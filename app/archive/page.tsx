import { Suspense } from "react";
import { getNoteSummaries } from "@/lib/notes";
import ArchiveClient from "./ArchiveClient";

export default function ArchivePage() {
  const allNotes = getNoteSummaries();

  return (
    <Suspense fallback={<div className="min-h-[500px]" />}>
      <ArchiveClient initialNotes={allNotes} />
    </Suspense>
  );
}
