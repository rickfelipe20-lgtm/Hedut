import CoverImage from "./cover-image";
import Image from "next/image";

type Props = {
  title: string;
  coverImage: string;
};

export function HeroPost({ coverImage }: Props) {
  return (
    <section className="mb-24">
      <div className="grid md:grid-cols-2 gap-6 items-center">

        {/* LADO ESQUERDO */}
        <div>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight mb-6">
            Nossos Projetos
          </h2>

          <p className="text-lg leading-relaxed text-neutral-700 mb-10 max-w-lg">
            Materializamos seus projetos com as melhores tecnologias do mercado 
            e uma equipe altamente qualificada para criar soluções personalizadas,
            respeitando as características de cada ambiente.
          </p>

          {/* LOGOS DOS SOFTWARES */}
          <div className="flex gap-12">

            {/* Revit */}
            <div className="flex flex-col items-center">
              <div
                className="
                  w-28 h-28
                  bg-gradient-to-br from-neutral-100 to-neutral-200
                  rounded-3xl
                  flex items-center justify-center
                  border border-white/60
                  shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Image
                  src="/revit.png"
                  alt="Revit"
                  width={70}
                  height={70}
                />
              </div>

              <span className="mt-4 text-sm font-semibold text-neutral-700 tracking-wide">
                Revit 3D
              </span>
            </div>

            {/* AutoCAD */}
            <div className="flex flex-col items-center">
              <div
                className="
                  w-28 h-28
                  bg-gradient-to-br from-neutral-100 to-neutral-200
                  rounded-3xl
                  flex items-center justify-center
                  border border-white/60
                  shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <Image
                  src="/autocad.png"
                  alt="AutoCAD"
                  width={70}
                  height={70}
                />
              </div>

              <span className="mt-4 text-sm font-semibold text-neutral-700 tracking-wide">
                AutoCAD 2D
              </span>
            </div>

          </div>
        </div>

        {/* LADO DIREITO - IMAGEM PRINCIPAL */}
        <div>
          <div className="w-[95%] bg-white p-5 rounded-3xl border border-neutral-200 shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
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
