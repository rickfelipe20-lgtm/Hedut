import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Dimensionamento de Dutos",
  description:
    "Calculadora gratuita de dimensionamento de dutos de ar retangulares e circulares pelo método Darcy-Weisbach, com perda de carga e velocidade do ar.",
  alternates: {
    canonical: "/ferramentas/dimensionamento-dutos",
  },
};

export default function DimensionamentoDutosPage() {
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
            Dimensionamento de Dutos
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Insira a vazão de ar e as dimensões do duto para calcular a
            velocidade e a perda de carga pelo método Darcy-Weisbach, com o
            fator de atrito estimado pela equação de Swamee-Jain.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
