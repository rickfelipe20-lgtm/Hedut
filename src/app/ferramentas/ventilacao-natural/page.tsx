import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Ventilação Natural (ASHRAE)",
  description:
    "Calculadora gratuita de ventilação natural pelo método do ASHRAE: estime a vazão de ar por vento e efeito chaminé a partir das aberturas, ou dimensione a área das aberturas para uma vazão necessária.",
  alternates: {
    canonical: "/ferramentas/ventilacao-natural",
  },
};

export default function VentilacaoNaturalPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <Link
            href="/ferramentas"
            className="font-mono text-sm text-hedut-blue hover:underline"
          >
            ← Voltar para Ferramentas
          </Link>
        </section>

        <section className="mb-10 max-w-3xl">
          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight mb-4">
            Ventilação Natural
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Estime quanto ar uma janela renova por vento e por diferença de
            temperatura (efeito chaminé), ou descubra a área de abertura
            necessária para atingir uma vazão — pelo método do ASHRAE
            Fundamentals.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
