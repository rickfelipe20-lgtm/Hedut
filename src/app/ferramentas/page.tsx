import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ferramentas",
  description:
    "Ferramentas gratuitas de engenharia para projetos de HVAC: dimensionamento de dutos e mais.",
  alternates: {
    canonical: "/ferramentas",
  },
};

const ferramentas = [
  {
    slug: "dimensionamento-dutos",
    titulo: "Dimensionamento de Dutos",
    descricao:
      "Calcule a área, velocidade do ar e perda de carga em dutos retangulares e circulares pelo método Darcy-Weisbach.",
  },
  {
    slug: "carga-termica",
    titulo: "Cálculo de Carga Térmica",
    descricao:
      "Envoltória, ocupação, iluminação, equipamentos e ventilação — carga térmica sensível, latente e total com detalhamento por fonte.",
  },
  {
    slug: "estudo-psicrometrico",
    titulo: "Estudo Psicrométrico",
    descricao:
      "Informe duas correntes de ar (temperatura, umidade e vazão) e veja o resultado da mistura na carta psicrométrica, com todos os dados.",
  },
];

export default function FerramentasPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight">
            Ferramentas
          </h1>
          <p className="text-lg mt-4 text-hedut-abissal/80 max-w-2xl">
            Calculadoras gratuitas para agilizar o dia a dia de quem projeta
            sistemas de climatização.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-32">
          {ferramentas.map((item) => (
            <Link key={item.slug} href={`/ferramentas/${item.slug}`}>
              <div className="border border-hedut-aco/25 rounded-2xl p-6 h-full hover:border-hedut-blue/50 hover:shadow-[0_15px_30px_rgba(8,25,44,0.08)] transition">
                <h3 className="font-display font-bold text-hedut-abissal text-xl mb-3 leading-snug">
                  {item.titulo}
                </h3>
                <p className="text-hedut-abissal/70 leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </Container>
    </main>
  );
}
