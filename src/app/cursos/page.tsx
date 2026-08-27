import Container from "@/app/_components/container";
import type { Metadata } from "next";
import type { ReactElement } from "react";

export const metadata: Metadata = {
  title: "Cursos e Arquivos de Climatização",
  description:
    "Cursos, templates e arquivos técnicos para quem trabalha com projetos de ar-condicionado, automação para climatização e água gelada.",
  alternates: {
    canonical: "/cursos",
  },
};

type IconName = "compass" | "thermometer" | "cube" | "document" | "grid" | "layers";

type Item = {
  titulo: string;
  valor: string;
  link: string;
  icone: IconName;
};

const cursos: Item[] = [
  {
    titulo: "Conceitos de HVAC para Arquitetos",
    valor: "R$ 147",
    link: "#",
    icone: "compass",
  },
  {
    titulo: "Carga Térmica",
    valor: "R$ 247",
    link: "#",
    icone: "thermometer",
  },
  {
    titulo: "Modelagem HVAC em Revit",
    valor: "R$ 347",
    link: "#",
    icone: "cube",
  },
];

const arquivos: Item[] = [
  { titulo: "Template - HVAC", valor: "R$ 97", link: "#", icone: "document" },
  {
    titulo: "Planilha Ductulator HVAC",
    valor: "R$ 127",
    link: "#",
    icone: "grid",
  },
  {
    titulo: "Famílias - Revit - HVAC",
    valor: "R$ 197",
    link: "#",
    icone: "layers",
  },
];

const iconProps = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icones: Record<IconName, (props: { className?: string }) => ReactElement> = {
  compass: ({ className }) => (
    <svg {...iconProps} className={className}>
      <circle cx="24" cy="10" r="3" />
      <line x1="24" y1="13" x2="14" y2="38" />
      <line x1="24" y1="13" x2="34" y2="38" />
      <line x1="12" y1="40" x2="18" y2="36" />
      <line x1="30" y1="36" x2="36" y2="40" />
    </svg>
  ),
  thermometer: ({ className }) => (
    <svg {...iconProps} className={className}>
      <rect x="21" y="8" width="6" height="22" rx="3" />
      <circle cx="24" cy="34" r="7" />
      <line x1="30" y1="14" x2="33" y2="14" />
      <line x1="30" y1="19" x2="33" y2="19" />
      <line x1="30" y1="24" x2="33" y2="24" />
    </svg>
  ),
  cube: ({ className }) => (
    <svg {...iconProps} className={className}>
      <path d="M24 6 L38 14 L24 22 L10 14 Z" />
      <path d="M10 14 L24 22 L24 38 L10 30 Z" />
      <path d="M38 14 L24 22 L24 38 L38 30 Z" />
    </svg>
  ),
  document: ({ className }) => (
    <svg {...iconProps} className={className}>
      <path d="M14 6 H28 L34 12 V42 H14 Z" />
      <path d="M28 6 V12 H34" />
      <line x1="18" y1="20" x2="30" y2="20" />
      <line x1="18" y1="26" x2="30" y2="26" />
      <line x1="18" y1="32" x2="26" y2="32" />
    </svg>
  ),
  grid: ({ className }) => (
    <svg {...iconProps} className={className}>
      <rect x="8" y="10" width="32" height="28" rx="1" />
      <line x1="8" y1="18" x2="40" y2="18" />
      <line x1="8" y1="26" x2="40" y2="26" />
      <line x1="8" y1="34" x2="40" y2="34" />
      <line x1="18" y1="10" x2="18" y2="38" />
      <line x1="29" y1="10" x2="29" y2="38" />
    </svg>
  ),
  layers: ({ className }) => (
    <svg {...iconProps} className={className}>
      <path d="M24 8 L40 16 L24 24 L8 16 Z" />
      <path d="M8 24 L24 32 L40 24" />
      <path d="M8 32 L24 40 L40 32" />
    </svg>
  ),
};

function ItemGrid({ items, botaoLabel }: { items: Item[]; botaoLabel: string }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-32">
      {items.map((item, i) => {
        const Icone = icones[item.icone];
        return (
          <div key={i}>
            <div className="w-full aspect-video bg-hedut-nevoa border border-hedut-aco/25 flex items-center justify-center mb-4">
              <Icone className="w-14 h-14 text-hedut-blue" />
            </div>

            <h3 className="font-display font-bold text-hedut-abissal text-xl mb-2 leading-snug">
              {item.titulo}
            </h3>

            <p className="font-mono text-hedut-blue font-medium text-xl mb-1">
              {item.valor}
            </p>

            <p className="font-mono text-hedut-abissal/60 text-sm mb-4">
              em até 6x sem juros
            </p>

            <a
              href={item.link}
              className="inline-block w-full text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-2.5 px-6 duration-200 transition-colors"
            >
              {botaoLabel}
            </a>
          </div>
        );
      })}
    </section>
  );
}

export default function CursosPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight">
            Cursos
          </h1>
          <p className="text-lg mt-4 text-hedut-abissal/80 max-w-2xl">
            Cursos e treinamentos disponíveis para quem deseja se especializar em
            projetos de climatização.
          </p>
        </section>

        <ItemGrid items={cursos} botaoLabel="Acessar curso" />

        <section className="mb-8">
          <h2 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight">
            Arquivos
          </h2>
          <p className="text-lg mt-4 text-hedut-abissal/80 max-w-2xl">
            Arquivos e templates prontos para agilizar o desenvolvimento dos
            seus projetos de climatização.
          </p>
        </section>

        <ItemGrid items={arquivos} botaoLabel="Acessar arquivo" />
      </Container>
    </main>
  );
}
