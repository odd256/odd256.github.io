"use client";

import { Blur } from "@animate-ui/react/primitives/effects/blur";

export function AnimatedTitle({ title }: { title: string }) {
  return (
    <Blur asChild>
      <h1 className="text-5xl font-extrabold tracking-tighter">{title}</h1>
    </Blur>
  );
}
