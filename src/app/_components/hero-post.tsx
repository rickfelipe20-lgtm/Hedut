import CoverImage from "./cover-image";
import Image from "next/image";

type Props = {
  title: string;
  coverImage: string;
};

export function HeroPost({ coverImage }: Props) {
  return (
    <section className="mb-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* LADO ESQUERDO */}
        <div>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Nossos Projetos
          </h2>

          <p className="text-lg leading-relaxed text-neutral-700 mb-8 max-w-lg">
            Materializamos seus projetos com as melhores tecnologias do mercado 
            e uma equipe altamente qualificada para criar soluções personalizadas,
            respeitando as características de cada ambiente.
          </p>

          {/* LOGOS DOS SOFTWARES */}
          <div className="flex gap-6">
            <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition">
              <Image
                src="/revit.png"
                alt="Revit"
                width={60}
                height={60}
              />
            </div>

            <div className="w-24 h-24 bg-neutral-100 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition">
              <Image
                src="/autocad.png"
                alt="AutoCAD"
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>

        {/* LADO DIREITO - IMAGEM PRINCIPAL */}
        <div className="flex justify-end">
          <div className="w-[85%]">
            <CoverImage
              title="Projeto em destaque"
              src={coverImage}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
