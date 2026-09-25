"use client";

import { useMemo, useRef, useState } from "react";
import { gerarMemorialPDF } from "./gerar-pdf";

type TipoDuto = "circular" | "retangular";

const MATERIAIS = [
  { nome: "Chapa Galvanizada", rugosidade: 0.09 },
  { nome: "Painel MPU (Poliuretano)", rugosidade: 0.09 },
  { nome: "Fibra de Vidro", rugosidade: 0.9 },
  { nome: "Duto Flexível", rugosidade: 3.0 },
  { nome: "PVC / Plástico Liso", rugosidade: 0.03 },
  { nome: "Alvenaria / Concreto", rugosidade: 3.0 },
] as const;

const RHO_AR = 1.204; // kg/m³ a 20°C
const MU_AR = 1.81e-5; // Pa·s a 20°C

const TIPOS_CURVA = [
  { nome: "90° raio longo (R/D ≥ 1,5)", k: 0.15 },
  { nome: "90° raio curto (R/D = 1,0)", k: 0.22 },
  { nome: "90° raio curto (R/D = 0,75)", k: 0.33 },
  { nome: "90° raio curto (R/D ≥ 0,5)", k: 0.5 },
  { nome: "90° com pás direcionadoras", k: 0.18 },
  { nome: "90° em gomos (sem raio)", k: 1.2 },
  { nome: "45° raio longo", k: 0.09 },
] as const;

const TIPOS_REDUCAO = [
  { nome: "Gradual 15°", k: 0.05 },
  { nome: "Gradual 30°", k: 0.06 },
  { nome: "Gradual 45°", k: 0.07 },
  { nome: "Brusca (> 45°)", k: 0.15 },
] as const;

type Trecho = {
  id: number;
  tipoDuto: TipoDuto;
  vazao: number;
  diametro: number;
  largura: number;
  altura: number;
  comprimento: number;
  materialIndex: number;
  qtdCurvas: number;
  tipoCurvaIndex: number;
  qtdReducoes: number;
  tipoReducaoIndex: number;
};

function trechoPadrao(id: number): Trecho {
  return {
    id,
    tipoDuto: "retangular",
    vazao: 1000,
    diametro: 250,
    largura: 300,
    altura: 200,
    comprimento: 10,
    materialIndex: 0,
    qtdCurvas: 0,
    tipoCurvaIndex: 0,
    qtdReducoes: 0,
    tipoReducaoIndex: 0,
  };
}

function calcularResultado(t: Trecho) {
  const Q = t.vazao / 3600; // m³/s
  const rugosidade = MATERIAIS[t.materialIndex].rugosidade / 1000; // m

  let areaM2: number;
  let diametroHidraulicoM: number;

  if (t.tipoDuto === "circular") {
    const dM = t.diametro / 1000;
    areaM2 = Math.PI * (dM / 2) ** 2;
    diametroHidraulicoM = dM;
  } else {
    const aM = t.largura / 1000;
    const bM = t.altura / 1000;
    areaM2 = aM * bM;
    // Diâmetro equivalente ASHRAE (mesma perda de carga e vazão)
    diametroHidraulicoM = (1.3 * (aM * bM) ** 0.625) / (aM + bM) ** 0.25;
  }

  if (areaM2 <= 0 || diametroHidraulicoM <= 0) {
    return null;
  }

  const velocidade = Q / areaM2; // m/s
  const reynolds = (RHO_AR * velocidade * diametroHidraulicoM) / MU_AR;

  let fatorAtrito: number;
  if (reynolds > 0) {
    const termo =
      rugosidade / (3.7 * diametroHidraulicoM) + 5.74 / reynolds ** 0.9;
    fatorAtrito = 0.25 / Math.log10(termo) ** 2;
  } else {
    fatorAtrito = 0;
  }

  const perdaPorMetro =
    (fatorAtrito * RHO_AR * velocidade ** 2) / (2 * diametroHidraulicoM); // Pa/m
  const perdaTrechoReto = perdaPorMetro * t.comprimento; // Pa

  const pressaoDinamica = (RHO_AR * velocidade ** 2) / 2; // Pa
  const perdaCurvas =
    t.qtdCurvas * TIPOS_CURVA[t.tipoCurvaIndex].k * pressaoDinamica;
  const perdaReducoes =
    t.qtdReducoes * TIPOS_REDUCAO[t.tipoReducaoIndex].k * pressaoDinamica;
  const perdaAcessorios = perdaCurvas + perdaReducoes;
  const perdaTotal = perdaTrechoReto + perdaAcessorios; // Pa

  let faixaVelocidade: "baixa" | "adequada" | "alta";
  if (velocidade < 4) faixaVelocidade = "baixa";
  else if (velocidade <= 9) faixaVelocidade = "adequada";
  else faixaVelocidade = "alta";

  return {
    areaM2,
    velocidade,
    diametroEquivalenteMm: diametroHidraulicoM * 1000,
    reynolds,
    fatorAtrito,
    perdaPorMetro,
    perdaTrechoReto,
    perdaAcessorios,
    perdaTotal,
    faixaVelocidade,
  };
}

