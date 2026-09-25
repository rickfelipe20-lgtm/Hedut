"use client";

import { useMemo, useState } from "react";

type TipoDuto = "circular" | "retangular";

const MATERIAIS = [
  { nome: "Chapa Galvanizada", rugosidade: 0.09 },
  { nome: "Fibra de Vidro", rugosidade: 0.9 },
  { nome: "Duto Flexível", rugosidade: 3.0 },
  { nome: "PVC / Plástico Liso", rugosidade: 0.03 },
  { nome: "Alvenaria / Concreto", rugosidade: 3.0 },
] as const;

const RHO_AR = 1.204; // kg/m³ a 20°C
const MU_AR = 1.81e-5; // Pa·s a 20°C

function inputClass() {
  return "w-full border border-hedut-aco/40 px-4 py-2.5 focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-sm text-hedut-abissal/70 mb-2";
}

export function Calculadora() {
  const [tipoDuto, setTipoDuto] = useState<TipoDuto>("retangular");
  const [vazao, setVazao] = useState(1000); // m³/h
  const [diametro, setDiametro] = useState(250); // mm
  const [largura, setLargura] = useState(300); // mm
  const [altura, setAltura] = useState(200); // mm
  const [comprimento, setComprimento] = useState(10); // m
  const [materialIndex, setMaterialIndex] = useState(0);

  const resultado = useMemo(() => {
    const Q = vazao / 3600; // m³/s
    const rugosidade = MATERIAIS[materialIndex].rugosidade / 1000; // m

    let areaM2: number;
    let diametroHidraulicoM: number;

    if (tipoDuto === "circular") {
      const dM = diametro / 1000;
      areaM2 = Math.PI * (dM / 2) ** 2;
      diametroHidraulicoM = dM;
    } else {
      const aM = largura / 1000;
      const bM = altura / 1000;
      areaM2 = aM * bM;
      // Diâmetro equivalente ASHRAE (mesma perda de carga e vazão)
      diametroHidraulicoM =
        (1.3 * (aM * bM) ** 0.625) / (aM + bM) ** 0.25;
    }

    if (areaM2 <= 0 || diametroHidraulicoM <= 0) {
      return null;
    }

    const velocidade = Q / areaM2; // m/s
    const reynolds =
      (RHO_AR * velocidade * diametroHidraulicoM) / MU_AR;

    let fatorAtrito: number;
    if (reynolds > 0) {
      const termo =
        rugosidade / (3.7 * diametroHidraulicoM) +
        5.74 / reynolds ** 0.9;
      fatorAtrito = 0.25 / Math.log10(termo) ** 2;
    } else {
      fatorAtrito = 0;
    }

    const perdaPorMetro =
      (fatorAtrito * RHO_AR * velocidade ** 2) /
      (2 * diametroHidraulicoM); // Pa/m
    const perdaTotal = perdaPorMetro * comprimento; // Pa

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
      perdaTotal,
      faixaVelocidade,
    };
  }, [tipoDuto, vazao, diametro, largura, altura, comprimento, materialIndex]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-32">
      {/* FORMULÁRIO */}
      <div className="space-y-6">
        <div>
          <span className={labelClass()}>Tipo de duto</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTipoDuto("retangular")}
              className={`flex-1 border py-2.5 font-medium transition-colors ${
                tipoDuto === "retangular"
                  ? "bg-black text-white border-black"
                  : "border-hedut-aco/40 text-hedut-abissal hover:border-hedut-blue"
              }`}
            >
              Retangular
            </button>
            <button
              type="button"
              onClick={() => setTipoDuto("circular")}
              className={`flex-1 border py-2.5 font-medium transition-colors ${
                tipoDuto === "circular"
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
            value={vazao}
            onChange={(e) => setVazao(Number(e.target.value))}
            className={inputClass()}
          />
        </div>

        {tipoDuto === "circular" ? (
          <div>
            <label className={labelClass()}>Diâmetro (mm)</label>
            <input
              type="number"
              min={0}
              value={diametro}
              onChange={(e) => setDiametro(Number(e.target.value))}
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
                value={largura}
                onChange={(e) => setLargura(Number(e.target.value))}
                className={inputClass()}
              />
            </div>
            <div>
              <label className={labelClass()}>Altura (mm)</label>
              <input
                type="number"
                min={0}
                value={altura}
                onChange={(e) => setAltura(Number(e.target.value))}
                className={inputClass()}
              />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass()}>Comprimento do trecho (m)</label>
          <input
            type="number"
            min={0}
            value={comprimento}
            onChange={(e) => setComprimento(Number(e.target.value))}
            className={inputClass()}
          />
        </div>

        <div>
          <label className={labelClass()}>Material do duto</label>
          <select
            value={materialIndex}
            onChange={(e) => setMaterialIndex(Number(e.target.value))}
            className={inputClass()}
          >
            {MATERIAIS.map((m, i) => (
              <option key={m.nome} value={i}>
                {m.nome} (ε = {m.rugosidade} mm)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="bg-hedut-nevoa border border-hedut-aco/25 rounded-2xl p-8">
        <h2 className="font-display font-bold text-hedut-abissal text-2xl mb-6">
          Resultado
        </h2>

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
                  Perda de carga
                </p>
                <p className="font-medium text-hedut-abissal">
                  {resultado.perdaPorMetro.toFixed(2)} Pa/m
                </p>
              </div>

              <div>
                <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-aco mb-1">
                  Perda total no trecho
                </p>
                <p className="font-medium text-hedut-abissal">
                  {resultado.perdaTotal.toFixed(1)} Pa
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-hedut-abissal/60">
            Preencha as dimensões do duto para ver o resultado.
          </p>
        )}

        <p className="font-mono text-xs text-hedut-abissal/50 mt-8 leading-relaxed">
          Cálculo pelo método Darcy-Weisbach, fator de atrito estimado pela
          equação de Swamee-Jain. Ar a 20°C e 1 atm (ρ = 1,204 kg/m³).
          Resultado de referência — valide com as normas do seu projeto
          antes de especificar.
        </p>
      </div>
    </section>
  );
}
