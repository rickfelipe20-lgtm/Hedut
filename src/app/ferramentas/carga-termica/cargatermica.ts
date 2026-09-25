import { calcularEstado } from "@/app/ferramentas/estudo-psicrometrico/psicrometria";

export type Orientacao =
  | "norte"
  | "nordeste"
  | "leste"
  | "sudeste"
  | "sul"
  | "sudoeste"
  | "oeste"
  | "noroeste";

export const ORIENTACOES: { chave: Orientacao; nome: string }[] = [
  { chave: "norte", nome: "Norte (N)" },
  { chave: "nordeste", nome: "Nordeste (NE)" },
  { chave: "leste", nome: "Leste (L)" },
  { chave: "sudeste", nome: "Sudeste (SE)" },
  { chave: "sul", nome: "Sul (S)" },
  { chave: "sudoeste", nome: "Sudoeste (SO)" },
  { chave: "oeste", nome: "Oeste (O)" },
  { chave: "noroeste", nome: "Noroeste (NO)" },
];

// Ganho solar instantâneo médio de referência por orientação (W/m²)
// — valores médios para clima tropical/subtropical brasileiro; as
// orientações intermediárias usam a média das duas cardeais vizinhas.
export const GSI_ORIENTACAO: Record<Orientacao, number> = {
  norte: 130,
  nordeste: 265,
  leste: 400,
  sudeste: 240,
  sul: 80,
  sudoeste: 240,
  oeste: 400,
  noroeste: 265,
};

// Irradiância horizontal de referência para a cobertura (W/m²) — pico
// de radiação global horizontal em dia de céu claro, clima tropical/
// subtropical brasileiro.
export const GSI_COBERTURA_HORIZONTAL = 900;

// Coeficiente de película externa (ASHRAE Fundamentals, superfície
// exterior, vento de verão) usado no cálculo da temperatura sol-ar.
export const H0_EXTERNO = 22.7; // W/(m²·K)

export const TIPOS_PAREDE = [
  { nome: "Alvenaria simples (tijolo furado)", u: 2.5 },
  { nome: "Bloco de concreto", u: 2.3 },
  { nome: "Alvenaria dupla c/ isolamento", u: 1.0 },
  { nome: "Drywall c/ lã de vidro", u: 0.8 },
  { nome: "Painel metálico isolado (PIR/EPS)", u: 0.5 },
] as const;

export const TIPOS_VIDRO = [
  { nome: "Vidro simples incolor", u: 5.7, fs: 1.0 },
  { nome: "Vidro simples verde/fumê", u: 5.7, fs: 0.72 },
  { nome: "Vidro duplo incolor", u: 2.8, fs: 0.82 },
  { nome: "Vidro duplo refletivo", u: 2.7, fs: 0.35 },
  { nome: "Vidro laminado refletivo", u: 5.6, fs: 0.45 },
] as const;

export const TIPOS_COBERTURA = [
  { nome: "Laje de concreto exposta", u: 2.3 },
  { nome: "Telha cerâmica + forro", u: 1.8 },
  { nome: "Telha metálica c/ isolamento", u: 1.5 },
  { nome: "Cobertura c/ isolamento reforçado", u: 0.6 },
] as const;

// Absortância solar (α) por cor de superfície — usada tanto nas
// paredes quanto na cobertura para o cálculo da temperatura sol-ar.
export const CORES_SUPERFICIE = [
  { nome: "Clara", alfa: 0.3 },
  { nome: "Média", alfa: 0.6 },
  { nome: "Escura", alfa: 0.9 },
] as const;

export const NIVEIS_ATIVIDADE = [
  { nome: "Sentado, repouso (cinema, teatro)", sensivel: 70, latente: 45 },
  { nome: "Trabalho leve / escritório", sensivel: 75, latente: 55 },
  { nome: "Trabalho moderado (loja, banco)", sensivel: 75, latente: 90 },
  { nome: "Atividade intensa (academia, dança)", sensivel: 90, latente: 150 },
] as const;

export type DadosParede = {
  id: number;
  orientacao: Orientacao;
  area: number; // m²
  tipoParedeIndex: number;
  corIndex: number;
  areaVidro: number; // m²
  tipoVidroIndex: number;
};

export type EntradaCargaTermica = {
  areaPiso: number;
  peDireito: number;
  tempExterna: number;
  tempInterna: number;
  urExterna: number;
  urInterna: number;

  paredes: DadosParede[];

  areaCobertura: number;
  tipoCoberturaIndex: number;
  corCoberturaIndex: number;
  coberturaExposta: boolean;

  numPessoas: number;
  atividadeIndex: number;
  potenciaIluminacao: number; // W
  potenciaEquipamentos: number; // W

  vazaoRenovacao: number; // m³/h

  fatorSeguranca: number; // %
};

