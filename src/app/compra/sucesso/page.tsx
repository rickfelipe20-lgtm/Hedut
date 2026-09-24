import Container from "@/app/_components/container";
import { findItem } from "@/app/cursos/data";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compra Confirmada",
};

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export default async function SucessoPage({ searchParams }: Props) {
  const params = await searchParams;
  const item = params.slug ? findItem(params.slug) : undefined;

  return (
    <main>
      <Container>
        <section className="mt-16 mb-32 max-w-xl text-center mx-auto py-20">
          <h1 className="font-display font-extrabold text-hedut-abissal text-3xl md:text-4xl tracking-tight mb-4">
            Compra confirmada!
          </h1>
          <p className="text-lg text-hedut-abissal/80 mb-8">
            {item
              ? `Recebemos seu pagamento de "${item.titulo}". `
              : "Recebemos seu pagamento. "}
            O material ainda está sendo preparado — em breve você recebe por
            e-mail o vídeo e o PDF deste item.
          </p>
          <Link
            href="/cursos"
            className="inline-block bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-10 duration-200 transition-colors"
          >
            Voltar para a Shop
          </Link>
        </section>
      </Container>
    </main>
  );
}
