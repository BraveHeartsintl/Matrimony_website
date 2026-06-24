import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Profile Not Found</h1>
      <p className="mt-2 text-muted">
        This profile does not exist or may have been removed.
      </p>
      <Link href="/search" className="mt-8">
        <Button>Back to Search</Button>
      </Link>
    </div>
  );
}
