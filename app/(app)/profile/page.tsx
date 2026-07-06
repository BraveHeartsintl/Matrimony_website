"use client";

import PhotoUpload from "@/components/profile/PhotoUpload";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import { useAuth } from "@/context/AuthContext";
import { getNextOnboardingRoute } from "@/lib/onboarding/access";
import {
  BODY_TYPES,
  EDUCATION_LEVELS,
  GENDERS,
  MARITAL_STATUSES,
  RELIGIONS,
  UK_LOCATIONS,
} from "@/lib/constants";
import type { BodyType, Gender, MaritalStatus } from "@/lib/types";
import { calculateAgeFromYearOfBirth } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "physical", label: "Physical" },
  { id: "photos", label: "Photos" },
  { id: "preferences", label: "Preferences" },
  { id: "privacy", label: "Privacy" },
];

const currentYear = new Date().getFullYear();

export default function ProfilePage() {
  const { session, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [saved, setSaved] = useState(false);

  if (!session) return null;
  const { profile } = session;
  const onboardingRoute = getNextOnboardingRoute(profile.onboardingStatus);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleYearOfBirthChange = (year: number) => {
    updateProfile({
      yearOfBirth: year,
      age: calculateAgeFromYearOfBirth(year),
    });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted">Manage your profile information and privacy</p>
          {onboardingRoute === "/onboarding/profile" && (
            <Link
              href="/onboarding/profile"
              className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
            >
              Continue guided profile setup →
            </Link>
          )}
        </div>
        {saved && (
          <span className="feedback-success rounded-[6px] px-3 py-1 text-sm">Saved!</span>
        )}
      </div>

      <Card padding="sm">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Year of Birth"
                  type="number"
                  min={currentYear - 80}
                  max={currentYear - 18}
                  value={profile.yearOfBirth || ""}
                  onChange={(e) => handleYearOfBirthChange(Number(e.target.value))}
                />
                <Input
                  label="Age"
                  type="number"
                  value={profile.age}
                  disabled
                  className="bg-background text-muted"
                />
              </div>
              <Select
                label="Gender"
                value={profile.gender}
                onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                options={GENDERS}
              />
              <Select
                label="Marital Status"
                value={profile.maritalStatus}
                onChange={(e) =>
                  updateProfile({ maritalStatus: e.target.value as MaritalStatus })
                }
                options={MARITAL_STATUSES}
              />
              <Select
                label="Location"
                value={profile.location}
                onChange={(e) => updateProfile({ location: e.target.value })}
                options={UK_LOCATIONS.map((l) => ({ value: l, label: l }))}
              />
              <Select
                label="Religion"
                value={profile.religion}
                onChange={(e) => updateProfile({ religion: e.target.value })}
                options={RELIGIONS.map((r) => ({ value: r, label: r }))}
              />
              <Select
                label="Education"
                value={profile.education}
                onChange={(e) => updateProfile({ education: e.target.value })}
                options={EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))}
              />
              <Input
                label="Occupation"
                value={profile.occupation}
                onChange={(e) => updateProfile({ occupation: e.target.value })}
              />
              <Textarea
                label="About Me"
                rows={4}
                value={profile.bio}
                onChange={(e) => updateProfile({ bio: e.target.value })}
                placeholder="Tell potential matches about yourself..."
              />
            </div>
          )}

          {activeTab === "physical" && (
            <div className="space-y-4">
              <p className="text-sm text-muted">
                Share your physical details to help others find compatible matches.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Height (cm)"
                  type="number"
                  min={120}
                  max={230}
                  placeholder="e.g. 175"
                  value={profile.heightCm || ""}
                  onChange={(e) => updateProfile({ heightCm: Number(e.target.value) })}
                />
                <Input
                  label="Weight (kg)"
                  type="number"
                  min={40}
                  max={200}
                  placeholder="e.g. 70"
                  value={profile.weightKg || ""}
                  onChange={(e) => updateProfile({ weightKg: Number(e.target.value) })}
                />
              </div>
              <Select
                label="Body Type"
                value={profile.bodyType || "average"}
                onChange={(e) => updateProfile({ bodyType: e.target.value as BodyType })}
                options={BODY_TYPES}
              />
              {profile.heightCm > 0 && profile.weightKg > 0 && (
                <div className="rounded-[6px] glass-subtle px-4 py-3 text-sm text-muted">
                  <span className="font-medium text-foreground">Preview: </span>
                  {profile.heightCm} cm &middot; {profile.weightKg} kg &middot;{" "}
                  {BODY_TYPES.find((b) => b.value === profile.bodyType)?.label ?? "Average"}
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <PhotoUpload
              userId={session.user.id}
              photos={profile.photos}
              onChange={(photos) => updateProfile({ photos })}
            />
          )}

          {activeTab === "preferences" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Preferred Min Age"
                  type="number"
                  min={18}
                  value={profile.preferences.ageMin}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, ageMin: Number(e.target.value) },
                    })
                  }
                />
                <Input
                  label="Preferred Max Age"
                  type="number"
                  min={18}
                  value={profile.preferences.ageMax}
                  onChange={(e) =>
                    updateProfile({
                      preferences: { ...profile.preferences, ageMax: Number(e.target.value) },
                    })
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
                      onClick={() => {
                        const current = profile.preferences.religions;
                        const updated = current.includes(r)
                          ? current.filter((x) => x !== r)
                          : [...current, r];
                        updateProfile({
                          preferences: { ...profile.preferences, religions: updated },
                        });
                      }}
                      className={`rounded px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                        profile.preferences.religions.includes(r)
                          ? "bg-accent text-white"
                          : "glass-subtle text-muted hover:border-border-hover"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Preferred Locations</label>
                <div className="flex flex-wrap gap-2">
                  {UK_LOCATIONS.slice(0, 10).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => {
                        const current = profile.preferences.locations;
                        const updated = current.includes(l)
                          ? current.filter((x) => x !== l)
                          : [...current, l];
                        updateProfile({
                          preferences: { ...profile.preferences, locations: updated },
                        });
                      }}
                      className={`rounded px-3 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                        profile.preferences.locations.includes(l)
                          ? "bg-accent text-white"
                          : "glass-subtle text-muted hover:border-border-hover"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <Toggle
                label="Hide My Photos"
                description="Only show photos to accepted connections"
                checked={profile.privacySettings.hidePhoto}
                onChange={(checked) =>
                  updateProfile({ privacySettings: { ...profile.privacySettings, hidePhoto: checked } })
                }
              />
              <Toggle
                label="Hide Contact Information"
                description="Prevent others from seeing your email or phone"
                checked={profile.privacySettings.hideContact}
                onChange={(checked) =>
                  updateProfile({
                    privacySettings: { ...profile.privacySettings, hideContact: checked },
                  })
                }
              />
              <Toggle
                label="Hide Profile from Search"
                description="Your profile won't appear in search results"
                checked={profile.privacySettings.hideProfile}
                onChange={(checked) =>
                  updateProfile({
                    privacySettings: { ...profile.privacySettings, hideProfile: checked },
                  })
                }
              />
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
