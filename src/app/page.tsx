import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";
import Image from "next/image";

export default function Page() {
  const allPosts = getAllPosts();
  const heroPost = allPosts[0];

  return (
    <main>
      <Container>
        <Intro />
      </Container>

      <HeroPost
        title={heroPost.title}
        coverImage={heroPost.coverImage}
      />

      <Image
        src="/hedut-rodape-completo-azul.svg"
        alt="Hedut Engenharia — Projetos 3D, Carga Térmica, Seleção de Equipamentos. Contato: hedut.projetos@hotmail.com · hedut.xyz"
        width={1920}
        height={520}
        className="w-full h-auto"
      />
    </main>
  );
}

