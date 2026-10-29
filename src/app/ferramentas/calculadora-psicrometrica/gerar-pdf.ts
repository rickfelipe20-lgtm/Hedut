import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  CASAS,
  CHAVES,
  NOMES,
  UNIDADES,
  paraDisplay,
  type Chave,
  type Estado,
  type Sistema,
} from "./psicro";

const HEDUT_ABISSAL: [number, number, number] = [8, 25, 44];
const HEDUT_BLUE: [number, number, number] = [11, 74, 128];

// Desenha o símbolo Hedut (3 formas geométricas) como vetor nativo do PDF
function desenharLogo(doc: jsPDF, x: number, y: number, alturaMm: number) {
  const escala = alturaMm / 340; // viewBox original: 220x340

  doc.setFillColor(...HEDUT_ABISSAL);
  doc.lines([[80, -52], [0, 340], [-80, -72]], x, y + 52 * escala, [
    escala,
    escala,
  ], "F", true);
  doc.lines([[80, 52], [0, 216], [-80, 72]], x + 140 * escala, y, [
    escala,
    escala,
  ], "F", true);
  doc.lines([[60, -30], [0, 40], [-60, 30]], x + 80 * escala, y + 175 * escala, [
    escala,
    escala,
  ], "F", true);
}

export type DadosPDF = {
  sistema: Sistema;
  altitude: string;
  pressao: string;
  linhas: {
    numero: number;
    ativos: Chave[];
    estado: Estado | null;
    erro: string | null;
  }[];
};

export function gerarPsicrometricaPDF(d: DadosPDF) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  desenharLogo(doc, margin, y - 6, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text("HEDUT ENGENHARIA", margin + 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Memorial de Cálculo — Calculadora Psicrométrica", margin + 18, y + 6);
  doc.setFontSize(9);
  doc.text(`Emitido em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - margin, y, {
    align: "right",
  });

  y += 16;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 9;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text("Condições de cálculo", margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const ip = d.sistema === "IP";
  doc.text(
    `Sistema de unidades: ${ip ? "IP (°F, lb, ft)" : "SI (°C, kg, m)"}   ·   Altitude: ${d.altitude} ${ip ? "ft" : "m"}   ·   Pressão barométrica: ${d.pressao} ${ip ? "psia" : "Pa"}`,
    margin,
    y
  );
  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    "Equações do ASHRAE Handbook — Fundamentals, cap. 1 (Psychrometrics); pressão de saturação de Hyland-Wexler.",
    margin,
    y
  );
  y += 7;

  const head = [
    "Linha",
    "Entradas",
    ...CHAVES.map((c) => `${NOMES[c].sigla} (${UNIDADES[d.sistema][c]})`),
  ];
  const body = d.linhas.map((l) => {
    const entradas = l.ativos.map((c) => NOMES[c].sigla).join(" + ") || "—";
    if (!l.estado) {
      return [String(l.numero), entradas, ...CHAVES.map(() => "—")];
    }
    const estado = l.estado;
    return [
      String(l.numero),
      entradas,
      ...CHAVES.map((c) =>
        paraDisplay(c, estado[c], d.sistema).toFixed(CASAS[c])
      ),
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: HEDUT_ABISSAL, halign: "center" },
    headStyles: { fillColor: HEDUT_BLUE, textColor: 255 },
    head: [head],
    body,
  });

  const alturaPagina = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140);
  doc.text(
    "HEDUT PROJETOS LTDA — ME · CNPJ 51.142.450/0001-50 · Henrique Duarte · Responsável Técnico · CREA 2623524742",
    margin,
    alturaPagina - 10
  );

  doc.save("calculadora-psicrometrica-hedut.pdf");
}
