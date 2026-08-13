import Container from "@/app/_components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tipos de Projeto",
};

const especialidades = [
  {
    titulo: "Ar-Condicionado",
    descricao:
      "Projetos de sistemas de ar-condicionado dimensionados para ambientes comerciais e residenciais, com foco em eficiência energética, conforto térmico e conformidade com as normas técnicas.",
  },
  {
    titulo: "Automação para Climatização",
    descricao:
      "Integração de sensores, controladores e sistemas de supervisão para automatizar o funcionamento dos equipamentos de climatização, reduzindo consumo de energia e permitindo monitoramento remoto.",
  },
  {
    titulo: "Água Gelada",
    descricao:
      "Projetos de sistemas de água gelada (chillers) para climatização de grandes edificações, contemplando dimensionamento de tubulações, casa de máquinas e integração com fan-coils.",
  },
];

export default function ProdutosPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tipos de Projeto
          </h1>
          <p className="text-lg mt-4 text-neutral-600 max-w-2xl">
            Somos especialistas em três frentes de climatização: ar-condicionado,
            automação e água gelada. Conheça cada uma delas abaixo.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-16 mb-32">
          {especialidades.map((item) => (
            <div key={item.titulo}>
              <div className="w-full aspect-[4/3] bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 text-sm mb-6">
                Imagem em breve
              </div>

              <h3 className="text-2xl font-semibold mb-3 leading-snug">
                {item.titulo}
              </h3>

              <p className="text-neutral-700 leading-relaxed">
                {item.descricao}
              </p>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
