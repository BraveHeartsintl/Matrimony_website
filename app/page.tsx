import Communities from "@/components/home/Communities";
import CTA from "@/components/home/CTA";
import FeaturedProfiles from "@/components/home/FeaturedProfiles";
import Hero from "@/components/home/Hero";
import OnboardingPhases from "@/components/home/OnboardingPhases";
import MatchStats from "@/components/home/MatchStats";
import QuickStart from "@/components/home/QuickStart";
import Testimonials from "@/components/home/Testimonials";
import TrustBadges from "@/components/home/TrustBadges";
import UKCoverage from "@/components/home/UKCoverage";
import PublicLayout from "@/components/layout/PublicLayout";

export default function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <QuickStart />
      <OnboardingPhases />
      <FeaturedProfiles />
      <MatchStats />
      <Communities />
      <UKCoverage />
      <TrustBadges />
      <Testimonials />
      <CTA />
    </PublicLayout>
  );
}
