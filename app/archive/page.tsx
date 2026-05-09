import { Suspense } from "react";
import { getAllNotes } from "@/lib/notes";
import ArchiveClient from "./ArchiveClient";

export default function ArchivePage() {
  const allNotes = getAllNotes();

  return (
    <Suspense fallback={<div className="min-h-[500px]" />}>
      <ArchiveClient initialNotes={allNotes} />
    </Suspense>
  );
}
