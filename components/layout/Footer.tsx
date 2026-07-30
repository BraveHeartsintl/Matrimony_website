import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import Link from "next/link";
import Container from "../ui/Container";
import ShareButton from "./ShareButton";
import SiteLogo from "./SiteLogo";
import SocialLinks from "./SocialLinks";

const helpLinks = [
  { href: "/login", label: "Member Login" },
  { href: "/register", label: "Sign Up Free" },
  { href: "/search", label: "Partner Search" },
  { href: "/subscription", label: "Premium Memberships" },
  { href: "/contact", label: "Customer Support" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t glass-nav">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <SiteLogo href="/" size="md" />
            <p className="mt-3 max-w-sm text-sm text-muted">{SITE_TAGLINE}.</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Connecting UK&apos;s Indian singles across England, Scotland, Wales, and Northern
              Ireland with verified profiles, privacy controls, and dedicated support.
            </p>
            <div className="mt-6 flex items-center gap-5">
              <SocialLinks />
              <div className="lg:hidden">
                <ShareButton placement="top" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="section-label mb-4">Need Help?</h3>
            <ul className="space-y-2 text-sm text-muted">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-accent/10 pt-6 text-xs text-muted-foreground">
          <span>Trusted by Thousands</span>
          <span className="hidden sm:inline">·</span>
          <span>Verified Profiles</span>
          <span className="hidden sm:inline">·</span>
          <span>100% Privacy</span>
          <span className="hidden sm:inline">·</span>
          <span>GDPR Compliant</span>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. The UK&apos;s Leading UK&apos;s Indian
          Matchmaking Service. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
