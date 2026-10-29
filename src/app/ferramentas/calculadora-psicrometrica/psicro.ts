// Calculadora psicrométrica: a partir de QUALQUER par de parâmetros
// (T, UR, TDP, W, h, Tw, v) calcula o estado completo do ar úmido.
// Equações do ASHRAE Handbook — Fundamentals, cap. 1 (Hyland-Wexler para a
// pressão de saturação). Internamente tudo em SI; a conversão para IP fica
// na interface.

import { pressaoSaturacao } from "@/app/ferramentas/ponto-de-orvalho/orvalho";

export type Chave = "T" | "rH" | "TDP" | "W" | "h" | "Tw" | "v";
export const CHAVES: Chave[] = ["T", "rH", "TDP", "W", "h", "Tw", "v"];

// SI: °C, %, °C, kg/kg, kJ/kg, °C, m³/kg
export type Estado = Record<Chave, number>;

export type Sistema = "SI" | "IP";

export const T_MIN = -50;
export const T_MAX = 90;
export const P_MIN_PA = 30000;
export const P_MAX_PA = 120000;

export const NOMES: Record<Chave, { nome: string; sigla: string }> = {
  T: { nome: "Bulbo seco", sigla: "T" },
  rH: { nome: "Umidade relativa", sigla: "UR" },
  TDP: { nome: "Ponto de orvalho", sigla: "TDP" },
  W: { nome: "Umidade absoluta", sigla: "W" },
  h: { nome: "Entalpia", sigla: "h" },
  Tw: { nome: "Bulbo úmido", sigla: "Tw" },
  v: { nome: "Volume específico", sigla: "v" },
};

export const UNIDADES: Record<Sistema, Record<Chave, string>> = {
  SI: { T: "°C", rH: "%", TDP: "°C", W: "kg/kg", h: "kJ/kg", Tw: "°C", v: "m³/kg" },
  IP: { T: "°F", rH: "%", TDP: "°F", W: "lb/lb", h: "Btu/lb", Tw: "°F", v: "ft³/lb" },
};

export const CASAS: Record<Chave, number> = {
  T: 2,
  rH: 1,
  TDP: 2,
  W: 5,
  h: 1,
  Tw: 2,
  v: 4,
};

// ---------- Conversões SI <-> IP ----------

export function paraDisplay(c: Chave, si: number, sis: Sistema): number {
  if (sis === "SI") return si;
  switch (c) {
    case "T":
    case "TDP":
    case "Tw":
      return (si * 9) / 5 + 32;
    case "h":
      return si * 0.429923 + 7.68; // referência ASHRAE IP: 0 Btu/lb a 0 °F
    case "v":
      return si * 16.01846;
    default:
      return si;
  }
}

export function deDisplay(c: Chave, v: number, sis: Sistema): number {
  if (sis === "SI") return v;
  switch (c) {
    case "T":
    case "TDP":
    case "Tw":
      return ((v - 32) * 5) / 9;
    case "h":
      return (v - 7.68) / 0.429923;
    case "v":
      return v / 16.01846;
    default:
      return v;
  }
}

export const M_POR_FT = 0.3048;
export const PA_POR_PSI = 6894.757;

// ---------- Atmosfera padrão ----------

export function pressaoDeAltitude(zM: number): number {
  return 101325 * Math.pow(1 - 2.25577e-5 * zM, 5.2559);
}

export function altitudeDePressao(pPa: number): number {
  return (1 - Math.pow(pPa / 101325, 1 / 5.2559)) / 2.25577e-5;
}

// ---------- Equações psicrométricas (p em kPa) ----------

function wDePw(pw: number, p: number): number {
  return (0.621945 * pw) / (p - pw);
}

function wSat(T: number, p: number): number {
  return wDePw(pressaoSaturacao(T), p);
}

// W para um par (T, Tw): eq. 33 (Tw >= 0) e eq. 35 (Tw < 0, sobre o gelo).
function wDeBulboUmido(T: number, Tw: number, p: number): number {
  const ws = wSat(Tw, p);
  if (Tw >= 0) {
    return (
      ((2501 - 2.326 * Tw) * ws - 1.006 * (T - Tw)) /
      (2501 + 1.86 * T - 4.186 * Tw)
    );
  }
  return (
    ((2830 - 0.24 * Tw) * ws - 1.006 * (T - Tw)) /
    (2830 + 1.86 * T - 2.1 * Tw)
  );
}

// Umidade absoluta W (kg/kg) que um parâmetro conhecido implica, dada T.
function wDe(chave: Exclude<Chave, "T">, valor: number, T: number, p: number): number {
  switch (chave) {
    case "rH":
      return wDePw((valor / 100) * pressaoSaturacao(T), p);
    case "TDP":
      return wDePw(pressaoSaturacao(valor), p);
    case "W":
      return valor;
    case "h":
      return (valor - 1.006 * T) / (2501 + 1.86 * T);
    case "Tw":
      return T < valor ? NaN : wDeBulboUmido(T, valor, p);
    case "v":
      return ((valor * p) / (0.287042 * (T + 273.15)) - 1) / 1.607858;
  }
}

