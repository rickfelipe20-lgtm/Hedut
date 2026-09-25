import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Estudo Psicrométrico",
  description:
    "Calculadora gratuita de mistura de ar: informe a condição de duas correntes de ar (temperatura, umidade e vazão) e veja o resultado da mistura na carta psicrométrica.",
  alternates: {
    canonical: "/ferramentas/estudo-psicrometrico",
  },
};

export default function EstudoPsicrometricoPage() {
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
            Estudo Psicrométrico
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Informe as condições de duas correntes de ar (temperatura,
            umidade relativa e vazão) e veja o resultado da mistura, com
            todos os dados psicrométricos e a posição de cada ponto na carta.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
