import { SITE_NAME, SITE_TAGLINE, SOCIAL_LINKS } from "@/lib/constants";
import { Heart, Mail, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import Container from "../ui/Container";

const socialIcons = [
  { href: SOCIAL_LINKS.email, icon: Mail, label: "Email" },
  { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: SOCIAL_LINKS.linkedin, icon: Share2, label: "LinkedIn" },
];

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
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-foreground">{SITE_NAME}</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted">{SITE_TAGLINE}.</p>
            <p className="mt-2 max-w-sm text-sm text-muted">
              Connecting Brit Asian singles across England, Scotland, Wales, and Northern
              Ireland with verified profiles, privacy controls, and dedicated support.
            </p>
            <div className="mt-6 flex gap-5 lg:hidden">
              {socialIcons.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
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
          &copy; {new Date().getFullYear()} {SITE_NAME}. The UK&apos;s Leading Brit Asian
          Matchmaking Service. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
