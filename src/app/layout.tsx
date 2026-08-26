import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Saira, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import cn from "classnames";

import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-saira",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Hedut Projetos",
    template: "%s | Hedut Projetos",
  },
  description:
    "Hedut Projetos – Engenharia, desenvolvimento de projetos e soluções técnicas com excelência.",
  openGraph: {
    title: "Hedut Projetos",
    description:
      "Engenharia e desenvolvimento de projetos com foco em qualidade, precisão e inovação.",
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={cn(
          saira.variable,
          plexSans.variable,
          plexMono.variable,
          "text-hedut-abissal dark:bg-slate-900 dark:text-slate-400"
        )}
      >
        {/* 🔹 HEADER AQUI */}
        <Header />

        <div className="min-h-screen">{children}</div>

        <Footer />
      </body>
    </html>
  );
}

