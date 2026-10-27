import { BIBLIOTECA, QUADRO_1, QUADRO_2 } from "./tabelas";

// Constantes físicas e parâmetros (ISO 7726 / ISO 7243 / NHO 06 / ASHRAE)
const SIGMA = 5.67e-8; // W/m²K⁴
const EPS_G = 0.95; // emissividade do globo
const D_G = 0.15; // diâmetro do globo (m)
const D_W = 0.006; // diâmetro do pavio (m)
const EPS_W = 0.95; // emissividade do pavio molhado
const K_AIR = 0.0263; // W/mK
const NU_AIR = 1.6e-5; // m²/s
const PR = 0.71;
const G = 9.81;
const LR0 = 16.5; // razão de Lewis a 101,325 kPa (K/kPa)
const RHO = 1.2; // kg/m³
const CP = 1.006; // kJ/kgK
const HFG = 2501; // kJ/kg
const HE = 17; // coef. de película externo (W/m²K)
const HI_COBERTURA = 6.1;
const HI_PISO = 6.1;
const HI_PAREDE = 8.3;

export const ITEM_OUTRO = "Outro – informar a temperatura (tsi)";

export type ModoAmbiente = "Ventilado" | "Climatizado";
export type ModoRadiante =
  | "Sem fonte radiante"
  | "Pelas superfícies"
  | "Informar tr";

export type Situacao = {
  id: number;
  nome: string;
  minutos: string; // ignorado na situação 1 (recebe o restante dos 60 min)
  atividade: string; // nome da atividade no Quadro 2 ("" = não escolhida)
  solDireto: boolean;
  ambiente: ModoAmbiente | "";
  taClim: string;
  urClim: string;
  qs: string; // kW
  ql: string; // kW
  vazao: string; // m³/h
  va: string; // m/s
  radiante: ModoRadiante | "";
  trInformada: string;
};

export type Superficie = {
  id: number;
  item: string; // nome na biblioteca ("" = não escolhida)
  situacaoId: number;
  area: string; // m²
  radSolar: string; // W/m² (opcional)
  tsiConhecida: string; // °C (opcional)
};

export type EntradaIBUTG = {
  altitude: string;
  te: string;
  urExt: string;
  situacoes: Situacao[];
  superficies: Superficie[];
};

export type CampoFaltando =
  | "atividade"
  | "ambiente"
  | "va"
  | "radiante"
  | "taClim"
  | "urClim"
  | "te"
  | "urExt"
  | "qs"
  | "vazao"
  | "trInformada"
  | "superficies";

export type ResultadoSituacao = {
  id: number;
  codigo: string;
  nome: string;
  minutos: number;
  m: number | null;
  ativa: boolean;
  faltam: CampoFaltando[];
  ambiente: ModoAmbiente | "";
  solDireto: boolean;
  // ar
  ta: number | null;
  ur: number | null;
  pv: number | null;
  elevacao: number | null;
  wExt: number | null;
  wInt: number | null;
  va: number | null;
  // radiação
  tr: number | null;
  // globo
  hrGlobo: number | null;
  hcGlobo: number | null;
  tg: number | null;
  // bulbo úmido natural
  tbn: number | null;
  convPavio: number | null;
  radPavio: number | null;
  evapPavio: number | null;
  // resultado
  ibutg: number | null;
};

export type ResultadoSuperficie = {
  id: number;
  tsi: number | null;
  origem: string;
  tSolAr: number | null;
  u: number | null;
  hi: number;
  alfa: number;
  rad: number;
};

export type ConclusaoNivel = "excedido" | "acao" | "ok" | "aviso" | "vazio";

export type ResultadoIBUTG = {
  pressao: number;
  situacoes: ResultadoSituacao[];
  superficies: ResultadoSuperficie[];
  minutosConsiderados: number;
  ibutgMedio: number | null;
  mMedio: number | null;
  limite: number | null;
  foraDoQuadro: boolean;
  nivelAcao: number | null;
  folga: number | null;
  faltamTotal: number;
  conclusao: { nivel: ConclusaoNivel; titulo: string; acao: string };
};

