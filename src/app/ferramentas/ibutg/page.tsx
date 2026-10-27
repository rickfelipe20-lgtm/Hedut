import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Cálculo de IBUTG (NR-15)",
  description:
    "Calculadora gratuita de IBUTG para projeto: estime o índice de bulbo úmido termômetro de globo a partir do ar, das superfícies e do ciclo de trabalho, e compare com o limite da NR-15 Anexo 3 e o nível de ação da NR-9.",
  alternates: {
    canonical: "/ferramentas/ibutg",
  },
};

export default function IbutgPage() {
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
            Cálculo de IBUTG
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Estimativa do IBUTG a partir da carga térmica e do sistema
            dimensionado — precisão técnica antes da obra. Informe o ciclo de
            trabalho, o ar no posto e as superfícies em volta do trabalhador e
            veja o enquadramento na NR-15 Anexo 3.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
