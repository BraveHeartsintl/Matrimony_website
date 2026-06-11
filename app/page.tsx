import CTA from "@/components/home/CTA";
import FeaturedProfiles from "@/components/home/FeaturedProfiles";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import StatsBar from "@/components/home/StatsBar";
import Testimonials from "@/components/home/Testimonials";
import TrustBadges from "@/components/home/TrustBadges";
import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <FeaturedProfiles />
      <TrustBadges />
      <Testimonials />
      <CTA />
    </PublicLayout>
  );
}
