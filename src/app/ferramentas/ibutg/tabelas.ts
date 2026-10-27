// Gerado a partir da planilha 777 - IBUTG.xlsx (abas Tabelas NR-15 e Biblioteca).
// Fonte: NR-15 Anexo 3 (Portaria SEPRT 1.359/2019), Quadros 1 e 2.

// Quadro 1 — [taxa metabólica M (W), IBUTG máximo (°C)]
export const QUADRO_1: ReadonlyArray<readonly [number, number]> = [
  [100, 33.7], [102, 33.6], [104, 33.5], [106, 33.4], [108, 33.3], [110, 33.2],
  [112, 33.1], [115, 33.0], [117, 32.9], [119, 32.8], [122, 32.7], [124, 32.6],
  [127, 32.5], [129, 32.4], [132, 32.3], [135, 32.2], [137, 32.1], [140, 32.0],
  [143, 31.9], [146, 31.8], [149, 31.7], [152, 31.6], [155, 31.5], [158, 31.4],
  [161, 31.3], [165, 31.2], [168, 31.1], [171, 31.0], [175, 30.9], [178, 30.8],
  [182, 30.7], [186, 30.6], [189, 30.5], [193, 30.4], [197, 30.3], [201, 30.2],
  [205, 30.1], [209, 30.0], [214, 29.9], [218, 29.8], [222, 29.7], [227, 29.6],
  [231, 29.5], [236, 29.4], [241, 29.3], [246, 29.2], [251, 29.1], [256, 29.0],
  [261, 28.9], [266, 28.8], [272, 28.7], [277, 28.6], [283, 28.5], [289, 28.4],
  [294, 28.3], [300, 28.2], [306, 28.1], [313, 28.0], [319, 27.9], [325, 27.8],
  [332, 27.7], [339, 27.6], [346, 27.5], [353, 27.4], [360, 27.3], [367, 27.2],
  [374, 27.1], [382, 27.0], [390, 26.9], [398, 26.8], [406, 26.7], [414, 26.6],
  [422, 26.5], [431, 26.4], [440, 26.3], [448, 26.2], [458, 26.1], [467, 26.0],
  [476, 25.9], [486, 25.8], [496, 25.7], [506, 25.6], [516, 25.5], [526, 25.4],
  [537, 25.3], [548, 25.2], [559, 25.1], [570, 25.0], [582, 24.9], [594, 24.8],
  [606, 24.7],
];

