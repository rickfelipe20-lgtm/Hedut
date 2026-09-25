import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const HEDUT_ABISSAL: [number, number, number] = [8, 25, 44];
const HEDUT_BLUE: [number, number, number] = [11, 74, 128];

export type ResultadoTrechoPDF = {
  areaM2: number;
  velocidade: number;
  diametroEquivalenteMm: number;
  reynolds: number;
  fatorAtrito: number;
  perdaTrechoReto: number;
  perdaAcessorios: number;
  perdaTotal: number;
};

export type TrechoPDF = {
  numero: number;
  tipoDuto: "circular" | "retangular";
  vazao: number;
  diametro: number;
  largura: number;
  altura: number;
  comprimento: number;
  materialNome: string;
  qtdCurvas: number;
  tipoCurvaNome: string;
  qtdReducoes: number;
  tipoReducaoNome: string;
  resultado: ResultadoTrechoPDF | null;
};

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

export function gerarMemorialPDF(
  trechos: TrechoPDF[],
  perdaTotalSistema: number
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
  doc.text(
    "Memorial de Cálculo — Dimensionamento de Dutos de Ar",
    margin + 18,
    y + 6
  );

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
  doc.text("Resumo do Sistema", margin, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...HEDUT_ABISSAL);
  doc.text(`Número de trechos: ${trechos.length}`, margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...HEDUT_BLUE);
  doc.text(
    `Perda de carga total do sistema: ${perdaTotalSistema.toFixed(1)} Pa`,
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
    "Perda de carga distribuída — Método de Darcy-Weisbach:",
    "   ΔP = f x (L / D) x (ρ x V² / 2)",
    "",
    "Fator de atrito (f) — Equação de Swamee-Jain (aproximação explícita de Colebrook-White):",
    "   f = 0,25 / [log10(ε / (3,7 x D) + 5,74 / Re^0,9)]²",
    "",
    "Número de Reynolds:",
    "   Re = (ρ x V x D) / μ",
    "",
    "Diâmetro equivalente para dutos retangulares (ASHRAE, mesma perda e vazão):",
    "   Deq = 1,30 x (a x b)^0,625 / (a + b)^0,25",
    "",
    "Perda de carga localizada (curvas e reduções):",
    "   ΔP = K x (ρ x V² / 2)",
    "",
    "Propriedades do ar consideradas: ρ = 1,204 kg/m³ e μ = 1,81x10⁻⁵ Pa.s (20°C, 1 atm).",
  ];
  fundamentos.forEach((linha) => {
    doc.text(linha, margin, y);
    y += 5;
  });
  y += 6;

  // Memória de cálculo por trecho
  trechos.forEach((t) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...HEDUT_ABISSAL);
    doc.text(`Trecho ${t.numero}`, margin, y);
    y += 6;

    const dimensao =
      t.tipoDuto === "circular"
        ? `Circular — Ø ${t.diametro} mm`
        : `Retangular — ${t.largura} x ${t.altura} mm`;

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      theme: "grid",
      styles: { fontSize: 9, textColor: HEDUT_ABISSAL },
      headStyles: { fillColor: HEDUT_ABISSAL, textColor: 255 },
      head: [["Dados de entrada", "Valor"]],
      body: [
        ["Tipo de duto", dimensao],
        ["Vazão de ar", `${t.vazao} m³/h`],
        ["Comprimento do trecho", `${t.comprimento} m`],
        ["Material", t.materialNome],
        [
          "Curvas",
          t.qtdCurvas > 0 ? `${t.qtdCurvas} x ${t.tipoCurvaNome}` : "—",
        ],
        [
          "Reduções",
          t.qtdReducoes > 0 ? `${t.qtdReducoes} x ${t.tipoReducaoNome}` : "—",
        ],
      ],
    });

    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 5;

    if (t.resultado) {
      autoTable(doc, {
        startY: y,
        margin: { left: margin, right: margin },
        theme: "grid",
        styles: { fontSize: 9, textColor: HEDUT_ABISSAL },
        headStyles: { fillColor: HEDUT_BLUE, textColor: 255 },
        head: [["Resultado do trecho", "Valor"]],
        body: [
          ["Área da seção", `${(t.resultado.areaM2 * 10000).toFixed(0)} cm²`],
          [
            "Diâmetro equivalente",
            `${t.resultado.diametroEquivalenteMm.toFixed(0)} mm`,
          ],
          ["Velocidade do ar", `${t.resultado.velocidade.toFixed(2)} m/s`],
          [
            "Número de Reynolds",
            t.resultado.reynolds.toLocaleString("pt-BR", {
              maximumFractionDigits: 0,
            }),
          ],
          ["Fator de atrito (f)", t.resultado.fatorAtrito.toFixed(4)],
          [
            "Perda no trecho reto",
            `${t.resultado.perdaTrechoReto.toFixed(1)} Pa`,
          ],
          [
            "Perda em curvas/reduções",
            `${t.resultado.perdaAcessorios.toFixed(1)} Pa`,
          ],
          ["Perda total do trecho", `${t.resultado.perdaTotal.toFixed(1)} Pa`],
        ],
      });

      y = (doc as unknown as { lastAutoTable: { finalY: number } })
        .lastAutoTable.finalY + 12;
    } else {
      y += 8;
    }
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

  doc.save("memorial-calculo-dutos-hedut.pdf");
}
