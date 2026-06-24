import ProfileDetailView from "@/components/profile/ProfileDetailView";
import { getAllProfileIds, getProfileById } from "@/lib/profiles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllProfileIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getProfileById(id);

  if (!profile) {
    return { title: "Profile Not Found" };
  }

  return {
    title: `${profile.name}, ${profile.age} — ${profile.location}`,
    description: profile.bio,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = getProfileById(id);

  if (!profile) {
    notFound();
  }

  return <ProfileDetailView profile={profile} />;
}
