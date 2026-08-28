import Container from "@/app/_components/container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mensagem Enviada",
  alternates: {
    canonical: "/contato/obrigado",
  },
};

export default function ObrigadoPage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-32 max-w-xl text-center mx-auto py-20">
          <h1 className="font-display font-extrabold text-hedut-abissal text-3xl md:text-4xl tracking-tight mb-4">
            Mensagem enviada!
          </h1>
          <p className="text-lg text-hedut-abissal/80 mb-8">
            Obrigado pelo contato. Vamos analisar o que você descreveu e
            responder por e-mail em breve.
          </p>
          <Link
            href="/"
            className="inline-block bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-10 duration-200 transition-colors"
          >
            Voltar para o site
          </Link>
        </section>
      </Container>
    </main>
  );
}
