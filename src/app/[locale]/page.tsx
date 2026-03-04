import { setRequestLocale } from "next-intl/server";
import { HeroSection }       from "@/components/sections/HeroSection";
import { ManifestoSection }  from "@/components/sections/ManifestoSection";
import { ServicesSection }   from "@/components/sections/ServicesSection";
import { PositioningBlock }  from "@/components/sections/PositioningBlock";
import { WhyFazoSection }   from "@/components/sections/WhyFazoSection";
import { TechStackSection }  from "@/components/sections/TechStackSection";
import { ProcessSection }    from "@/components/sections/ProcessSection";
import { ApproachSection }   from "@/components/sections/ApproachSection";
import { TeamSection }       from "@/components/sections/TeamSection";
import { ContactSection }    from "@/components/sections/ContactSection";

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
