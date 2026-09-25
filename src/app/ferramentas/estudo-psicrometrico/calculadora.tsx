"use client";

import { useMemo, useState } from "react";
import { calcularEstado, misturarAr, type EstadoAr } from "./psicrometria";
import { CartaPsicrometrica } from "./grafico";
import { gerarMemorialPsicrometricoPDF } from "./gerar-pdf";

function inputClass() {
  return "w-full border border-hedut-aco/40 px-4 py-2.5 focus:outline-none focus:border-hedut-blue";
}

function labelClass() {
  return "block font-mono text-sm text-hedut-abissal/70 mb-2";
}

function CardEntradaAr({
  titulo,
  cor,
  tdb,
  rh,
  vazao,
  onTdbChange,
  onRhChange,
  onVazaoChange,
}: {
  titulo: string;
  cor: string;
  tdb: number;
  rh: number;
  vazao: number;
  onTdbChange: (v: number) => void;
  onRhChange: (v: number) => void;
  onVazaoChange: (v: number) => void;
}) {
  return (
    <div className="border border-hedut-aco/25 rounded-2xl p-6">
      <h3
        className="font-display font-bold text-xl mb-5"
        style={{ color: cor }}
      >
        {titulo}
      </h3>

      <div className="space-y-4">
        <div>
          <label className={labelClass()}>
            Temperatura de bulbo seco (°C)
          </label>
          <input
            type="number"
            value={tdb}
            onChange={(e) => onTdbChange(Number(e.target.value))}
            className={inputClass()}
          />
        </div>

        <div>
          <label className={labelClass()}>Umidade relativa (%)</label>
          <input
            type="number"
            min={1}
            max={100}
            value={rh}
            onChange={(e) => onRhChange(Number(e.target.value))}
            className={inputClass()}
          />
        </div>

        <div>
          <label className={labelClass()}>Vazão de ar (m³/h)</label>
          <input
            type="number"
            min={0}
            value={vazao}
            onChange={(e) => onVazaoChange(Number(e.target.value))}
            className={inputClass()}
          />
        </div>
      </div>
    </div>
  );
}

function linhaDado(label: string, valor: string) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-hedut-aco/15 last:border-0">
      <span className="text-hedut-abissal/60 text-sm">{label}</span>
      <span className="font-medium text-hedut-abissal text-sm">{valor}</span>
    </div>
  );
}

function PainelEstado({
  titulo,
  cor,
  estado,
  vazao,
}: {
  titulo: string;
  cor: string;
  estado: EstadoAr;
  vazao: number;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <p
        className="font-mono text-xs tracking-[0.15em] uppercase mb-2"
        style={{ color: cor }}
      >
        {titulo}
      </p>
      {linhaDado("Bulbo seco", `${estado.tdb.toFixed(1)} °C`)}
      {linhaDado("Bulbo úmido", `${estado.twb.toFixed(1)} °C`)}
      {linhaDado("Ponto de orvalho", `${estado.tdp.toFixed(1)} °C`)}
      {linhaDado("Umidade relativa", `${estado.rh.toFixed(0)} %`)}
      {linhaDado("Umidade absoluta", `${(estado.w * 1000).toFixed(2)} g/kg`)}
      {linhaDado("Entalpia", `${estado.h.toFixed(1)} kJ/kg`)}
      {linhaDado("Volume específico", `${estado.v.toFixed(3)} m³/kg`)}
      {linhaDado("Vazão de ar", `${vazao.toFixed(0)} m³/h`)}
    </div>
  );
}

