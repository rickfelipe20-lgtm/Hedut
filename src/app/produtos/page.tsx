import Container from "@/app/_components/container";
import type { Metadata } from "next";

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
    titulo: "Ar-Condicionado",
    descricao:
      "Projetos de sistemas de ar-condicionado dimensionados para ambientes comerciais e residenciais, com foco em eficiência energética, conforto térmico e conformidade com as normas técnicas.",
    detalhes:
      "O projeto de ar-condicionado começa pelo cálculo de carga térmica de cada ambiente, considerando ocupação, iluminação, equipamentos e orientação solar. A partir daí é feita a seleção do sistema mais adequado — Split, VRF ou self-contained — e o dimensionamento de dutos, difusores e tubulações frigorígenas. O resultado é a documentação executiva completa (plantas, cortes, memorial de cálculo e especificações) pronta para orçamento e execução em obra.",
  },
  {
    titulo: "Automação para Climatização",
    descricao:
      "Integração de sensores, controladores e sistemas de supervisão para automatizar o funcionamento dos equipamentos de climatização, reduzindo consumo de energia e permitindo monitoramento remoto.",
    detalhes:
      "A automação conecta os equipamentos de climatização a controladores e sistemas de supervisão (BMS), permitindo programar horários de funcionamento, ajustar setpoints por ambiente e monitorar o sistema remotamente. Isso reduz o consumo de energia ao evitar operação desnecessária, antecipa manutenções a partir de alarmes de falha e dá ao gestor do edifício visibilidade completa sobre o desempenho da climatização em tempo real.",
  },
  {
    titulo: "Água Gelada",
    descricao:
      "Projetos de sistemas de água gelada (chillers) para climatização de grandes edificações, contemplando dimensionamento de tubulações, casa de máquinas e integração com fan-coils.",
    detalhes:
      "Sistemas de água gelada são a solução indicada para edificações de grande porte — hospitais, shoppings, centros empresariais — onde a centralização da produção de frio em chillers reduz custo operacional em relação a soluções descentralizadas. O projeto contempla o dimensionamento da casa de máquinas, da rede de tubulações primária e secundária, das bombas de recalque e da integração com os fan-coils e unidades de tratamento de ar de cada pavimento.",
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
              <div className="w-full aspect-[4/3] bg-hedut-nevoa border border-hedut-aco/25 flex items-center justify-center font-mono text-hedut-aco text-sm mb-6">
                Imagem em breve
              </div>

              <h3 className="font-display font-bold text-hedut-abissal text-2xl mb-3 leading-snug">
                {item.titulo}
              </h3>

              <p className="text-hedut-abissal/80 leading-relaxed">
                {item.descricao}
              </p>

              <p className="text-hedut-abissal/70 leading-relaxed mt-4">
                {item.detalhes}
              </p>
            </div>
          ))}
        </section>
      </Container>
    </main>
  );
}
