import Image from "next/image";

export function Intro() {
  return (
    <section className="w-full">
      <Image
        src="/hedut-banner-servicos.svg"
        alt="Hedut Engenharia — Projeto executivo completo de HVAC: Projetos 3D, Carga Térmica, Seleção de Equipamentos"
        width={1920}
        height={640}
        className="w-full h-auto"
        priority
      />
    </section>
  );
}
