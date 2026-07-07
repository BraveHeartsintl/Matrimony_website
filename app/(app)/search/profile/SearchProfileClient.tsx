"use client";

import ProfileDetailView from "@/components/profile/ProfileDetailView";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getPublicSearchProfile } from "@/lib/firebase/services/search.service";
import type { FullProfile } from "@/lib/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchProfileClient() {
  const searchParams = useSearchParams();
  const profileId = searchParams.get("id");
  const interestId = searchParams.get("interest");
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      setError("No profile specified");
      return;
    }

    void (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getPublicSearchProfile(profileId);
        if (!data) {
          setError("Profile not found");
          setProfile(null);
        } else {
          setProfile({
            ...data,
            matrimony: {
              aboutMe: data.bio,
              partnerExpectations: "",
              familyBackground: "",
              fatherOccupation: "",
              motherOccupation: "",
              siblings: "",
              diet: "",
              smoking: "",
              drinking: "",
              languages: [],
              community: data.religion,
              willingToRelocate: false,
              hobbies: [],
              memberSince: new Date().toISOString(),
              lastActive: new Date().toISOString(),
              ...data.matrimony,
            },
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <Card className="mx-auto max-w-lg py-12 text-center">
        <p className="text-lg font-medium">{error || "Profile not found"}</p>
        <Link href="/search" className="mt-4 inline-block">
          <Button variant="outline">Back to Search</Button>
        </Link>
      </Card>
    );
  }

  return <ProfileDetailView profile={profile} interestId={interestId} />;
}
