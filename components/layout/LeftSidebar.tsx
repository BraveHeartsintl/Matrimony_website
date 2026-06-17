import { SITE_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Mail, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

const socialIcons = [
  { href: SOCIAL_LINKS.email, icon: Mail, label: "Email" },
  { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: SOCIAL_LINKS.linkedin, icon: Share2, label: "LinkedIn" },
];

export default function LeftSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-12 flex-col items-center justify-between border-r glass-sidebar py-8 lg:flex">
      <Link
        href="/"
        className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        {SITE_NAME}
      </Link>

      <div className="flex flex-col items-center gap-5">
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
    </aside>
  );
}
