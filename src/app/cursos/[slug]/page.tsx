import Container from "@/app/_components/container";
import { BuyButton } from "@/app/_components/buy-button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { arquivos, cursos, findItem } from "../data";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ItemPage(props: Params) {
  const params = await props.params;
  const item = findItem(params.slug);

  if (!item) {
    return notFound();
  }

  return (
    <main>
      <Container>
        <section className="mt-16 mb-8">
          <Link
            href="/cursos"
            className="font-mono text-sm text-hedut-blue hover:underline"
          >
            ← Voltar para a Shop
          </Link>
        </section>

        <section className="max-w-3xl mb-16">
          {item.emDesenvolvimento && (
            <div className="border-2 border-hedut-blue bg-hedut-nevoa rounded-2xl px-6 py-8 md:px-10 md:py-10 mb-8 text-center">
              <p className="font-mono text-xs tracking-[0.25em] uppercase text-hedut-blue mb-3">
                Shop · {item.modulos ? "curso" : "arquivo"}
              </p>
              <p className="font-display font-extrabold text-hedut-abissal text-4xl md:text-6xl tracking-tight mb-3">
                Em desenvolvimento
              </p>
              <p className="text-hedut-abissal/80 text-lg leading-relaxed max-w-xl mx-auto">
                {item.modulos
                  ? "Este curso ainda está sendo produzido. Em breve ele estará disponível para compra aqui na Shop."
                  : "Este arquivo ainda está sendo finalizado. Em breve ele estará disponível para compra aqui na Shop."}
              </p>
            </div>
          )}

          <div className="w-full aspect-video bg-hedut-nevoa border border-hedut-aco/25 flex items-center justify-center font-mono text-hedut-aco text-sm mb-8 rounded-2xl">
            Vídeo em breve
          </div>

          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight mb-4">
            {item.titulo}
          </h1>

          <p className="font-mono text-hedut-blue font-medium text-2xl mb-1">
            {item.valor}
          </p>

          <p className="font-mono text-hedut-abissal/60 text-sm mb-8">
            em até 6x sem juros
          </p>

          <p className="text-lg text-hedut-abissal/80 leading-relaxed mb-10">
            {item.descricao}
          </p>

          {item.modulos && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-hedut-abissal text-2xl mb-6">
                Conteúdo do Curso
              </h2>

              <div className="space-y-6">
                {item.modulos.map((modulo, i) => (
                  <div
                    key={modulo.titulo}
                    className="border border-hedut-aco/25 rounded-2xl p-6"
                  >
                    <p className="font-mono text-xs tracking-[0.2em] uppercase text-hedut-blue mb-2">
                      Módulo {i + 1}
                    </p>
                    <h3 className="font-display font-bold text-hedut-abissal text-lg mb-3">
                      {modulo.titulo}
                    </h3>
                    <ul className="space-y-1.5">
                      {modulo.topicos.map((topico) => (
                        <li
                          key={topico}
                          className="text-hedut-abissal/80 leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-hedut-aco"
                        >
                          {topico}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.emDesenvolvimento ? (
            <button
              type="button"
              disabled
              className="w-full sm:w-auto bg-hedut-aco/30 text-hedut-abissal/60 font-bold py-3 px-8 cursor-not-allowed"
            >
              Em desenvolvimento — compra indisponível
            </button>
          ) : (
            <BuyButton
              slug={item.slug}
              label={item.modulos ? "Comprar curso" : "Comprar arquivo"}
            />
          )}
        </section>
      </Container>
    </main>
  );
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const item = findItem(params.slug);

  if (!item) {
    return notFound();
  }

  return {
    title: item.titulo,
    description: item.descricao,
    alternates: {
      canonical: `/cursos/${item.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return [...cursos, ...arquivos].map((item) => ({
    slug: item.slug,
  }));
}
