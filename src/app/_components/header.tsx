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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3">

        {/* Logo */}
        <Link href="/" className="order-1 flex items-center">
          <Image
            src="/hedut-simbolo-abissal.svg"
            alt="Hedut Projetos"
            width={73}
            height={112}
            className="h-12 md:h-28 w-auto"
            priority
          />
        </Link>

        {/* Menu CENTRAL */}
        <nav className="order-3 md:order-2 w-full md:w-auto flex flex-wrap justify-center gap-5 md:gap-10 text-base md:text-lg font-medium text-hedut-abissal">
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
        <div className="order-2 md:order-3 flex gap-3 md:gap-4">
          <a
            href="https://www.instagram.com/hedut.create"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaInstagram className="text-[18px] md:text-[28px]" />
          </a>

          <a
            href="https://wa.me/5515991610562"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaWhatsapp className="text-[18px] md:text-[28px]" />
          </a>

          <a
            href="https://www.linkedin.com/in/henrique-duarte-a07525156/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-hedut-aco/40 text-hedut-abissal hover:bg-white hover:border-hedut-blue/40 transition"
          >
            <FaLinkedinIn className="text-[18px] md:text-[28px]" />
          </a>
        </div>

      </div>
    </header>
  );
};

export default Header;
