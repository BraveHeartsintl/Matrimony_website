import CTA from "@/components/home/CTA";
import FeaturedProfiles from "@/components/home/FeaturedProfiles";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import TrustBadges from "@/components/home/TrustBadges";
import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <HowItWorks />
      <FeaturedProfiles />
      <TrustBadges />
      <CTA />
    </PublicLayout>
  );
}