export function Calculadora() {
  const [tdb1, setTdb1] = useState(24);
  const [rh1, setRh1] = useState(50);
  const [vazao1, setVazao1] = useState(1000);

  const [tdb2, setTdb2] = useState(32);
  const [rh2, setRh2] = useState(70);
  const [vazao2, setVazao2] = useState(500);

  const ar1 = useMemo(() => calcularEstado(tdb1, rh1), [tdb1, rh1]);
  const ar2 = useMemo(() => calcularEstado(tdb2, rh2), [tdb2, rh2]);
  const mistura = useMemo(
    () => misturarAr(ar1, vazao1, ar2, vazao2),
    [ar1, vazao1, ar2, vazao2]
  );

  function handleBaixarPDF() {
    gerarMemorialPsicrometricoPDF(ar1, vazao1, ar2, vazao2, mistura);
  }

  return (
    <div className="mb-32">
      {/* AR 1 e AR 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CardEntradaAr
          titulo="Ar 1"
          cor="#0B4A80"
          tdb={tdb1}
          rh={rh1}
          vazao={vazao1}
          onTdbChange={setTdb1}
          onRhChange={setRh1}
          onVazaoChange={setVazao1}
        />
        <CardEntradaAr
          titulo="Ar 2"
          cor="#C2410C"
          tdb={tdb2}
          rh={rh2}
          vazao={vazao2}
          onTdbChange={setTdb2}
          onRhChange={setRh2}
          onVazaoChange={setVazao2}
        />
      </div>

      {/* RESULTADO DA MISTURA */}
      <div className="bg-hedut-abissal text-white rounded-2xl p-8 mb-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <p className="font-mono text-xs tracking-[0.15em] uppercase text-white/60">
            Ar Misturado — Resultado ({mistura.vazaoTotal.toFixed(0)} m³/h)
          </p>
          <button
            type="button"
            onClick={handleBaixarPDF}
            className="whitespace-nowrap bg-white text-hedut-abissal font-bold py-2.5 px-6 text-sm hover:bg-hedut-nevoa transition"
          >
            Baixar PDF
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-white/60 text-xs mb-1">Bulbo seco</p>
            <p className="font-display font-bold text-2xl">
              {mistura.tdb.toFixed(1)} °C
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Umidade relativa</p>
            <p className="font-display font-bold text-2xl">
              {mistura.rh.toFixed(0)} %
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Umidade absoluta</p>
            <p className="font-display font-bold text-2xl">
              {(mistura.w * 1000).toFixed(2)} g/kg
            </p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Entalpia</p>
            <p className="font-display font-bold text-2xl">
              {mistura.h.toFixed(1)} kJ/kg
            </p>
          </div>
        </div>
      </div>

      {/* CARTA + PAINEL LATERAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border border-hedut-aco/25 rounded-2xl p-6">
          <h3 className="font-display font-bold text-hedut-abissal text-xl mb-4">
            Carta Psicrométrica
          </h3>
          <CartaPsicrometrica ar1={ar1} ar2={ar2} mistura={mistura} />
          <p className="font-mono text-xs text-hedut-abissal/50 mt-4 leading-relaxed">
            Carta simplificada (eixos ortogonais), com curvas de umidade
            relativa de 10% a 100%, linhas de bulbo úmido e de entalpia
            constantes (ver legenda no canto do gráfico). A escala se ajusta
            automaticamente aos pontos plotados. A linha tracejada liga Ar 1
            e Ar 2; o ponto da mistura se aproxima dessa reta conforme as
            vazões se equilibram.
          </p>
        </div>

        <div className="bg-hedut-nevoa border border-hedut-aco/25 rounded-2xl p-6">
          <h3 className="font-display font-bold text-hedut-abissal text-xl mb-5">
            Dados Psicrométricos
          </h3>
          <PainelEstado titulo="Ar 1" cor="#0B4A80" estado={ar1} vazao={vazao1} />
          <PainelEstado titulo="Ar 2" cor="#C2410C" estado={ar2} vazao={vazao2} />
          <PainelEstado
            titulo="Mistura"
            cor="#15803D"
            estado={mistura}
            vazao={mistura.vazaoTotal}
          />
        </div>
      </div>

      <p className="font-mono text-xs text-hedut-abissal/50 mt-8 leading-relaxed max-w-3xl">
        Cálculo baseado nas correlações psicrométricas da ASHRAE Fundamentals
        (aproximação de Magnus-Tetens para pressão de saturação). Pressão
        atmosférica padrão ao nível do mar (101.325 Pa). Mistura adiabática
        ponderada pela vazão mássica de ar seco. Resultado de referência —
        valide com as normas do seu projeto antes de especificar.
      </p>
    </div>
  );
}
