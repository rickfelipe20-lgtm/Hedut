// Ventilação natural por vento e por efeito chaminé (diferença de temperatura),
// no método do ASHRAE Handbook — Fundamentals, cap. 16 (Ventilation and
// Infiltration):
//   vento:   Q = Cv · A · U
//   chaminé: Q = Cd · A · √(2 g Δh (Ti − To) / Ti)
//   ambos:   Q = √(Qv² + Qc²)
// Para aberturas de entrada e saída com áreas diferentes usa-se a área efetiva
// A_ef = Ae·As / √(Ae² + As²), que generaliza as equações acima: quando
// Ae = As = A, elas se reduzem exatamente às equações do ASHRAE.

const G = 9.81; // m/s²
const RHO = 1.2; // kg/m³
const CP = 1.006; // kJ/kgK

export type ModoVent = "vazao" | "area";
export type CriterioVazao = "vazao" | "trocas" | "calor";
export type Direcao = "perpendicular" | "diagonal" | "personalizado";

export const CV_PADRAO: Record<Exclude<Direcao, "personalizado">, number> = {
  perpendicular: 0.55, // faixa ASHRAE: 0,5 a 0,6
  diagonal: 0.3, // faixa ASHRAE: 0,25 a 0,35
};

export type EntradaVent = {
  modo: ModoVent;
  ti: string; // °C
  to: string; // °C
  u: string; // m/s (vazio = 0)
  h: string; // m, desnível entre os centros das aberturas (vazio = 0)
  volume: string; // m³ (opcional)
  areaPiso: string; // m² (opcional)
  direcao: Direcao;
  cvPersonalizado: string;
  cd: string;
  // modo "vazao"
  areaEntrada: string; // m²
  areaSaida: string; // m²
  // modo "area"
  criterio: CriterioVazao;
  vazaoAlvo: string; // m³/h
  trocasAlvo: string; // 1/h
  calorKw: string; // kW
  razao: string; // área de saída / área de entrada
};

export type ResultadoVent = {
  pronto: boolean;
  faltam: string[];
  erro: string | null;
  avisos: string[];
  cv: number;
  cd: number;
  deltaT: number; // Ti − To
  kVento: number; // Cv·√2·U  (m/s)
  kChamine: number; // Cd·√(2 g H |ΔT| / T)  (m/s)
  kTotal: number;
  // modo "vazao"
  aEfetiva: number | null;
  qVento: number | null; // m³/s
  qChamine: number | null; // m³/s
  qTotal: number | null; // m³/s
  fracVento: number | null; // 0..1 (vento²/(vento²+chaminé²))
  ach: number | null;
  calorKw: number | null;
  // modo "area"
  qNecessaria: number | null; // m³/s
  aEntrada: number | null;
  aSaida: number | null;
  percPiso: number | null;
};