function inputClass() {
  return "w-full border border-hedut-aco/40 px-4 py-2.5 focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-sm text-hedut-abissal/70 mb-2";
}

export function Calculadora() {
  const proximoId = useRef(2);
  const [trechos, setTrechos] = useState<Trecho[]>([trechoPadrao(1)]);

  function atualizarTrecho(id: number, patch: Partial<Trecho>) {
    setTrechos((atual) =>
      atual.map((t) => (t.id === id ? { ...t, ...patch } : t))
    );
  }

  function adicionarTrecho() {
    const novo = trechoPadrao(proximoId.current);
    proximoId.current += 1;
    setTrechos((atual) => [...atual, novo]);
  }

  function removerTrecho(id: number) {
    setTrechos((atual) => atual.filter((t) => t.id !== id));
  }

  const resultados = useMemo(
    () => trechos.map((t) => ({ id: t.id, resultado: calcularResultado(t) })),
    [trechos]
  );

  const perdaTotalSistema = resultados.reduce(
    (soma, r) => soma + (r.resultado?.perdaTotal ?? 0),
    0
  );

  const algumaVelocidadeAlta = resultados.some(
    (r) => r.resultado?.faixaVelocidade === "alta"
  );

  function handleBaixarPDF() {
    const dados = trechos.map((t, index) => {
      const resultado =
        resultados.find((r) => r.id === t.id)?.resultado ?? null;

      return {
        numero: index + 1,
        tipoDuto: t.tipoDuto,
        vazao: t.vazao,
        diametro: t.diametro,
        largura: t.largura,
        altura: t.altura,
        comprimento: t.comprimento,
        materialNome: MATERIAIS[t.materialIndex].nome,
        qtdCurvas: t.qtdCurvas,
        tipoCurvaNome: TIPOS_CURVA[t.tipoCurvaIndex].nome,
        qtdReducoes: t.qtdReducoes,
        tipoReducaoNome: TIPOS_REDUCAO[t.tipoReducaoIndex].nome,
        resultado: resultado
          ? {
              areaM2: resultado.areaM2,
              velocidade: resultado.velocidade,
              diametroEquivalenteMm: resultado.diametroEquivalenteMm,
              reynolds: resultado.reynolds,
              fatorAtrito: resultado.fatorAtrito,
              perdaTrechoReto: resultado.perdaTrechoReto,
              perdaAcessorios: resultado.perdaAcessorios,
              perdaTotal: resultado.perdaTotal,
            }
          : null,
      };
    });

    gerarMemorialPDF(dados, perdaTotalSistema);
  }

  return (
    <div className="mb-32">
      {/* RESUMO GERAL */}
      <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-1">
            Perda de carga total do sistema ({trechos.length}{" "}
            {trechos.length === 1 ? "trecho" : "trechos"})
          </p>
          <p className="font-display font-bold text-4xl">
            {perdaTotalSistema.toFixed(1)} Pa
          </p>
          {algumaVelocidadeAlta && (
            <p className="font-mono text-sm text-amber-300 mt-2">
              ⚠ Um ou mais trechos com velocidade acima de 9 m/s — risco de
              ruído
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <p className="text-white/70 text-sm max-w-xs">
            Some a perda de todos os trechos do caminho mais crítico (do
            ventilador até o difusor mais distante) para dimensionar o
            equipamento.
          </p>
          <button
            type="button"
            onClick={handleBaixarPDF}
            className="whitespace-nowrap bg-white text-hedut-abissal font-bold py-3 px-8 hover:bg-hedut-nevoa transition"
          >
            Baixar PDF
          </button>
        </div>
      </div>

      {/* TRECHOS */}
      <div className="space-y-10">
        {trechos.map((trecho, index) => {
          const resultado = resultados.find((r) => r.id === trecho.id)
            ?.resultado;

          return (
            <div
              key={trecho.id}
              className="border border-hedut-aco/25 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-hedut-abissal text-xl">
                  Trecho {index + 1}
                </h3>
                {trechos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerTrecho(trecho.id)}
                    className="font-mono text-sm text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FORMULÁRIO DO TRECHO */}
                <div className="space-y-5">
                  <div>
                    <span className={labelClass()}>Tipo de duto</span>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          atualizarTrecho(trecho.id, {
                            tipoDuto: "retangular",
                          })
                        }
                        className={`flex-1 border py-2.5 font-medium transition-colors ${
                          trecho.tipoDuto === "retangular"
                            ? "bg-black text-white border-black"
                            : "border-hedut-aco/40 text-hedut-abissal hover:border-hedut-blue"
                        }`}
                      >
                        Retangular
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          atualizarTrecho(trecho.id, { tipoDuto: "circular" })
                        }
                        className={`flex-1 border py-2.5 font-medium transition-colors ${
                          trecho.tipoDuto === "circular"
                            ? "bg-black text-white border-black"
                            : "border-hedut-aco/40 text-hedut-abissal hover:border-hedut-blue"
                        }`}
                      >
                        Circular
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass()}>Vazão de ar (m³/h)</label>
                    <input
                      type="number"
                      min={0}
                      value={trecho.vazao}
                      onChange={(e) =>
                        atualizarTrecho(trecho.id, {
                          vazao: Number(e.target.value),
                        })
                      }
                      className={inputClass()}
                    />
                  </div>

                  {trecho.tipoDuto === "circular" ? (
                    <div>
                      <label className={labelClass()}>Diâmetro (mm)</label>
                      <input
                        type="number"
                        min={0}
                        value={trecho.diametro}
                        onChange={(e) =>
                          atualizarTrecho(trecho.id, {
                            diametro: Number(e.target.value),
                          })
                        }
                        className={inputClass()}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass()}>Largura (mm)</label>
                        <input
                          type="number"
                          min={0}
                          value={trecho.largura}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              largura: Number(e.target.value),
                            })
                          }
                          className={inputClass()}
                        />
                      </div>
                      <div>
                        <label className={labelClass()}>Altura (mm)</label>
                        <input
                          type="number"
                          min={0}
                          value={trecho.altura}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              altura: Number(e.target.value),
                            })
                          }
                          className={inputClass()}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className={labelClass()}>
                      Comprimento do trecho (m)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={trecho.comprimento}
                      onChange={(e) =>
                        atualizarTrecho(trecho.id, {
                          comprimento: Number(e.target.value),
                        })
                      }
                      className={inputClass()}
                    />
                  </div>

                  <div>
                    <label className={labelClass()}>Material do duto</label>
                    <select
                      value={trecho.materialIndex}
                      onChange={(e) =>
                        atualizarTrecho(trecho.id, {
                          materialIndex: Number(e.target.value),
                        })
                      }
                      className={inputClass()}
                    >
                      {MATERIAIS.map((m, i) => (
                        <option key={m.nome} value={i}>
                          {m.nome} (ε = {m.rugosidade} mm)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-4 border-t border-hedut-aco/25">
                    <p className="font-mono text-xs tracking-[0.1em] uppercase text-hedut-aco mb-3">
                      Curvas e reduções neste trecho
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block font-mono text-xs text-hedut-abissal/60 mb-1">
                          Qtd. curvas
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={trecho.qtdCurvas}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              qtdCurvas: Number(e.target.value),
                            })
                          }
                          className="w-full border border-hedut-aco/40 px-3 py-2 text-sm focus:outline-none focus:border-hedut-blue"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-hedut-abissal/60 mb-1">
                          Tipo de curva
                        </label>
                        <select
                          value={trecho.tipoCurvaIndex}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              tipoCurvaIndex: Number(e.target.value),
                            })
                          }
                          className="w-full border border-hedut-aco/40 px-2 py-2 text-sm focus:outline-none focus:border-hedut-blue"
                        >
                          {TIPOS_CURVA.map((c, i) => (
                            <option key={c.nome} value={i}>
                              {c.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-hedut-abissal/60 mb-1">
                          Qtd. reduções
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={trecho.qtdReducoes}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              qtdReducoes: Number(e.target.value),
                            })
                          }
                          className="w-full border border-hedut-aco/40 px-3 py-2 text-sm focus:outline-none focus:border-hedut-blue"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-xs text-hedut-abissal/60 mb-1">
                          Ângulo de redução
                        </label>
                        <select
                          value={trecho.tipoReducaoIndex}
                          onChange={(e) =>
                            atualizarTrecho(trecho.id, {
                              tipoReducaoIndex: Number(e.target.value),
                            })
                          }
                          className="w-full border border-hedut-aco/40 px-2 py-2 text-sm focus:outline-none focus:border-hedut-blue"
                        >
                          {TIPOS_REDUCAO.map((r, i) => (
                            <option key={r.nome} value={i}>
                              {r.nome}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RESULTADO DO TRECHO */}
                <div className="bg-hedut-nevoa border border-hedut-aco/25 rounded-2xl p-6">
                  {resultado ? (
                    <div className="space-y-5">
                      <div>
                        <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                          Velocidade do ar
                        </p>
                        <p className="font-display font-bold text-hedut-blue text-3xl">
                          {resultado.velocidade.toFixed(2)} m/s
                        </p>
                        <p
                          className={`font-mono text-sm mt-1 ${
                            resultado.faixaVelocidade === "adequada"
                              ? "text-green-700"
                              : "text-amber-600"
                          }`}
                        >
                          {resultado.faixaVelocidade === "baixa" &&
                            "Baixa — duto superdimensionado para a vazão"}
                          {resultado.faixaVelocidade === "adequada" &&
                            "Dentro da faixa usual (4–9 m/s)"}
                          {resultado.faixaVelocidade === "alta" &&
                            "Alta — risco de ruído, avalie aumentar o duto"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-5 pt-5 border-t border-hedut-aco/25">
                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Área da seção
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {(resultado.areaM2 * 10000).toFixed(0)} cm²
                          </p>
                        </div>

                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Diâmetro equivalente
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {resultado.diametroEquivalenteMm.toFixed(0)} mm
                          </p>
                        </div>

                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Número de Reynolds
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {resultado.reynolds.toLocaleString("pt-BR", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>

                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Fator de atrito (f)
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {resultado.fatorAtrito.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5 pt-5 border-t border-hedut-aco/25">
                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Perda no trecho reto
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {resultado.perdaTrechoReto.toFixed(1)} Pa
                          </p>
                        </div>

                        <div>
                          <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                            Perda em curvas/reduções
                          </p>
                          <p className="font-medium text-hedut-abissal">
                            {resultado.perdaAcessorios.toFixed(1)} Pa
                          </p>
                        </div>
                      </div>

                      <div className="pt-5 border-t border-hedut-aco/25">
                        <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                          Perda total do trecho
                        </p>
                        <p className="font-display font-bold text-hedut-blue text-2xl">
                          {resultado.perdaTotal.toFixed(1)} Pa
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-hedut-abissal/60">
                      Preencha as dimensões do duto para ver o resultado.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={adicionarTrecho}
        className="w-full mt-6 border-2 border-dashed border-hedut-aco/40 text-hedut-abissal/70 rounded-2xl py-5 font-medium hover:border-hedut-blue hover:text-hedut-blue transition"
      >
        + Adicionar trecho
      </button>

      <p className="font-mono text-xs text-hedut-abissal/50 mt-8 leading-relaxed max-w-3xl">
        Cálculo pelo método Darcy-Weisbach, fator de atrito estimado pela
        equação de Swamee-Jain. Ar a 20°C e 1 atm (ρ = 1,204 kg/m³).
        Resultado de referência — valide com as normas do seu projeto antes
        de especificar.
      </p>
    </div>
  );
}
