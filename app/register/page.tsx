"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import {
  BIRTH_MONTHS,
  GENDERS,
  LOOKING_FOR_OPTIONS,
  SITE_NAME,
  UK_LOCATIONS,
} from "@/lib/constants";
import type { Gender, LookingFor } from "@/lib/types";
import { calculateAgeFromYearOfBirth } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [essentials, setEssentials] = useState({
    gender: "female" as Gender,
    lookingFor: "groom" as LookingFor,
    birthMonth: "6",
    yearOfBirth: String(new Date().getFullYear() - 28),
    location: "London",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const name = (nameRef.current?.value ?? "").trim();
    const email = (emailRef.current?.value ?? "").trim();
    const password = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    const year = Number(essentials.yearOfBirth);
    const age = calculateAgeFromYearOfBirth(year);
    if (!year || age < 18) {
      setError("You must be at least 18 years old");
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      password,
      profile: {
        gender: essentials.gender,
        lookingFor: essentials.lookingFor,
        birthMonth: Number(essentials.birthMonth),
        yearOfBirth: year,
        age,
        location: essentials.location,
        preferences: {
          ageMin: Math.max(18, age - 5),
          ageMax: age + 8,
          religions: [],
          locations: [essentials.location],
        },
        onboardingStatus: "basic_registered",
      },
    });
    setLoading(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-80 flex-col justify-between bg-gradient-to-br from-deepest via-[#5c1a38] to-deepest p-8 text-white lg:flex">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-gold" />
            <span className="font-display text-xl font-bold">{SITE_NAME}</span>
          </Link>
          <h2 className="mt-12 font-display text-3xl font-bold leading-tight">
            Join in under 60 seconds
          </h2>
          <p className="mt-4 text-sm text-white/70">
            Create your account with just the essentials. Browse matches immediately — complete
            your profile and verify later to unlock more features.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            <li>✓ See potential matches right away</li>
            <li>✓ Add details at your own pace</li>
            <li>✓ Verify when you&apos;re ready to connect</li>
          </ul>
        </div>
        <p className="text-xs text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-gold underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-accent/10 px-4 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-accent" />
            <span className="font-display text-lg font-bold">{SITE_NAME}</span>
          </Link>
          <Link href="/login" className="text-sm text-accent">
            Sign in
          </Link>
        </header>

        <div className="flex flex-1 items-start justify-center p-4 py-8 lg:p-8">
          <Card className="animate-scale-in w-full max-w-lg" padding="lg" style={{ animationDelay: "0.15s" }}>
            <p className="section-label">Quick Registration</p>
            <h1 className="mt-1 font-display text-2xl font-bold">Create your account</h1>
            <p className="mt-2 text-sm text-muted">
              Tell us a few basics to get started. You can add more details later.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <Input ref={nameRef} label="First Name" placeholder="Your first name" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Gender"
                  value={essentials.gender}
                  onChange={(e) =>
                    setEssentials((s) => ({ ...s, gender: e.target.value as Gender }))
                  }
                  options={GENDERS}
                />
                <Select
                  label="Looking For"
                  value={essentials.lookingFor}
                  onChange={(e) =>
                    setEssentials((s) => ({ ...s, lookingFor: e.target.value as LookingFor }))
                  }
                  options={LOOKING_FOR_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Birth Month"
                  value={essentials.birthMonth}
                  onChange={(e) =>
                    setEssentials((s) => ({ ...s, birthMonth: e.target.value }))
                  }
                  options={BIRTH_MONTHS}
                />
                <Select
                  label="Birth Year"
                  value={essentials.yearOfBirth}
                  onChange={(e) =>
                    setEssentials((s) => ({ ...s, yearOfBirth: e.target.value }))
                  }
                  options={Array.from({ length: 60 }, (_, i) => {
                    const year = new Date().getFullYear() - 18 - i;
                    return { value: String(year), label: String(year) };
                  })}
                />
              </div>
              <Select
                label="Current Location"
                value={essentials.location}
                onChange={(e) =>
                  setEssentials((s) => ({ ...s, location: e.target.value }))
                }
                options={UK_LOCATIONS.map((l) => ({ value: l, label: l }))}
              />

              <hr className="border-accent/10" />
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Account credentials
              </p>
              <Input
                ref={emailRef}
                label="Email"
                type="email"
                placeholder="you@example.com"
                required
              />
              <Input
                ref={passwordRef}
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                required
              />
              <Input
                ref={confirmPasswordRef}
                label="Confirm Password"
                type="password"
                placeholder="Repeat password"
                required
              />

              {error && <p className="feedback-error">{error}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Creating account…" : "Create Account & See Matches"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted lg:hidden">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-accent">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
