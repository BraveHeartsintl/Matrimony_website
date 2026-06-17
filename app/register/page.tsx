"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { GENDERS, MARITAL_STATUSES, RELIGIONS, SITE_NAME, UK_LOCATIONS, BODY_TYPES } from "@/lib/constants";
import type { BodyType, Gender, MaritalStatus } from "@/lib/types";
import { calculateAgeFromYearOfBirth } from "@/lib/utils";
import { Check, Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const STEPS = ["Account", "Profile", "Preferences"] as const;

type AccountData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [account, setAccount] = useState<AccountData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profile, setProfile] = useState({
    yearOfBirth: String(new Date().getFullYear() - 25),
    gender: "other" as Gender,
    location: "London",
    religion: "No Religion",
    occupation: "",
    maritalStatus: "never_married" as MaritalStatus,
    heightCm: "",
    weightKg: "",
    bodyType: "average" as BodyType,
  });
  const [preferences, setPreferences] = useState({
    ageMin: "21",
    ageMax: "35",
    religions: [] as string[],
  });

  const readAccountFields = (): AccountData => ({
    name: (nameRef.current?.value ?? account.name).trim(),
    email: (emailRef.current?.value ?? account.email).trim(),
    password: passwordRef.current?.value ?? account.password,
    confirmPassword: confirmPasswordRef.current?.value ?? account.confirmPassword,
  });

  const validateAccount = (data: AccountData): string | null => {
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      return "Please fill in all fields";
    }
    if (data.password !== data.confirmPassword) {
      return "Passwords do not match";
    }
    if (data.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const goToStep = (next: number) => {
    setError("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContinue = () => {
    setError("");

    if (step === 0) {
      const data = readAccountFields();
      const validationError = validateAccount(data);
      if (validationError) {
        setError(validationError);
        setAccount(data);
        return;
      }
      setAccount(data);
      goToStep(1);
      return;
    }

    if (step === 1) {
      const year = Number(profile.yearOfBirth);
      const age = calculateAgeFromYearOfBirth(year);
      if (!year || age < 18) {
        setError("You must be at least 18 years old");
        return;
      }
      goToStep(2);
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    setLoading(true);

    const result = await register({
      name: account.name,
      email: account.email,
      password: account.password,
      profile: {
        yearOfBirth: Number(profile.yearOfBirth),
        age: calculateAgeFromYearOfBirth(Number(profile.yearOfBirth)),
        gender: profile.gender,
        location: profile.location,
        religion: profile.religion,
        occupation: profile.occupation,
        maritalStatus: profile.maritalStatus,
        heightCm: Number(profile.heightCm) || 0,
        weightKg: Number(profile.weightKg) || 0,
        bodyType: profile.bodyType,
        preferences: {
          ageMin: Number(preferences.ageMin),
          ageMax: Number(preferences.ageMax),
          religions: preferences.religions,
          locations: [profile.location],
        },
      },
    });

    setLoading(false);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const toggleReligion = (religion: string) => {
    setPreferences((prev) => ({
      ...prev,
      religions: prev.religions.includes(religion)
        ? prev.religions.filter((r) => r !== religion)
        : [...prev.religions, religion],
    }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-2/5 flex-col justify-between glass-sidebar p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-accent" />
          <span className="font-display text-2xl font-bold text-foreground">{SITE_NAME}</span>
        </Link>

        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Start Your Journey</h1>
          <p className="mt-4 text-muted">
            Create your free account in three simple steps and join thousands of UK singles.
          </p>
          <div className="mt-10 space-y-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    i <= step ? "bg-accent text-white" : "glass-subtle text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={i <= step ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Free to join. No credit card required.</p>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center border-b border-border px-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-foreground">{SITE_NAME}</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 py-12">
          <Card className="w-full max-w-lg">
            <p className="section-label text-center">Step {step + 1} of {STEPS.length}</p>
            <h2 className="mt-2 text-center font-display text-2xl font-bold">
              {step === 0 ? "Create Your Account" : step === 1 ? "Your Profile" : "Partner Preferences"}
            </h2>
            <p className="mt-2 text-center text-sm text-muted">
              {step === 0 && "Enter your account details"}
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Set your match preferences"}
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 lg:hidden">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                      i <= step ? "bg-accent text-white" : "glass-subtle text-muted-foreground"
                    }`}
                  >
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mx-1 h-px w-6 ${i < step ? "bg-accent" : "bg-border"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              {step === 0 && (
                <div className="space-y-4">
                  <Input
                    ref={nameRef}
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    defaultValue={account.name}
                    onChange={(e) =>
                      setAccount((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    ref={emailRef}
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={account.email}
                    onChange={(e) =>
                      setAccount((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <Input
                    ref={passwordRef}
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    defaultValue={account.password}
                    onChange={(e) =>
                      setAccount((prev) => ({ ...prev, password: e.target.value }))
                    }
                  />
                  <Input
                    ref={confirmPasswordRef}
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    defaultValue={account.confirmPassword}
                    onChange={(e) =>
                      setAccount((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                  />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <Input
                    label="Year of Birth"
                    type="number"
                    min={new Date().getFullYear() - 80}
                    max={new Date().getFullYear() - 18}
                    value={profile.yearOfBirth}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, yearOfBirth: e.target.value }))
                    }
                  />
                  <Select
                    label="Gender"
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, gender: e.target.value as Gender }))
                    }
                    options={GENDERS}
                  />
                  <Select
                    label="Marital Status"
                    value={profile.maritalStatus}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        maritalStatus: e.target.value as MaritalStatus,
                      }))
                    }
                    options={MARITAL_STATUSES}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Height (cm)"
                      type="number"
                      min={120}
                      max={230}
                      placeholder="175"
                      value={profile.heightCm}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, heightCm: e.target.value }))
                      }
                    />
                    <Input
                      label="Weight (kg)"
                      type="number"
                      min={40}
                      max={200}
                      placeholder="70"
                      value={profile.weightKg}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, weightKg: e.target.value }))
                      }
                    />
                  </div>
                  <Select
                    label="Body Type"
                    value={profile.bodyType}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, bodyType: e.target.value as BodyType }))
                    }
                    options={BODY_TYPES}
                  />
                  <Select
                    label="Location"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, location: e.target.value }))
                    }
                    options={UK_LOCATIONS.map((l) => ({ value: l, label: l }))}
                  />
                  <Select
                    label="Religion"
                    value={profile.religion}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, religion: e.target.value }))
                    }
                    options={RELIGIONS.map((r) => ({ value: r, label: r }))}
                  />
                  <Input
                    label="Occupation"
                    value={profile.occupation}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, occupation: e.target.value }))
                    }
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Preferred Min Age"
                      type="number"
                      min={18}
                      value={preferences.ageMin}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, ageMin: e.target.value }))
                      }
                    />
                    <Input
                      label="Preferred Max Age"
                      type="number"
                      min={18}
                      value={preferences.ageMax}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, ageMax: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Preferred Religions</label>
                    <div className="flex flex-wrap gap-2">
                      {RELIGIONS.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => toggleReligion(r)}
                          className={`rounded px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                            preferences.religions.includes(r)
                              ? "bg-accent text-white"
                              : "glass-subtle text-muted hover:border-border-hover"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="feedback-error mt-4 rounded-[6px] px-3 py-2 text-sm font-medium"
                >
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => goToStep(step - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}

                {step < STEPS.length - 1 ? (
                  <Button type="button" onClick={handleContinue} className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleCreateAccount}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-foreground transition-colors hover:text-accent">
                Log In
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
