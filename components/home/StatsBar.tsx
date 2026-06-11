import { Heart, MessageCircle, ShieldCheck, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Active Members" },
  { icon: Heart, value: "5K+", label: "Success Stories" },
  { icon: ShieldCheck, value: "98%", label: "Verified Profiles" },
  { icon: MessageCircle, value: "1M+", label: "Messages Sent" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
