"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import Input from "@/components/ui/Input";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import SplitHeadline from "@/components/ui/SplitHeadline";
import Textarea from "@/components/ui/Textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicLayout>
      <Section variant="deepest" className="!py-24">
        <Container className="max-w-3xl text-center">
          <SectionLabel>Contact</SectionLabel>
          <SplitHeadline primary="Contact Us" muted="we'd love to hear from you" />
        </Container>
      </Section>

      <Section variant="base">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <Mail className="h-6 w-6 text-accent" />
                <h3 className="mt-2 font-semibold text-foreground">Email</h3>
                <p className="text-sm text-muted">support@ukmatrimony.co.uk</p>
              </Card>
              <Card>
                <Phone className="h-6 w-6 text-accent" />
                <h3 className="mt-2 font-semibold text-foreground">Phone</h3>
                <p className="text-sm text-muted">+44 20 7946 0958</p>
                <p className="text-xs text-muted-foreground">Mon–Fri, 9am–6pm GMT</p>
              </Card>
              <Card>
                <MapPin className="h-6 w-6 text-accent" />
                <h3 className="mt-2 font-semibold text-foreground">Office</h3>
                <p className="text-sm text-muted">
                  123 Kensington High Street
                  <br />
                  London, W8 6SH
                  <br />
                  United Kingdom
                </p>
              </Card>
            </div>

            <Card className="lg:col-span-3">
              {submitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full glass-subtle">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Message Sent!</h2>
                  <p className="mt-2 text-muted">
                    Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                  </p>
                  <Button
                    className="mt-6"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", message: "" });
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Send us a Message</h2>
                  <Input
                    label="Your Name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Textarea
                    label="Message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <Button type="submit" className="w-full sm:w-auto">
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
