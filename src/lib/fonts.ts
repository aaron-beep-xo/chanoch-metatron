import {
  Cormorant_Garamond,
  Spectral,
  Inter,
  Frank_Ruhl_Libre,
  Noto_Serif_Hebrew,
  Noto_Naskh_Arabic,
  Noto_Serif_JP,
} from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const frankRuhl = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-frank",
  display: "swap",
});

export const notoHebrew = Noto_Serif_Hebrew({
  subsets: ["hebrew"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-noto-he",
  display: "swap",
});

export const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh",
  display: "swap",
  preload: false,
});

export const notoJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-notojp",
  display: "swap",
  preload: false,
});

export const fontVariables = [
  cormorant.variable,
  spectral.variable,
  inter.variable,
  frankRuhl.variable,
  notoHebrew.variable,
  naskh.variable,
  notoJP.variable,
].join(" ");
