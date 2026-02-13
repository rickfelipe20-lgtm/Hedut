"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `pb-1 border-b-2 transition-all duration-200 ${
      pathname === path
        ? "border-black font-semibold"
        : "border-transparent hover:border-neutral-400"
    }`;

  return (
    <header className="w-full bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

        {/* Espaço invisível à esquerda para centralizar menu */}
        <div className="w-24" />

        {/* Menu CENTRAL */}
        <nav className="flex gap-10 text-base text-neutral-800">
          <Link href="/projetos" className={linkStyle("/projetos")}>
            Projetos
          </Link>

          <Link href="/produtos" className={linkStyle("/produtos")}>
            Produtos
          </Link>

          <Link href="/contatos" className={linkStyle("/contatos")}>
            Contato
          </Link>
        </nav>

        {/* Ícones sociais */}
        <div className="flex gap-4">
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
          >
            <FaInstagram size={14} />
          </a>

          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
          >
            <FaWhatsapp size={14} />
          </a>

          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition"
          >
            <FaLinkedinIn size={14} />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;
