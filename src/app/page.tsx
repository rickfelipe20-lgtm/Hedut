import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { getAllPosts } from "@/lib/api";

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
    </main>
  );
}

