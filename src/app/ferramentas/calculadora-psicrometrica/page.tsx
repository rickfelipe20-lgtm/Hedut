import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";
import { Calculadora } from "./calculadora";

export const metadata: Metadata = {
  title: "Calculadora Psicrométrica",
  description:
    "Calculadora psicrométrica gratuita: informe quaisquer dois parâmetros (temperatura de bulbo seco, umidade relativa, ponto de orvalho, umidade absoluta, entalpia, bulbo úmido ou volume específico) e calcule os demais, em SI ou IP, com altitude e pressão barométrica.",
  alternates: {
    canonical: "/ferramentas/calculadora-psicrometrica",
  },
};

export default function CalculadoraPsicrometricaPage() {
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
            Calculadora Psicrométrica
          </h1>
          <p className="text-lg text-hedut-abissal/80 leading-relaxed">
            Informe quaisquer dois parâmetros do ar úmido — bulbo seco, umidade
            relativa, ponto de orvalho, umidade absoluta, entalpia, bulbo úmido
            ou volume específico — e veja os outros cinco calculados na hora,
            em SI ou IP, na altitude do seu projeto.
          </p>
        </section>

        <Calculadora />
      </Container>
    </main>
  );
}
