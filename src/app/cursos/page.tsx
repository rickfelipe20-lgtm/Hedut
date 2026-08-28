import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cursos, arquivos, type Item } from "./data";

export const metadata: Metadata = {
  title: "Cursos e Arquivos de Climatização",
  description:
    "Cursos, templates e arquivos técnicos para quem trabalha com projetos de ar-condicionado, automação para climatização e água gelada.",
  alternates: {
    canonical: "/cursos",
  },
};

function ItemGrid({ items, botaoLabel }: { items: Item[]; botaoLabel: string }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-32">
      {items.map((item) => (
        <div key={item.slug}>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 shadow-[0_15px_30px_rgba(8,25,44,0.25)]">
            <Image
              src={item.foto}
              alt={item.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover saturate-125 brightness-105"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-hedut-blue/40 to-transparent mix-blend-overlay" />
            <div className="absolute inset-0 bg-hedut-blue/10" />
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

          <Link
            href={`/cursos/${item.slug}`}
            className="inline-block w-full text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-2.5 px-6 duration-200 transition-colors"
          >
            {botaoLabel}
          </Link>
        </div>
      ))}
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
