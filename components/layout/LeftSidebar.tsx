"use client";

import { useAuth } from "@/context/AuthContext";
import { Mail, MessageCircle, Search } from "lucide-react";
import ShareButton from "./ShareButton";
import SiteLogo from "./SiteLogo";
import SocialLinks from "./SocialLinks";

export default function LeftSidebar() {
  const { session } = useAuth();

  const quickLinks = session
    ? [
        { href: "/dashboard", icon: Mail, label: "Dashboard" },
        { href: "/messages", icon: MessageCircle, label: "Messages" },
        { href: "/search", icon: Search, label: "Search" },
      ]
    : null;

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-12 flex-col items-center justify-between border-r glass-sidebar py-6 lg:flex">
      <SiteLogo href={session ? "/dashboard" : "/"} size="sm" withText={false} />

      <div className="flex flex-col items-center gap-5">
        {quickLinks ? (
          quickLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))
        ) : (
          <>
            <SocialLinks
              orientation="vertical"
              include={["Facebook", "Instagram", "WhatsApp", "Email"]}
            />
            <ShareButton placement="right" />
          </>
        )}
      </div>
    </aside>
  );
}
