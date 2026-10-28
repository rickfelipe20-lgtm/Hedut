"use client";

import { useMemo, useState } from "react";
import {
  calcularOrvalho,
  P_ATM_KPA,
  type EntradaOrvalho,
  type ModoOrvalho,
} from "./orvalho";

function inputClass(erro = false) {
  return `w-full border px-4 py-2.5 focus:outline-none focus:border-hedut-blue ${
    erro ? "border-red-400 bg-red-50/40" : "border-hedut-aco/60 bg-hedut-nevoa focus:bg-white"
  }`;
}

function labelClass() {
  return "block font-mono text-sm text-hedut-abissal/70 mb-2";
}

function Secao({
  titulo,
  children,
  padraoAberta = false,
}: {
  titulo: string;
  children: React.ReactNode;
  padraoAberta?: boolean;
}) {
  const [aberta, setAberta] = useState(padraoAberta);
  return (
    <div className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-6">
      <button
        type="button"
        onClick={() => setAberta((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
        aria-expanded={aberta}
      >
        <h3 className="font-display font-bold text-hedut-abissal text-xl">
          {titulo}
        </h3>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-5 h-5 shrink-0 text-hedut-abissal/60 transition-transform ${
            aberta ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {aberta && <div className="mt-5">{children}</div>}
    </div>
  );
}

function linhaDado(label: string, valor: string) {
  return (
    <div
      key={label}
      className="flex items-center justify-between py-1.5 border-b border-hedut-aco/15 last:border-0"
    >
      <span className="text-hedut-abissal/60 text-sm">{label}</span>
      <span className="font-medium text-hedut-abissal text-sm">{valor}</span>
    </div>
  );
}

function linhaMemoria(
  etapa: string,
  equacao: string,
  numeros: string,
  resultado: string
) {
  return (
    <div
      key={etapa}
      className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-1 py-3 border-b border-hedut-aco/15 last:border-0"
    >
      <p className="md:col-span-3 text-sm font-medium text-hedut-abissal">
        {etapa}
      </p>
      <div className="md:col-span-6">
        <p className="font-mono text-xs text-hedut-abissal/70">{equacao}</p>
        {numeros && (
          <p className="font-mono text-xs text-hedut-blue mt-0.5">{numeros}</p>
        )}
      </div>
      <p className="md:col-span-3 md:text-right text-sm font-medium text-hedut-abissal">
        {resultado}
      </p>
    </div>
  );
}

const MODOS: { chave: ModoOrvalho; titulo: string; descricao: string }[] = [
  {
    chave: "ur",
    titulo: "Tbs + UR → ponto de orvalho",
    descricao: "Informo a temperatura e a umidade relativa",
  },
  {
    chave: "td",
    titulo: "Tbs + ponto de orvalho → UR",
    descricao: "Informo a temperatura e o ponto de orvalho",
  },
];

export function Calculadora() {
  const [entrada, setEntrada] = useState<EntradaOrvalho>({
    modo: "ur",
    tbs: "",
    ur: "",
    td: "",
    ts: "",
  });

  const calculo = useMemo(() => calcularOrvalho(entrada), [entrada]);
  const { resultado: r, erro, condensacao, tabela } = calculo;

  function atualizar(patch: Partial<EntradaOrvalho>) {
    setEntrada((atual) => ({ ...atual, ...patch }));
  }

  const modoUR = entrada.modo === "ur";

  return (
    <div className="mb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {MODOS.map((m) => {
          const ativo = entrada.modo === m.chave;
          return (
            <button
              key={m.chave}
              type="button"
              onClick={() => atualizar({ modo: m.chave })}
              aria-pressed={ativo}
              className={`text-left rounded-2xl border px-5 py-4 transition ${
                ativo
                  ? "border-hedut-blue bg-white shadow-[0_2px_14px_rgba(11,74,128,0.22)]"
                  : "border-hedut-aco/40 bg-white/70 hover:border-hedut-blue/50"
              }`}
            >
              <p
                className={`font-display font-bold text-lg ${
                  ativo ? "text-hedut-blue" : "text-hedut-abissal"
                }`}
              >
                {m.titulo}
              </p>
              <p className="text-sm text-hedut-abissal/60 mt-1">
                {m.descricao}
              </p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ENTRADAS */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-6">
            <h3 className="font-display font-bold text-hedut-abissal text-xl mb-5">
              Condições do ar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass()}>
                  Temperatura de bulbo seco (°C)
                </label>
                <input
                  type="number"
                  step="any"
                  value={entrada.tbs}
                  placeholder="Ex: 25"
                  onChange={(e) => atualizar({ tbs: e.target.value })}
                  className={inputClass()}
                />
              </div>

              {modoUR ? (
                <div>
                  <label className={labelClass()}>Umidade relativa (%)</label>
                  <input
                    type="number"
                    step="any"
                    min={0}
                    max={100}
                    value={entrada.ur}
                    placeholder="Ex: 60"
                    onChange={(e) => atualizar({ ur: e.target.value })}
                    className={inputClass()}
                  />
                </div>
              ) : (
                <div>
                  <label className={labelClass()}>
                    Ponto de orvalho (°C)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={entrada.td}
                    placeholder="Ex: 16"
                    onChange={(e) => atualizar({ td: e.target.value })}
                    className={inputClass()}
                  />
                </div>
              )}
            </div>
            {erro && (
              <p className="font-mono text-xs text-red-600 mt-4">{erro}</p>
            )}
          </div>

          <div className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-6">
            <h3 className="font-display font-bold text-hedut-abissal text-xl mb-2">
              Verificação de condensação
            </h3>
            <p className="text-sm text-hedut-abissal/60 mb-5 leading-relaxed">
              Opcional. Informe a temperatura da superfície (tubulação de água
              gelada, duto, vidro, parede fria…) para saber se ela fica abaixo
              do ponto de orvalho do ar.
            </p>
            <div className="max-w-xs">
              <label className={labelClass()}>
                Temperatura da superfície (°C)
              </label>
              <input
                type="number"
                step="any"
                value={entrada.ts}
                placeholder="Ex: 14"
                onChange={(e) => atualizar({ ts: e.target.value })}
                className={inputClass()}
              />
            </div>
          </div>

          <Secao titulo="Ponto de orvalho por umidade relativa">
            {tabela.length > 0 && r ? (
              <>
                <p className="text-sm text-hedut-abissal/60 mb-4">
                  Para ar a {r.tbs.toFixed(1)} °C de bulbo seco:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {tabela.map((linha) => (
                    <div
                      key={linha.ur}
                      className="bg-hedut-nevoa border border-hedut-aco/60 rounded-xl px-3 py-3 text-center"
                    >
                      <p className="font-mono text-xs text-hedut-abissal/60">
                        UR {linha.ur} %
                      </p>
                      <p className="font-display font-bold text-hedut-abissal text-lg">
                        {linha.td.toFixed(1)} °C
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-hedut-abissal/60">
                Informe a temperatura de bulbo seco para ver a tabela.
              </p>
            )}
          </Secao>

          <Secao titulo="Memória de Cálculo">
            {r ? (
              <div>
                {linhaMemoria(
                  "1. Pressão de saturação",
                  r.tbs < 0
                    ? "ln pws = C1/T + C2 + C3·T + C4·T² + C5·T³ + C6·T⁴ + C7·ln T  (ASHRAE eq. 5, sobre o gelo)"
                    : "ln pws = C8/T + C9 + C10·T + C11·T² + C12·T³ + C13·ln T  (ASHRAE eq. 6, sobre a água)",
                  `T = ${r.tbs.toFixed(2)} + 273,15 = ${(r.tbs + 273.15).toFixed(2)} K`,
                  `pws = ${r.pws.toFixed(4)} kPa`
                )}
                {modoUR
                  ? linhaMemoria(
                      "2. Pressão parcial de vapor",
                      "pw = (UR / 100) · pws",
                      `(${r.ur.toFixed(1)} / 100) · ${r.pws.toFixed(4)}`,
                      `pw = ${r.pw.toFixed(4)} kPa`
                    )
                  : linhaMemoria(
                      "2. Pressão parcial de vapor",
                      "pw = pws(td) — saturação na temperatura do ponto de orvalho",
                      `pws(${r.td.toFixed(2)} °C)`,
                      `pw = ${r.pw.toFixed(4)} kPa`
                    )}
                {modoUR
                  ? linhaMemoria(
                      "3. Ponto de orvalho",
                      r.equacao === 37
                        ? "td = C14 + C15·α + C16·α² + C17·α³ + C18·pw^0,1984,  α = ln pw  (ASHRAE eq. 37, 0 a 93 °C)"
                        : "td = 6,09 + 12,608·α + 0,4959·α²,  α = ln pw  (ASHRAE eq. 38, abaixo de 0 °C: ponto de geada)",
                      `α = ln(${r.pw.toFixed(4)}) = ${r.alfa!.toFixed(4)}`,
                      `td = ${r.td.toFixed(2)} °C`
                    )
                  : linhaMemoria(
                      "3. Umidade relativa",
                      "UR = pw / pws(tbs) · 100",
                      `${r.pw.toFixed(4)} / ${r.pws.toFixed(4)} · 100`,
                      `UR = ${r.ur.toFixed(1)} %`
                    )}
                {linhaMemoria(
                  "4. Umidade absoluta",
                  "W = 0,621945 · pw / (p − pw)",
                  `0,621945 · ${r.pw.toFixed(4)} / (${P_ATM_KPA} − ${r.pw.toFixed(4)})`,
                  `W = ${(r.w * 1000).toFixed(2)} g/kg`
                )}
                {linhaMemoria(
                  "5. Entalpia",
                  "h = 1,006·t + W·(2501 + 1,86·t)",
                  `1,006 · ${r.tbs.toFixed(1)} + ${r.w.toFixed(5)} · (2501 + 1,86 · ${r.tbs.toFixed(1)})`,
                  `h = ${r.h.toFixed(1)} kJ/kg`
                )}
              </div>
            ) : (
              <p className="text-sm text-hedut-abissal/60">
                Preencha os dados do ar para ver as contas.
              </p>
            )}
          </Secao>
        </div>

        {/* RESULTADO */}
        <div>
          <div className="sticky top-6">
            <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-6">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-2">
                {modoUR ? "Ponto de orvalho" : "Umidade relativa"}
              </p>
              <p className="font-display font-bold text-4xl mb-4">
                {r
                  ? modoUR
                    ? `${r.td.toFixed(1)} °C`
                    : `${r.ur.toFixed(1)} %`
                  : "—"}
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/60 text-xs">
                    {modoUR ? "Umidade relativa" : "Ponto de orvalho"}
                  </p>
                  <p className="font-medium">
                    {r
                      ? modoUR
                        ? `${r.ur.toFixed(0)} %`
                        : `${r.td.toFixed(1)} °C`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">
                    Depressão (tbs − td)
                  </p>
                  <p className="font-medium">
                    {r ? `${r.depressao.toFixed(1)} °C` : "—"}
                  </p>
                </div>
              </div>

              {condensacao && (
                <div
                  className={`mt-5 border rounded-xl p-4 text-sm leading-relaxed ${
                    condensacao.condensa
                      ? "bg-red-500/20 border-red-400/50 text-red-100"
                      : "bg-green-500/20 border-green-400/50 text-green-100"
                  }`}
                >
                  <p className="font-semibold">
                    {condensacao.condensa
                      ? condensacao.geada
                        ? "Risco de geada na superfície"
                        : "Risco de condensação na superfície"
                      : "Sem condensação na superfície"}
                  </p>
                  <p className="mt-1 opacity-90">
                    Superfície a {condensacao.ts.toFixed(1)} °C ·{" "}
                    {condensacao.folga >= 0
                      ? `${condensacao.folga.toFixed(1)} °C acima`
                      : `${Math.abs(condensacao.folga).toFixed(1)} °C abaixo`}{" "}
                    do ponto de orvalho.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white border border-hedut-aco/70 border-t-4 border-t-hedut-blue rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6">
              <h3 className="font-display font-bold text-hedut-abissal text-lg mb-4">
                Dados psicrométricos
              </h3>
              {r ? (
                <>
                  {linhaDado("Bulbo seco", `${r.tbs.toFixed(1)} °C`)}
                  {linhaDado("Umidade relativa", `${r.ur.toFixed(1)} %`)}
                  {linhaDado("Ponto de orvalho", `${r.td.toFixed(2)} °C`)}
                  {linhaDado("Pressão de saturação (pws)", `${r.pws.toFixed(3)} kPa`)}
                  {linhaDado("Pressão de vapor (pw)", `${r.pw.toFixed(3)} kPa`)}
                  {linhaDado("Umidade absoluta", `${(r.w * 1000).toFixed(2)} g/kg`)}
                  {linhaDado("Entalpia", `${r.h.toFixed(1)} kJ/kg`)}
                  {linhaDado("Volume específico", `${r.v.toFixed(3)} m³/kg`)}
                </>
              ) : (
                <p className="text-sm text-hedut-abissal/60">
                  Preencha a temperatura e a{" "}
                  {modoUR ? "umidade relativa" : "temperatura do ponto de orvalho"}{" "}
                  para calcular.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/60 mt-8 leading-relaxed max-w-3xl">
        Cálculo conforme o ASHRAE Handbook — Fundamentals, cap. 1
        (Psychrometrics): pressão de saturação de Hyland-Wexler (eq. 5 sobre o
        gelo e eq. 6 sobre a água) e correlação do ponto de orvalho (eq. 37 e
        38). Válido para ponto de orvalho de 0 a 93 °C e, abaixo de 0 °C,
        ponto de geada. Pressão atmosférica padrão ao nível do mar (101,325
        kPa), usada apenas na umidade absoluta, entalpia e volume específico —
        o ponto de orvalho em si não depende dela. Resultado de referência —
        valide com as normas do seu projeto antes de especificar.
      </p>
    </div>
  );
}
