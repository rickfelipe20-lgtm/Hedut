import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { EstadoAr, ResultadoMistura } from "./psicrometria";

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

function linhasEstado(estado: EstadoAr, vazao: number): [string, string][] {
  return [
    ["Vazão de ar", `${vazao.toFixed(0)} m³/h`],
    ["Temperatura de bulbo seco", `${estado.tdb.toFixed(1)} °C`],
    ["Umidade relativa", `${estado.rh.toFixed(0)} %`],
    ["Temperatura de bulbo úmido", `${estado.twb.toFixed(1)} °C`],
    ["Ponto de orvalho", `${estado.tdp.toFixed(1)} °C`],
    ["Umidade absoluta", `${(estado.w * 1000).toFixed(2)} g/kg`],
    ["Entalpia", `${estado.h.toFixed(1)} kJ/kg`],
    ["Volume específico", `${estado.v.toFixed(3)} m³/kg`],
  ];
}

export function gerarMemorialPsicrometricoPDF(
  ar1: EstadoAr,
  vazao1: number,
  ar2: EstadoAr,
  vazao2: number,
  mistura: ResultadoMistura
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let y = 20;

  // Cabeçalho
  desenharLogo(doc, margin, y - 6, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text("HEDUT ENGENHARIA", margin + 18, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Memorial de Cálculo — Estudo Psicrométrico", margin + 18, y + 6);

  doc.setFontSize(9);
  doc.text(`Emitido em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth - margin, y, {
    align: "right",
  });

  y += 16;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Resumo
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text("Resumo da Mistura", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text(
    `Vazão total: ${mistura.vazaoTotal.toFixed(0)} m³/h (Ar 1: ${vazao1.toFixed(0)} m³/h + Ar 2: ${vazao2.toFixed(0)} m³/h)`,
    margin,
    y
  );
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEDUT_BLUE);
  doc.text(
    `Ar misturado: ${mistura.tdb.toFixed(1)} °C, ${mistura.rh.toFixed(0)}% UR, ${(mistura.w * 1000).toFixed(2)} g/kg, ${mistura.h.toFixed(1)} kJ/kg`,
    margin,
    y
  );
  y += 12;

  // Fundamentos do cálculo
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Fundamentos do Cálculo", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const fundamentos = [
    "Pressão de saturação do vapor d'água — aproximação de Magnus-Tetens:",
    "   Psat = 611,2 x exp[17,62 x T / (243,12 + T)]",
    "",
    "Umidade absoluta:",
    "   w = 0,622 x Pv / (Patm - Pv), com Pv = (UR / 100) x Psat",
    "",
    "Entalpia específica do ar úmido:",
    "   h = 1,006 x T + w x (2501 + 1,86 x T)",
    "",
    "Volume específico:",
    "   v = 287,055 x (T + 273,15) x (1 + 1,6078 x w) / Patm",
    "",
    "Ponto de orvalho — inversa de Magnus-Tetens a partir de Pv.",
    "Temperatura de bulbo úmido — relação psicrométrica da ASHRAE,",
    "resolvida iterativamente (bisseção).",
    "",
    "Mistura adiabática de duas correntes, ponderada pela vazão mássica",
    "de ar seco (m = vazão volumétrica / volume específico):",
    "   w_mix = (m1 x w1 + m2 x w2) / (m1 + m2)",
    "   h_mix = (m1 x h1 + m2 x h2) / (m1 + m2)",
    "   T_mix = (h_mix - 2501 x w_mix) / (1,006 + 1,86 x w_mix)",
    "",
    "Pressão atmosférica padrão considerada: 101.325 Pa (nível do mar).",
  ];
  fundamentos.forEach((linha) => {
    doc.text(linha, margin, y);
    y += 5;
  });
  y += 6;

  // Tabelas por corrente de ar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text("Dados Psicrométricos", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: HEDUT_ABISSAL },
    headStyles: { fillColor: HEDUT_BLUE, textColor: 255 },
    head: [["Ar 1", "Valor"]],
    body: linhasEstado(ar1, vazao1),
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY + 8;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: HEDUT_ABISSAL },
    headStyles: { fillColor: [194, 65, 12], textColor: 255 },
    head: [["Ar 2", "Valor"]],
    body: linhasEstado(ar2, vazao2),
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY + 8;

  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    theme: "grid",
    styles: { fontSize: 9, textColor: HEDUT_ABISSAL },
    headStyles: { fillColor: [21, 128, 61], textColor: 255 },
    head: [["Ar Misturado", "Valor"]],
    body: linhasEstado(mistura, mistura.vazaoTotal),
  });

  // Rodapé em todas as páginas
  const totalPaginas = doc.getNumberOfPages();
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i);
    const alturaPagina = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(140);
    doc.text(
      "HEDUT PROJETOS LTDA — ME · CNPJ 51.142.450/0001-50 · Henrique Duarte · Responsável Técnico · CREA 2623524742",
      margin,
      alturaPagina - 10
    );
    doc.text(`Página ${i} de ${totalPaginas}`, pageWidth - margin, alturaPagina - 10, {
      align: "right",
    });
  }

  doc.save("memorial-estudo-psicrometrico-hedut.pdf");
}
