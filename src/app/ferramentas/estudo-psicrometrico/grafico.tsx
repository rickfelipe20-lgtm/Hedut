"use client";

import { useMemo } from "react";
import {
  calcularEstado,
  umidadeParaBulboUmido,
  umidadeParaEntalpia,
  P_ATM,
  type EstadoAr,
} from "./psicrometria";

const MARGIN = { left: 58, right: 20, top: 20, bottom: 50 };
const CHART_W = 640;
const CHART_H = 420;
const PLOT_W = CHART_W - MARGIN.left - MARGIN.right;
const PLOT_H = CHART_H - MARGIN.top - MARGIN.bottom;

// Escolhe um passo "redondo" (1, 2, 2.5, 5, 10 × potência de 10) para um
// número alvo de marcações no eixo.
function passoAgradavel(intervalo: number, alvoTicks: number): number {
  if (intervalo <= 0) return 1;
  const passoBruto = intervalo / alvoTicks;
  const potencia = Math.pow(10, Math.floor(Math.log10(passoBruto)));
  const candidatos = [1, 2, 2.5, 5, 10];
  for (const c of candidatos) {
    const passo = c * potencia;
    if (passo >= passoBruto) return passo;
  }
  return 10 * potencia;
}

function gerarTicks(min: number, max: number, alvoTicks: number): number[] {
  const passo = passoAgradavel(max - min, alvoTicks);
  const inicio = Math.ceil(min / passo) * passo;
  const ticks: number[] = [];
  for (let v = inicio; v <= max + 1e-6; v += passo) {
    ticks.push(Math.round(v * 100) / 100);
  }
  return ticks;
}

type Props = {
  ar1: EstadoAr;
  ar2: EstadoAr;
  mistura: EstadoAr;
};

