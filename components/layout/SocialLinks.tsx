"use client";

import { SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "@/components/icons/SocialBrandIcons";
import { Mail, MessageCircle } from "lucide-react";

const socialItems = [
  { href: SOCIAL_LINKS.facebook, icon: FacebookIcon, label: "Facebook" },
  { href: SOCIAL_LINKS.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: SOCIAL_LINKS.whatsapp, icon: MessageCircle, label: "WhatsApp" },
  { href: SOCIAL_LINKS.email, icon: Mail, label: "Email" },
] as const;

type SocialLinksProps = {
  className?: string;
  iconClassName?: string;
  /** Vertical stack (sidebar) vs horizontal row (footer / contact). */
  orientation?: "horizontal" | "vertical";
  /** Which networks to show. Defaults to all. */
  include?: Array<(typeof socialItems)[number]["label"]>;
};

export default function SocialLinks({
  className,
  iconClassName = "h-5 w-5",
  orientation = "horizontal",
  include,
}: SocialLinksProps) {
  const items = socialItems.filter((item) => {
    if (!item.href) return false;
    if (include && !include.includes(item.label)) return false;
    return true;
  });

  return (
    <div
      className={cn(
        "flex items-center",
        orientation === "vertical" ? "flex-col gap-5" : "flex-row gap-5",
        className
      )}
    >
      {items.map(({ href, icon: Icon, label }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={label}
          title={label}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
