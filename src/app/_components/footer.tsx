import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-hedut-nevoa border-t border-hedut-aco/25">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="font-display font-extrabold text-hedut-abissal text-3xl lg:text-[2.0rem] tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Vamos transformar seu espaço em algo único.
          </h3>

<div className="flex flex-col justify-center items-center lg:pl-4 lg:w-1/2 space-y-4">
  
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
        </div>

        <div className="pb-16 flex justify-center lg:justify-end">
          <div className="flex flex-col items-center">
            <Image
              src="/images/perfil.jpg"
              alt="Henrique Duarte"
              width={160}
              height={160}
              className="rounded-full object-cover shadow-sm"
            />

            <div className="mt-4 text-center">
              <p className="font-display font-bold text-hedut-abissal text-lg">
                Eng. Henrique Duarte
              </p>
              <p className="font-mono text-sm text-hedut-aco">
                CREA 2623524742
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
