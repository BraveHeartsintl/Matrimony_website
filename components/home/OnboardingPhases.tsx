import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import { ONBOARDING_PHASES } from "@/lib/constants";
import { Check, Lock, ShieldCheck, UserPlus, UserRoundCheck } from "lucide-react";
import Link from "next/link";

const phaseIcons = [UserPlus, UserRoundCheck, ShieldCheck] as const;

export default function OnboardingPhases() {
  return (
    <Section variant="surface">
      <Container>
        <FadeIn>
          <SectionLabel>How It Works</SectionLabel>
          <SplitHeadline primary="Three Phases" muted="to your perfect match" />
          <p className="mt-4 max-w-2xl text-muted">
            We guide you step by step — start with a quick sign-up, build a detailed profile for
            better matches, then verify your identity to unlock full access. No lengthy forms
            upfront.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {ONBOARDING_PHASES.map((phase, i) => {
            const Icon = phaseIcons[i];
            return (
              <FadeIn key={phase.id} delay={i * 120} direction={i % 2 === 0 ? "left" : "right"}>
                <Card hover className="relative flex h-full flex-col">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[6px] glass-accent">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <span className="text-xs font-medium uppercase tracking-[0.1em] text-accent">
                        Phase {phase.id}
                      </span>
                      <h3 className="font-semibold text-foreground">{phase.label}</h3>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-accent/80">{phase.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                    {phase.description}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                        You unlock
                      </p>
                      <ul className="mt-2 space-y-2">
                        {phase.unlocks.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-muted">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {phase.locked.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                          Unlocks in later phases
                        </p>
                        <ul className="mt-2 space-y-2">
                          {phase.locked.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {phase.id === 1 && (
                    <div className="mt-6 border-t border-accent/10 pt-5">
                      <Link href={phase.route}>
                        <Button size="sm" className="w-full">
                          Start Phase 1 — Register Free
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn delay={200}>
          <div className="glass-floating mt-12 overflow-hidden rounded-[12px]">
            <div className="border-b border-accent/10 px-6 py-4">
              <p className="text-sm font-semibold text-foreground">What you get at each phase</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-accent/10 bg-surface/50">
                    <th className="px-6 py-3 font-medium text-muted">Feature</th>
                    <th className="px-4 py-3 text-center font-medium text-muted">Phase 1</th>
                    <th className="px-4 py-3 text-center font-medium text-muted">Phase 2</th>
                    <th className="px-4 py-3 text-center font-medium text-muted">Phase 3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-accent/10">
                  {[
                    ["View match suggestions", true, true, true],
                    ["AI compatibility scores", false, true, true],
                    ["Send interests", false, true, true],
                    ["View contact details", false, false, true],
                    ["Direct messaging & calls", false, false, true],
                    ["Verification badge", false, false, true],
                  ].map(([feature, p1, p2, p3]) => (
                    <tr key={feature as string}>
                      <td className="px-6 py-3 text-muted">{feature as string}</td>
                      {[p1, p2, p3].map((enabled, col) => (
                        <td key={col} className="px-4 py-3 text-center">
                          {enabled ? (
                            <Check className="mx-auto h-4 w-4 text-gold" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
