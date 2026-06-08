"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { GENDERS, RELIGIONS, UK_LOCATIONS } from "@/lib/constants";
import type { Gender } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEPS = ["Account", "Profile", "Preferences"];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [profile, setProfile] = useState({
    age: "25",
    gender: "other" as Gender,
    location: "London",
    religion: "No Religion",
    occupation: "",
  });
  const [preferences, setPreferences] = useState({
    ageMin: "21",
    ageMax: "35",
    religions: [] as string[],
  });

  const nextStep = () => {
    setError("");
    if (step === 0) {
      if (!account.name || !account.email || !account.password) {
        setError("Please fill in all fields");
        return;
      }
      if (account.password !== account.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (account.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const result = await register({
      name: account.name,
      email: account.email,
      password: account.password,
      profile: {
        age: Number(profile.age),
        gender: profile.gender,
        location: profile.location,
        religion: profile.religion,
        occupation: profile.occupation,
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
    <PublicLayout>
      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg">
          <h1 className="text-center font-display text-2xl font-bold">Create Your Account</h1>
          <p className="mt-2 text-center text-sm text-muted">Join UK Matrimony — it&apos;s free</p>

          {/* Step indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                    i <= step ? "bg-primary text-white" : "bg-border text-muted"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`hidden text-sm sm:inline ${i <= step ? "text-foreground" : "text-muted"}`}>
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`mx-1 h-px w-8 ${i < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            {step === 0 && (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  required
                  value={account.name}
                  onChange={(e) => setAccount({ ...account, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={account.email}
                  onChange={(e) => setAccount({ ...account, email: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  required
                  value={account.password}
                  onChange={(e) => setAccount({ ...account, password: e.target.value })}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  value={account.confirmPassword}
                  onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <Input
                  label="Age"
                  type="number"
                  min={18}
                  max={80}
                  required
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                />
                <Select
                  label="Gender"
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as Gender })}
                  options={GENDERS}
                />
                <Select
                  label="Location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  options={UK_LOCATIONS.map((l) => ({ value: l, label: l }))}
                />
                <Select
                  label="Religion"
                  value={profile.religion}
                  onChange={(e) => setProfile({ ...profile, religion: e.target.value })}
                  options={RELIGIONS.map((r) => ({ value: r, label: r }))}
                />
                <Input
                  label="Occupation"
                  value={profile.occupation}
                  onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
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
                    onChange={(e) => setPreferences({ ...preferences, ageMin: e.target.value })}
                  />
                  <Input
                    label="Preferred Max Age"
                    type="number"
                    min={18}
                    value={preferences.ageMax}
                    onChange={(e) => setPreferences({ ...preferences, ageMax: e.target.value })}
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
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          preferences.religions.includes(r)
                            ? "bg-primary text-white"
                            : "bg-border text-muted hover:bg-primary/10"
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
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-6 flex gap-3">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={nextStep} className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log In
            </Link>
          </p>
        </Card>
      </section>
    </PublicLayout>
  );
}
