import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Heart, Mail, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import Container from "../ui/Container";

const socialIcons = [
  { href: SOCIAL_LINKS.email, icon: Mail, label: "Email" },
  { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: SOCIAL_LINKS.linkedin, icon: Share2, label: "LinkedIn" },
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
            <p className="mt-3 max-w-sm text-sm text-muted">
              The trusted matrimony platform for UK singles seeking meaningful, lasting
              relationships. Connecting hearts across England, Scotland, Wales, and Northern
              Ireland.
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
            <h3 className="section-label mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/about" className="transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/register" className="transition-colors hover:text-foreground">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="transition-colors hover:text-foreground">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="section-label mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-foreground">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-accent/10 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
