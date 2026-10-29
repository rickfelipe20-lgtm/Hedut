"use client";

import { useMemo, useRef, useState } from "react";
import {
  CASAS,
  CHAVES,
  NOMES,
  P_MAX_PA,
  P_MIN_PA,
  PA_POR_PSI,
  M_POR_FT,
  UNIDADES,
  altitudeDePressao,
  deDisplay,
  paraDisplay,
  pressaoDeAltitude,
  resolver,
  type Chave,
  type Estado,
  type Sistema,
} from "./psicro";
import { gerarPsicrometricaPDF } from "./gerar-pdf";

type Linha = {
  id: number;
  raw: Partial<Record<Chave, string>>;
  ordem: Chave[]; // até 2 campos digitados, do mais antigo para o mais recente
};

type ResultadoLinha = {
  ativos: Chave[];
  estado: Estado | null;
  erro: string | null;
};

function num(s: string | undefined): number | null {
  if (s === undefined) return null;
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function fmt(c: Chave, valorDisplay: number): string {
  return valorDisplay.toFixed(CASAS[c]);
}

function inputClass() {
  return "w-full border border-hedut-aco/60 bg-hedut-nevoa focus:bg-white px-3 py-2 text-sm focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-xs text-hedut-abissal/60 mb-1";
}

// Altitude e pressão exibidas no sistema atual
function pressaoParaPa(s: string, sis: Sistema): number | null {
  const n = num(s);
  if (n === null) return null;
  return sis === "SI" ? n : n * PA_POR_PSI;
}

function altitudeParaM(s: string, sis: Sistema): number | null {
  const n = num(s);
  if (n === null) return null;
  return sis === "SI" ? n : n * M_POR_FT;
}

function pressaoDeExibicao(pa: number, sis: Sistema): string {
  return sis === "SI" ? String(Math.round(pa)) : (pa / PA_POR_PSI).toFixed(3);
}

function altitudeDeExibicao(m: number, sis: Sistema): string {
  return sis === "SI" ? String(Math.round(m)) : String(Math.round(m / M_POR_FT));
}

function converterTexto(
  texto: string | undefined,
  de: (n: number) => number,
  casas: number
): string | undefined {
  const n = num(texto);
  if (n === null) return undefined;
  return String(Number(de(n).toFixed(casas)));
}

export function Calculadora() {
  const [sistema, setSistema] = useState<Sistema>("SI");
  const [altitude, setAltitude] = useState("0");
  const [pressao, setPressao] = useState("101325");
  const [linhas, setLinhas] = useState<Linha[]>([
    { id: 1, raw: {}, ordem: [] },
  ]);
  const proximaLinha = useRef(2);
  // Valores exatos em SI, para que alternar SI/IP não acumule arredondamento.
  const canonico = useRef({ altM: 0, pPa: 101325 });

  const pPa = pressaoParaPa(pressao, sistema);
  const erroPressao =
    pPa === null
      ? "Informe uma pressão barométrica válida."
      : pPa < P_MIN_PA || pPa > P_MAX_PA
        ? `Pressão fora da faixa de validade (${P_MIN_PA} a ${P_MAX_PA} Pa).`
        : null;

  const resultados: ResultadoLinha[] = useMemo(
    () =>
      linhas.map((l) => {
        const ativos = l.ordem.filter((k) => num(l.raw[k]) !== null);
        if (ativos.length < 2) return { ativos, estado: null, erro: null };
        if (erroPressao || pPa === null) {
          return { ativos, estado: null, erro: erroPressao };
        }
        const [k1, k2] = ativos.slice(-2);
        const r = resolver(
          { chave: k1, valor: deDisplay(k1, num(l.raw[k1])!, sistema) },
          { chave: k2, valor: deDisplay(k2, num(l.raw[k2])!, sistema) },
          pPa
        );
        return { ativos: [k1, k2], estado: r.estado, erro: r.erro };
      }),
    [linhas, sistema, pPa, erroPressao]
  );

  function editarAltitude(v: string) {
    setAltitude(v);
    const m = altitudeParaM(v, sistema);
    if (m === null) {
      setPressao("");
      return;
    }
    const pa = pressaoDeAltitude(m);
    canonico.current = { altM: m, pPa: pa };
    setPressao(pressaoDeExibicao(pa, sistema));
  }

  function editarPressao(v: string) {
    setPressao(v);
    const pa = pressaoParaPa(v, sistema);
    if (pa === null || pa <= 0) {
      setAltitude("");
      return;
    }
    const m = altitudeDePressao(pa);
    canonico.current = { altM: m, pPa: pa };
    setAltitude(altitudeDeExibicao(m, sistema));
  }

  function mudarSistema(novo: Sistema) {
    if (novo === sistema) return;
    setLinhas((ls) =>
      ls.map((l) => {
        const raw: Partial<Record<Chave, string>> = {};
        for (const c of CHAVES) {
          const t = converterTexto(
            l.raw[c],
            (n) => paraDisplay(c, deDisplay(c, n, sistema), novo),
            CASAS[c] + 2
          );
          if (t !== undefined) raw[c] = t;
        }
        return { ...l, raw };
      })
    );
    const pa = pressaoParaPa(pressao, sistema);
    const m = altitudeParaM(altitude, sistema);
    setPressao(pa === null ? "" : pressaoDeExibicao(canonico.current.pPa, novo));
    setAltitude(
      m === null ? "" : altitudeDeExibicao(canonico.current.altM, novo)
    );
    setSistema(novo);
  }

  function editar(id: number, chave: Chave, valor: string) {
    setLinhas((ls) =>
      ls.map((l) => {
        if (l.id !== id) return l;
        const raw = { ...l.raw, [chave]: valor };
        let ordem = l.ordem.filter((k) => k !== chave);
        if (valor.trim() === "") {
          delete raw[chave];
        } else {
          ordem = [...ordem, chave];
        }
        while (ordem.length > 2) {
          const removido = ordem.shift()!;
          delete raw[removido];
        }
        return { ...l, raw, ordem };
      })
    );
  }

  function adicionarLinha() {
    const id = proximaLinha.current;
    proximaLinha.current += 1;
    setLinhas((ls) => [...ls, { id, raw: {}, ordem: [] }]);
  }

  function removerLinha(id: number) {
    setLinhas((ls) => (ls.length > 1 ? ls.filter((l) => l.id !== id) : ls));
  }

  function limparLinhas() {
    proximaLinha.current = 2;
    setLinhas([{ id: 1, raw: {}, ordem: [] }]);
  }

  function baixarPDF() {
    gerarPsicrometricaPDF({
      sistema,
      altitude,
      pressao,
      linhas: linhas.map((l, i) => ({
        numero: i + 1,
        ativos: resultados[i].ativos,
        estado: resultados[i].estado,
        erro: resultados[i].erro,
      })),
    });
  }

  const algumResultado = resultados.some((r) => r.estado);

  return (
    <div className="mb-32">
      {/* AJUSTES GERAIS */}
      <div className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-6">
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          <div>
            <span className={labelClass()}>Sistema de unidades</span>
            <div className="flex">
              {(["SI", "IP"] as Sistema[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => mudarSistema(s)}
                  aria-pressed={sistema === s}
                  className={`px-5 py-2 text-sm font-medium border transition-colors ${
                    sistema === s
                      ? "bg-hedut-abissal text-white border-hedut-abissal"
                      : "bg-hedut-nevoa text-hedut-abissal border-hedut-aco/60 hover:border-hedut-blue"
                  }`}
                >
                  {s === "SI" ? "SI (°C, kg, m)" : "IP (°F, lb, ft)"}
                </button>
              ))}
            </div>
          </div>

          <div className="w-40">
            <label className={labelClass()}>
              Altitude ({sistema === "SI" ? "m" : "ft"})
            </label>
            <input
              type="number"
              step="any"
              value={altitude}
              onChange={(e) => editarAltitude(e.target.value)}
              className={inputClass()}
            />
          </div>

          <div className="w-44">
            <label className={labelClass()}>
              Pressão barométrica ({sistema === "SI" ? "Pa" : "psia"})
            </label>
            <input
              type="number"
              step="any"
              value={pressao}
              onChange={(e) => editarPressao(e.target.value)}
              className={inputClass()}
            />
          </div>
        </div>
        {erroPressao && (
          <p className="font-mono text-xs text-red-600 mt-3">{erroPressao}</p>
        )}
        <p className="font-mono text-xs text-hedut-abissal/60 mt-4 leading-relaxed">
          Altitude e pressão se atualizam juntas (atmosfera padrão). Em cada
          linha, preencha <strong>quaisquer dois</strong> parâmetros — os dois
          últimos que você digitar valem como entrada e os outros cinco (em
          azul) são calculados na hora.
        </p>
      </div>

      {/* LINHAS */}
      {linhas.map((l, i) => {
        const r = resultados[i];
        return (
          <div
            key={l.id}
            className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-hedut-blue">
                Linha {i + 1}
              </p>
              {linhas.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerLinha(l.id)}
                  className="font-mono text-xs uppercase tracking-wide text-hedut-abissal/50 hover:text-red-600 transition"
                >
                  Remover
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {CHAVES.map((c) => {
                const ativo = r.ativos.includes(c);
                const calculado = !ativo && r.estado !== null;
                const valor = ativo
                  ? (l.raw[c] ?? "")
                  : r.estado
                    ? fmt(c, paraDisplay(c, r.estado[c], sistema))
                    : (l.raw[c] ?? "");
                const idDica = `dica-${l.id}-${c}`;
                return (
                  <div key={c} className="group relative">
                    <span
                      id={idDica}
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded-xl bg-hedut-abissal px-3 py-2.5 text-xs leading-snug text-white opacity-0 shadow-[0_6px_20px_rgba(8,25,44,0.35)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
                    >
                      <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                        {NOMES[c].nome}
                      </span>
                      {NOMES[c].descricao}
                      <span className="absolute left-1/2 top-full -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-hedut-abissal" />
                    </span>
                    <label className={labelClass()}>
                      <span className="cursor-help font-bold text-hedut-abissal underline decoration-dotted decoration-hedut-aco underline-offset-4">
                        {NOMES[c].sigla}
                      </span>{" "}
                      ({UNIDADES[sistema][c]})
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={valor}
                      placeholder={NOMES[c].nome}
                      aria-describedby={idDica}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => editar(l.id, c, e.target.value)}
                      className={`${inputClass()} ${
                        calculado
                          ? "!bg-[#E3EEFA] !border-hedut-blue/50 text-hedut-blue font-medium"
                          : ""
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {r.erro ? (
              <p className="font-mono text-xs text-red-600 mt-4">{r.erro}</p>
            ) : r.ativos.length < 2 ? (
              <p className="font-mono text-xs text-hedut-abissal/50 mt-4">
                Preencha dois parâmetros para calcular os demais.
              </p>
            ) : r.ativos.includes("h") && r.ativos.includes("Tw") ? (
              <p className="font-mono text-xs text-amber-700 mt-4">
                Atenção: entalpia e bulbo úmido são grandezas quase
                equivalentes — uma pequena variação em qualquer uma delas muda
                bastante os outros resultados. Prefira combinar com T ou UR.
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          type="button"
          onClick={adicionarLinha}
          className="font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
        >
          + Adicionar linha
        </button>
        <button
          type="button"
          onClick={baixarPDF}
          disabled={!algumResultado}
          className="font-mono text-xs uppercase tracking-wide bg-hedut-abissal text-white px-5 py-2.5 rounded-full hover:bg-hedut-blue transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Baixar PDF
        </button>
        <button
          type="button"
          onClick={limparLinhas}
          className="font-mono text-xs uppercase tracking-wide text-hedut-abissal/60 hover:text-hedut-abissal transition px-3 py-2"
        >
          Limpar linhas
        </button>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/60 mt-8 leading-relaxed max-w-3xl">
        Cálculo conforme o ASHRAE Handbook — Fundamentals, cap. 1
        (Psychrometrics): pressão de saturação de Hyland-Wexler, umidade
        absoluta, entalpia, volume específico e bulbo úmido (eq. 33 e 35). Os
        parâmetros que você não informa são obtidos resolvendo numericamente o
        par escolhido; o ponto de orvalho é a inversa exata da pressão de
        saturação (pode diferir cerca de 0,02 °C da correlação da ferramenta
        Ponto de Orvalho). Faixa de validade: {-50} a {90} °C. Resultado de
        referência — valide com as normas do seu projeto antes de especificar.
      </p>
    </div>
  );
}
