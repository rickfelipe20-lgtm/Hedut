import Image from "next/image";

export function Intro() {
  return (
    <section className="mt-16 mb-16 flex items-center justify-between">
      
      <div>
        <h1 className="font-display font-extrabold text-hedut-abissal text-5xl md:text-5xl tracking-tight">
          Hedut Projetos
        </h1>

        <h4 className="font-display font-medium text-hedut-blue text-lg mt-4 max-w-xl">
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
          <p className="font-display font-bold text-hedut-abissal text-lg">
            Eng. Henrique Duarte
          </p>
          <p className="font-mono text-sm text-hedut-aco">
            CREA 2623524742
          </p>
        </div>
      </div>

    </section>
  );
}
