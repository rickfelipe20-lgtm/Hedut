"use client";

import { useMemo, useRef, useState } from "react";
import {
  calcularIBUTG,
  exemploGalpao,
  minutosSituacao,
  num,
  situacaoPadrao,
  superficiePadrao,
  type CampoFaltando,
  type EntradaIBUTG,
  type ModoAmbiente,
  type ModoRadiante,
  type ResultadoIBUTG,
  type ResultadoSituacao,
  type Situacao,
  type Superficie,
} from "./ibutg";
import { BIBLIOTECA, QUADRO_2 } from "./tabelas";

const CORES_SITUACAO = ["#0B4A80", "#C2410C", "#15803D", "#7C3AED"];
const MAX_SITUACOES = 4;
const MAX_SUPERFICIES = 10;

function inputClass(erro = false) {
  return `w-full border px-3 py-2 text-sm focus:outline-none focus:border-hedut-blue ${
    erro ? "border-red-400 bg-red-50/40" : "border-hedut-aco/60 bg-hedut-nevoa focus:bg-white"
  }`;
}

function labelClass() {
  return "block font-mono text-xs text-hedut-abissal/60 mb-1";
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

function CampoNumero({
  label,
  value,
  onChange,
  erro,
  placeholder,
  disabled,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  erro?: boolean;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
}) {
  return (
    <div>
      <label className={labelClass()}>{label}</label>
      <input
        type="number"
        step="any"
        min={min}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass(erro)} ${disabled ? "!bg-hedut-aco/20 text-hedut-abissal/60 cursor-not-allowed" : ""}`}
      />
    </div>
  );
}

function CardSituacao({
  situacao,
  index,
  minutos,
  resultado,
  podeRemover,
  onChange,
  onRemover,
}: {
  situacao: Situacao;
  index: number;
  minutos: number;
  resultado: ResultadoSituacao;
  podeRemover: boolean;
  onChange: (patch: Partial<Situacao>) => void;
  onRemover: () => void;
}) {
  const faltando = new Set<CampoFaltando>(resultado.faltam);
  const cor = CORES_SITUACAO[index % CORES_SITUACAO.length];

  return (
    <div className="border border-hedut-aco/60 border-l-4 border-l-hedut-blue/50 rounded-xl p-5 mb-4 last:mb-0">
      <div className="flex items-center justify-between gap-3 mb-4">
        <p
          className="font-mono text-xs tracking-[0.15em] uppercase"
          style={{ color: cor }}
        >
          Situação {index + 1}
        </p>
        {podeRemover && (
          <button
            type="button"
            onClick={onRemover}
            aria-label={`Remover situação ${index + 1}`}
            className="font-mono text-xs uppercase tracking-wide text-hedut-abissal/40 hover:text-red-600 transition"
          >
            Remover
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className={labelClass()}>Onde o trabalhador está?</label>
          <input
            type="text"
            value={situacao.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Ex: posto junto ao forno, sala de descanso"
            className={inputClass()}
          />
        </div>
        {index === 0 ? (
          <CampoNumero
            label="Tempo (min) — o que falta para 60"
            value={String(minutos)}
            onChange={() => {}}
            disabled
          />
        ) : (
          <CampoNumero
            label="Tempo (min)"
            value={situacao.minutos}
            onChange={(v) => onChange({ minutos: v })}
            placeholder="0"
            min={0}
          />
        )}
      </div>

      <div className="mb-4">
        <label className={labelClass()}>
          O que está fazendo? (Quadro 2 da NR-15)
          {resultado.m !== null && (
            <span className="text-hedut-blue"> — M = {resultado.m} W</span>
          )}
        </label>
        <select
          value={situacao.atividade}
          onChange={(e) => onChange({ atividade: e.target.value })}
          className={inputClass(faltando.has("atividade"))}
        >
          <option value="">Selecione a atividade…</option>
          {QUADRO_2.map((q) => (
            <option key={q.nome} value={q.nome}>
              {q.nome} ({q.m} W)
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 font-mono text-xs text-hedut-abissal/70 mb-5">
        <input
          type="checkbox"
          checked={situacao.solDireto}
          onChange={(e) => onChange({ solDireto: e.target.checked })}
        />
        Recebe sol direto (muda a fórmula: 0,7·tbn + 0,2·tg + 0,1·tbs)
      </label>

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-hedut-abissal/60 mb-3">
        Ar no posto
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelClass()}>Como o ambiente é tratado?</label>
          <select
            value={situacao.ambiente}
            onChange={(e) =>
              onChange({ ambiente: e.target.value as ModoAmbiente | "" })
            }
            className={inputClass(faltando.has("ambiente"))}
          >
            <option value="">Selecione…</option>
            <option value="Ventilado">Ventilado (natural ou mecânico)</option>
            <option value="Climatizado">Climatizado (ar-condicionado)</option>
          </select>
        </div>
        <CampoNumero
          label="Velocidade do ar no trabalhador (m/s)"
          value={situacao.va}
          onChange={(v) => onChange({ va: v })}
          erro={faltando.has("va")}
          placeholder="Ex: 0.3"
          min={0}
        />
      </div>

      {situacao.ambiente === "Climatizado" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <CampoNumero
            label="Temperatura do ar — setpoint (°C)"
            value={situacao.taClim}
            onChange={(v) => onChange({ taClim: v })}
            erro={faltando.has("taClim")}
            placeholder="Ex: 24"
          />
          <CampoNumero
            label="Umidade relativa — setpoint (%)"
            value={situacao.urClim}
            onChange={(v) => onChange({ urClim: v })}
            erro={faltando.has("urClim")}
            placeholder="Ex: 55"
            min={0}
          />
        </div>
      )}

      {situacao.ambiente === "Ventilado" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <CampoNumero
            label="Carga térmica sensível (kW)"
            value={situacao.qs}
            onChange={(v) => onChange({ qs: v })}
            erro={faltando.has("qs")}
            placeholder="Ex: 120"
            min={0}
          />
          <CampoNumero
            label="Carga térmica latente (kW)"
            value={situacao.ql}
            onChange={(v) => onChange({ ql: v })}
            placeholder="0"
            min={0}
          />
          <CampoNumero
            label="Vazão de ventilação (m³/h)"
            value={situacao.vazao}
            onChange={(v) => onChange({ vazao: v })}
            erro={faltando.has("vazao")}
            placeholder="Ex: 60000"
            min={0}
          />
        </div>
      )}
      {situacao.ambiente === "Ventilado" &&
        (faltando.has("te") || faltando.has("urExt")) && (
          <p className="font-mono text-xs text-red-600 mb-4">
            Informe a temperatura e a umidade externas em &quot;Dados do
            Local&quot;.
          </p>
        )}

      <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-hedut-abissal/60 mb-3">
        Calor radiante
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass()}>Há superfície quente radiando?</label>
          <select
            value={situacao.radiante}
            onChange={(e) =>
              onChange({ radiante: e.target.value as ModoRadiante | "" })
            }
            className={inputClass(faltando.has("radiante"))}
          >
            <option value="">Selecione…</option>
            <option value="Sem fonte radiante">
              Sem fonte radiante (tr = ta)
            </option>
            <option value="Pelas superfícies">
              Pelas superfícies (tabela abaixo)
            </option>
            <option value="Informar tr">Informar tr (simulação/medição)</option>
          </select>
        </div>
        {situacao.radiante === "Informar tr" && (
          <CampoNumero
            label="Temperatura radiante média — tr (°C)"
            value={situacao.trInformada}
            onChange={(v) => onChange({ trInformada: v })}
            erro={faltando.has("trInformada")}
            placeholder="Ex: 45"
          />
        )}
      </div>
      {faltando.has("superficies") && (
        <p className="font-mono text-xs text-red-600 mt-3">
          Adicione ao menos uma superfície para esta situação em
          &quot;Superfícies Radiantes&quot;.
        </p>
      )}
    </div>
  );
}

function CardSuperficie({
  superficie,
  situacoes,
  calculo,
  onChange,
  onRemover,
}: {
  superficie: Superficie;
  situacoes: Situacao[];
  calculo: ResultadoIBUTG["superficies"][number];
  onChange: (patch: Partial<Superficie>) => void;
  onRemover: () => void;
}) {
  return (
    <div className="border border-hedut-aco/60 border-l-4 border-l-hedut-blue/50 rounded-xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <select
          value={superficie.item}
          onChange={(e) => onChange({ item: e.target.value })}
          className={inputClass()}
        >
          <option value="">Escolha o item na lista…</option>
          {BIBLIOTECA.map((b) => (
            <option key={b.nome} value={b.nome}>
              {b.nome}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onRemover}
          aria-label="Remover superfície"
          className="text-hedut-abissal/40 hover:text-red-600 transition text-lg leading-none px-1 pt-1.5"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={labelClass()}>Situação</label>
          <select
            value={superficie.situacaoId}
            onChange={(e) => onChange({ situacaoId: Number(e.target.value) })}
            className={inputClass()}
          >
            {situacoes.map((s, i) => (
              <option key={s.id} value={s.id}>
                Situação {i + 1}
              </option>
            ))}
          </select>
        </div>
        <CampoNumero
          label="Área vista (m²)"
          value={superficie.area}
          onChange={(v) => onChange({ area: v })}
          placeholder="0"
          min={0}
        />
        <CampoNumero
          label="Rad. solar (W/m²) — opcional"
          value={superficie.radSolar}
          onChange={(v) => onChange({ radSolar: v })}
          placeholder="típico"
          min={0}
        />
        <CampoNumero
          label="tsi conhecida (°C) — opcional"
          value={superficie.tsiConhecida}
          onChange={(v) => onChange({ tsiConhecida: v })}
          placeholder="típica"
        />
      </div>

      {superficie.item !== "" && (
        <p className="font-mono text-xs text-hedut-abissal/60 mt-3">
          {calculo.tsi !== null ? (
            <>
              tsi adotada:{" "}
              <span className="text-hedut-blue font-medium">
                {calculo.tsi.toFixed(1)} °C
              </span>{" "}
              · {calculo.origem}
            </>
          ) : (
            calculo.origem
          )}
        </p>
      )}
    </div>
  );
}

function BarraLimites({ r }: { r: ResultadoIBUTG }) {
  if (r.ibutgMedio === null || r.nivelAcao === null) return null;
  const limite = r.limite ?? r.nivelAcao + 3;
  const lo = Math.floor(Math.min(r.nivelAcao, r.ibutgMedio) - 3);
  const hi = Math.ceil(Math.max(limite, r.ibutgMedio) + 3);
  const pct = (v: number) =>
    `${Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100))}%`;

  return (
    <div className="mt-5">
      <div className="relative h-3 rounded-full overflow-hidden flex">
        <div
          style={{ width: pct(r.nivelAcao) }}
          className="bg-green-500/80 h-full"
        />
        <div
          style={{
            width: `${
              ((limite - r.nivelAcao) / (hi - lo)) * 100
            }%`,
          }}
          className="bg-amber-400/90 h-full"
        />
        <div className="bg-red-500/80 h-full flex-1" />
        <div
          style={{ left: pct(r.ibutgMedio) }}
          className="absolute top-0 -translate-x-1/2 w-1 h-full bg-white"
        />
      </div>
      <div className="flex justify-between font-mono text-[10px] text-white/50 mt-1.5">
        <span>{lo} °C</span>
        <span>nível de ação {r.nivelAcao.toFixed(1)}</span>
        {r.limite !== null && <span>limite {r.limite.toFixed(1)}</span>}
        <span>{hi} °C</span>
      </div>
    </div>
  );
}

const ESTILO_CONCLUSAO: Record<string, string> = {
  excedido: "bg-red-500/20 border-red-400/50 text-red-100",
  acao: "bg-amber-400/20 border-amber-300/50 text-amber-100",
  ok: "bg-green-500/20 border-green-400/50 text-green-100",
  aviso: "bg-amber-400/15 border-amber-300/40 text-amber-100",
  vazio: "bg-white/5 border-white/15 text-white/70",
};

function linhaMemoria(
  etapa: string,
  equacao: string,
  numeros: string,
  resultado: string,
  unidade: string
) {
  return (
    <div
      key={etapa}
      className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-1 py-3 border-b border-hedut-aco/15 last:border-0"
    >
      <p className="md:col-span-3 text-sm font-medium text-hedut-abissal">
        {etapa}
      </p>
      <div className="md:col-span-7">
        <p className="font-mono text-xs text-hedut-abissal/70">{equacao}</p>
        {numeros && (
          <p className="font-mono text-xs text-hedut-blue mt-0.5">{numeros}</p>
        )}
      </div>
      <p className="md:col-span-2 md:text-right text-sm font-medium text-hedut-abissal">
        {resultado} <span className="text-hedut-abissal/60">{unidade}</span>
      </p>
    </div>
  );
}

export function Calculadora() {
  const [entrada, setEntrada] = useState<EntradaIBUTG>(() => ({
    altitude: "0",
    te: "",
    urExt: "",
    situacoes: [situacaoPadrao(1)],
    superficies: [],
  }));
  const [situacaoMemoria, setSituacaoMemoria] = useState(1);
  const proximaSituacao = useRef(2);
  const proximaSuperficie = useRef(1);

  const resultado = useMemo(() => calcularIBUTG(entrada), [entrada]);

  function atualizarLocal(patch: Partial<EntradaIBUTG>) {
    setEntrada((atual) => ({ ...atual, ...patch }));
  }

  function atualizarSituacao(id: number, patch: Partial<Situacao>) {
    setEntrada((atual) => ({
      ...atual,
      situacoes: atual.situacoes.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }));
  }

  function adicionarSituacao() {
    const nova = situacaoPadrao(proximaSituacao.current);
    proximaSituacao.current += 1;
    setEntrada((atual) =>
      atual.situacoes.length >= MAX_SITUACOES
        ? atual
        : { ...atual, situacoes: [...atual.situacoes, nova] }
    );
  }

  function removerSituacao(id: number) {
    setEntrada((atual) => {
      if (atual.situacoes.length <= 1) return atual;
      const restantes = atual.situacoes.filter((s) => s.id !== id);
      return {
        ...atual,
        situacoes: restantes,
        superficies: atual.superficies.map((sup) =>
          sup.situacaoId === id
            ? { ...sup, situacaoId: restantes[0].id }
            : sup
        ),
      };
    });
    if (situacaoMemoria === id) setSituacaoMemoria(entrada.situacoes[0].id);
  }

  function atualizarSuperficie(id: number, patch: Partial<Superficie>) {
    setEntrada((atual) => ({
      ...atual,
      superficies: atual.superficies.map((s) =>
        s.id === id ? { ...s, ...patch } : s
      ),
    }));
  }

  function adicionarSuperficie() {
    const nova = superficiePadrao(
      proximaSuperficie.current,
      entrada.situacoes[0].id
    );
    proximaSuperficie.current += 1;
    setEntrada((atual) =>
      atual.superficies.length >= MAX_SUPERFICIES
        ? atual
        : { ...atual, superficies: [...atual.superficies, nova] }
    );
  }

  function removerSuperficie(id: number) {
    setEntrada((atual) => ({
      ...atual,
      superficies: atual.superficies.filter((s) => s.id !== id),
    }));
  }

  function carregarExemplo() {
    setEntrada(exemploGalpao());
    proximaSituacao.current = 2;
    proximaSuperficie.current = 4;
    setSituacaoMemoria(1);
  }

  function limpar() {
    setEntrada({
      altitude: "0",
      te: "",
      urExt: "",
      situacoes: [situacaoPadrao(1)],
      superficies: [],
    });
    proximaSituacao.current = 2;
    proximaSuperficie.current = 1;
    setSituacaoMemoria(1);
  }

  const totalMinutos = Math.max(
    60,
    resultado.situacoes.reduce((soma, s) => soma + s.minutos, 0)
  );

  const sitMemoria =
    resultado.situacoes.find((s) => s.id === situacaoMemoria) ??
    resultado.situacoes[0];
  const indexMemoria = resultado.situacoes.findIndex(
    (s) => s.id === sitMemoria.id
  );
  const entradaMemoria = entrada.situacoes[indexMemoria];

  function linhasMemoria() {
    const linhas: React.ReactNode[] = [];
    const z = num(entrada.altitude) ?? 0;
    linhas.push(
      linhaMemoria(
        "1. Pressão atmosférica",
        "p = 101,325 · (1 − 2,25577×10⁻⁵ · z)^5,2559",
        `101,325 · (1 − 2,25577×10⁻⁵ · ${z})^5,2559`,
        resultado.pressao.toFixed(3),
        "kPa"
      )
    );
    if (!sitMemoria.ativa) return linhas;

    const ta = sitMemoria.ta!;
    if (sitMemoria.ambiente === "Ventilado") {
      const vazaoM3s = (num(entradaMemoria.vazao) ?? 0) / 3600;
      linhas.push(
        linhaMemoria(
          "2. Temperatura do ar (tbs)",
          "ta = te + Qs / (ρ · cp · V)",
          `${entrada.te} + ${entradaMemoria.qs} / (1,20 · 1,006 · ${vazaoM3s.toFixed(2)})`,
          ta.toFixed(2),
          "°C"
        ),
        linhaMemoria(
          "3. Umidade do ar",
          "wi = we + Ql / (ρ · V · hfg)  →  UR = pv / ps(ta)",
          `wi = ${sitMemoria.wExt!.toFixed(4)} + ${num(entradaMemoria.ql) ?? 0} / (1,20 · ${vazaoM3s.toFixed(2)} · 2501) = ${sitMemoria.wInt!.toFixed(4)} kg/kg`,
          sitMemoria.ur!.toFixed(1),
          "%"
        )
      );
    } else {
      linhas.push(
        linhaMemoria(
          "2. Temperatura do ar (tbs)",
          "ta = temperatura de projeto informada",
          "",
          ta.toFixed(2),
          "°C"
        ),
        linhaMemoria(
          "3. Umidade do ar",
          "UR de projeto informada",
          "",
          sitMemoria.ur!.toFixed(1),
          "%"
        )
      );
    }

    linhas.push(
      linhaMemoria(
        "4. Temperatura radiante média (tr)",
        entradaMemoria.radiante === "Pelas superfícies"
          ? "tr = [Σ(A·T⁴) / ΣA]^¼ das superfícies"
          : entradaMemoria.radiante === "Informar tr"
            ? "tr informada"
            : "tr = ta (sem fonte radiante)",
        "",
        sitMemoria.tr!.toFixed(2),
        "°C"
      ),
      linhaMemoria(
        "5. Temperatura de globo (tg)",
        "tg = (hr · tr + hc · ta) / (hr + hc)",
        `(${sitMemoria.hrGlobo!.toFixed(2)} · ${sitMemoria.tr!.toFixed(1)} + ${sitMemoria.hcGlobo!.toFixed(2)} · ${ta.toFixed(1)}) / (${sitMemoria.hrGlobo!.toFixed(2)} + ${sitMemoria.hcGlobo!.toFixed(2)})`,
        sitMemoria.tg!.toFixed(2),
        "°C"
      ),
      linhaMemoria(
        "6. Bulbo úmido natural (tbn)",
        "calor que chega ao pavio = calor que sai evaporando (Newton-Raphson)",
        `convecção ${sitMemoria.convPavio!.toFixed(1)} + radiação ${sitMemoria.radPavio!.toFixed(1)} = evaporação ${sitMemoria.evapPavio!.toFixed(1)} W/m²`,
        sitMemoria.tbn!.toFixed(2),
        "°C"
      ),
      linhaMemoria(
        "7. IBUTG da situação",
        sitMemoria.solDireto
          ? "IBUTG = 0,7 · tbn + 0,2 · tg + 0,1 · tbs"
          : "IBUTG = 0,7 · tbn + 0,3 · tg",
        sitMemoria.solDireto
          ? `0,7 · ${sitMemoria.tbn!.toFixed(2)} + 0,2 · ${sitMemoria.tg!.toFixed(2)} + 0,1 · ${ta.toFixed(2)}`
          : `0,7 · ${sitMemoria.tbn!.toFixed(2)} + 0,3 · ${sitMemoria.tg!.toFixed(2)}`,
        sitMemoria.ibutg!.toFixed(2),
        "°C"
      ),
      linhaMemoria(
        "8. Taxa metabólica",
        "M = valor do Quadro 2 da NR-15",
        entradaMemoria.atividade,
        String(sitMemoria.m),
        "W"
      )
    );
    return linhas;
  }

  function linhasMemoriaGlobal() {
    const ativas = resultado.situacoes.filter((s) => s.ativa);
    if (ativas.length === 0 || resultado.ibutgMedio === null) return [];
    const somaT = resultado.minutosConsiderados;
    const linhas: React.ReactNode[] = [
      linhaMemoria(
        "9. IBUTG médio",
        "IBUTG = Σ(IBUTGi · ti) / Σti",
        `(${ativas.map((s) => `${s.ibutg!.toFixed(1)}×${s.minutos}`).join(" + ")}) / (${somaT})`,
        resultado.ibutgMedio.toFixed(2),
        "°C"
      ),
      linhaMemoria(
        "10. Taxa metabólica média",
        "M = Σ(Mi · ti) / Σti",
        `(${ativas.map((s) => `${s.m}×${s.minutos}`).join(" + ")}) / (${somaT})`,
        resultado.mMedio!.toFixed(0),
        "W"
      ),
      linhaMemoria(
        "11. Limite de exposição",
        "Quadro 1 da NR-15, com a M média",
        `M = ${resultado.mMedio!.toFixed(0)} W → linha do Quadro 1 com M igual ou imediatamente superior`,
        resultado.limite !== null ? resultado.limite.toFixed(1) : "fora do quadro",
        "°C"
      ),
      linhaMemoria(
        "12. Nível de ação",
        "NA = 59,9 − 14,1 · log(M)",
        `59,9 − 14,1 · log(${resultado.mMedio!.toFixed(0)})`,
        resultado.nivelAcao!.toFixed(1),
        "°C"
      ),
    ];
    if (resultado.folga !== null) {
      linhas.push(
        linhaMemoria(
          "13. Comparação",
          "IBUTG médio × limite × nível de ação",
          `${resultado.ibutgMedio.toFixed(1)} °C × limite ${resultado.limite!.toFixed(1)} °C × nível de ação ${resultado.nivelAcao!.toFixed(1)} °C`,
          resultado.folga.toFixed(1),
          "°C de folga"
        )
      );
    }
    return linhas;
  }

  const c = resultado.conclusao;

  return (
    <div className="mb-32">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={carregarExemplo}
          className="font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
        >
          Carregar exemplo (galpão de produção)
        </button>
        <button
          type="button"
          onClick={limpar}
          className="font-mono text-xs uppercase tracking-wide text-hedut-abissal/60 hover:text-hedut-abissal transition px-3 py-2"
        >
          Limpar tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULÁRIO */}
        <div className="lg:col-span-2">
          <Secao titulo="Dados do Local">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CampoNumero
                label="Altitude do local (m)"
                value={entrada.altitude}
                onChange={(v) => atualizarLocal({ altitude: v })}
                placeholder="0"
              />
              <CampoNumero
                label="Temperatura externa de projeto (°C)"
                value={entrada.te}
                onChange={(v) => atualizarLocal({ te: v })}
                erro={resultado.situacoes.some((s) =>
                  s.faltam.includes("te")
                )}
                placeholder="Ex: 32"
              />
              <CampoNumero
                label="Umidade relativa externa (%)"
                value={entrada.urExt}
                onChange={(v) => atualizarLocal({ urExt: v })}
                erro={resultado.situacoes.some((s) =>
                  s.faltam.includes("urExt")
                )}
                placeholder="Ex: 80"
                min={0}
              />
            </div>
            <p className="font-mono text-xs text-hedut-abissal/60 mt-4 leading-relaxed">
              Altitude 0 = nível do mar (São Paulo ≈ 760 m). Temperatura e
              umidade externas: bulbo seco de verão do local (NBR 16401 /
              ASHRAE) — usadas só em ambientes ventilados.
            </p>
          </Secao>

          <Secao titulo="Ciclo de Trabalho (hora mais crítica)">
            <p className="text-sm text-hedut-abissal/70 mb-4 leading-relaxed">
              A NR-15 não avalia a jornada inteira: ela pega os 60 minutos
              seguidos mais quentes do dia. Divida essa hora pelos lugares onde
              o trabalhador passa. Ex.: 45 min na máquina e 15 min descansando
              na sala climatizada → Situação 2 = 15 min; a Situação 1 recebe
              sozinha os 45 min que sobram.
            </p>

            <div className="flex h-7 rounded-lg overflow-hidden mb-5 bg-hedut-nevoa">
              {resultado.situacoes.map((s, i) =>
                s.minutos > 0 ? (
                  <div
                    key={s.id}
                    style={{
                      width: `${(s.minutos / totalMinutos) * 100}%`,
                      backgroundColor:
                        CORES_SITUACAO[i % CORES_SITUACAO.length],
                    }}
                    className="flex items-center justify-center text-white font-mono text-[11px] overflow-hidden whitespace-nowrap"
                  >
                    {s.codigo} · {s.minutos} min
                  </div>
                ) : null
              )}
            </div>

            {entrada.situacoes.map((s, i) => (
              <CardSituacao
                key={s.id}
                situacao={s}
                index={i}
                minutos={minutosSituacao(entrada, i)}
                resultado={resultado.situacoes[i]}
                podeRemover={i > 0}
                onChange={(patch) => atualizarSituacao(s.id, patch)}
                onRemover={() => removerSituacao(s.id)}
              />
            ))}

            {entrada.situacoes.length < MAX_SITUACOES && (
              <button
                type="button"
                onClick={adicionarSituacao}
                className="mt-4 font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
              >
                + Adicionar situação
              </button>
            )}
          </Secao>

          <Secao titulo="Superfícies Radiantes">
            <p className="text-sm text-hedut-abissal/70 mb-4 leading-relaxed">
              Escolha o item na lista (coberturas, paredes, pisos e
              equipamentos já vêm com U, cor e temperatura típicos), diga a
              situação e a área que o trabalhador enxerga. Opcional: a radiação
              solar (vazio = valor típico: 900 W/m² cobertura, 300 W/m²
              parede) e a tsi, se você conhecer a temperatura real. Fonte muito
              quente MUITO perto do trabalhador: prefira &quot;Informar
              tr&quot; com valor de simulação.
            </p>
            <div className="space-y-3 mb-4">
              {entrada.superficies.map((sup, i) => (
                <CardSuperficie
                  key={sup.id}
                  superficie={sup}
                  situacoes={entrada.situacoes}
                  calculo={resultado.superficies[i]}
                  onChange={(patch) => atualizarSuperficie(sup.id, patch)}
                  onRemover={() => removerSuperficie(sup.id)}
                />
              ))}
            </div>
            {entrada.superficies.length < MAX_SUPERFICIES && (
              <button
                type="button"
                onClick={adicionarSuperficie}
                className="font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
              >
                + Adicionar superfície
              </button>
            )}
          </Secao>

          <Secao titulo="Memória de Cálculo">
            <div className="max-w-sm mb-4">
              <label className={labelClass()}>Mostrar a situação</label>
              <select
                value={sitMemoria.id}
                onChange={(e) => setSituacaoMemoria(Number(e.target.value))}
                className={inputClass()}
              >
                {resultado.situacoes.map((s, i) => (
                  <option key={s.id} value={s.id}>
                    Situação {i + 1}
                    {s.nome ? ` — ${s.nome}` : ""}
                  </option>
                ))}
              </select>
            </div>
            {sitMemoria.ativa ? (
              <>
                <div>{linhasMemoria()}</div>
                <p className="font-mono text-xs text-hedut-abissal/60 mt-3 leading-relaxed">
                  hr = troca por radiação; hc = troca por convecção (ar). Mais
                  vento → tg mais perto de ta; mais radiação → tg mais perto
                  de tr. tsi das superfícies = ta + (U/hi)·(t sol-ar − ta), com
                  t sol-ar = te + α·I/he.
                </p>
              </>
            ) : (
              <p className="text-sm text-hedut-abissal/60">
                Esta situação ainda está incompleta ou com tempo zero —
                preencha os campos para ver as contas.
              </p>
            )}
            {linhasMemoriaGlobal().length > 0 && (
              <div className="mt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-hedut-abissal/60 mb-1">
                  Hora mais crítica (todas as situações)
                </p>
                {linhasMemoriaGlobal()}
              </div>
            )}
          </Secao>
        </div>

        {/* RESULTADO */}
        <div>
          <div className="sticky top-6">
            <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-6">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-2">
                IBUTG médio da hora
              </p>
              <p className="font-display font-bold text-4xl mb-4">
                {resultado.ibutgMedio !== null
                  ? `${resultado.ibutgMedio.toFixed(1)} °C`
                  : "—"}
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-white/60 text-xs">Limite NR-15</p>
                  <p className="font-medium">
                    {resultado.limite !== null
                      ? `${resultado.limite.toFixed(1)} °C`
                      : resultado.foraDoQuadro
                        ? "fora"
                        : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Nível de ação</p>
                  <p className="font-medium">
                    {resultado.nivelAcao !== null
                      ? `${resultado.nivelAcao.toFixed(1)} °C`
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Folga</p>
                  <p className="font-medium">
                    {resultado.folga !== null
                      ? `${resultado.folga > 0 ? "+" : ""}${resultado.folga.toFixed(1)} °C`
                      : "—"}
                  </p>
                </div>
              </div>
              {resultado.mMedio !== null && (
                <p className="font-mono text-xs text-white/50 mt-3">
                  M média = {resultado.mMedio.toFixed(0)} W · Quadro 1
                </p>
              )}

              <BarraLimites r={resultado} />

              <div
                className={`mt-5 border rounded-xl p-4 text-sm leading-relaxed ${ESTILO_CONCLUSAO[c.nivel]}`}
              >
                <p className="font-semibold">{c.titulo}</p>
                {c.acao && <p className="mt-2 opacity-90">{c.acao}</p>}
              </div>
            </div>

            <div className="bg-white border border-hedut-aco/70 border-t-4 border-t-hedut-blue rounded-2xl shadow-[0_2px_14px_rgba(8,25,44,0.07)] p-6">
              <h3 className="font-display font-bold text-hedut-abissal text-lg mb-4">
                Por situação
              </h3>
              {resultado.situacoes.every((s) => !s.ativa) ? (
                <p className="text-sm text-hedut-abissal/60">
                  Nenhuma situação completa ainda.
                </p>
              ) : (
                resultado.situacoes.map((s, i) =>
                  s.ativa ? (
                    <div key={s.id} className="mb-5 last:mb-0">
                      <p
                        className="font-mono text-xs tracking-[0.15em] uppercase mb-2"
                        style={{
                          color: CORES_SITUACAO[i % CORES_SITUACAO.length],
                        }}
                      >
                        {s.codigo} · {s.minutos} min
                        {s.nome ? ` · ${s.nome}` : ""}
                      </p>
                      {[
                        ["Ar (ta · UR · va)", `${s.ta!.toFixed(1)} °C · ${s.ur!.toFixed(0)} % · ${s.va!.toFixed(2)} m/s`],
                        ["Radiante (tr)", `${s.tr!.toFixed(1)} °C`],
                        ["Bulbo úmido natural (tbn)", `${s.tbn!.toFixed(1)} °C`],
                        ["Globo (tg)", `${s.tg!.toFixed(1)} °C`],
                        ["IBUTG da situação", `${s.ibutg!.toFixed(1)} °C`],
                      ].map(([rotulo, valor]) => (
                        <div
                          key={rotulo}
                          className="flex items-center justify-between py-1.5 border-b border-hedut-aco/15 last:border-0"
                        >
                          <span className="text-hedut-abissal/70 text-sm">
                            {rotulo}
                          </span>
                          <span className="font-medium text-hedut-abissal text-sm">
                            {valor}
                          </span>
                        </div>
                      ))}
                      <p className="font-mono text-[11px] text-hedut-abissal/60 mt-2">
                        {s.solDireto
                          ? `0,7 × ${s.tbn!.toFixed(1)} + 0,2 × ${s.tg!.toFixed(1)} + 0,1 × ${s.ta!.toFixed(1)}`
                          : `0,7 × ${s.tbn!.toFixed(1)} + 0,3 × ${s.tg!.toFixed(1)} = ${(0.7 * s.tbn!).toFixed(1)} + ${(0.3 * s.tg!).toFixed(1)}`}{" "}
                        = {s.ibutg!.toFixed(1)}
                      </p>
                    </div>
                  ) : null
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/60 mt-8 leading-relaxed max-w-3xl">
        Estimativa de projeto do IBUTG (NR-15 Anexo 3): a ferramenta calcula o
        que o termômetro de globo (ISO 7726) e o bulbo úmido natural (balanço
        de calor e massa no pavio, Hilpert/Morgan + Lewis) MARCARIAM, a partir
        do ar e das superfícies em volta do trabalhador — útil antes da obra,
        quando não há o que medir. Limites pelos Quadros 1 e 2 da NR-15
        (Portaria SEPRT 1.359/2019) e nível de ação da NR-9. Não substitui a
        avaliação quantitativa com instrumentos calibrados no local (NHO 06).
        Resultado de referência — valide com as normas do seu projeto antes de
        especificar.
      </p>
    </div>
  );
}
