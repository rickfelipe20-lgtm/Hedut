import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-hedut-nevoa border-t border-hedut-aco/25">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center justify-between gap-12">
          <h3 className="font-display font-extrabold text-hedut-abissal text-3xl lg:text-[2.0rem] tracking-tighter leading-tight text-center lg:text-left lg:w-1/3">
            Vamos transformar seu espaço em algo único.
          </h3>

          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex flex-col justify-center items-center space-y-4">

 <a
  href="mailto:hedut.projetos@hotmail.com"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  Entre em contato
</a>

 <a
  href="https://www.instagram.com/hedut.create"
  target="_blank"
  rel="noopener noreferrer"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  Instagram
</a>

<a
  href="https://www.linkedin.com/in/henrique-duarte-a07525156/"
  target="_blank"
  rel="noopener noreferrer"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  LinkedIn
</a>

            </div>

            <Image
              src="/hedut-assinatura-email.svg"
              alt="Henrique Duarte — Responsável técnico · CREA 2623524742"
              width={280}
              height={69}
              className="w-full max-w-[280px] h-auto"
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
