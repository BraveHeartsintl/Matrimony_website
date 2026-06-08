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
import {
  EDUCATION_LEVELS,
  GENDERS,
  MARITAL_STATUSES,
  RELIGIONS,
  UK_LOCATIONS,
} from "@/lib/constants";
import type { Gender, MaritalStatus } from "@/lib/types";
import { useState } from "react";

const TABS = [
  { id: "personal", label: "Personal" },
  { id: "photos", label: "Photos" },
  { id: "preferences", label: "Preferences" },
  { id: "privacy", label: "Privacy" },
];

export default function ProfilePage() {
  const { session, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [saved, setSaved] = useState(false);

  if (!session) return null;
  const { profile } = session;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">My Profile</h1>
          <p className="text-sm text-muted">Manage your profile information and privacy</p>
        </div>
        {saved && (
          <span className="rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Saved!</span>
        )}
      </div>

      <Card padding="sm">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Age"
                  type="number"
                  min={18}
                  max={80}
                  value={profile.age}
                  onChange={(e) => updateProfile({ age: Number(e.target.value) })}
                />
                <Select
                  label="Gender"
                  value={profile.gender}
                  onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
                  options={GENDERS}
                />
              </div>
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
              <Select
                label="Marital Status"
                value={profile.maritalStatus}
                onChange={(e) =>
                  updateProfile({ maritalStatus: e.target.value as MaritalStatus })
                }
                options={MARITAL_STATUSES}
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

          {activeTab === "photos" && (
            <PhotoUpload
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
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        profile.preferences.religions.includes(r)
                          ? "bg-primary text-white"
                          : "bg-border text-muted hover:bg-primary/10"
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
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        profile.preferences.locations.includes(l)
                          ? "bg-primary text-white"
                          : "bg-border text-muted hover:bg-primary/10"
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
