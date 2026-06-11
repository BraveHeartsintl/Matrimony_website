import { Lock, ShieldCheck, Star, Users } from "lucide-react";

const badges = [
  {
    icon: ShieldCheck,
    title: "Verified Profiles",
    desc: "Manual profile verification for authenticity",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    desc: "You control who sees your photos and contact info",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Users,
    title: "UK Community",
    desc: "Members from England, Scotland, Wales & NI",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Star,
    title: "Premium Support",
    desc: "Dedicated customer support for all members",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function TrustBadges() {
  return (
    <section className="border-t border-border bg-background px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-accent">Why Choose Us</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Built on Trust & Safety</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="card-hover rounded-2xl border border-border bg-card p-6"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge.color}`}>
                <badge.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold">{badge.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
