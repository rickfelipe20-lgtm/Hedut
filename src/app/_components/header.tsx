"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

const Header = () => {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `pb-1 border-b-2 transition-all duration-200 ${
      pathname === path
        ? "border-hedut-blue text-hedut-blue font-semibold"
        : "border-transparent hover:border-hedut-aco"
    }`;

  return (
    <header className="w-full bg-hedut-nevoa border-b border-hedut-aco/25">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/hedut-logo-vertical.svg"
            alt="Hedut Projetos"
            width={98}
            height={112}
            className="h-28 w-auto"
            priority
          />
        </Link>

        {/* Menu CENTRAL */}
        <nav className="flex gap-10 text-base font-medium text-hedut-abissal">
          <Link href="/" className={linkStyle("/")}>
            Home
          </Link>

          <Link href="/produtos" className={linkStyle("/produtos")}>
            Projetos
          </Link>

          <Link href="/cursos" className={linkStyle("/cursos")}>
            Cursos
          </Link>
        </nav>

        {/* Ícones sociais */}
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/hedut.create"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaInstagram size={18} />
          </a>

          <a
            href="https://wa.me/5515991610562"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaWhatsapp size={18} />
          </a>

          <a
            href="https://www.linkedin.com/in/henrique-duarte-a07525156/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaLinkedinIn size={18} />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;
