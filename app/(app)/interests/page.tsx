import { Suspense } from "react";
import InterestsClient from "./InterestsClient";
import { Loader2 } from "lucide-react";

export default function InterestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <InterestsClient />
    </Suspense>
  );
}
