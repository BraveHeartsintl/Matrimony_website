import { Suspense } from "react";
import SearchProfileClient from "./SearchProfileClient";

export default function SearchProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-muted">Loading profile…</div>
      }
    >
      <SearchProfileClient />
    </Suspense>
  );
}
