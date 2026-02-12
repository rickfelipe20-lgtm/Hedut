import CoverImage from "./cover-image";

type Props = {
  title: string;
  coverImage: string;
};

export function HeroPost({
  coverImage,
}: Props) {
  return (
    <section>
      <div className="mb-12 md:mb-20">
        <CoverImage title="Projeto em destaque" src={coverImage} />
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-24 mb-24">
        <div>
          <h2 className="text-4xl lg:text-5xl font-semibold leading-tight">
            Arquitetura pensada para refletir identidade e elevar experiências
          </h2>
        </div>

        <div className="mt-6 md:mt-0 max-w-lg">
          <p className="text-lg leading-relaxed text-neutral-700">
            Cada projeto nasce de uma escuta atenta e de uma leitura sensível do espaço.
            A arquitetura é desenvolvida com atenção à proporção, luz natural e materialidade,
            criando ambientes equilibrados, funcionais e alinhados ao estilo de vida de cada cliente.
          </p>
        </div>
      </div>
    </section>
  );
}
