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
  const isInterior = title.includes("Learn"); // primeira imagem
  return (
    <div className="mb-20">
      <div className="mb-6">
        <CoverImage title={title} src={coverImage} />
      </div>

      {isInterior ? (
        <>
          <h3 className="text-2xl font-semibold mb-4 leading-snug">
            Projeto — Áreas Internas
          </h3>

          <p className="text-neutral-700 leading-relaxed max-w-md">
            Ambientes internos integrados com living e cozinha em conceito aberto,
            valorizando pé-direito duplo, iluminação natural abundante e materiais neutros.
            A composição explora texturas suaves, madeira clara e paleta atemporal,
            criando fluidez espacial, conforto e sofisticação contemporânea.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-4 leading-snug">
            Projeto — Áreas Externas
          </h3>

          <p className="text-neutral-700 leading-relaxed max-w-md">
            Área gourmet integrada ao jardim com forte conexão entre interior e exterior.
            A proposta valoriza ventilação cruzada, iluminação natural e integração com a paisagem,
            promovendo convivência, funcionalidade e elegância em um espaço pensado
            para receber e relaxar.
          </p>
        </>
      )}
    </div>
  );
}
