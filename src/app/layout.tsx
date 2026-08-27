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
  metadataBase: new URL("https://hedut.xyz"),
  title: {
    default: "Hedut Projetos",
    template: "%s | Hedut Projetos",
  },
  description:
    "Hedut Engenharia — projetos executivos de HVAC: ar-condicionado, automação para climatização, água gelada e modelagem MEP/BIM. Do cálculo de carga térmica ao detalhamento pronto para execução.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hedut Projetos",
    description:
      "Projetos executivos de HVAC — ar-condicionado, automação para climatização, água gelada e modelagem MEP/BIM. Do cálculo de carga térmica ao detalhamento executivo.",
    images: [
      {
        url: HOME_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Hedut Engenharia — projetos de climatização",
      },
    ],
  },
  verification: {
    google: "x2sNPBgHEc1wXAXDxqKTtC9PctoKP1uXwHLwtf8IK3g",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Hedut Projetos",
  description:
    "Projetos executivos de HVAC: ar-condicionado, automação para climatização, água gelada e modelagem MEP/BIM.",
  url: "https://hedut.xyz",
  email: "hedut.projetos@hotmail.com",
  areaServed: "BR",
  founder: {
    "@type": "Person",
    name: "Henrique Duarte",
  },
  sameAs: [
    "https://www.instagram.com/hedut.create",
    "https://www.linkedin.com/in/henrique-duarte-a07525156/",
  ],
  makesOffer: [
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Projeto de Ar-Condicionado",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Automação para Climatização",
      },
    },
    {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Projeto de Água Gelada",
      },
    },
  ],
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
          "font-sans text-hedut-abissal dark:bg-slate-900 dark:text-slate-400"
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* 🔹 HEADER AQUI */}
        <Header />

        <div className="min-h-screen">{children}</div>

        <Footer />
      </body>
    </html>
  );
}