// Quadro 2 — taxa metabólica (W) por tipo de atividade
export const QUADRO_2: ReadonlyArray<{ nome: string; m: number }> = [
  { nome: "Sentado – Em repouso", m: 100 },
  { nome: "Sentado – Trabalho leve com as mãos", m: 126 },
  { nome: "Sentado – Trabalho moderado com as mãos", m: 153 },
  { nome: "Sentado – Trabalho pesado com as mãos", m: 171 },
  { nome: "Sentado – Trabalho leve com um braço", m: 162 },
  { nome: "Sentado – Trabalho moderado com um braço", m: 198 },
  { nome: "Sentado – Trabalho pesado com um braço", m: 234 },
  { nome: "Sentado – Trabalho leve com dois braços", m: 216 },
  { nome: "Sentado – Trabalho moderado com dois braços", m: 252 },
  { nome: "Sentado – Trabalho pesado com dois braços", m: 288 },
  { nome: "Sentado – Trabalho leve com braços e pernas", m: 324 },
  { nome: "Sentado – Trabalho moderado com braços e pernas", m: 441 },
  { nome: "Sentado – Trabalho pesado com braços e pernas", m: 603 },
  { nome: "Em pé/agachado – Em repouso", m: 126 },
  { nome: "Em pé/agachado – Trabalho leve com as mãos", m: 153 },
  { nome: "Em pé/agachado – Trabalho moderado com as mãos", m: 180 },
  { nome: "Em pé/agachado – Trabalho pesado com as mãos", m: 198 },
  { nome: "Em pé/agachado – Trabalho leve com um braço", m: 189 },
  { nome: "Em pé/agachado – Trabalho moderado com um braço", m: 225 },
  { nome: "Em pé/agachado – Trabalho pesado com um braço", m: 261 },
  { nome: "Em pé/agachado – Trabalho leve com dois braços", m: 243 },
  { nome: "Em pé/agachado – Trabalho moderado com dois braços", m: 279 },
  { nome: "Em pé/agachado – Trabalho pesado com dois braços", m: 315 },
  { nome: "Em pé/agachado – Trabalho leve com o corpo", m: 351 },
  { nome: "Em pé/agachado – Trabalho moderado com o corpo", m: 468 },
  { nome: "Em pé/agachado – Trabalho pesado com o corpo", m: 630 },
  { nome: "Andando no plano sem carga – 2 km/h", m: 198 },
  { nome: "Andando no plano sem carga – 3 km/h", m: 252 },
  { nome: "Andando no plano sem carga – 4 km/h", m: 297 },
  { nome: "Andando no plano sem carga – 5 km/h", m: 360 },
  { nome: "Andando no plano com carga – 10 kg, 4 km/h", m: 333 },
  { nome: "Andando no plano com carga – 30 kg, 4 km/h", m: 450 },
  { nome: "Correndo no plano – 9 km/h", m: 787 },
  { nome: "Correndo no plano – 12 km/h", m: 873 },
  { nome: "Correndo no plano – 15 km/h", m: 990 },
  { nome: "Subindo rampa sem carga – 5°, 4 km/h", m: 324 },
  { nome: "Subindo rampa sem carga – 15°, 3 km/h", m: 378 },
  { nome: "Subindo rampa sem carga – 25°, 3 km/h", m: 540 },
  { nome: "Subindo rampa com 20 kg – 15°, 4 km/h", m: 486 },
  { nome: "Subindo rampa com 20 kg – 25°, 4 km/h", m: 738 },
  { nome: "Descendo rampa sem carga (5 km/h) – 5°", m: 243 },
  { nome: "Descendo rampa sem carga (5 km/h) – 15°", m: 252 },
  { nome: "Descendo rampa sem carga (5 km/h) – 25°", m: 324 },
  { nome: "Subindo escada (80 degraus/min) – sem carga", m: 522 },
  { nome: "Subindo escada (80 degraus/min) – com 20 kg", m: 648 },
  { nome: "Descendo escada (80 degraus/min) – sem carga", m: 279 },
  { nome: "Descendo escada (80 degraus/min) – com 20 kg", m: 400 },
  { nome: "Trabalho moderado de braços (ex.: varrer, almoxarifado)", m: 320 },
  { nome: "Trabalho moderado de levantar ou empurrar", m: 349 },
  { nome: "Empurrar carrinho de mão com carga, no plano", m: 391 },
  { nome: "Carregar pesos / movimentos vigorosos com os braços (ex.: foice)", m: 495 },
  { nome: "Trabalho pesado de levantar, empurrar ou arrastar pesos (ex.: pá, valas)", m: 524 },
];

export type TipoSuperficie = "Cobertura" | "Parede" | "Piso" | "Equipamento";

