import Container from "@/app/_components/container";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projetos de Ar-Condicionado, Automação e Água Gelada",
  description:
    "Projetos de ar-condicionado, automação para climatização e água gelada (chillers) para obras comerciais e residenciais. Dimensionamento técnico completo, do cálculo de carga térmica à documentação executiva.",
  alternates: {
    canonical: "/produtos",
  },
};

const especialidades = [
  {
    titulo: "Projetos de HVAC",
    foto: "/assets/produtos/hvac.jpg",
    descricao:
      "Projeto técnico de ar-condicionado em 2D e 3D, do cálculo de carga térmica à seleção do sistema — Split, VRF ou self-contained. Documentação executiva completa (plantas, cortes e memorial de cálculo) pronta para obra.",
  },
  {
    titulo: "Projetos de Automação",
    foto: "/assets/produtos/automacao.jpg",
    descricao:
      "Projeto 2D e 3D de automação para climatização: integração de sensores, controladores e supervisão (BMS) para reduzir consumo de energia e permitir monitoramento remoto do sistema.",
  },
  {
    titulo: "Projetos de Água Gelada (CAG)",
    foto: "/assets/produtos/agua-gelada.jpg",
    descricao:
      "Projeto técnico em 2D e 3D de sistemas de água gelada (chillers) para grandes edificações — dimensionamento da casa de máquinas, tubulações e integração com fan-coils.",
  },
];

export default function ProdutosPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight">
            Tipos de Projeto
          </h1>
          <p className="text-lg mt-4 text-hedut-abissal/80 max-w-2xl">
            Somos especialistas em três frentes de climatização: ar-condicionado,
            automação e água gelada. Conheça cada uma delas abaixo.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-32">
          {especialidades.map((item) => (
            <div key={item.titulo}>
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 shadow-[0_15px_30px_rgba(8,25,44,0.2)]">
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

              <h3 className="font-display font-bold text-hedut-abissal text-2xl mb-3 leading-snug">
                {item.titulo}
              </h3>

              <p className="text-hedut-abissal/80 leading-relaxed">
                {item.descricao}
              </p>

              <Link
                href={`/contato?servico=${encodeURIComponent(item.titulo)}`}
                className="inline-block w-full text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-2.5 px-6 duration-200 transition-colors mt-6"
              >
                Entre em contato
              </Link>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
