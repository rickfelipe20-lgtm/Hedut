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

const ACCENT = "#3FA9F5";
const SHADE = "#061420";

function CardBg({ uid }: { uid: string }): ReactElement {
  return (
    <>
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0B4A80" />
          <stop offset="1" stopColor="#08192C" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="30%" cy="22%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" rx="16" fill={`url(#grad-${uid})`} />
      <rect x="0" y="0" width="320" height="180" rx="16" fill={`url(#glow-${uid})`} />
    </>
  );
}

const icones: Record<IconName, (props: { className?: string }) => ReactElement> = {
  compass: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="compass" />
      <circle cx="160" cy="40" r="7" fill="#FFFFFF" />
      <line x1="160" y1="47" x2="136" y2="138" stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" />
      <line x1="160" y1="47" x2="184" y2="138" stroke={ACCENT} strokeWidth="11" strokeLinecap="round" />
      <line x1="147" y1="93" x2="173" y2="93" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
      <line x1="128" y1="146" x2="140" y2="137" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
      <line x1="180" y1="137" x2="192" y2="146" stroke={ACCENT} strokeWidth="9" strokeLinecap="round" />
    </svg>
  ),
  thermometer: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="thermo" />
      <rect x="148" y="32" width="24" height="82" rx="12" fill="#FFFFFF" />
      <circle cx="160" cy="132" r="24" fill={ACCENT} />
      <circle cx="152" cy="122" r="6" fill="#FFFFFF" fillOpacity="0.55" />
      <line x1="178" y1="50" x2="190" y2="50" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <line x1="178" y1="64" x2="192" y2="64" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <line x1="178" y1="78" x2="190" y2="78" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      <line x1="196" y1="34" x2="206" y2="26" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
      <line x1="208" y1="42" x2="218" y2="36" stroke={ACCENT} strokeWidth="6" strokeLinecap="round" />
    </svg>
  ),
  cube: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="cube" />
      <path d="M160 40 L208 66 L160 92 L112 66 Z" fill="#FFFFFF" />
      <path d="M112 66 L160 92 L160 144 L112 118 Z" fill={ACCENT} />
      <path d="M208 66 L160 92 L160 144 L208 118 Z" fill={SHADE} />
      <line x1="128" y1="70" x2="152" y2="83" stroke={SHADE} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="192" y1="70" x2="168" y2="83" stroke={SHADE} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  document: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="document" />
      <rect x="147" y="50" width="64" height="90" rx="4" fill="#FFFFFF" fillOpacity="0.35" />
      <path d="M123 28 H179 L197 46 V140 H123 Z" fill="#FFFFFF" />
      <path d="M179 28 L179 46 L197 46 Z" fill={ACCENT} />
      <rect x="135" y="66" width="10" height="10" fill={SHADE} />
      <line x1="153" y1="71" x2="185" y2="71" stroke={SHADE} strokeWidth="5" strokeLinecap="round" />
      <rect x="135" y="88" width="10" height="10" fill={SHADE} />
      <line x1="153" y1="93" x2="185" y2="93" stroke={SHADE} strokeWidth="5" strokeLinecap="round" />
      <rect x="135" y="110" width="10" height="10" fill={SHADE} />
      <line x1="153" y1="115" x2="173" y2="115" stroke={SHADE} strokeWidth="5" strokeLinecap="round" />
    </svg>
  ),
  grid: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="grid" />
      <rect x="100" y="34" width="120" height="112" rx="6" fill="#FFFFFF" />
      <line x1="140" y1="34" x2="140" y2="146" stroke={SHADE} strokeWidth="3" strokeOpacity="0.6" />
      <line x1="180" y1="34" x2="180" y2="146" stroke={SHADE} strokeWidth="3" strokeOpacity="0.6" />
      <line x1="100" y1="64" x2="220" y2="64" stroke={SHADE} strokeWidth="3" strokeOpacity="0.6" />
      <line x1="100" y1="94" x2="220" y2="94" stroke={SHADE} strokeWidth="3" strokeOpacity="0.6" />
      <line x1="100" y1="124" x2="220" y2="124" stroke={SHADE} strokeWidth="3" strokeOpacity="0.6" />
      <rect x="141" y="65" width="38" height="28" fill={ACCENT} />
    </svg>
  ),
  layers: ({ className }) => (
    <svg viewBox="0 0 320 180" className={className}>
      <CardBg uid="layers" />
      <path d="M160 96 L214 120 L160 144 L106 120 Z" fill={SHADE} />
      <path d="M160 66 L214 90 L160 114 L106 90 Z" fill={ACCENT} />
      <path d="M160 36 L214 60 L160 84 L106 60 Z" fill="#FFFFFF" />
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
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 shadow-[0_15px_30px_rgba(8,25,44,0.25)]">
              <Icone className="w-full h-full block" />
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