// Biblioteca de superfícies e equipamentos — valores típicos de referência
export const BIBLIOTECA: ReadonlyArray<{
  nome: string;
  tipo: TipoSuperficie;
  u: number | null; // W/m²K
  alfa: number | null; // absortância solar
  tsiTipica: number | null; // °C
  radSolar: number | null; // W/m²
  obs: string;
}> = [
  { nome: "Cobertura · Telha metálica sem isolamento – cor clara", tipo: "Cobertura", u: 5.8, alfa: 0.3, tsiTipica: null, radSolar: 900, obs: "Aço galvanizado novo ou pintado de branco" },
  { nome: "Cobertura · Telha metálica sem isolamento – cor média", tipo: "Cobertura", u: 5.8, alfa: 0.5, tsiTipica: null, radSolar: 900, obs: "Galvanizado envelhecido, cinza" },
  { nome: "Cobertura · Telha metálica sem isolamento – escura/oxidada", tipo: "Cobertura", u: 5.8, alfa: 0.8, tsiTipica: null, radSolar: 900, obs: "Oxidada, pintura escura" },
  { nome: "Cobertura · Telha termoacústica (sanduíche 30 mm)", tipo: "Cobertura", u: 0.95, alfa: 0.3, tsiTipica: null, radSolar: 900, obs: "EPS/PIR 30 mm" },
  { nome: "Cobertura · Telha termoacústica (sanduíche 50 mm)", tipo: "Cobertura", u: 0.6, alfa: 0.3, tsiTipica: null, radSolar: 900, obs: "EPS/PIR 50 mm" },
  { nome: "Cobertura · Telha de fibrocimento", tipo: "Cobertura", u: 4.6, alfa: 0.65, tsiTipica: null, radSolar: 900, obs: "Sem forro" },
  { nome: "Cobertura · Telha cerâmica", tipo: "Cobertura", u: 4.5, alfa: 0.75, tsiTipica: null, radSolar: 900, obs: "Sem forro (NBR 15220-3)" },
  { nome: "Cobertura · Telha metálica + forro (ático ventilado)", tipo: "Cobertura", u: 2, alfa: 0.5, tsiTipica: null, radSolar: 900, obs: "Forro de PVC/gesso sob a telha" },
  { nome: "Cobertura · Laje de concreto impermeabilizada", tipo: "Cobertura", u: 3.7, alfa: 0.7, tsiTipica: null, radSolar: 900, obs: "Laje 10–12 cm" },
  { nome: "Cobertura · Laje de concreto com isolamento térmico", tipo: "Cobertura", u: 0.9, alfa: 0.7, tsiTipica: null, radSolar: 900, obs: "Laje + isolante" },
  { nome: "Parede · Bloco de concreto 14 cm – cor clara", tipo: "Parede", u: 2.8, alfa: 0.3, tsiTipica: null, radSolar: 300, obs: "Rebocada e pintada" },
  { nome: "Parede · Bloco de concreto 14 cm – cor escura", tipo: "Parede", u: 2.8, alfa: 0.7, tsiTipica: null, radSolar: 300, obs: "Concreto aparente / cor escura" },
  { nome: "Parede · Alvenaria de bloco cerâmico – cor clara", tipo: "Parede", u: 2.4, alfa: 0.3, tsiTipica: null, radSolar: 300, obs: "Tijolo 6/8 furos rebocado" },
  { nome: "Parede · Alvenaria de bloco cerâmico – cor média", tipo: "Parede", u: 2.4, alfa: 0.5, tsiTipica: null, radSolar: 300, obs: "" },
  { nome: "Parede · Fechamento em telha metálica – cor clara", tipo: "Parede", u: 5.8, alfa: 0.3, tsiTipica: null, radSolar: 300, obs: "Fechamento lateral de galpão" },
  { nome: "Parede · Fechamento em telha metálica – cor média", tipo: "Parede", u: 5.8, alfa: 0.5, tsiTipica: null, radSolar: 300, obs: "" },
  { nome: "Parede · Painel sanduíche isolado", tipo: "Parede", u: 0.6, alfa: 0.3, tsiTipica: null, radSolar: 300, obs: "Câmaras, salas limpas" },
  { nome: "Parede · Parede interna / divisória (sem sol)", tipo: "Parede", u: null, alfa: null, tsiTipica: null, radSolar: null, obs: "Mesma temperatura do ar" },
  { nome: "Piso · Piso de concreto sobre o solo", tipo: "Piso", u: null, alfa: null, tsiTipica: null, radSolar: null, obs: "Mesma temperatura do ar (se souber, informe a tsi)" },
  { nome: "Equipamento · Forno industrial – carcaça isolada", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 60, radSolar: null, obs: "Superfície externa típica" },
  { nome: "Equipamento · Forno / estufa sem isolamento", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 150, radSolar: null, obs: "" },
  { nome: "Equipamento · Estufa de secagem / pintura – carcaça", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 80, radSolar: null, obs: "" },
  { nome: "Equipamento · Caldeira – costado isolado", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 50, radSolar: null, obs: "" },
  { nome: "Equipamento · Tubulação de vapor isolada", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 45, radSolar: null, obs: "Área = perímetro × comprimento" },
  { nome: "Equipamento · Tubulação de vapor sem isolamento", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 150, radSolar: null, obs: "Vapor ~5 bar" },
  { nome: "Equipamento · Prensa de vulcanização / molde aquecido", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 150, radSolar: null, obs: "Indústria de pneus e borracha" },
  { nome: "Equipamento · Misturador interno (Banbury) – carcaça", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 70, radSolar: null, obs: "Indústria de borracha" },
  { nome: "Equipamento · Extrusora / injetora – cilindro aquecido", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 180, radSolar: null, obs: "Plásticos e borracha" },
  { nome: "Equipamento · Motor elétrico grande / compressor", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 60, radSolar: null, obs: "" },
  { nome: "Equipamento · Transformador / painel elétrico", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 45, radSolar: null, obs: "" },
  { nome: "Equipamento · Banho de metal fundido (alumínio)", tipo: "Equipamento", u: null, alfa: null, tsiTipica: 700, radSolar: null, obs: "Fundição – prefira 'Informar tr'" },
  { nome: "Outro – informar a temperatura (tsi)", tipo: "Equipamento", u: null, alfa: null, tsiTipica: null, radSolar: null, obs: "Preencha a coluna 'tsi conhecida'" },
];
