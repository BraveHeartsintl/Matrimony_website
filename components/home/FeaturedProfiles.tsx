import Badge from "@/components/ui/Badge";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import TextCTA from "@/components/ui/TextCTA";
import { MOCK_PROFILES } from "@/lib/mock/profiles";
import { MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const featured = MOCK_PROFILES.slice(0, 4);

export default function FeaturedProfiles() {
  return (
    <Section id="featured-profiles" variant="base" className="scroll-mt-20">
      <Container>
        <FadeIn>
          <SectionLabel>Discover</SectionLabel>
          <SplitHeadline primary="Featured Profiles" muted="from across the UK" />
          <p className="mt-4 text-muted">
            Verified Brit Asian members from London, Birmingham, Manchester, Leicester and beyond
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((profile, i) => (
            <FadeIn key={profile.id} delay={i * 100} direction="scale">
              <div className="group overflow-hidden rounded-[14px] glass glass-hover shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={profile.photos[0]}
                    alt={profile.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3d1228]/75 via-[#3d1228]/20 to-transparent" />
                  {profile.verified && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded glass-subtle px-2 py-1 text-xs font-medium uppercase tracking-wider text-accent">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-lg font-bold text-white">
                      {profile.name}, {profile.age}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-white/75">
                      <MapPin className="h-3.5 w-3.5" />
                      {profile.location}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted">{profile.occupation}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge>{profile.religion}</Badge>
                    <Badge variant="accent">{profile.education}</Badge>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={150}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <TextCTA href="/register">Register to View All Profiles</TextCTA>
            <p className="text-sm text-muted">
              Already a member?{" "}
              <Link href="/login" className="text-foreground transition-colors hover:text-accent">
                Log in
              </Link>
            </p>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