export function num(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function entradaVazia(): EntradaVent {
  return {
    modo: "vazao",
    ti: "",
    to: "",
    u: "",
    h: "",
    volume: "",
    areaPiso: "",
    direcao: "perpendicular",
    cvPersonalizado: "",
    cd: "0.65",
    areaEntrada: "",
    areaSaida: "",
    criterio: "trocas",
    vazaoAlvo: "",
    trocasAlvo: "",
    calorKw: "",
    razao: "1",
  };
}

// Sala de 6 × 5 × 3 m, 28 °C interno, 24 °C externo, vento de 2 m/s.
export function entradaExemplo(): EntradaVent {
  return {
    ...entradaVazia(),
    ti: "28",
    to: "24",
    u: "2",
    h: "2",
    volume: "90",
    areaPiso: "30",
    areaEntrada: "1.5",
    areaSaida: "1.5",
  };
}

export function calcularVentilacao(e: EntradaVent): ResultadoVent {
  const ti = num(e.ti);
  const to = num(e.to);
  const u = num(e.u) ?? 0;
  const h = num(e.h) ?? 0;
  const cd = num(e.cd);
  const cv =
    e.direcao === "personalizado" ? num(e.cvPersonalizado) : CV_PADRAO[e.direcao];

  const base: ResultadoVent = {
    pronto: false,
    faltam: [],
    erro: null,
    avisos: [],
    cv: cv ?? 0,
    cd: cd ?? 0,
    deltaT: 0,
    kVento: 0,
    kChamine: 0,
    kTotal: 0,
    aEfetiva: null,
    qVento: null,
    qChamine: null,
    qTotal: null,
    fracVento: null,
    ach: null,
    calorKw: null,
    qNecessaria: null,
    aEntrada: null,
    aSaida: null,
    percPiso: null,
  };

  const faltam: string[] = [];
  if (ti === null) faltam.push("temperatura interna");
  if (to === null) faltam.push("temperatura externa");
  if (cv === null) faltam.push("Cv");
  if (cd === null) faltam.push("Cd");

  const aEntrada = num(e.areaEntrada);
  const aSaida = num(e.areaSaida);
  const razao = num(e.razao);
  let qAlvoM3s: number | null = null;

  if (e.modo === "vazao") {
    if (aEntrada === null) faltam.push("área de entrada");
    if (aSaida === null) faltam.push("área de saída");
  } else {
    if (razao === null) faltam.push("razão saída/entrada");
    if (e.criterio === "vazao") {
      const q = num(e.vazaoAlvo);
      if (q === null) faltam.push("vazão necessária");
      else qAlvoM3s = q / 3600;
    } else if (e.criterio === "trocas") {
      const n = num(e.trocasAlvo);
      const v = num(e.volume);
      if (n === null) faltam.push("trocas por hora");
      if (v === null) faltam.push("volume do ambiente");
      if (n !== null && v !== null) qAlvoM3s = (n * v) / 3600;
    } else {
      const kw = num(e.calorKw);
      if (kw === null) faltam.push("calor sensível a remover");
    }
  }

  if (faltam.length > 0 || ti === null || to === null || cv === null || cd === null) {
    return { ...base, faltam };
  }

  const erroFaixa = (cond: boolean, msg: string) => (cond ? msg : null);
  const erro =
    erroFaixa(u < 0, "A velocidade do vento não pode ser negativa.") ??
    erroFaixa(h < 0, "O desnível entre as aberturas não pode ser negativo (a saída fica acima da entrada).") ??
    erroFaixa(cv < 0 || cv > 1, "Cv deve estar entre 0 e 1.") ??
    erroFaixa(cd <= 0 || cd > 1, "Cd deve estar entre 0 (exclusive) e 1.") ??
    erroFaixa(
      e.modo === "vazao" && ((aEntrada ?? 0) <= 0 || (aSaida ?? 0) <= 0),
      "As áreas livres de entrada e saída devem ser maiores que zero."
    ) ??
    erroFaixa(
      e.modo === "area" && (razao ?? 0) <= 0,
      "A razão saída/entrada deve ser maior que zero."
    );
  if (erro) return { ...base, erro };

  const deltaT = ti - to;
  const tRef = (deltaT >= 0 ? ti : to) + 273.15;
  const kVento = cv * Math.SQRT2 * u;
  const kChamine =
    h > 0 && deltaT !== 0
      ? cd * Math.sqrt((2 * G * h * Math.abs(deltaT)) / tRef)
      : 0;
  const kTotal = Math.sqrt(kVento * kVento + kChamine * kChamine);

  const avisos: string[] = [];
  if (deltaT < 0 && kChamine > 0) {
    avisos.push(
      "Temperatura externa maior que a interna: o efeito chaminé inverte o sentido (entra pela abertura alta e sai pela baixa)."
    );
  }
  if (deltaT === 0 && h > 0) {
    avisos.push("Sem diferença de temperatura não há efeito chaminé.");
  }
  if (u === 0) avisos.push("Sem vento (calmaria): só atua o efeito chaminé.");

  const volume = num(e.volume);
  const areaPiso = num(e.areaPiso);
  const resultado: ResultadoVent = {
    ...base,
    pronto: true,
    avisos,
    deltaT,
    kVento,
    kChamine,
    kTotal,
  };

  if (e.modo === "vazao") {
    const ae = aEntrada!;
    const as = aSaida!;
    const aEf = (ae * as) / Math.sqrt(ae * ae + as * as);
    const qVento = kVento * aEf;
    const qChamine = kChamine * aEf;
    const qTotal = kTotal * aEf;
    return {
      ...resultado,
      aEfetiva: aEf,
      qVento,
      qChamine,
      qTotal,
      fracVento: qTotal > 0 ? (qVento * qVento) / (qTotal * qTotal) : null,
      ach: volume !== null && volume > 0 ? (qTotal * 3600) / volume : null,
      calorKw: deltaT > 0 ? RHO * CP * qTotal * deltaT : null,
      percPiso:
        areaPiso !== null && areaPiso > 0 ? (ae / areaPiso) * 100 : null,
    };
  }

  // modo "area": dimensiona as aberturas para a vazão necessária
  let q = qAlvoM3s;
  if (e.criterio === "calor") {
    const kw = num(e.calorKw)!;
    if (deltaT <= 0) {
      return {
        ...resultado,
        erro: "Para remover calor por ventilação a temperatura interna precisa ser maior que a externa.",
      };
    }
    q = kw / (RHO * CP * deltaT);
  }
  if (q === null || q <= 0) {
    return { ...resultado, erro: "A vazão necessária deve ser maior que zero." };
  }
  if (kTotal <= 0) {
    return {
      ...resultado,
      erro: "Sem vento e sem efeito chaminé (desnível ou diferença de temperatura nulos) não há força motriz para a ventilação natural.",
    };
  }
  const r = razao!;
  const aEf = q / kTotal;
  const ae = (aEf * Math.sqrt(1 + r * r)) / r;
  const as = r * ae;
  return {
    ...resultado,
    qNecessaria: q,
    aEfetiva: aEf,
    aEntrada: ae,
    aSaida: as,
    qVento: kVento * aEf,
    qChamine: kChamine * aEf,
    qTotal: q,
    fracVento: (kVento * kVento) / (kTotal * kTotal),
    ach: volume !== null && volume > 0 ? (q * 3600) / volume : null,
    percPiso: areaPiso !== null && areaPiso > 0 ? (ae / areaPiso) * 100 : null,
  };
}
