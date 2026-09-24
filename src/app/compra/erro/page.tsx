import Container from "@/app/_components/container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento Não Concluído",
};

export default function ErroPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-32 max-w-xl text-center mx-auto py-20">
          <h1 className="font-display font-extrabold text-hedut-abissal text-3xl md:text-4xl tracking-tight mb-4">
            O pagamento não foi concluído
          </h1>
          <p className="text-lg text-hedut-abissal/80 mb-8">
            Algo deu errado ou o pagamento foi cancelado. Nenhum valor foi
            cobrado. Você pode tentar novamente quando quiser.
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
