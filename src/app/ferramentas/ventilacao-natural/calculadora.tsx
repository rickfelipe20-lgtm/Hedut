"use client";

import { useMemo, useState } from "react";
import {
  CV_PADRAO,
  calcularVentilacao,
  entradaExemplo,
  entradaVazia,
  type CriterioVazao,
  type Direcao,
  type EntradaVent,
  type ModoVent,
} from "./ventilacao";

function inputClass() {
  return "w-full border border-hedut-aco/60 bg-hedut-nevoa focus:bg-white px-4 py-2.5 focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-sm text-hedut-abissal/70 mb-2";
}

function Cartao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-hedut-aco/70 rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6 mb-6">
      <h3 className="font-display font-bold text-hedut-abissal text-xl mb-1">
        {titulo}
      </h3>
      {descricao && (
        <p className="text-sm text-hedut-abissal/60 mb-5 leading-relaxed">
          {descricao}
        </p>
      )}
      {!descricao && <div className="mb-4" />}
      {children}
    </div>
  );
}

function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  const [aberta, setAberta] = useState(false);
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
          className={`w-5 h-5 shrink-0 text-hedut-abissal/50 transition-transform ${
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

const DICAS = {
  ti: "Temperatura do ar dentro do ambiente. Quanto maior que a externa, mais forte o efeito chaminé.",
  to: "Temperatura do ar lá fora (condição de projeto do local).",
  u: "Velocidade do vento no local, na altura da edificação. Zero = calmaria.",
  volume:
    "Volume do ambiente (comprimento × largura × pé-direito). Usado nas trocas de ar por hora.",
  areaPiso: "Área do piso do ambiente. Serve só para mostrar a abertura como % do piso.",
  areaEntrada:
    "Área livre por onde o ar entra, já descontando caixilhos, telas e venezianas.",
  areaSaida:
    "Área livre por onde o ar sai, já descontando caixilhos, telas e venezianas.",
  h: "Distância vertical entre o centro da abertura de entrada e o da saída. Saída mais alta = mais efeito chaminé. 0 = mesma altura.",
  criterio:
    "Como você quer informar o ar necessário: por trocas por hora, por vazão direta ou pelo calor a remover.",
  trocas: "Quantas vezes por hora o ar do ambiente deve ser renovado.",
  vazao: "Volume de ar por hora que precisa atravessar o ambiente.",
  calor:
    "Calor sensível que a ventilação deve levar para fora (pessoas, equipamentos, sol…).",
  razao: "Área de saída dividida pela de entrada. 1 = iguais.",
  direcao:
    "Ângulo do vento em relação à fachada da abertura de entrada. Define o coeficiente Cv.",
  cv: "Efetividade das aberturas (0 a 1): quanto do vento vira vazão de ar.",
  cd: "Coeficiente de descarga: perda de energia ao passar pela abertura. Cerca de 0,65 em aberturas comuns.",
};

// Envolve um campo com o balão explicativo (aparece no hover e no foco).
function Dica({
  id,
  titulo,
  texto,
  children,
}: {
  id: string;
  titulo: string;
  texto: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <span
        id={id}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-xl bg-hedut-abissal px-3 py-2.5 text-xs leading-snug text-white opacity-0 shadow-[0_6px_20px_rgba(8,25,44,0.35)] transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
          {titulo}
        </span>
        {texto}
        <span className="absolute left-1/2 top-full -mt-1.5 h-3 w-3 -translate-x-1/2 rotate-45 bg-hedut-abissal" />
      </span>
      {children}
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  min,
  dica,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  dica?: string;
}) {
  const id = `dica-${label.replace(/[^a-zA-Z0-9]+/g, "-")}`;
  const campo = (
    <>
      <label className={`${labelClass()} ${dica ? "cursor-help" : ""}`}>
        {label}
      </label>
      <input
        type="number"
        step="any"
        min={min}
        value={value}
        placeholder={placeholder}
        aria-describedby={dica ? id : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass()}
      />
    </>
  );
  if (!dica) return <div>{campo}</div>;
  return (
    <Dica id={id} titulo={label.replace(/\s*\(.*\)\s*$/, "")} texto={dica}>
      {campo}
    </Dica>
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

const MODOS: { chave: ModoVent; titulo: string; descricao: string }[] = [
  {
    chave: "vazao",
    titulo: "Aberturas → vazão de ar",
    descricao: "Conheço as janelas e quero saber quanto ar entra",
  },
  {
    chave: "area",
    titulo: "Vazão necessária → área das aberturas",
    descricao: "Preciso de uma vazão e quero dimensionar as janelas",
  },
];

export function Calculadora() {
  const [e, setE] = useState<EntradaVent>(entradaVazia);
  const r = useMemo(() => calcularVentilacao(e), [e]);

  function atualizar(patch: Partial<EntradaVent>) {
    setE((atual) => ({ ...atual, ...patch }));
  }

  const modoVazao = e.modo === "vazao";
  const f = (n: number, casas: number) => n.toFixed(casas);

  function linhasMemoria() {
    if (!r.pronto) return [];
    const linhas: React.ReactNode[] = [];
    const u = e.u === "" ? "0" : e.u;
    const h = e.h === "" ? "0" : e.h;
    const tRef = (r.deltaT >= 0 ? Number(e.ti) : Number(e.to)) + 273.15;

    if (modoVazao) {
      linhas.push(
        linhaMemoria(
          "1. Área efetiva",
          "A_ef = A_e · A_s / √(A_e² + A_s²)",
          `${e.areaEntrada} · ${e.areaSaida} / √(${e.areaEntrada}² + ${e.areaSaida}²)`,
          `${f(r.aEfetiva!, 3)} m²`
        ),
        linhaMemoria(
          "2. Vazão por vento",
          "Q_v = Cv · √2 · A_ef · U   (= Cv · A · U se A_e = A_s)",
          `${f(r.cv, 2)} · 1,414 · ${f(r.aEfetiva!, 3)} · ${u}`,
          `${f(r.qVento!, 3)} m³/s`
        ),
        linhaMemoria(
          "3. Vazão por efeito chaminé",
          "Q_c = Cd · A_ef · √(2 g H |Ti − To| / T)",
          `${f(r.cd, 2)} · ${f(r.aEfetiva!, 3)} · √(2 · 9,81 · ${h} · ${f(Math.abs(r.deltaT), 1)} / ${f(tRef, 1)})`,
          `${f(r.qChamine!, 3)} m³/s`
        ),
        linhaMemoria(
          "4. Vazão combinada",
          "Q = √(Q_v² + Q_c²)",
          `√(${f(r.qVento!, 3)}² + ${f(r.qChamine!, 3)}²)`,
          `${f(r.qTotal!, 3)} m³/s = ${f(r.qTotal! * 3600, 0)} m³/h`
        )
      );
      if (r.ach !== null) {
        linhas.push(
          linhaMemoria(
            "5. Trocas de ar por hora",
            "ACH = Q · 3600 / V",
            `${f(r.qTotal!, 3)} · 3600 / ${e.volume}`,
            `${f(r.ach, 1)} 1/h`
          )
        );
      }
      if (r.calorKw !== null) {
        linhas.push(
          linhaMemoria(
            "6. Calor sensível removido",
            "q = ρ · cp · Q · (Ti − To)",
            `1,2 · 1,006 · ${f(r.qTotal!, 3)} · ${f(r.deltaT, 1)}`,
            `${f(r.calorKw, 2)} kW`
          )
        );
      }
    } else if (r.qNecessaria !== null) {
      linhas.push(
        linhaMemoria(
          "1. Vazão necessária",
          e.criterio === "vazao"
            ? "Q informada"
            : e.criterio === "trocas"
              ? "Q = ACH · V / 3600"
              : "Q = q / (ρ · cp · (Ti − To))",
          e.criterio === "trocas"
            ? `${e.trocasAlvo} · ${e.volume} / 3600`
            : e.criterio === "calor"
              ? `${e.calorKw} / (1,2 · 1,006 · ${f(r.deltaT, 1)})`
              : `${e.vazaoAlvo} / 3600`,
          `${f(r.qNecessaria, 3)} m³/s = ${f(r.qNecessaria * 3600, 0)} m³/h`
        ),
        linhaMemoria(
          "2. Velocidades equivalentes",
          "k_v = Cv · √2 · U ;  k_c = Cd · √(2 g H |Ti − To| / T) ;  k = √(k_v² + k_c²)",
          `k_v = ${f(r.kVento, 3)} m/s ;  k_c = ${f(r.kChamine, 3)} m/s`,
          `k = ${f(r.kTotal, 3)} m/s`
        ),
        linhaMemoria(
          "3. Área efetiva necessária",
          "A_ef = Q / k",
          `${f(r.qNecessaria, 3)} / ${f(r.kTotal, 3)}`,
          `${f(r.aEfetiva!, 3)} m²`
        ),
        linhaMemoria(
          "4. Áreas livres",
          "A_e = A_ef · √(1 + r²) / r ;  A_s = r · A_e",
          `r = ${e.razao}`,
          `A_e = ${f(r.aEntrada!, 2)} m² ; A_s = ${f(r.aSaida!, 2)} m²`
        )
      );
    }
    return linhas;
  }

  const classeFracao = (v: number) => `${Math.round(v * 100)}%`;

  return (
    <div className="mb-32">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {MODOS.map((m) => {
          const ativo = e.modo === m.chave;
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

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setE(entradaExemplo())}
          className="font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
        >
          Carregar exemplo (sala de 90 m³)
        </button>
        <button
          type="button"
          onClick={() => setE(entradaVazia())}
          className="font-mono text-xs uppercase tracking-wide text-hedut-abissal/60 hover:text-hedut-abissal transition px-3 py-2"
        >
          Limpar tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ENTRADAS */}
        <div className="lg:col-span-2">
          <Cartao
            titulo="Clima e ambiente"
            descricao="Condições de projeto do local e dimensões do ambiente."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Campo
                label="Temperatura interna (°C)"
                dica={DICAS.ti}
                value={e.ti}
                onChange={(v) => atualizar({ ti: v })}
                placeholder="Ex: 28"
              />
              <Campo
                label="Temperatura externa (°C)"
                dica={DICAS.to}
                value={e.to}
                onChange={(v) => atualizar({ to: v })}
                placeholder="Ex: 24"
              />
              <Campo
                label="Velocidade do vento (m/s)"
                dica={DICAS.u}
                value={e.u}
                onChange={(v) => atualizar({ u: v })}
                placeholder="0 = calmaria"
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Campo
                label="Volume do ambiente (m³)"
                dica={DICAS.volume}
                value={e.volume}
                onChange={(v) => atualizar({ volume: v })}
                placeholder="Opcional"
                min={0}
              />
              <Campo
                label="Área do piso (m²)"
                dica={DICAS.areaPiso}
                value={e.areaPiso}
                onChange={(v) => atualizar({ areaPiso: v })}
                placeholder="Opcional"
                min={0}
              />
            </div>
            <p className="font-mono text-xs text-hedut-abissal/60 mt-4 leading-relaxed">
              Use o vento do local na altura da edificação: dados de estação
              meteorológica (normalmente a 10 m, em terreno aberto) costumam
              superestimar o vento em área urbana.
            </p>
          </Cartao>

          <Cartao
            titulo="Aberturas"
            descricao={
              modoVazao
                ? "Áreas livres (descontando esquadrias, telas e venezianas) da abertura de entrada e da de saída."
                : "Quanto de ar você precisa e como as aberturas estão dispostas."
            }
          >
            {modoVazao ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Campo
                  label="Área livre de entrada (m²)"
                dica={DICAS.areaEntrada}
                  value={e.areaEntrada}
                  onChange={(v) => atualizar({ areaEntrada: v })}
                  placeholder="Ex: 1.5"
                  min={0}
                />
                <Campo
                  label="Área livre de saída (m²)"
                dica={DICAS.areaSaida}
                  value={e.areaSaida}
                  onChange={(v) => atualizar({ areaSaida: v })}
                  placeholder="Ex: 1.5"
                  min={0}
                />
                <Campo
                  label="Desnível entrada → saída (m)"
                dica={DICAS.h}
                  value={e.h}
                  onChange={(v) => atualizar({ h: v })}
                  placeholder="0 = mesma altura"
                  min={0}
                />
              </div>
            ) : (
              <>
                <div className="mb-4 max-w-sm">
                  <Dica
                    id="dica-criterio"
                    titulo="Como definir a vazão"
                    texto={DICAS.criterio}
                  >
                    <label className={`${labelClass()} cursor-help`}>
                      Como definir a vazão?
                    </label>
                    <select
                      value={e.criterio}
                      aria-describedby="dica-criterio"
                      onChange={(ev) =>
                        atualizar({
                          criterio: ev.target.value as CriterioVazao,
                        })
                      }
                      className={inputClass()}
                    >
                      <option value="trocas">Trocas de ar por hora</option>
                      <option value="vazao">Vazão direta (m³/h)</option>
                      <option value="calor">Remover calor sensível</option>
                    </select>
                  </Dica>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {e.criterio === "trocas" && (
                    <Campo
                      label="Trocas por hora (1/h)"
                dica={DICAS.trocas}
                      value={e.trocasAlvo}
                      onChange={(v) => atualizar({ trocasAlvo: v })}
                      placeholder="Ex: 10"
                      min={0}
                    />
                  )}
                  {e.criterio === "vazao" && (
                    <Campo
                      label="Vazão necessária (m³/h)"
                dica={DICAS.vazao}
                      value={e.vazaoAlvo}
                      onChange={(v) => atualizar({ vazaoAlvo: v })}
                      placeholder="Ex: 3000"
                      min={0}
                    />
                  )}
                  {e.criterio === "calor" && (
                    <Campo
                      label="Calor sensível a remover (kW)"
                dica={DICAS.calor}
                      value={e.calorKw}
                      onChange={(v) => atualizar({ calorKw: v })}
                      placeholder="Ex: 8"
                      min={0}
                    />
                  )}
                  <Campo
                    label="Desnível entrada → saída (m)"
                dica={DICAS.h}
                    value={e.h}
                    onChange={(v) => atualizar({ h: v })}
                    placeholder="0 = mesma altura"
                    min={0}
                  />
                  <Campo
                    label="Razão área de saída / entrada"
                dica={DICAS.razao}
                    value={e.razao}
                    onChange={(v) => atualizar({ razao: v })}
                    placeholder="1 = iguais"
                    min={0}
                  />
                </div>
                {e.criterio === "trocas" && e.volume.trim() === "" && (
                  <p className="font-mono text-xs text-hedut-abissal/60 mt-3">
                    Informe o volume do ambiente em &quot;Clima e ambiente&quot;.
                  </p>
                )}
                {e.criterio === "calor" && (
                  <p className="font-mono text-xs text-hedut-abissal/60 mt-3">
                    A temperatura interna precisa ser maior que a externa: a
                    vazão é a que carrega o calor com essa diferença.
                  </p>
                )}
              </>
            )}
          </Cartao>

          <Cartao
            titulo="Coeficientes (ASHRAE)"
            descricao="Valores típicos do ASHRAE Fundamentals; ajuste conforme a geometria real das aberturas."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Dica
                id="dica-direcao"
                titulo="Direção do vento"
                texto={DICAS.direcao}
              >
                <label className={`${labelClass()} cursor-help`}>
                  Direção do vento (Cv)
                </label>
                <select
                  value={e.direcao}
                  aria-describedby="dica-direcao"
                  onChange={(ev) =>
                    atualizar({ direcao: ev.target.value as Direcao })
                  }
                  className={inputClass()}
                >
                  <option value="perpendicular">
                    Perpendicular à fachada (Cv = {CV_PADRAO.perpendicular})
                  </option>
                  <option value="diagonal">
                    Diagonal (Cv = {CV_PADRAO.diagonal})
                  </option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </Dica>
              {e.direcao === "personalizado" && (
                <Campo
                  label="Cv (efetividade das aberturas)"
                dica={DICAS.cv}
                  value={e.cvPersonalizado}
                  onChange={(v) => atualizar({ cvPersonalizado: v })}
                  placeholder="0 a 1"
                  min={0}
                />
              )}
              <Campo
                label="Cd (coef. de descarga)"
                dica={DICAS.cd}
                value={e.cd}
                onChange={(v) => atualizar({ cd: v })}
                placeholder="0.65"
                min={0}
              />
            </div>
            <p className="font-mono text-xs text-hedut-abissal/60 mt-4 leading-relaxed">
              Cv ≈ 0,5–0,6 para vento perpendicular e 0,25–0,35 para vento
              diagonal; Cd ≈ 0,65 para aberturas comuns.
            </p>
          </Cartao>

          <Secao titulo="Memória de Cálculo">
            {r.pronto && !r.erro ? (
              <div>{linhasMemoria()}</div>
            ) : (
              <p className="text-sm text-hedut-abissal/60">
                Preencha os dados para ver as contas.
              </p>
            )}
          </Secao>
        </div>

        {/* RESULTADO */}
        <div>
          <div className="sticky top-6">
            <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-6">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-2">
                {modoVazao ? "Vazão por ventilação natural" : "Área livre necessária"}
              </p>

              {r.erro ? (
                <p className="text-sm leading-relaxed text-red-200">{r.erro}</p>
              ) : !r.pronto ? (
                <>
                  <p className="font-display font-bold text-4xl mb-3">—</p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {r.faltam.length > 0
                      ? `Preencha: ${r.faltam.join(", ")}.`
                      : "Preencha os dados para calcular."}
                  </p>
                </>
              ) : modoVazao ? (
                <>
                  <p className="font-display font-bold text-4xl mb-1">
                    {f(r.qTotal! * 3600, 0)} m³/h
                  </p>
                  <p className="font-mono text-xs text-white/50 mb-4">
                    {f(r.qTotal!, 3)} m³/s · {f(r.qTotal! * 1000, 0)} L/s
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/60 text-xs">Trocas por hora</p>
                      <p className="font-medium">
                        {r.ach !== null ? `${f(r.ach, 1)} 1/h` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Calor removido</p>
                      <p className="font-medium">
                        {r.calorKw !== null ? `${f(r.calorKw, 2)} kW` : "—"}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-display font-bold text-4xl mb-1">
                    {f(r.aEntrada!, 2)} m²
                  </p>
                  <p className="font-mono text-xs text-white/50 mb-4">
                    de entrada · saída {f(r.aSaida!, 2)} m²
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-white/60 text-xs">Vazão alvo</p>
                      <p className="font-medium">
                        {f(r.qNecessaria! * 3600, 0)} m³/h
                      </p>
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">
                        Entrada / área do piso
                      </p>
                      <p className="font-medium">
                        {r.percPiso !== null ? `${f(r.percPiso, 1)} %` : "—"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {r.pronto && !r.erro && r.fracVento !== null && (
                <div className="mt-5 pt-5 border-t border-white/20">
                  <p className="text-white/60 text-xs mb-2">
                    Quem move o ar
                  </p>
                  <div className="flex h-2.5 rounded-full overflow-hidden bg-white/10">
                    <div
                      className="bg-sky-400"
                      style={{ width: `${r.fracVento * 100}%` }}
                    />
                    <div className="bg-amber-400 flex-1" />
                  </div>
                  <div className="flex justify-between font-mono text-[11px] text-white/60 mt-1.5">
                    <span>vento {classeFracao(r.fracVento)}</span>
                    <span>chaminé {classeFracao(1 - r.fracVento)}</span>
                  </div>
                  {r.qVento !== null && r.qChamine !== null && (
                    <p className="font-mono text-[11px] text-white/50 mt-2">
                      vento {f(r.qVento * 3600, 0)} m³/h · chaminé{" "}
                      {f(r.qChamine * 3600, 0)} m³/h
                    </p>
                  )}
                </div>
              )}

              {r.pronto &&
                !r.erro &&
                modoVazao &&
                r.percPiso !== null && (
                  <p className="font-mono text-xs text-white/50 mt-4">
                    Abertura de entrada = {f(r.percPiso, 1)} % da área do piso
                  </p>
                )}
            </div>

            {r.avisos.length > 0 && !r.erro && (
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 text-sm text-amber-900 leading-relaxed space-y-2">
                {r.avisos.map((a) => (
                  <p key={a}>{a}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/60 mt-8 leading-relaxed max-w-3xl">
        Estimativa pelo método do ASHRAE Handbook — Fundamentals, cap. 16
        (Ventilation and Infiltration): vento Q = Cv·A·U, efeito chaminé Q =
        Cd·A·√(2·g·Δh·(Ti−To)/Ti) e combinação Q = √(Qv² + Qc²). Para
        aberturas de áreas diferentes usa-se a área efetiva, que reproduz as
        equações do ASHRAE quando entrada e saída são iguais. A ventilação
        natural varia com o vento, a vizinhança e a geometria real das
        aberturas: o resultado é uma estimativa, não substitui simulação
        (CFD/multizona) nem medição. Os requisitos mínimos de abertura
        dependem da norma e da edição adotadas no projeto (ASHRAE 62.1, NBR
        15575, código de obras local) e não estão embutidos nesta ferramenta.
      </p>
    </div>
  );
}
