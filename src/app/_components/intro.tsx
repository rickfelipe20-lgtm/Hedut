import Image from "next/image";

export function Intro() {
  return (
    <section className="mt-16 mb-16 flex items-center justify-between">
      
      <div>
        <h1 className="text-5xl md:text-5xl font-bold tracking-tight">
          Hedut Projetos
        </h1>

        <h4 className="text-lg mt-4 text-neutral-600 max-w-xl">
          Onde a visão técnica garante a viabilidade do projeto
        </h4>
      </div>

      <div className="hidden md:flex flex-col items-center">
        <Image
          src="/images/perfil.jpg"
          alt="Henrique Duarte"
          width={160}
          height={160}
          className="rounded-full object-cover shadow-sm"
        />

        <div className="mt-4 text-center">
          <p className="font-semibold text-lg">
            Eng. Henrique Duarte
          </p>
          <p className="text-sm text-neutral-500">
            CREA 2623524742
          </p>
        </div>
      </div>

    </section>
  );
}
