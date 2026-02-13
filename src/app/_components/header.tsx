"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `pb-1 border-b-2 transition-all duration-200 ${
      pathname === path
        ? "border-black font-semibold"
        : "border-transparent hover:border-neutral-400"
    }`;

  return (
    <header className="w-full border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-center">
        <nav className="flex gap-16 text-base">
          <Link href="/projetos" className={linkStyle("/projetos")}>
            Projetos
          </Link>

          <Link href="/produtos" className={linkStyle("/produtos")}>
            Produtos
          </Link>

          <Link href="/contatos" className={linkStyle("/contatos")}>
            Contatos
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
