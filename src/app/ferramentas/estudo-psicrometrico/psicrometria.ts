// Cálculos psicrométricos padrão (ASHRAE Fundamentals).
// Pressão atmosférica padrão ao nível do mar: 101325 Pa.

export const P_ATM = 101325; // Pa

export type EstadoAr = {
  tdb: number; // temperatura de bulbo seco (°C)
  rh: number; // umidade relativa (%)
  twb: number; // temperatura de bulbo úmido (°C)
  tdp: number; // ponto de orvalho (°C)
  w: number; // umidade absoluta (kg água / kg ar seco)
  h: number; // entalpia (kJ/kg ar seco)
  v: number; // volume específico (m³/kg ar seco)
  pv: number; // pressão parcial de vapor (Pa)
};

// Pressão de saturação do vapor d'água (Pa), aproximação de Magnus-Tetens.
export function pressaoSaturacao(tempC: number): number {
  return 611.2 * Math.exp((17.62 * tempC) / (243.12 + tempC));
}

function umidadeRelativaCalor(w: number, tdb: number, p: number): number {
  const pv = (w * p) / (0.622 + w);
  return Math.min(100, Math.max(0, (pv / pressaoSaturacao(tdb)) * 100));
}

function pontoOrvalho(pv: number): number {
  if (pv <= 1) return -60;
  const x = Math.log(pv / 611.2);
  return (243.12 * x) / (17.62 - x);
}

function bulboUmido(tdb: number, w: number, p: number): number {
  let lo = -40;
  let hi = tdb;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const psatMid = pressaoSaturacao(mid);
    const wsatMid = (0.622 * psatMid) / (p - psatMid);
    const wCalc =
      ((2501 - 2.326 * mid) * wsatMid - 1.006 * (tdb - mid)) /
      (2501 + 1.86 * tdb - 4.186 * mid);
    if (wCalc < w) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Calcula todas as propriedades psicrométricas a partir de Tbs e UR.
export function calcularEstado(
  tdb: number,
  rh: number,
  p: number = P_ATM
): EstadoAr {
  const psat = pressaoSaturacao(tdb);
  const pv = (rh / 100) * psat;
  const w = (0.622 * pv) / (p - pv);
  const h = 1.006 * tdb + w * (2501 + 1.86 * tdb);
  const v = (287.055 * (tdb + 273.15) * (1 + 1.6078 * w)) / p;
  const tdp = pontoOrvalho(pv);
  const twb = bulboUmido(tdb, w, p);

  return { tdb, rh, twb, tdp, w, h, v, pv };
}

export type ResultadoMistura = EstadoAr & {
  vazaoTotal: number;
  vazaoMassaSecaTotal: number;
};

// Mistura adiabática de duas correntes de ar (ponderada pela massa de ar seco).
export function misturarAr(
  estado1: EstadoAr,
  vazao1M3h: number,
  estado2: EstadoAr,
  vazao2M3h: number,
  p: number = P_ATM
): ResultadoMistura {
  const mSeco1 = vazao1M3h / estado1.v;
  const mSeco2 = vazao2M3h / estado2.v;
  const mSecoTotal = mSeco1 + mSeco2;

  if (mSecoTotal <= 0) {
    const vazio = calcularEstado(estado1.tdb, estado1.rh, p);
    return { ...vazio, vazaoTotal: 0, vazaoMassaSecaTotal: 0 };
  }

  const wMix = (mSeco1 * estado1.w + mSeco2 * estado2.w) / mSecoTotal;
  const hMix = (mSeco1 * estado1.h + mSeco2 * estado2.h) / mSecoTotal;
  const tdbMix = (hMix - 2501 * wMix) / (1.006 + 1.86 * wMix);
  const rhMix = umidadeRelativaCalor(wMix, tdbMix, p);

  const estadoMix = calcularEstado(tdbMix, rhMix, p);

  return {
    ...estadoMix,
    vazaoTotal: vazao1M3h + vazao2M3h,
    vazaoMassaSecaTotal: mSecoTotal,
  };
}