export function CartaPsicrometrica({ ar1, ar2, mistura }: Props) {
  // Domínio ajustado automaticamente aos três pontos plotados, com
  // margem e arredondado a passos "redondos" — evita tanto um gráfico
  // fixo grande demais quanto um recorte apertado demais nos pontos.
  const { tdbMin, tdbMax, wMax } = useMemo(() => {
    const tdbs = [ar1.tdb, ar2.tdb, mistura.tdb];
    const wsGkg = [ar1.w, ar2.w, mistura.w].map((w) => w * 1000);

    let min = Math.floor((Math.min(...tdbs) - 8) / 5) * 5;
    let max = Math.ceil((Math.max(...tdbs) + 8) / 5) * 5;
    if (max - min < 20) {
      const meio = (max + min) / 2;
      min = Math.floor((meio - 10) / 5) * 5;
      max = Math.ceil((meio + 10) / 5) * 5;
    }
    min = Math.max(-10, min);
    max = Math.min(60, max);

    let w = Math.ceil((Math.max(...wsGkg, 5) + 6) / 5) * 5;
    w = Math.max(10, Math.min(40, w));

    return { tdbMin: min, tdbMax: max, wMax: w };
  }, [ar1, ar2, mistura]);

  function escalaX(tdb: number) {
    return MARGIN.left + ((tdb - tdbMin) / (tdbMax - tdbMin)) * PLOT_W;
  }
  function escalaY(wGkg: number) {
    return MARGIN.top + (1 - Math.min(wGkg, wMax) / wMax) * PLOT_H;
  }

  const curvasRH = useMemo(() => {
    const passo = (tdbMax - tdbMin) / 120;
    return [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rh) => {
      const pontos: string[] = [];
      for (let tdb = tdbMin; tdb <= tdbMax; tdb += passo) {
        const wGkg = calcularEstado(tdb, rh).w * 1000;
        if (wGkg > wMax) break;
        pontos.push(`${escalaX(tdb)},${escalaY(wGkg)}`);
      }
      return { rh, pontos: pontos.join(" ") };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tdbMin, tdbMax, wMax]);

  // Linhas de temperatura de bulbo úmido constante.
  const linhasTwb = useMemo(() => {
    const valores = gerarTicks(Math.max(0, tdbMin), tdbMax, 6);
    const passo = (tdbMax - tdbMin) / 60;
    return valores
      .map((twb) => {
        const pontos: string[] = [];
        for (let tdb = twb; tdb <= tdbMax; tdb += passo) {
          const w = umidadeParaBulboUmido(tdb, twb, P_ATM) * 1000;
          if (w < -0.5) break;
          if (w >= 0 && w <= wMax) pontos.push(`${escalaX(tdb)},${escalaY(w)}`);
        }
        return { valor: twb, pontos: pontos.join(" ") };
      })
      .filter((l) => l.pontos.split(" ").length > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tdbMin, tdbMax, wMax]);

  // Linhas de entalpia constante.
  const linhasEntalpia = useMemo(() => {
    const hMin = 1.006 * tdbMin;
    const hMax = 1.006 * tdbMax + (wMax / 1000) * (2501 + 1.86 * tdbMax);
    const valores = gerarTicks(hMin, hMax, 5);
    const passo = (tdbMax - tdbMin) / 60;
    return valores
      .map((h) => {
        const pontos: string[] = [];
        for (let tdb = tdbMin; tdb <= tdbMax; tdb += passo) {
          const w = umidadeParaEntalpia(tdb, h) * 1000;
          if (w >= 0 && w <= wMax) pontos.push(`${escalaX(tdb)},${escalaY(w)}`);
        }
        return { valor: h, pontos: pontos.join(" ") };
      })
      .filter((l) => l.pontos.split(" ").length > 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tdbMin, tdbMax, wMax]);

  const eixosX = useMemo(() => gerarTicks(tdbMin, tdbMax, 8), [tdbMin, tdbMax]);
  const eixosY = useMemo(() => gerarTicks(0, wMax, 6), [wMax]);

  const p1 = { x: escalaX(ar1.tdb), y: escalaY(ar1.w * 1000) };
  const p2 = { x: escalaX(ar2.tdb), y: escalaY(ar2.w * 1000) };
  const pMix = { x: escalaX(mistura.tdb), y: escalaY(mistura.w * 1000) };

  return (
    <svg
      viewBox={`0 0 ${CHART_W} ${CHART_H}`}
      className="w-full h-auto"
      role="img"
      aria-label="Carta psicrométrica com os pontos de Ar 1, Ar 2 e da mistura"
    >
      {/* Fundo da área de plotagem */}
      <rect
        x={MARGIN.left}
        y={MARGIN.top}
        width={PLOT_W}
        height={PLOT_H}
        fill="#EDF1F5"
      />

      {/* Grade */}
      {eixosX.map((t) => (
        <line
          key={`gx-${t}`}
          x1={escalaX(t)}
          y1={MARGIN.top}
          x2={escalaX(t)}
          y2={MARGIN.top + PLOT_H}
          stroke="#8D99A8"
          strokeOpacity={0.2}
        />
      ))}
      {eixosY.map((w) => (
        <line
          key={`gy-${w}`}
          x1={MARGIN.left}
          y1={escalaY(w)}
          x2={MARGIN.left + PLOT_W}
          y2={escalaY(w)}
          stroke="#8D99A8"
          strokeOpacity={0.2}
        />
      ))}

      {/* Linhas de entalpia constante */}
      {linhasEntalpia.map(({ valor, pontos }) => (
        <polyline
          key={`h-${valor}`}
          points={pontos}
          fill="none"
          stroke="#0F766E"
          strokeOpacity={0.45}
          strokeDasharray="1 3"
          strokeWidth={1.1}
        />
      ))}

      {/* Linhas de bulbo úmido constante */}
      {linhasTwb.map(({ valor, pontos }) => (
        <polyline
          key={`twb-${valor}`}
          points={pontos}
          fill="none"
          stroke="#7C3AED"
          strokeOpacity={0.45}
          strokeDasharray="3 3"
          strokeWidth={1.1}
        />
      ))}

      {/* Curvas de umidade relativa */}
      {curvasRH.map(({ rh, pontos }) => (
        <g key={rh}>
          <polyline
            points={pontos}
            fill="none"
            stroke={rh === 100 ? "#0B4A80" : "#8D99A8"}
            strokeWidth={rh === 100 ? 1.75 : 1}
          />
        </g>
      ))}

      {/* Eixos */}
      <line
        x1={MARGIN.left}
        y1={MARGIN.top + PLOT_H}
        x2={MARGIN.left + PLOT_W}
        y2={MARGIN.top + PLOT_H}
        stroke="#08192C"
      />
      <line
        x1={MARGIN.left}
        y1={MARGIN.top}
        x2={MARGIN.left}
        y2={MARGIN.top + PLOT_H}
        stroke="#08192C"
      />

      {eixosX.map((t) => (
        <text
          key={`lx-${t}`}
          x={escalaX(t)}
          y={MARGIN.top + PLOT_H + 18}
          fontSize={11}
          textAnchor="middle"
          fill="#08192C"
        >
          {t}
        </text>
      ))}
      <text
        x={MARGIN.left + PLOT_W / 2}
        y={CHART_H - 6}
        fontSize={12}
        textAnchor="middle"
        fill="#08192C"
        fontWeight={600}
      >
        Temperatura de bulbo seco (°C)
      </text>

      {eixosY.map((w) => (
        <text
          key={`ly-${w}`}
          x={MARGIN.left - 8}
          y={escalaY(w) + 4}
          fontSize={11}
          textAnchor="end"
          fill="#08192C"
        >
          {w}
        </text>
      ))}
      <text
        x={14}
        y={MARGIN.top + PLOT_H / 2}
        fontSize={12}
        textAnchor="middle"
        fill="#08192C"
        fontWeight={600}
        transform={`rotate(-90, 14, ${MARGIN.top + PLOT_H / 2})`}
      >
        Umidade absoluta (g/kg)
      </text>

      {/* Legenda das linhas de referência */}
      <g transform={`translate(${MARGIN.left + PLOT_W - 168}, ${MARGIN.top + 10})`}>
        <rect x={-8} y={-12} width={176} height={58} fill="white" fillOpacity={0.82} rx={6} />
        <line x1={0} y1={0} x2={20} y2={0} stroke="#0B4A80" strokeWidth={1.75} />
        <text x={26} y={3} fontSize={10} fill="#08192C">
          UR 100% (saturação)
        </text>
        <line x1={0} y1={16} x2={20} y2={16} stroke="#7C3AED" strokeOpacity={0.7} strokeDasharray="3 3" strokeWidth={1.3} />
        <text x={26} y={19} fontSize={10} fill="#08192C">
          Bulbo úmido constante
        </text>
        <line x1={0} y1={32} x2={20} y2={32} stroke="#0F766E" strokeOpacity={0.7} strokeDasharray="1 3" strokeWidth={1.3} />
        <text x={26} y={35} fontSize={10} fill="#08192C">
          Entalpia constante
        </text>
      </g>

      {/* Linha de mistura entre Ar 1 e Ar 2 */}
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="#8D99A8"
        strokeDasharray="4 3"
      />

      {/* Pontos */}
      <circle cx={p1.x} cy={p1.y} r={6} fill="#0B4A80" stroke="white" strokeWidth={2} />
      <text x={p1.x + 10} y={p1.y - 8} fontSize={12} fontWeight={700} fill="#0B4A80">
        Ar 1
      </text>

      <circle cx={p2.x} cy={p2.y} r={6} fill="#C2410C" stroke="white" strokeWidth={2} />
      <text x={p2.x + 10} y={p2.y - 8} fontSize={12} fontWeight={700} fill="#C2410C">
        Ar 2
      </text>

      <circle cx={pMix.x} cy={pMix.y} r={6} fill="#15803D" stroke="white" strokeWidth={2} />
      <text x={pMix.x + 10} y={pMix.y - 8} fontSize={12} fontWeight={700} fill="#15803D">
        Mistura
      </text>
    </svg>
  );
}
