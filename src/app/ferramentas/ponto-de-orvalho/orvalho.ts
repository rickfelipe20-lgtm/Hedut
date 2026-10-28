// Ponto de orvalho segundo o ASHRAE Handbook — Fundamentals, cap. 1
// (Psychrometrics): pressão de saturação de Hyland-Wexler (eq. 5 e 6) e
// correlação do ponto de orvalho (eq. 37 e 38). Pressão atmosférica padrão.

export const P_ATM_KPA = 101.325;

export const TBS_MIN = -50;
export const TBS_MAX = 90;

// Pressão de saturação do vapor d'água (kPa).
// Sobre o gelo abaixo de 0 °C (eq. 5) e sobre a água líquida a partir de 0 °C (eq. 6).
export function pressaoSaturacao(tempC: number): number {
  const T = tempC + 273.15;
  let ln: number;
  if (tempC < 0) {
    ln =
      -5.6745359e3 / T +
      6.3925247 -
      9.677843e-3 * T +
      6.2215701e-7 * T ** 2 +
      2.0747825e-9 * T ** 3 -
      9.484024e-13 * T ** 4 +
      4.1635019 * Math.log(T);
  } else {
    ln =
      -5.8002206e3 / T +
      1.3914993 -
      4.8640239e-2 * T +
      4.1764768e-5 * T ** 2 -
      1.4452093e-8 * T ** 3 +
      6.5459673 * Math.log(T);
  }
  return Math.exp(ln) / 1000;
}

// Ponto de orvalho (°C) a partir da pressão parcial de vapor pw (kPa).
// eq. 37 (0 a 93 °C); se o resultado for negativo, eq. 38 (ponto de geada).
export function pontoOrvalhoDePw(pw: number): {
  td: number;
  equacao: 37 | 38;
  alfa: number;
} {
  const alfa = Math.log(pw);
  const td37 =
    6.54 +
    14.526 * alfa +
    0.7389 * alfa ** 2 +
    0.09486 * alfa ** 3 +
    0.4569 * pw ** 0.1984;
  if (td37 >= 0) return { td: td37, equacao: 37, alfa };
  return { td: 6.09 + 12.608 * alfa + 0.4959 * alfa ** 2, equacao: 38, alfa };
}

export type ModoOrvalho = "ur" | "td";

export type EntradaOrvalho = {
  modo: ModoOrvalho;
  tbs: string;
  ur: string; // usado no modo "ur"
  td: string; // usado no modo "td"
  ts: string; // temperatura da superfície (opcional)
};

export type ResultadoOrvalho = {
  tbs: number;
  ur: number;
  td: number;
  pws: number; // kPa, saturação na Tbs
  pw: number; // kPa, pressão parcial de vapor
  equacao: 37 | 38 | null; // null no modo "td" (pw vem de pws(td))
  alfa: number | null;
  depressao: number; // tbs − td
  w: number; // kg/kg
  h: number; // kJ/kg
  v: number; // m³/kg
};

export type Condensacao = {
  ts: number;
  folga: number; // ts − td
  condensa: boolean;
  geada: boolean;
};

export type ResultadoCompleto = {
  resultado: ResultadoOrvalho | null;
  erro: string | null;
  condensacao: Condensacao | null;
  tabela: { ur: number; td: number }[];
};

export function num(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function propriedades(tbs: number, pw: number) {
  const w = (0.621945 * pw) / (P_ATM_KPA - pw);
  const h = 1.006 * tbs + w * (2501 + 1.86 * tbs);
  const v = (0.287042 * (tbs + 273.15) * (1 + 1.607858 * w)) / P_ATM_KPA;
  return { w, h, v };
}

export function calcularOrvalho(e: EntradaOrvalho): ResultadoCompleto {
  const vazio: ResultadoCompleto = {
    resultado: null,
    erro: null,
    condensacao: null,
    tabela: [],
  };

  const tbs = num(e.tbs);
  if (tbs === null) return vazio;
  if (tbs < TBS_MIN || tbs > TBS_MAX) {
    return {
      ...vazio,
      erro: `Temperatura de bulbo seco fora da faixa de validade (${TBS_MIN} a ${TBS_MAX} °C).`,
    };
  }
  const pws = pressaoSaturacao(tbs);

  let resultado: ResultadoOrvalho;

  if (e.modo === "ur") {
    const ur = num(e.ur);
    if (ur === null) return vazio;
    if (ur <= 0 || ur > 100) {
      return {
        ...vazio,
        erro: "A umidade relativa deve estar entre 0 (exclusive) e 100 %.",
      };
    }
    const pw = (ur / 100) * pws;
    const { td, equacao, alfa } = pontoOrvalhoDePw(pw);
    resultado = {
      tbs,
      ur,
      td,
      pws,
      pw,
      equacao,
      alfa,
      depressao: tbs - td,
      ...propriedades(tbs, pw),
    };
  } else {
    const td = num(e.td);
    if (td === null) return vazio;
    if (td < TBS_MIN) {
      return {
        ...vazio,
        erro: `Ponto de orvalho abaixo da faixa de validade (mínimo ${TBS_MIN} °C).`,
      };
    }
    if (td > tbs) {
      return {
        ...vazio,
        erro: "O ponto de orvalho não pode ser maior que a temperatura de bulbo seco (UR acima de 100 %).",
      };
    }
    const pw = pressaoSaturacao(td);
    resultado = {
      tbs,
      ur: (pw / pws) * 100,
      td,
      pws,
      pw,
      equacao: null,
      alfa: null,
      depressao: tbs - td,
      ...propriedades(tbs, pw),
    };
  }

  const ts = num(e.ts);
  const condensacao: Condensacao | null =
    ts === null
      ? null
      : {
          ts,
          folga: ts - resultado.td,
          condensa: ts <= resultado.td,
          geada: resultado.td < 0,
        };

  const tabela = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((ur) => ({
    ur,
    td: pontoOrvalhoDePw((ur / 100) * pws).td,
  }));

  return { resultado, erro: null, condensacao, tabela };
}
