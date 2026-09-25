import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Cálculo de Carga Térmica",
  description:
    "Calculadora gratuita de carga térmica de ambientes: paredes, vidros por orientação, cobertura, ocupação, iluminação, equipamentos e ventilação.",
  alternates: {
    canonical: "/ferramentas/carga-termica",
  },
};

export default function CargaTermicaPage() {
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
            Cálculo de Carga Térmica
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Informe os dados do ambiente — envoltória, ocupação, iluminação,
            equipamentos e ventilação — e veja a carga térmica sensível,
            latente e total, com o detalhamento de cada fonte de ganho.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
