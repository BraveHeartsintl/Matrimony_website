import { MOCK_PROFILES } from "@/lib/mock/profiles";
import LegacyProfileRedirect from "./LegacyProfileRedirect";

export function generateStaticParams() {
  return MOCK_PROFILES.map((p) => ({ id: p.id }));
}

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <LegacyProfileRedirect params={params} />;
}
