"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaFacebookF } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-md transition-all duration-300 ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-neutral-700 hover:bg-blue-500 hover:text-white"
    }`;

  return (
    <header className="w-full bg-blue-100 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-700">
          Hedut
        </Link>

        {/* Menu */}
        <nav className="flex gap-6 text-base font-medium">
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

        {/* Redes Sociais */}
        <div className="flex gap-3">
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-700 transition"
          >
            <FaInstagram size={14} />
          </a>

          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-700 transition"
          >
            <FaFacebookF size={14} />
          </a>

          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-700 transition"
          >
            <FaLinkedinIn size={14} />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;

