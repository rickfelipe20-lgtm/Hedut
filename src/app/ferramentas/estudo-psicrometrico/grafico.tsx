"use client";

import { useMemo } from "react";
import { calcularEstado, type EstadoAr } from "./psicrometria";

const TDB_MIN = 0;
const TDB_MAX = 45;
const W_MAX_GKG = 30;

const MARGIN = { left: 55, right: 20, top: 20, bottom: 45 };
const CHART_W = 640;
const CHART_H = 420;
const PLOT_W = CHART_W - MARGIN.left - MARGIN.right;
const PLOT_H = CHART_H - MARGIN.top - MARGIN.bottom;

function escalaX(tdb: number) {
  return MARGIN.left + ((tdb - TDB_MIN) / (TDB_MAX - TDB_MIN)) * PLOT_W;
}

function escalaY(wGkg: number) {
  return (
    MARGIN.top + (1 - Math.min(wGkg, W_MAX_GKG) / W_MAX_GKG) * PLOT_H
  );
}

function curvaRH(rh: number) {
  const pontos: string[] = [];
  for (let tdb = TDB_MIN; tdb <= TDB_MAX; tdb += 1) {
    const estado = calcularEstado(tdb, rh);
    const wGkg = estado.w * 1000;
    if (wGkg > W_MAX_GKG) break;
    pontos.push(`${escalaX(tdb)},${escalaY(wGkg)}`);
  }
  return pontos.join(" ");
}

type Props = {
  ar1: EstadoAr;
  ar2: EstadoAr;
  mistura: EstadoAr;
};

export function CartaPsicrometrica({ ar1, ar2, mistura }: Props) {
  const curvasRH = useMemo(
    () => [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rh) => ({
      rh,
      pontos: curvaRH(rh),
    })),
    []
  );

  const eixosX = useMemo(() => {
    const valores = [];
    for (let t = 0; t <= 45; t += 5) valores.push(t);
    return valores;
  }, []);

  const eixosY = useMemo(() => {
    const valores = [];
    for (let w = 0; w <= 30; w += 5) valores.push(w);
    return valores;
  }, []);

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
