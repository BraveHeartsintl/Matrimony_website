"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
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
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold">Contact Us</h1>
          <p className="mt-4 text-lg text-white/80">
            Have a question? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <Mail className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-semibold">Email</h3>
              <p className="text-sm text-muted">support@ukmatrimony.co.uk</p>
            </Card>
            <Card>
              <Phone className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-semibold">Phone</h3>
              <p className="text-sm text-muted">+44 20 7946 0958</p>
              <p className="text-xs text-muted">Mon–Fri, 9am–6pm GMT</p>
            </Card>
            <Card>
              <MapPin className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-semibold">Office</h3>
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
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold">Message Sent!</h2>
                <p className="mt-2 text-muted">
                  Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                </p>
                <Button className="mt-6" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", message: "" }); }}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold">Send us a Message</h2>
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
      </section>
    </PublicLayout>
  );
}
