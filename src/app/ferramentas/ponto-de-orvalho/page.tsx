import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Ponto de Orvalho (ASHRAE)",
  description:
    "Calculadora gratuita de ponto de orvalho segundo o ASHRAE Fundamentals: informe temperatura e umidade relativa (ou o inverso) e verifique o risco de condensação em tubulações, dutos e superfícies frias.",
  alternates: {
    canonical: "/ferramentas/ponto-de-orvalho",
  },
};

export default function PontoDeOrvalhoPage() {
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
            Ponto de Orvalho
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Calcule o ponto de orvalho do ar pelas equações do ASHRAE
            Fundamentals e verifique se uma superfície fria — tubulação de água
            gelada, duto, vidro — corre risco de condensação.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
