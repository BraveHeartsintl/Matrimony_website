import { Lock, ShieldCheck, Star, Users } from "lucide-react";

const badges = [
  { icon: ShieldCheck, title: "Verified Profiles", desc: "Manual profile verification for authenticity" },
  { icon: Lock, title: "Privacy Controls", desc: "You control who sees your photos and contact info" },
  { icon: Users, title: "UK Community", desc: "Members from England, Scotland, Wales & NI" },
  { icon: Star, title: "Premium Support", desc: "Dedicated customer support for all members" },
];

export default function TrustBadges() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div key={badge.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{badge.title}</h3>
                <p className="mt-1 text-sm text-muted">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
