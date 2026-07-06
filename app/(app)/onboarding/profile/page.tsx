"use client";

import OnboardingShell from "@/components/onboarding/OnboardingShell";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { useAuth } from "@/context/AuthContext";
import {
  EDUCATION_LEVELS,
  FAMILY_TYPES,
  FAMILY_VALUES,
  FITNESS_INTERESTS,
  FOOD_PREFERENCES,
  MARITAL_STATUSES,
  MOTHER_TONGUES,
  RELIGIONS,
  SMOKING_DRINKING_OPTIONS,
  UK_COUNTRIES,
  UK_LOCATIONS,
  ANNUAL_INCOME_RANGES,
} from "@/lib/constants";
import type { MaritalStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  "Personal Details",
  "Education & Career",
  "Family Details",
  "Lifestyle",
  "Partner Preferences",
] as const;

export default function OnboardingProfilePage() {
  const { session, completeOnboardingProfile } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const profile = session?.profile;

  useEffect(() => {
    if (session && session.profile.onboardingStatus !== "basic_registered") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  const [form, setForm] = useState({
    birthDay: String(profile?.birthDay ?? 15),
    heightCm: String(profile?.heightCm || ""),
    maritalStatus: (profile?.maritalStatus ?? "never_married") as MaritalStatus,
    motherTongue: profile?.motherTongue ?? "English",
    religion: profile?.religion ?? "No Religion",
    caste: profile?.caste ?? "",
    country: profile?.country ?? "England",
    state: profile?.state ?? "",
    city: profile?.city ?? profile?.location ?? "London",
    education: profile?.education ?? "",
    college: profile?.college ?? "",
    occupation: profile?.occupation ?? "",
    company: profile?.company ?? "",
    annualIncome: profile?.annualIncome ?? "",
    fatherOccupation: profile?.matrimony.fatherOccupation ?? "",
    motherOccupation: profile?.matrimony.motherOccupation ?? "",
    familyType: profile?.matrimony.familyType ?? "Nuclear",
    familyValues: profile?.matrimony.familyValues ?? "Moderate",
    familyBackground: profile?.matrimony.familyBackground ?? "",
    diet: profile?.matrimony.diet ?? "",
    smoking: profile?.matrimony.smoking ?? "No",
    drinking: profile?.matrimony.drinking ?? "No",
    fitnessInterests: profile?.matrimony.fitnessInterests ?? ([] as string[]),
    hobbies: (profile?.matrimony.hobbies ?? []).join(", "),
    bio: profile?.bio ?? "",
    ageMin: String(profile?.preferences.ageMin ?? 21),
    ageMax: String(profile?.preferences.ageMax ?? 35),
    prefHeightMin: String(profile?.preferences.heightMinCm ?? 150),
    prefHeightMax: String(profile?.preferences.heightMaxCm ?? 190),
    prefEducation: profile?.preferences.education?.[0] ?? "",
    prefProfession: profile?.preferences.professions?.[0] ?? "",
    prefLocations: profile?.preferences.locations ?? [],
    prefReligions: profile?.preferences.religions ?? [],
    prefLifestyle: profile?.preferences.lifestyle?.[0] ?? "",
  });

  const update = (key: keyof typeof form, value: string | string[]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleChip = (key: "prefLocations" | "prefReligions" | "fitnessInterests", value: string) => {
    setForm((f) => {
      const arr = f[key] as string[];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const goToStep = (next: number) => {
    setError("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!form.heightCm || Number(form.heightCm) < 100) return "Please enter a valid height";
      if (!form.religion) return "Please select your religion";
    }
    if (step === 1) {
      if (!form.education || !form.occupation) return "Education and occupation are required";
    }
    if (step === 2) {
      if (!form.fatherOccupation || !form.motherOccupation)
        return "Please enter parent occupations";
    }
    if (step === 3) {
      if (!form.diet) return "Please select food preference";
    }
    return null;
  };

  const handleContinue = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    if (step < STEPS.length - 1) goToStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const hobbies = form.hobbies
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    try {
      await completeOnboardingProfile({
        birthDay: Number(form.birthDay),
        heightCm: Number(form.heightCm),
        maritalStatus: form.maritalStatus,
        motherTongue: form.motherTongue,
        religion: form.religion,
        caste: form.caste || undefined,
        country: form.country,
        state: form.state,
        city: form.city,
        location: form.city || profile?.location,
        education: form.education,
        college: form.college,
        occupation: form.occupation,
        company: form.company,
        annualIncome: form.annualIncome,
        bio: form.bio || `Looking for a meaningful connection.`,
        preferences: {
          ageMin: Number(form.ageMin),
          ageMax: Number(form.ageMax),
          religions: form.prefReligions,
          locations: form.prefLocations.length > 0 ? form.prefLocations : [form.city],
          heightMinCm: Number(form.prefHeightMin),
          heightMaxCm: Number(form.prefHeightMax),
          education: form.prefEducation ? [form.prefEducation] : [],
          professions: form.prefProfession ? [form.prefProfession] : [],
          lifestyle: form.prefLifestyle ? [form.prefLifestyle] : [],
        },
        matrimony: {
          fatherOccupation: form.fatherOccupation,
          motherOccupation: form.motherOccupation,
          familyType: form.familyType,
          familyValues: form.familyValues,
          familyBackground: form.familyBackground || "Family-oriented background.",
          diet: form.diet,
          smoking: form.smoking,
          drinking: form.drinking,
          fitnessInterests: form.fitnessInterests,
          hobbies,
          aboutMe: form.bio || "Looking for a meaningful connection.",
          partnerExpectations: "Seeking a compatible life partner.",
          community: form.religion,
          willingToRelocate: form.prefLocations.length > 1,
          languages: [form.motherTongue, "English"].filter(
            (v, i, a) => a.indexOf(v) === i
          ),
        },
      });
      router.push("/onboarding/verify");
    } catch {
      setError("Failed to save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  if (session.profile.onboardingStatus !== "basic_registered") {
    return null;
  }

  return (
    <OnboardingShell
      steps={STEPS}
      currentStep={step}
      title="Complete Profile"
      subtitle="Help us find your best matches"
    >
      <Card padding="lg">
        <p className="section-label">Step {step + 1}</p>
        <h1 className="mt-1 font-display text-2xl font-bold">{STEPS[step]}</h1>

        <div className="mt-8 space-y-5">
          {step === 0 && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Birth Day"
                  value={form.birthDay}
                  onChange={(e) => update("birthDay", e.target.value)}
                  options={Array.from({ length: 31 }, (_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1),
                  }))}
                />
                <Select
                  label="Birth Month"
                  value={String(profile?.birthMonth ?? 1)}
                  disabled
                  options={[{ value: String(profile?.birthMonth ?? 1), label: "From signup" }]}
                />
                <Select
                  label="Birth Year"
                  value={String(profile?.yearOfBirth ?? 1999)}
                  disabled
                  options={[{ value: String(profile?.yearOfBirth), label: String(profile?.yearOfBirth) }]}
                />
              </div>
              <Input
                label="Height (cm)"
                type="number"
                value={form.heightCm}
                onChange={(e) => update("heightCm", e.target.value)}
                placeholder="e.g. 165"
              />
              <Select
                label="Marital Status"
                value={form.maritalStatus}
                onChange={(e) => update("maritalStatus", e.target.value)}
                options={MARITAL_STATUSES}
              />
              <Select
                label="Mother Tongue"
                value={form.motherTongue}
                onChange={(e) => update("motherTongue", e.target.value)}
                options={MOTHER_TONGUES.map((t) => ({ value: t, label: t }))}
              />
              <Select
                label="Religion"
                value={form.religion}
                onChange={(e) => update("religion", e.target.value)}
                options={RELIGIONS.map((r) => ({ value: r, label: r }))}
              />
              <Input
                label="Caste (optional)"
                value={form.caste}
                onChange={(e) => update("caste", e.target.value)}
                placeholder="Optional"
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <Select
                  label="Country"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  options={UK_COUNTRIES.map((c) => ({ value: c, label: c }))}
                />
                <Input
                  label="County / Region"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  placeholder="e.g. Greater London"
                />
                <Select
                  label="City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  options={UK_LOCATIONS.map((l) => ({ value: l, label: l }))}
                />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <Select
                label="Highest Education"
                value={form.education}
                onChange={(e) => update("education", e.target.value)}
                options={EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))}
              />
              <Input
                label="College / University"
                value={form.college}
                onChange={(e) => update("college", e.target.value)}
                placeholder="Institution name"
              />
              <Input
                label="Occupation"
                value={form.occupation}
                onChange={(e) => update("occupation", e.target.value)}
                placeholder="Your profession"
              />
              <Input
                label="Company Name"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Optional"
              />
              <Select
                label="Annual Income"
                value={form.annualIncome}
                onChange={(e) => update("annualIncome", e.target.value)}
                options={[
                  { value: "", label: "Select range" },
                  ...ANNUAL_INCOME_RANGES.map((r) => ({ value: r, label: r })),
                ]}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Father's Occupation"
                value={form.fatherOccupation}
                onChange={(e) => update("fatherOccupation", e.target.value)}
              />
              <Input
                label="Mother's Occupation"
                value={form.motherOccupation}
                onChange={(e) => update("motherOccupation", e.target.value)}
              />
              <Select
                label="Family Type"
                value={form.familyType}
                onChange={(e) => update("familyType", e.target.value)}
                options={FAMILY_TYPES.map((t) => ({ value: t, label: t }))}
              />
              <Select
                label="Family Values"
                value={form.familyValues}
                onChange={(e) => update("familyValues", e.target.value)}
                options={FAMILY_VALUES.map((v) => ({ value: v, label: v }))}
              />
              <Textarea
                label="Family Background"
                value={form.familyBackground}
                onChange={(e) => update("familyBackground", e.target.value)}
                rows={3}
                placeholder="Brief family background"
              />
            </>
          )}

          {step === 3 && (
            <>
              <Select
                label="Food Preference"
                value={form.diet}
                onChange={(e) => update("diet", e.target.value)}
                options={[
                  { value: "", label: "Select" },
                  ...FOOD_PREFERENCES.map((f) => ({ value: f, label: f })),
                ]}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Smoking"
                  value={form.smoking}
                  onChange={(e) => update("smoking", e.target.value)}
                  options={SMOKING_DRINKING_OPTIONS.map((o) => ({ value: o, label: o }))}
                />
                <Select
                  label="Drinking"
                  value={form.drinking}
                  onChange={(e) => update("drinking", e.target.value)}
                  options={SMOKING_DRINKING_OPTIONS.map((o) => ({ value: o, label: o }))}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Fitness Interests</p>
                <div className="flex flex-wrap gap-2">
                  {FITNESS_INTERESTS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleChip("fitnessInterests", item)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        form.fitnessInterests.includes(item)
                          ? "bg-accent text-white"
                          : "glass-subtle text-muted"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Hobbies (comma-separated)"
                value={form.hobbies}
                onChange={(e) => update("hobbies", e.target.value)}
                placeholder="Travel, Cooking, Music"
              />
              <Textarea
                label="About Me"
                value={form.bio}
                onChange={(e) => update("bio", e.target.value)}
                rows={4}
                placeholder="Tell potential matches about yourself"
              />
            </>
          )}

          {step === 4 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Preferred Age Min"
                  type="number"
                  value={form.ageMin}
                  onChange={(e) => update("ageMin", e.target.value)}
                />
                <Input
                  label="Preferred Age Max"
                  type="number"
                  value={form.ageMax}
                  onChange={(e) => update("ageMax", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Preferred Height Min (cm)"
                  type="number"
                  value={form.prefHeightMin}
                  onChange={(e) => update("prefHeightMin", e.target.value)}
                />
                <Input
                  label="Preferred Height Max (cm)"
                  type="number"
                  value={form.prefHeightMax}
                  onChange={(e) => update("prefHeightMax", e.target.value)}
                />
              </div>
              <Select
                label="Preferred Education"
                value={form.prefEducation}
                onChange={(e) => update("prefEducation", e.target.value)}
                options={[
                  { value: "", label: "Any" },
                  ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e })),
                ]}
              />
              <Input
                label="Preferred Profession"
                value={form.prefProfession}
                onChange={(e) => update("prefProfession", e.target.value)}
                placeholder="e.g. Doctor, Engineer"
              />
              <div>
                <p className="mb-2 text-sm font-medium">Preferred Religion</p>
                <div className="flex flex-wrap gap-2">
                  {RELIGIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleChip("prefReligions", r)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        form.prefReligions.includes(r)
                          ? "bg-accent text-white"
                          : "glass-subtle text-muted"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Preferred Locations</p>
                <div className="flex flex-wrap gap-2">
                  {UK_LOCATIONS.slice(0, 8).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => toggleChip("prefLocations", l)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        form.prefLocations.includes(l)
                          ? "bg-accent text-white"
                          : "glass-subtle text-muted"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <Select
                label="Preferred Lifestyle"
                value={form.prefLifestyle}
                onChange={(e) => update("prefLifestyle", e.target.value)}
                options={[
                  { value: "", label: "Any" },
                  ...FOOD_PREFERENCES.map((f) => ({ value: f, label: f })),
                ]}
              />
            </>
          )}

          {error && <p className="feedback-error">{error}</p>}

          <div className="flex gap-3 pt-4">
            {step > 0 && (
              <Button variant="outline" onClick={() => goToStep(step - 1)}>
                Back
              </Button>
            )}
            <Button className="flex-1" onClick={handleContinue} disabled={loading}>
              {step === STEPS.length - 1
                ? loading
                  ? "Saving…"
                  : "Complete Profile"
                : "Continue"}
            </Button>
          </div>
        </div>
      </Card>
    </OnboardingShell>
  );
}
