import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUI, getMalchus } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { AmbientVideo } from "@/components/motion/AmbientVideo";
import { MEDIA } from "@/lib/media";
import { MalchusCircuit } from "@/components/features/MalchusCircuit";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const ui = await getUI(locale);
  return {
    title: ui.circuit.title,
    description: ui.circuit.intro,
    alternates: { canonical: `/${locale}/circuit` },
  };
}

export default async function CircuitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const l = locale as Locale;
  const [ui, facets] = await Promise.all([getUI(l), getMalchus(l)]);

  return (
    <div className="page circuit-page">
      <AmbientVideo
        className="veil-page"
        src={MEDIA.circuit.video}
        poster={MEDIA.circuit.poster}
        still={MEDIA.veil.circuit}
      />
      <header className="page-head shell">
        <Reveal as="p" className="eyebrow">{ui.circuit.eyebrow}</Reveal>
        <Reveal as="h1" className="page-title" delay={60}>{ui.circuit.title}</Reveal>
        <Reveal as="p" className="page-lede measure-wide" delay={110}>{ui.circuit.intro}</Reveal>
      </header>
      <div className="shell">
        <MalchusCircuit facets={facets} ui={ui} />
      </div>
    </div>
  );
}