// Temperatura de ponto de orvalho (°C) a partir de pw (kPa), invertendo a
// pressão de saturação (Hyland-Wexler) por bisseção.
function pontoOrvalhoExato(pw: number): number {
  let lo = -80;
  let hi = 100;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (pressaoSaturacao(mid) < pw) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Bulbo úmido (°C) a partir de (T, W) por bisseção.
function bulboUmidoDe(T: number, W: number, p: number): number {
  let lo = -60;
  let hi = T;
  if (wDeBulboUmido(T, lo, p) - W > 0) return lo;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (wDeBulboUmido(T, mid, p) - W < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

function estadoCompleto(T: number, W: number, p: number): Estado {
  const pw = (W * p) / (0.621945 + W);
  return {
    T,
    rH: (pw / pressaoSaturacao(T)) * 100,
    TDP: pontoOrvalhoExato(pw),
    W,
    h: 1.006 * T + W * (2501 + 1.86 * T),
    Tw: bulboUmidoDe(T, W, p),
    v: (0.287042 * (T + 273.15) * (1 + 1.607858 * W)) / p,
  };
}

export type Entrada = { chave: Chave; valor: number };
export type Resolucao = { estado: Estado | null; erro: string | null };

export function resolver(a: Entrada, b: Entrada, pPa: number): Resolucao {
  const p = pPa / 1000;
  const falha = (erro: string): Resolucao => ({ estado: null, erro });

  if (a.chave === b.chave) return falha("Escolha dois parâmetros diferentes.");

  for (const e of [a, b]) {
    if (e.chave === "rH" && (e.valor < 0 || e.valor > 100)) {
      return falha("A umidade relativa deve estar entre 0 e 100 %.");
    }
    if (e.chave === "W" && e.valor < 0) {
      return falha("A umidade absoluta não pode ser negativa.");
    }
    if (
      (e.chave === "T" || e.chave === "TDP" || e.chave === "Tw") &&
      (e.valor < T_MIN || e.valor > T_MAX)
    ) {
      return falha(
        `Temperatura fora da faixa de validade (${T_MIN} a ${T_MAX} °C).`
      );
    }
    if (e.chave === "v" && e.valor <= 0) {
      return falha("O volume específico deve ser positivo.");
    }
  }

  const ehPar = (x: Chave, y: Chave) =>
    (a.chave === x && b.chave === y) || (a.chave === y && b.chave === x);

  if (ehPar("TDP", "W")) {
    return falha(
      "TDP e W descrevem a mesma grandeza e não definem a temperatura: combine um deles com outro parâmetro."
    );
  }

  let T: number;
  let W: number;

  const comT = a.chave === "T" ? a : b.chave === "T" ? b : null;
  if (comT) {
    const outro = comT === a ? b : a;
    T = comT.valor;
    W = wDe(outro.chave as Exclude<Chave, "T">, outro.valor, T, p);
  } else {
    const ca = a.chave as Exclude<Chave, "T">;
    const cb = b.chave as Exclude<Chave, "T">;
    let lo = T_MIN;
    let hi = T_MAX;
    while (hi > lo && pressaoSaturacao(hi) >= 0.95 * p) hi -= 1;
    for (const e of [a, b]) {
      if (e.chave === "Tw") lo = Math.max(lo, e.valor);
    }
    const g = (t: number) => wDe(ca, a.valor, t, p) - wDe(cb, b.valor, t, p);

    let bracket: [number, number] | null = null;
    const passos = 400;
    let anterior = lo;
    let gAnterior = g(lo);
    for (let i = 1; i <= passos; i++) {
      const t = lo + ((hi - lo) * i) / passos;
      const gt = g(t);
      if (
        Number.isFinite(gAnterior) &&
        Number.isFinite(gt) &&
        (gAnterior === 0 || gAnterior * gt <= 0)
      ) {
        bracket = [anterior, t];
        break;
      }
      anterior = t;
      gAnterior = gt;
    }
    if (!bracket) {
      return falha(
        "Esse par de valores não corresponde a um estado possível do ar úmido nesta pressão."
      );
    }
    let [x0, x1] = bracket;
    for (let i = 0; i < 100; i++) {
      const mid = (x0 + x1) / 2;
      if (g(x0) * g(mid) <= 0) x1 = mid;
      else x0 = mid;
    }
    T = (x0 + x1) / 2;
    W = wDe(ca, a.valor, T, p);
  }

  if (!Number.isFinite(W) || W < -1e-9) {
    return falha("Esse par de valores não corresponde a um estado possível do ar úmido.");
  }
  if (T < T_MIN || T > T_MAX) {
    return falha(
      `Temperatura resultante fora da faixa de validade (${T_MIN} a ${T_MAX} °C).`
    );
  }
  if (W > wSat(T, p) * 1.0005) {
    return falha(
      "Estado impossível: a umidade passaria de 100 % (ar supersaturado)."
    );
  }

  return { estado: estadoCompleto(T, Math.max(W, 0), p), erro: null };
}
