import Image from "next/image";

export function Intro() {
  return (
    <section className="mt-16 mb-16 flex items-center justify-between">
      
      <div>
        <h1 className="text-5xl md:text-5xl font-bold tracking-tight">
          Juliana Minerbo.
        </h1>

        <h4 className="text-lg mt-4 text-neutral-600 max-w-xl">
          Interiores autorais, sofisticados e cuidadosamente planejados.
        </h4>
      </div>

      <div className="hidden md:block">
        <Image
          src="/images/perfil.jpg"
          alt="Juliana Minerbo"
          width={160}
          height={160}
          className="rounded-full object-cover shadow-sm"
        />
      </div>

    </section>
  );
}

