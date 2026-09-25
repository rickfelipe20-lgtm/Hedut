"use client";

import { useMemo, useRef, useState } from "react";
import {
  ORIENTACOES,
  TIPOS_PAREDE,
  TIPOS_VIDRO,
  TIPOS_COBERTURA,
  CORES_COBERTURA,
  NIVEIS_ATIVIDADE,
  calcularCargaTermica,
  fachadaPadrao,
  type Orientacao,
  type DadosParede,
  type EntradaCargaTermica,
} from "./cargatermica";

function inputClass() {
  return "w-full border border-hedut-aco/40 px-3 py-2 text-sm focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-xs text-hedut-abissal/60 mb-1";
}

function Secao({
  titulo,
  children,
  padraoAberta = true,
}: {
  titulo: string;
  children: React.ReactNode;
  padraoAberta?: boolean;
}) {
  const [aberta, setAberta] = useState(padraoAberta);
  return (
    <div className="border border-hedut-aco/25 rounded-2xl p-6 mb-6">
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
          <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {aberta && <div className="mt-5">{children}</div>}
    </div>
  );
}

function CardFachada({
  dados,
  onChange,
  onRemover,
  podeRemover,
}: {
  dados: DadosParede;
  onChange: (patch: Partial<DadosParede>) => void;
  onRemover: () => void;
  podeRemover: boolean;
}) {
  return (
    <div className="border border-hedut-aco/20 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <select
          value={dados.orientacao}
          onChange={(e) =>
            onChange({ orientacao: e.target.value as Orientacao })
          }
          className="font-mono text-xs tracking-[0.12em] uppercase text-hedut-blue border border-hedut-aco/30 px-2 py-1 bg-transparent focus:outline-none focus:border-hedut-blue"
        >
          {ORIENTACOES.map((o) => (
            <option key={o.chave} value={o.chave}>
              {o.nome}
            </option>
          ))}
        </select>
        {podeRemover && (
          <button
            type="button"
            onClick={onRemover}
            aria-label="Remover fachada"
            className="text-hedut-abissal/40 hover:text-red-600 transition text-lg leading-none px-1"
          >
            ×
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className={labelClass()}>Área de parede (m²)</label>
          <input
            type="number"
            min={0}
            value={dados.area}
            onChange={(e) => onChange({ area: Number(e.target.value) })}
            className={inputClass()}
          />
        </div>
        <div>
          <label className={labelClass()}>Área de vidro (m²)</label>
          <input
            type="number"
            min={0}
            value={dados.areaVidro}
            onChange={(e) => onChange({ areaVidro: Number(e.target.value) })}
            className={inputClass()}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className={labelClass()}>Tipo de parede</label>
          <select
            value={dados.tipoParedeIndex}
            onChange={(e) =>
              onChange({ tipoParedeIndex: Number(e.target.value) })
            }
            className={inputClass()}
          >
            {TIPOS_PAREDE.map((t, i) => (
              <option key={t.nome} value={i}>
                {t.nome} (U={t.u})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass()}>Tipo de vidro</label>
          <select
            value={dados.tipoVidroIndex}
            onChange={(e) =>
              onChange({ tipoVidroIndex: Number(e.target.value) })
            }
            className={inputClass()}
          >
            {TIPOS_VIDRO.map((t, i) => (
              <option key={t.nome} value={i}>
                {t.nome} (FS={t.fs})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function linhaResultado(label: string, valorW: number) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-hedut-aco/15 last:border-0">
      <span className="text-hedut-abissal/70 text-sm">{label}</span>
      <span className="font-medium text-hedut-abissal text-sm">
        {valorW.toFixed(0)} W
      </span>
    </div>
  );
}

export function Calculadora() {
  const [areaPiso, setAreaPiso] = useState(50);
  const [peDireito, setPeDireito] = useState(2.8);
  const [tempExterna, setTempExterna] = useState(35);
  const [tempInterna, setTempInterna] = useState(24);
  const [urExterna, setUrExterna] = useState(60);
  const [urInterna, setUrInterna] = useState(50);

  const [paredes, setParedes] = useState<DadosParede[]>([fachadaPadrao(1)]);
  const proximoIdParede = useRef(2);

  const [areaCobertura, setAreaCobertura] = useState(0);
  const [tipoCoberturaIndex, setTipoCoberturaIndex] = useState(0);
  const [corCoberturaIndex, setCorCoberturaIndex] = useState(0);
  const [coberturaExposta, setCoberturaExposta] = useState(false);

  const [numPessoas, setNumPessoas] = useState(10);
  const [atividadeIndex, setAtividadeIndex] = useState(1);
  const [potenciaIluminacao, setPotenciaIluminacao] = useState(1000);
  const [potenciaEquipamentos, setPotenciaEquipamentos] = useState(2000);

  const [vazaoRenovacao, setVazaoRenovacao] = useState(300);
  const [fatorSeguranca, setFatorSeguranca] = useState(10);

  function atualizarFachada(id: number, patch: Partial<DadosParede>) {
    setParedes((atual) =>
      atual.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  }

  function adicionarFachada() {
    const nova = fachadaPadrao(proximoIdParede.current);
    proximoIdParede.current += 1;
    setParedes((atual) => [...atual, nova]);
  }

  function removerFachada(id: number) {
    setParedes((atual) =>
      atual.length > 1 ? atual.filter((p) => p.id !== id) : atual
    );
  }

  const entrada: EntradaCargaTermica = useMemo(
    () => ({
      areaPiso,
      peDireito,
      tempExterna,
      tempInterna,
      urExterna,
      urInterna,
      paredes,
      areaCobertura,
      tipoCoberturaIndex,
      corCoberturaIndex,
      coberturaExposta,
      numPessoas,
      atividadeIndex,
      potenciaIluminacao,
      potenciaEquipamentos,
      vazaoRenovacao,
      fatorSeguranca,
    }),
    [
      areaPiso,
      peDireito,
      tempExterna,
      tempInterna,
      urExterna,
      urInterna,
      paredes,
      areaCobertura,
      tipoCoberturaIndex,
      corCoberturaIndex,
      coberturaExposta,
      numPessoas,
      atividadeIndex,
      potenciaIluminacao,
      potenciaEquipamentos,
      vazaoRenovacao,
      fatorSeguranca,
    ]
  );

  const resultado = useMemo(() => calcularCargaTermica(entrada), [entrada]);

  return (
    <div className="mb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORMULÁRIO */}
        <div className="lg:col-span-2">
          <Secao titulo="Dados Gerais do Ambiente">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass()}>Área do piso (m²)</label>
                <input
                  type="number"
                  min={0}
                  value={areaPiso}
                  onChange={(e) => setAreaPiso(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Pé-direito (m)</label>
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={peDireito}
                  onChange={(e) => setPeDireito(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>
                  Temp. externa de projeto (°C)
                </label>
                <input
                  type="number"
                  value={tempExterna}
                  onChange={(e) => setTempExterna(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>
                  Temp. interna desejada (°C)
                </label>
                <input
                  type="number"
                  value={tempInterna}
                  onChange={(e) => setTempInterna(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>UR externa (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={urExterna}
                  onChange={(e) => setUrExterna(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>UR interna desejada (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={urInterna}
                  onChange={(e) => setUrInterna(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
            </div>
          </Secao>

          <Secao titulo="Paredes e Vidros por Orientação">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {paredes.map((p) => (
                <CardFachada
                  key={p.id}
                  dados={p}
                  onChange={(patch) => atualizarFachada(p.id, patch)}
                  onRemover={() => removerFachada(p.id)}
                  podeRemover={paredes.length > 1}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={adicionarFachada}
              className="font-mono text-xs uppercase tracking-wide text-hedut-blue border border-hedut-blue/40 px-4 py-2 rounded-full hover:bg-hedut-blue hover:text-white transition"
            >
              + Adicionar fachada
            </button>
          </Secao>

          <Secao titulo="Cobertura">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass()}>Área de cobertura (m²)</label>
                <input
                  type="number"
                  min={0}
                  value={areaCobertura}
                  onChange={(e) => setAreaCobertura(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 font-mono text-xs text-hedut-abissal/70">
                  <input
                    type="checkbox"
                    checked={coberturaExposta}
                    onChange={(e) => setCoberturaExposta(e.target.checked)}
                  />
                  Exposta diretamente ao sol (último pavimento)
                </label>
              </div>
              <div>
                <label className={labelClass()}>Tipo de cobertura</label>
                <select
                  value={tipoCoberturaIndex}
                  onChange={(e) =>
                    setTipoCoberturaIndex(Number(e.target.value))
                  }
                  className={inputClass()}
                >
                  {TIPOS_COBERTURA.map((t, i) => (
                    <option key={t.nome} value={i}>
                      {t.nome} (U={t.u})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass()}>Cor da cobertura</label>
                <select
                  value={corCoberturaIndex}
                  onChange={(e) =>
                    setCorCoberturaIndex(Number(e.target.value))
                  }
                  className={inputClass()}
                  disabled={!coberturaExposta}
                >
                  {CORES_COBERTURA.map((c, i) => (
                    <option key={c.nome} value={i}>
                      {c.nome} (+{c.deltaTAdicional}°C)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Secao>

          <Secao titulo="Ganhos Internos">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass()}>Número de pessoas</label>
                <input
                  type="number"
                  min={0}
                  value={numPessoas}
                  onChange={(e) => setNumPessoas(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className={labelClass()}>Nível de atividade</label>
                <select
                  value={atividadeIndex}
                  onChange={(e) => setAtividadeIndex(Number(e.target.value))}
                  className={inputClass()}
                >
                  {NIVEIS_ATIVIDADE.map((a, i) => (
                    <option key={a.nome} value={i}>
                      {a.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass()}>Iluminação (W)</label>
                <input
                  type="number"
                  min={0}
                  value={potenciaIluminacao}
                  onChange={(e) =>
                    setPotenciaIluminacao(Number(e.target.value))
                  }
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Equipamentos (W)</label>
                <input
                  type="number"
                  min={0}
                  value={potenciaEquipamentos}
                  onChange={(e) =>
                    setPotenciaEquipamentos(Number(e.target.value))
                  }
                  className={inputClass()}
                />
              </div>
            </div>
          </Secao>

          <Secao titulo="Ventilação e Fator de Segurança">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass()}>
                  Vazão de ar de renovação (m³/h)
                </label>
                <input
                  type="number"
                  min={0}
                  value={vazaoRenovacao}
                  onChange={(e) => setVazaoRenovacao(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass()}>Fator de segurança (%)</label>
                <input
                  type="number"
                  min={0}
                  value={fatorSeguranca}
                  onChange={(e) => setFatorSeguranca(Number(e.target.value))}
                  className={inputClass()}
                />
              </div>
            </div>
          </Secao>
        </div>

        {/* RESULTADO */}
        <div>
          <div className="sticky top-6">
            <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-6">
              <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-2">
                Carga Térmica Total
              </p>
              <p className="font-display font-bold text-4xl mb-4">
                {resultado.total.toFixed(0)} W
              </p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-white/60 text-xs">BTU/h</p>
                  <p className="font-medium">
                    {resultado.totalBtuH.toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">TR</p>
                  <p className="font-medium">{resultado.totalTR.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">kcal/h</p>
                  <p className="font-medium">
                    {resultado.totalKcalH.toLocaleString("pt-BR", {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mt-4 pt-4 border-t border-white/20">
                <div>
                  <p className="text-white/60 text-xs">Sensível</p>
                  <p className="font-medium">{resultado.sensivel.toFixed(0)} W</p>
                </div>
                <div>
                  <p className="text-white/60 text-xs">Latente</p>
                  <p className="font-medium">{resultado.latente.toFixed(0)} W</p>
                </div>
              </div>
              <p className="font-mono text-xs text-white/50 mt-3">
                Fator de calor sensível (FCS):{" "}
                {resultado.fatorCalorSensivel.toFixed(2)}
              </p>
            </div>

            <div className="bg-hedut-nevoa border border-hedut-aco/25 rounded-2xl p-6">
              <h3 className="font-display font-bold text-hedut-abissal text-lg mb-4">
                Detalhamento
              </h3>
              {linhaResultado("Paredes (condução)", resultado.detalhamento.paredes)}
              {linhaResultado(
                "Vidros (condução)",
                resultado.detalhamento.vidrosConducao
              )}
              {linhaResultado(
                "Vidros (ganho solar)",
                resultado.detalhamento.vidrosSolar
              )}
              {linhaResultado("Cobertura", resultado.detalhamento.cobertura)}
              {linhaResultado(
                "Pessoas (sensível)",
                resultado.detalhamento.pessoasSensivel
              )}
              {linhaResultado(
                "Pessoas (latente)",
                resultado.detalhamento.pessoasLatente
              )}
              {linhaResultado("Iluminação", resultado.detalhamento.iluminacao)}
              {linhaResultado(
                "Equipamentos",
                resultado.detalhamento.equipamentos
              )}
              {linhaResultado(
                "Ventilação (sensível)",
                resultado.detalhamento.ventilacaoSensivel
              )}
              {linhaResultado(
                "Ventilação (latente)",
                resultado.detalhamento.ventilacaoLatente
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/50 mt-8 leading-relaxed max-w-3xl">
        Cálculo pelo método simplificado (condução por U×A×ΔT, ganho solar em
        vidros por orientação com valores médios de referência para clima
        tropical/subtropical, ganhos internos por tabela ASHRAE de ocupação e
        ventilação calculada via propriedades psicrométricas reais). Não
        substitui o método detalhado CLTD/RTS da ASHRAE para projetos que
        exigam essa precisão. Resultado de referência — valide com as normas
        do seu projeto antes de especificar.
      </p>
    </div>
  );
}
