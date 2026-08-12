import CoverImage from "./cover-image";

type Props = {
  title: string;
  coverImage: string;
  slug: string;
};

export function PostPreview({
  title,
  coverImage,
}: Props) {
  const isDucts = title.includes("Learn"); // primeira imagem
  return (
    <div className="mb-20">
      <div className="mb-6">
        <CoverImage title={title} src={coverImage} />
      </div>

      {isDucts ? (
        <>
          <h3 className="text-2xl font-semibold mb-4 leading-snug">
            Execução — Rede de Dutos
          </h3>

          <p className="text-neutral-700 leading-relaxed max-w-md">
            Fabricação e instalação de dutos metálicos para climatização, com acabamento
            em chapa galvanizada, reforços estruturais e conexões de precisão.
            A montagem segue rigorosos padrões dimensionais, garantindo vedação,
            eficiência no fluxo de ar e durabilidade da instalação.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-4 leading-snug">
            Projeto — Modelagem MEP/BIM
          </h3>

          <p className="text-neutral-700 leading-relaxed max-w-md">
            Modelagem tridimensional integrada dos sistemas de climatização, elétrica
            e hidráulica em plataforma BIM. O detalhamento antecipa interferências entre
            disciplinas, otimiza trajetos de dutos e tubulações e assegura precisão
            na execução da obra.
          </p>
        </>
      )}
    </div>
  );
}
