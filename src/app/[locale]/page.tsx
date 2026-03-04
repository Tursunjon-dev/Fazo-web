import { setRequestLocale } from "next-intl/server";
import dynamic from "next/dynamic";
import { HeroSection }       from "@/components/sections/HeroSection";
import { ManifestoSection }  from "@/components/sections/ManifestoSection";
import { ServicesSection }   from "@/components/sections/ServicesSection";
import { PositioningBlock }  from "@/components/sections/PositioningBlock";
import { WhyFazoSection }   from "@/components/sections/WhyFazoSection";
import { ApproachSection }   from "@/components/sections/ApproachSection";
import { TeamSection }       from "@/components/sections/TeamSection";
import { ContactSection }    from "@/components/sections/ContactSection";

const TechStackSection = dynamic(
  () => import("@/components/sections/TechStackSection").then((m) => ({ default: m.TechStackSection })),
  { loading: () => <section className="py-14" /> }
);
const ProcessSection = dynamic(
  () => import("@/components/sections/ProcessSection").then((m) => ({ default: m.ProcessSection })),
  { loading: () => <section className="py-20" /> }
);

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ManifestoSection />
      <ServicesSection />
      <PositioningBlock />
      <WhyFazoSection />
      <TechStackSection />
      <ProcessSection />
      <ApproachSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
