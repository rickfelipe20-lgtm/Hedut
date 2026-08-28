import Container from "@/app/_components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entre em Contato",
  description:
    "Fale com a Hedut Engenharia sobre o seu projeto de ar-condicionado, automação ou água gelada.",
  alternates: {
    canonical: "/contato",
  },
};

type Props = {
  searchParams: Promise<{ servico?: string }>;
};

export default async function ContatoPage({ searchParams }: Props) {
  const params = await searchParams;
  const descricaoInicial = params.servico
    ? `Tenho interesse em: ${params.servico}.\n\n`
    : "";

  return (
    <main>
      <Container>
        <section className="mt-16 mb-8 max-w-2xl">
          <h1 className="font-display font-extrabold text-hedut-abissal text-4xl md:text-5xl tracking-tight">
            Entre em Contato
          </h1>
          <p className="text-lg mt-4 text-hedut-abissal/80">
            Preencha os dados abaixo e conte um pouco sobre o seu projeto.
            Retornamos por e-mail.
          </p>
        </section>

        <form
          action="https://formsubmit.co/hedut.projetos@hotmail.com"
          method="POST"
          className="max-w-2xl mb-32 space-y-6"
        >
          <input
            type="hidden"
            name="_subject"
            value="Novo contato pelo site Hedut"
          />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input
            type="hidden"
            name="_next"
            value="https://hedut.xyz/contato/obrigado"
          />

          <div>
            <label
              htmlFor="name"
              className="block font-mono text-sm text-hedut-abissal/70 mb-2"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full border border-hedut-aco/40 px-4 py-3 focus:outline-none focus:border-hedut-blue"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-sm text-hedut-abissal/70 mb-2"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-hedut-aco/40 px-4 py-3 focus:outline-none focus:border-hedut-blue"
            />
          </div>

          <div>
            <label
              htmlFor="empresa"
              className="block font-mono text-sm text-hedut-abissal/70 mb-2"
            >
              Empresa
            </label>
            <input
              id="empresa"
              name="empresa"
              type="text"
              className="w-full border border-hedut-aco/40 px-4 py-3 focus:outline-none focus:border-hedut-blue"
            />
          </div>

          <div>
            <label
              htmlFor="servico"
              className="block font-mono text-sm text-hedut-abissal/70 mb-2"
            >
              Descreva o serviço
            </label>
            <textarea
              id="servico"
              name="servico"
              required
              rows={6}
              defaultValue={descricaoInicial}
              className="w-full border border-hedut-aco/40 px-4 py-3 focus:outline-none focus:border-hedut-blue"
            />
          </div>

          <button
            type="submit"
            className="inline-block w-full sm:w-auto text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-10 duration-200 transition-colors"
          >
            Enviar
          </button>
        </form>
      </Container>
    </main>
  );
}
