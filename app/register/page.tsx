"use client";

import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import {
  BIRTH_MONTHS,
  GENDERS,
  LOOKING_FOR_OPTIONS,
  UK_LOCATIONS,
} from "@/lib/constants";
import type { Gender, LookingFor } from "@/lib/types";
import { calculateAgeFromYearOfBirth } from "@/lib/utils";
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
    <AuthShell
      asideTitle="Join in under 60 seconds"
      asideBody="Create your account with the essentials. Browse matches right away — complete your profile and verify when you're ready to connect."
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
        Quick registration
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-[#fff8e7]">
        Create your account
      </h2>
      <p className="mt-2 text-sm text-white/70">
        A few basics to get started. Add more details later.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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
              setEssentials((s) => ({
                ...s,
                lookingFor: e.target.value as LookingFor,
              }))
            }
            options={LOOKING_FOR_OPTIONS.map((o) => ({
              value: o.value,
              label: o.label,
            }))}
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

        <div className="border-t border-white/15 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/50">
            Account credentials
          </p>
          <div className="space-y-4">
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
          </div>
        </div>

        {error && (
          <p className="auth-feedback-error rounded-lg px-3 py-2 text-sm">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Creating account…" : "Create Account & See Matches"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-white/70">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-gold transition-colors hover:text-gold-hover"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
