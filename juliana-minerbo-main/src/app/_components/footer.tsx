import Container from "@/app/_components/container";
import { EXAMPLE_PATH } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-3xl lg:text-[2.0rem] font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
            Vamos transformar seu espaço em algo único.
          </h3>

<div className="flex flex-col justify-center items-center lg:pl-4 lg:w-1/2 space-y-4">
  
 <a
  href="mailto:minerboarq@gmail.com"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  Entre em contato
</a>

 <a
  href="https://www.instagram.com/minerbo.arq"
  target="_blank"
  rel="noopener noreferrer"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  Instagram
</a>

<a
  href="https://www.linkedin.com/in/juliana-minerbo-2021a7282"
  target="_blank"
  rel="noopener noreferrer"
  className="w-64 text-center bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 duration-200 transition-colors"
>
  LinkedIn
</a>

</div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
