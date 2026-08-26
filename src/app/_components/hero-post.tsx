import Container from "./container";
import Image from "next/image";

type Props = {
  title: string;
  coverImage: string;
};

export function HeroPost({ coverImage }: Props) {
  return (
    <section className="w-full bg-hedut-nevoa border-y border-hedut-aco/25 py-12 md:py-20">
      <Container>
      <div className="grid md:grid-cols-2 gap-6 items-center">

        {/* LADO ESQUERDO */}
        <div>
          <h2 className="font-display font-extrabold text-hedut-abissal text-4xl lg:text-5xl leading-tight mb-6">
            Nossos Projetos
          </h2>

          <p className="text-lg leading-relaxed text-hedut-abissal/80 mb-10 max-w-lg">
            Materializamos seus projetos com as melhores tecnologias do mercado
            e uma equipe altamente qualificada para criar soluções personalizadas,
            respeitando as características de cada ambiente.
          </p>

          {/* LOGOS DOS SOFTWARES */}
          <div className="flex flex-wrap gap-6 md:gap-12">

            {/* Revit */}
            <div className="flex flex-col items-center">
              <div
                className="
                  w-28 h-28
                  bg-gradient-to-br from-white to-hedut-nevoa
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

              <span className="mt-4 text-sm font-mono font-medium text-hedut-abissal/80 tracking-wide uppercase">
                Revit 3D
              </span>
            </div>

            {/* AutoCAD */}
            <div className="flex flex-col items-center">
              <div
                className="
                  w-28 h-28
                  bg-gradient-to-br from-white to-hedut-nevoa
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

              <span className="mt-4 text-sm font-mono font-medium text-hedut-abissal/80 tracking-wide uppercase">
                AutoCAD 2D
              </span>
            </div>

            {/* HAP */}
            <div className="flex flex-col items-center">
              <div
                className="
                  w-28 h-28
                  bg-gradient-to-br from-white to-hedut-nevoa
                  rounded-3xl
                  flex items-center justify-center
                  border border-white/60
                  shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_25px_50px_rgba(0,0,0,0.12)]
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <span className="font-display font-extrabold text-hedut-blue text-2xl">
                  HAP
                </span>
              </div>

              <span className="mt-4 text-sm font-mono font-medium text-hedut-abissal/80 tracking-wide uppercase">
                Carrier HAP
              </span>
            </div>

          </div>

          {/* FABRICANTES */}
          <div className="mt-12">
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-hedut-aco">
              Equipamentos que especificamos
            </span>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              {[
                { nome: "Daikin", src: "/marcas/daikin.svg" },
                { nome: "Carrier", src: "/marcas/carrier.svg" },
                { nome: "LG", src: "/marcas/lg.svg" },
                { nome: "Hitachi", src: "/marcas/hitachi.svg" },
                { nome: "Trox", src: "/marcas/trox.svg" },
                { nome: "Samsung", src: "/marcas/samsung.svg" },
                { nome: "Trane", src: "/marcas/trane.svg" },
              ].map((marca) => (
                <div
                  key={marca.nome}
                  className="px-5 py-3 bg-white border border-hedut-aco/25 rounded-xl flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={marca.src}
                    alt={marca.nome}
                    className="h-6 w-auto max-w-[100px] object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DIREITO - IMAGEM PRINCIPAL */}
        <div>
          <div className="w-[64%] mx-auto md:mx-0">
            <div className="relative w-full aspect-[4/5] overflow-hidden bg-hedut-nevoa rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
              <Image
                src={coverImage}
                alt="Projeto em destaque"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

      </div>
      </Container>
    </section>
  );
}
