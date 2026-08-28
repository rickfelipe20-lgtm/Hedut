export type Modulo = {
  titulo: string;
  topicos: string[];
};

export type Item = {
  slug: string;
  titulo: string;
  valor: string;
  foto: string;
  descricao: string;
  modulos?: Modulo[];
};

export const cursos: Item[] = [
  {
    slug: "conceitos-hvac-arquitetos",
    titulo: "Conceitos de HVAC para Arquitetos",
    valor: "R$ 147",
    foto: "/assets/cursos/compass.jpg",
    descricao:
      "Curso introdutório para arquitetos e estudantes que querem entender como os sistemas de climatização impactam o projeto arquitetônico — sem precisar se tornar um engenheiro de HVAC. Você vai aprender a reconhecer as necessidades de espaço, prever pontos de conflito com a documentação executiva antes que virem retrabalho em obra, e conversar com mais autonomia com o projetista de climatização.",
    modulos: [
      {
        titulo: "Fundamentos de Climatização",
        topicos: [
          "O que é HVAC e por que ele molda decisões de projeto",
          "Vocabulário essencial para conversar com o projetista de climatização",
        ],
      },
      {
        titulo: "Tipos de Sistemas",
        topicos: [
          "Split, VRF, Self-Contained e Água Gelada: quando cada um é usado",
          "Vantagens e limitações de cada solução",
        ],
      },
      {
        titulo: "Compatibilização com a Arquitetura",
        topicos: [
          "Shafts, forros técnicos e prumadas",
          "Dimensionamento de casa de máquinas",
        ],
      },
      {
        titulo: "Erros Comuns",
        topicos: [
          "O que evitar na concepção do projeto para não gerar retrabalho",
          "Checklist de compatibilização antes de fechar o projeto arquitetônico",
        ],
      },
    ],
  },
  {
    slug: "carga-termica",
    titulo: "Carga Térmica",
    valor: "R$ 247",
    foto: "/assets/cursos/thermal.jpg",
    descricao:
      "Curso técnico sobre o cálculo de carga térmica — a base de qualquer projeto de ar-condicionado bem dimensionado. Você vai entender as variáveis que compõem o cálculo, aplicar o método na prática e interpretar os resultados para selecionar o equipamento correto, evitando super ou subdimensionamento.",
    modulos: [
      {
        titulo: "Fundamentos de Transferência de Calor",
        topicos: [
          "Condução, convecção e radiação aplicadas a edificações",
          "Ganhos de calor internos e externos",
        ],
      },
      {
        titulo: "Variáveis do Cálculo",
        topicos: [
          "Ocupação, iluminação e equipamentos",
          "Envoltória e orientação solar",
        ],
      },
      {
        titulo: "Método de Cálculo na Prática",
        topicos: [
          "Passo a passo com exemplos reais",
          "Erros comuns no levantamento de dados",
        ],
      },
      {
        titulo: "Interpretação de Resultados",
        topicos: [
          "Como usar a carga térmica para selecionar equipamentos",
          "Ajustes de segurança sem superdimensionar",
        ],
      },
    ],
  },
  {
    slug: "modelagem-hvac-revit",
    titulo: "Modelagem HVAC em Revit",
    valor: "R$ 347",
    foto: "/assets/cursos/bim.jpg",
    descricao:
      "Curso prático de modelagem de sistemas de climatização em Revit, do zero à documentação executiva. Ideal para quem já conhece o básico do Revit e quer aplicar o fluxo de trabalho MEP para HVAC — dutos, tubulações, equipamentos e compatibilização com as demais disciplinas.",
    modulos: [
      {
        titulo: "Configuração do Projeto Mecânico",
        topicos: [
          "Templates, níveis e parâmetros iniciais",
          "Organização de vistas e disciplinas",
        ],
      },
      {
        titulo: "Sistemas de Dutos e Tubulações",
        topicos: [
          "Criação e roteamento de sistemas",
          "Dimensionamento automático",
        ],
      },
      {
        titulo: "Famílias e Equipamentos",
        topicos: [
          "Difusores, fan-coils e chillers",
          "Conexões e parametrização",
        ],
      },
      {
        titulo: "Compatibilização BIM",
        topicos: [
          "Detecção de interferências entre disciplinas",
          "Resolução de conflitos no modelo",
        ],
      },
      {
        titulo: "Documentação e Quantitativos",
        topicos: [
          "Extração de plantas e cortes",
          "Listas de materiais a partir do modelo",
        ],
      },
    ],
  },
];

export const arquivos: Item[] = [
  {
    slug: "template-hvac",
    titulo: "Template - HVAC",
    valor: "R$ 97",
    foto: "/assets/cursos/documents.jpg",
    descricao:
      "Template de projeto pronto para começar um projeto de HVAC do zero: estrutura de pranchas, legendas, tabelas de simbologia e folha de rosto padronizadas. Economize as horas iniciais de configuração e comece direto pelo que importa — o dimensionamento.",
  },
  {
    slug: "planilha-ductulator-hvac",
    titulo: "Planilha Ductulator HVAC",
    valor: "R$ 127",
    foto: "/assets/cursos/ducts.jpg",
    descricao:
      "Planilha de dimensionamento de dutos (método da igual perda de carga / velocidade) pronta para uso. Insira a vazão de ar e as dimensões desejadas e obtenha automaticamente a perda de carga, velocidade e recomendações de ajuste — sem precisar abrir um Ductulator físico.",
  },
  {
    slug: "familias-revit-hvac",
    titulo: "Famílias - Revit - HVAC",
    valor: "R$ 197",
    foto: "/assets/cursos/units.jpg",
    descricao:
      "Biblioteca de famílias Revit para projetos de HVAC: difusores, grelhas, fan-coils, chillers, VRFs e conexões de duto, todas parametrizadas e prontas para inserir no seu modelo. Economize horas de modelagem manual de componentes que você usa em praticamente todo projeto.",
  },
];

export function findItem(slug: string): Item | undefined {
  return [...cursos, ...arquivos].find((item) => item.slug === slug);
}