export type ResultadoCargaTermica = {
  detalhamento: {
    paredes: number;
    vidrosConducao: number;
    vidrosSolar: number;
    cobertura: number;
    pessoasSensivel: number;
    pessoasLatente: number;
    iluminacao: number;
    equipamentos: number;
    ventilacaoSensivel: number;
    ventilacaoLatente: number;
  };
  sensivel: number; // W
  latente: number; // W
  total: number; // W
  fatorCalorSensivel: number;
  totalBtuH: number;
  totalTR: number;
  totalKcalH: number;
};

export function calcularCargaTermica(
  dados: EntradaCargaTermica
): ResultadoCargaTermica {
  const deltaT = dados.tempExterna - dados.tempInterna;

  const estadoExt = calcularEstado(dados.tempExterna, dados.urExterna);
  const estadoInt = calcularEstado(dados.tempInterna, dados.urInterna);

  let qParedes = 0;
  let qVidrosConducao = 0;
  let qVidrosSolar = 0;

  dados.paredes.forEach((p) => {
    const tipoParede = TIPOS_PAREDE[p.tipoParedeIndex];
    const tipoVidro = TIPOS_VIDRO[p.tipoVidroIndex];
    const corParede = CORES_SUPERFICIE[p.corIndex];
    const areaParedeLiquida = Math.max(0, p.area - p.areaVidro);
    const gsiFachada = GSI_ORIENTACAO[p.orientacao];

    // Temperatura sol-ar (ASHRAE): a parede opaca também absorve
    // radiação solar incidente na fachada, não só a esquadria de
    // vidro — por isso ela gera carga mesmo sem nenhuma área de vidro.
    const deltaTeParede = deltaT + (corParede.alfa * gsiFachada) / H0_EXTERNO;

    qParedes += tipoParede.u * areaParedeLiquida * deltaTeParede;
    qVidrosConducao += tipoVidro.u * p.areaVidro * deltaT;
    qVidrosSolar += p.areaVidro * tipoVidro.fs * gsiFachada;
  });

  const tipoCobertura = TIPOS_COBERTURA[dados.tipoCoberturaIndex];
  const corCobertura = CORES_SUPERFICIE[dados.corCoberturaIndex];
  const deltaTeCobertura = dados.coberturaExposta
    ? deltaT + (corCobertura.alfa * GSI_COBERTURA_HORIZONTAL) / H0_EXTERNO
    : deltaT;
  const qCobertura = tipoCobertura.u * dados.areaCobertura * deltaTeCobertura;

  const atividade = NIVEIS_ATIVIDADE[dados.atividadeIndex];
  const qPessoasSensivel = dados.numPessoas * atividade.sensivel;
  const qPessoasLatente = dados.numPessoas * atividade.latente;

  const qIluminacao = dados.potenciaIluminacao;
  const qEquipamentos = dados.potenciaEquipamentos;

  const mSecoVent = dados.vazaoRenovacao / estadoExt.v / 3600; // kg/s
  const qVentSensivel = mSecoVent * 1.006 * deltaT * 1000; // W
  const qVentLatente =
    mSecoVent * 2501 * (estadoExt.w - estadoInt.w) * 1000; // W

  const sensivelBruto =
    qParedes +
    qVidrosConducao +
    qVidrosSolar +
    qCobertura +
    qPessoasSensivel +
    qIluminacao +
    qEquipamentos +
    qVentSensivel;

  const latenteBruto = qPessoasLatente + qVentLatente;
  const totalBruto = sensivelBruto + latenteBruto;

  const fator = 1 + dados.fatorSeguranca / 100;

  const sensivel = sensivelBruto * fator;
  const latente = latenteBruto * fator;
  const total = totalBruto * fator;

  return {
    detalhamento: {
      paredes: qParedes * fator,
      vidrosConducao: qVidrosConducao * fator,
      vidrosSolar: qVidrosSolar * fator,
      cobertura: qCobertura * fator,
      pessoasSensivel: qPessoasSensivel * fator,
      pessoasLatente: qPessoasLatente * fator,
      iluminacao: qIluminacao * fator,
      equipamentos: qEquipamentos * fator,
      ventilacaoSensivel: qVentSensivel * fator,
      ventilacaoLatente: qVentLatente * fator,
    },
    sensivel,
    latente,
    total,
    fatorCalorSensivel: total !== 0 ? sensivel / total : 0,
    totalBtuH: total * 3.412,
    totalTR: total / 3517,
    totalKcalH: total * 0.86,
  };
}

export function fachadaPadrao(
  id: number,
  orientacao: Orientacao = "norte"
): DadosParede {
  return {
    id,
    orientacao,
    area: 0,
    tipoParedeIndex: 0,
    corIndex: 0,
    areaVidro: 0,
    tipoVidroIndex: 0,
  };
}
