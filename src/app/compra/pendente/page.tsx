import Container from "@/app/_components/container";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pagamento Pendente",
};

export default function PendentePage() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-32 max-w-xl text-center mx-auto py-20">
          <h1 className="font-display font-extrabold text-hedut-abissal text-3xl md:text-4xl tracking-tight mb-4">
            Pagamento em processamento
          </h1>
          <p className="text-lg text-hedut-abissal/80 mb-8">
            Seu pagamento está sendo processado (comum em boleto e alguns
            métodos de pix/débito). Assim que for aprovado, você recebe a
            confirmação por e-mail.
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