export function num(s: string): number | null {
  const t = s.trim();
  if (t === "") return null;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

// Pressão de saturação do vapor (kPa) — Tetens
function psat(t: number): number {
  return 0.61078 * Math.exp((17.27 * t) / (t + 237.3));
}

export function taxaMetabolica(atividade: string): number | null {
  const a = QUADRO_2.find((q) => q.nome === atividade);
  return a ? a.m : null;
}

export function minutosSituacao(e: EntradaIBUTG, index: number): number {
  if (index === 0) {
    const outros = e.situacoes
      .slice(1)
      .reduce((soma, s) => soma + Math.max(0, num(s.minutos) ?? 0), 0);
    return Math.max(0, 60 - outros);
  }
  return Math.max(0, num(e.situacoes[index].minutos) ?? 0);
}

function calcularGlobo(ta: number, tr: number, va: number) {
  const hcForcada = (6.3 * Math.pow(va, 0.6)) / Math.pow(D_G, 0.4);
  let hr = 4 * EPS_G * SIGMA * Math.pow((tr + ta) / 2 + 273.15, 3);
  let hc = Math.max(
    hcForcada,
    1.4 * Math.pow(Math.max(Math.abs(tr - ta) / 2, 0.01) / D_G, 0.25)
  );
  let tg = (hr * tr + hc * ta) / (hr + hc);
  for (let i = 0; i < 3; i++) {
    hr =
      EPS_G *
      SIGMA *
      (Math.pow(tr + 273.15, 2) + Math.pow(tg + 273.15, 2)) *
      (tr + tg + 546.3);
    hc = Math.max(
      hcForcada,
      1.4 * Math.pow(Math.max(Math.abs(tg - ta), 0.01) / D_G, 0.25)
    );
    tg = (hr * tr + hc * ta) / (hr + hc);
  }
  return { tg, hr, hc };
}

// Balanço de calor e massa no pavio (Hilpert/Morgan + Lewis), Newton-Raphson.
function calcularTbn(ta: number, tr: number, va: number, pv: number, p: number) {
  const lr = (LR0 * 101.325) / p;
  const re = (va * D_W) / NU_AIR;
  const nuForcado =
    (re < 4
      ? 0.989 * Math.pow(re, 0.33)
      : re < 40
        ? 0.911 * Math.pow(re, 0.385)
        : 0.683 * Math.pow(re, 0.466)) * Math.pow(PR, 1 / 3);

  let tbn = ta;
  let hc = 0;
  let hr = 0;
  for (let i = 0; i < 6; i++) {
    const ra = Math.max(
      ((G / (ta + 273.15)) *
        Math.max(ta - tbn, 0.001) *
        Math.pow(D_W, 3)) /
        ((NU_AIR * NU_AIR) / PR),
      1e-6
    );
    const nuNatural =
      ra < 100 ? 1.02 * Math.pow(ra, 0.148) : 0.85 * Math.pow(ra, 0.188);
    hc =
      (Math.cbrt(Math.pow(nuForcado, 3) + Math.pow(nuNatural, 3)) * K_AIR) /
      D_W;
    hr =
      EPS_W *
      SIGMA *
      (Math.pow(tr + 273.15, 2) + Math.pow(tbn + 273.15, 2)) *
      (tr + tbn + 546.3);
    const ps = psat(tbn);
    const residuo = hc * (ta - tbn) + hr * (tr - tbn) - lr * hc * (ps - pv);
    const derivada =
      -hc - hr - (lr * hc * ps * 17.27 * 237.3) / Math.pow(tbn + 237.3, 2);
    tbn = tbn - residuo / derivada;
  }
  return {
    tbn,
    conv: hc * (ta - tbn),
    rad: hr * (tr - tbn),
    evap: lr * hc * (psat(tbn) - pv),
  };
}

export function limiteQuadro1(m: number): number | null {
  if (m > 606) return null;
  if (m <= 100) return QUADRO_1[0][1];
  let idx = 0;
  for (let i = 0; i < QUADRO_1.length; i++) {
    if (QUADRO_1[i][0] <= m) idx = i;
    else break;
  }
  if (QUADRO_1[idx][0] === m) return QUADRO_1[idx][1];
  return QUADRO_1[Math.min(idx + 1, QUADRO_1.length - 1)][1];
}

function vazioSituacao(
  s: Situacao,
  index: number,
  minutos: number,
  m: number | null,
  faltam: CampoFaltando[]
): ResultadoSituacao {
  return {
    id: s.id,
    codigo: `S${index + 1}`,
    nome: s.nome,
    minutos,
    m,
    ativa: false,
    faltam,
    ambiente: s.ambiente,
    solDireto: s.solDireto,
    ta: null,
    ur: null,
    pv: null,
    elevacao: null,
    wExt: null,
    wInt: null,
    va: null,
    tr: null,
    hrGlobo: null,
    hcGlobo: null,
    tg: null,
    tbn: null,
    convPavio: null,
    radPavio: null,
    evapPavio: null,
    ibutg: null,
  };
}

export function calcularIBUTG(e: EntradaIBUTG): ResultadoIBUTG {
  const z = num(e.altitude) ?? 0;
  const p = 101.325 * Math.pow(1 - 2.25577e-5 * z, 5.2559);
  const te = num(e.te);
  const urExt = num(e.urExt);

  // Passo 1 — campos obrigatórios e condições do ar de cada situação
  const prelim = e.situacoes.map((s, i) => {
    const minutos = minutosSituacao(e, i);
    const m = taxaMetabolica(s.atividade);
    const faltam: CampoFaltando[] = [];

    if (minutos > 0) {
      if (m === null) faltam.push("atividade");
      if (s.ambiente === "") faltam.push("ambiente");
      if (num(s.va) === null) faltam.push("va");
      if (s.radiante === "") faltam.push("radiante");
      if (s.ambiente === "Climatizado") {
        if (num(s.taClim) === null) faltam.push("taClim");
        if (num(s.urClim) === null) faltam.push("urClim");
      }
      if (s.ambiente === "Ventilado") {
        if (te === null) faltam.push("te");
        if (urExt === null) faltam.push("urExt");
        if (num(s.qs) === null) faltam.push("qs");
        const v = num(s.vazao);
        if (v === null || v <= 0) faltam.push("vazao");
      }
      if (s.radiante === "Informar tr" && num(s.trInformada) === null) {
        faltam.push("trInformada");
      }
      if (
        s.radiante === "Pelas superfícies" &&
        !e.superficies.some((sup) => sup.situacaoId === s.id)
      ) {
        faltam.push("superficies");
      }
    }

    const ativa = minutos > 0 && m !== null && faltam.length === 0;
    const base = vazioSituacao(s, i, minutos, m, faltam);
    if (!ativa) return base;

    let ta: number;
    let ur: number;
    let pv: number;
    let elevacao: number | null = null;
    let wExt: number | null = null;
    let wInt: number | null = null;

    if (s.ambiente === "Ventilado") {
      const pvExt = (urExt! / 100) * psat(te!);
      wExt = (0.622 * pvExt) / (p - pvExt);
      const vazaoM3s = num(s.vazao)! / 3600;
      elevacao = num(s.qs)! / (RHO * CP * vazaoM3s);
      wInt = wExt + (num(s.ql) ?? 0) / (RHO * vazaoM3s * HFG);
      ta = te! + elevacao;
      pv = (p * wInt) / (0.622 + wInt);
      ur = (100 * pv) / psat(ta);
    } else {
      ta = num(s.taClim)!;
      ur = num(s.urClim)!;
      pv = (ur / 100) * psat(ta);
    }

    return {
      ...base,
      ativa: true,
      ta,
      ur,
      pv,
      elevacao,
      wExt,
      wInt,
      va: Math.max(num(s.va)!, 0.05),
    };
  });

  // Passo 2 — temperatura superficial interna (tsi) de cada superfície
  const superficies: ResultadoSuperficie[] = e.superficies.map((sup) => {
    const lib = BIBLIOTECA.find((b) => b.nome === sup.item);
    const tipo = lib ? lib.tipo : "Equipamento";
    const alfa = lib && lib.alfa !== null ? lib.alfa : 0.5;
    const hi =
      tipo === "Cobertura" ? HI_COBERTURA : tipo === "Piso" ? HI_PISO : HI_PAREDE;
    const u = lib ? lib.u : null;
    const rad =
      num(sup.radSolar) ?? (lib && lib.radSolar !== null ? lib.radSolar : 0);
    const tSolAr = te === null ? null : te + (alfa * rad) / HE;
    const tsiConhecida = num(sup.tsiConhecida);
    const sit = prelim.find((r) => r.id === sup.situacaoId);
    const ta = sit && sit.ativa ? sit.ta : null;

    let tsi: number | null = null;
    let origem = "";
    if (sup.item === "") {
      origem = "";
    } else if (!sit) {
      origem = "Falta a situação";
    } else if (ta === null) {
      origem = "Situação inativa ou incompleta";
    } else if (tsiConhecida !== null) {
      tsi = tsiConhecida;
      origem = "Informada por você";
    } else if (lib && lib.tsiTipica !== null) {
      tsi = lib.tsiTipica;
      origem = "Típica do equipamento (lista)";
    } else if (u === null) {
      tsi = ta;
      origem = "Igual ao ar (superfície interna)";
    } else if (tSolAr === null) {
      tsi = ta;
      origem = "Falta te do local – igual ao ar";
    } else {
      tsi = ta + (u / hi) * (tSolAr - ta);
      origem = `Calculada: sol de ${rad.toFixed(0)} W/m² + U ${u.toFixed(2)}`;
    }

    return { id: sup.id, tsi, origem, tSolAr, u, hi, alfa, rad };
  });

  // Passo 3 — tr, globo, bulbo úmido natural e IBUTG de cada situação
  const situacoes: ResultadoSituacao[] = prelim.map((r, i) => {
    if (!r.ativa) return r;
    const s = e.situacoes[i];
    const ta = r.ta!;

    let tr = ta;
    if (s.radiante === "Informar tr") {
      tr = num(s.trInformada)!;
    } else if (s.radiante === "Pelas superfícies") {
      let somaArea = 0;
      let somaAreaT4 = 0;
      e.superficies.forEach((sup, k) => {
        const calc = superficies[k];
        if (sup.situacaoId !== s.id || calc.tsi === null) return;
        const area = num(sup.area) ?? 0;
        somaArea += area;
        somaAreaT4 += area * Math.pow(calc.tsi + 273.15, 4);
      });
      tr = somaArea > 0 ? Math.pow(somaAreaT4 / somaArea, 0.25) - 273.15 : ta;
    }

    const globo = calcularGlobo(ta, tr, r.va!);
    const umido = calcularTbn(ta, tr, r.va!, r.pv!, p);
    const ibutg = s.solDireto
      ? 0.7 * umido.tbn + 0.2 * globo.tg + 0.1 * ta
      : 0.7 * umido.tbn + 0.3 * globo.tg;

    return {
      ...r,
      tr,
      hrGlobo: globo.hr,
      hcGlobo: globo.hc,
      tg: globo.tg,
      tbn: umido.tbn,
      convPavio: umido.conv,
      radPavio: umido.rad,
      evapPavio: umido.evap,
      ibutg,
    };
  });

  // Passo 4 — enquadramento na NR-15 (média ponderada da hora)
  const ativas = situacoes.filter((s) => s.ativa);
  const minutosConsiderados = ativas.reduce((soma, s) => soma + s.minutos, 0);
  const ibutgMedio =
    minutosConsiderados > 0
      ? ativas.reduce((soma, s) => soma + s.ibutg! * s.minutos, 0) /
        minutosConsiderados
      : null;
  const mMedio =
    minutosConsiderados > 0
      ? ativas.reduce((soma, s) => soma + s.m! * s.minutos, 0) /
        minutosConsiderados
      : null;

  const limite = mMedio === null ? null : limiteQuadro1(mMedio);
  const foraDoQuadro = mMedio !== null && limite === null;
  const nivelAcao = mMedio === null ? null : 59.9 - 14.1 * Math.log10(mMedio);
  const folga =
    limite !== null && ibutgMedio !== null ? limite - ibutgMedio : null;
  const faltamTotal = situacoes.reduce((soma, s) => soma + s.faltam.length, 0);

  let conclusao: ResultadoIBUTG["conclusao"];
  if (ativas.some((s) => (s.ur ?? 0) > 100)) {
    conclusao = {
      nivel: "aviso",
      titulo:
        "Umidade acima de 100 % no posto – a vazão está baixa para a carga latente (revise o ar no posto)",
      acao: "",
    };
  } else if (faltamTotal > 0) {
    conclusao = {
      nivel: "aviso",
      titulo: `Faltam ${faltamTotal} campo(s) obrigatório(s) – preencha os campos destacados em vermelho`,
      acao: "",
    };
  } else if (ibutgMedio === null) {
    conclusao = {
      nivel: "vazio",
      titulo: "Preencha ao menos uma situação (tempo e atividade)",
      acao: "",
    };
  } else if (Math.abs(minutosConsiderados - 60) > 0.01) {
    conclusao = {
      nivel: "aviso",
      titulo:
        "A soma dos tempos não dá 60 min – revise o ciclo de trabalho (alguma situação está incompleta ou a soma passou de 60 min)",
      acao: "",
    };
  } else if (limite === null) {
    conclusao = {
      nivel: "aviso",
      titulo: "Taxa metabólica acima do Quadro 1 (M > 606 W)",
      acao: "",
    };
  } else if (ibutgMedio > limite) {
    conclusao = {
      nivel: "excedido",
      titulo:
        "ACIMA DO LIMITE – caracteriza insalubridade (grau médio) em ambiente fechado ou com fonte artificial de calor",
      acao: "Reduza o IBUTG: mais vazão ou velocidade do ar, isolamento da cobertura ou barreira contra radiação, resfriamento evaporativo ou climatização local, ou mais tempo em descanso mais fresco.",
    };
  } else if (ibutgMedio > nivelAcao!) {
    conclusao = {
      nivel: "acao",
      titulo:
        "ABAIXO DO LIMITE, MAS ACIMA DO NÍVEL DE AÇÃO – exige medidas preventivas (NR-9)",
      acao: `O projeto atende ao limite, mas a empresa precisará de medidas preventivas (hidratação, aclimatização, monitoramento). Para ficar abaixo do nível de ação, reduza o IBUTG em ${(ibutgMedio - nivelAcao!).toFixed(1)} °C.`,
    };
  } else {
    conclusao = {
      nivel: "ok",
      titulo: "ATENDE À NORMA – abaixo do nível de ação",
      acao: "Nenhuma ação necessária pelo critério do calor.",
    };
  }

  return {
    pressao: p,
    situacoes,
    superficies,
    minutosConsiderados,
    ibutgMedio,
    mMedio,
    limite,
    foraDoQuadro,
    nivelAcao,
    folga,
    faltamTotal,
    conclusao,
  };
}

export function situacaoPadrao(id: number, nome = ""): Situacao {
  return {
    id,
    nome,
    minutos: "",
    atividade: "",
    solDireto: false,
    ambiente: "",
    taClim: "",
    urClim: "",
    qs: "",
    ql: "",
    vazao: "",
    va: "",
    radiante: "",
    trInformada: "",
  };
}

export function superficiePadrao(id: number, situacaoId: number): Superficie {
  return {
    id,
    item: "",
    situacaoId,
    area: "",
    radSolar: "",
    tsiConhecida: "",
  };
}

// Exemplo da planilha original ("Galpão de produção"): IBUTG ≈ 33,7 °C.
export function exemploGalpao(): EntradaIBUTG {
  return {
    altitude: "0",
    te: "32",
    urExt: "80",
    situacoes: [
      {
        ...situacaoPadrao(1, "Posto junto à linha (galpão ventilado)"),
        atividade: "Em pé/agachado – Trabalho pesado com dois braços",
        ambiente: "Ventilado",
        qs: "120",
        ql: "5",
        vazao: "60000",
        va: "0.5",
        radiante: "Pelas superfícies",
      },
    ],
    superficies: [
      {
        id: 1,
        item: "Equipamento · Motor elétrico grande / compressor",
        situacaoId: 1,
        area: "2000",
        radSolar: "900",
        tsiConhecida: "",
      },
      {
        id: 2,
        item: "Parede · Alvenaria de bloco cerâmico – cor clara",
        situacaoId: 1,
        area: "1200",
        radSolar: "300",
        tsiConhecida: "",
      },
      {
        id: 3,
        item: "Piso · Piso de concreto sobre o solo",
        situacaoId: 1,
        area: "2000",
        radSolar: "",
        tsiConhecida: "30",
      },
    ],
  };
}
