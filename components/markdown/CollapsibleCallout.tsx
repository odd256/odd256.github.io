"use client";

import { useState } from "react";
import { Collapsible } from "@animate-ui/react/primitives/radix-ui/collapsible";

interface CollapsibleCalloutProps {
  type: string;
  title: string;
  content: string;
  isDefaultCollapsed?: boolean;
}

export function CollapsibleCallout({ type, title, content, isDefaultCollapsed = false }: CollapsibleCalloutProps) {
  const [open, setOpen] = useState(!isDefaultCollapsed);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} asChild>
      <div className={`callout callout-${type} collapsible is-animated w-full px-4`} data-callout={type} {...(open ? { open: true } : {})}>
        <Collapsible.Trigger className="callout-title flex w-full cursor-pointer select-none justify-start border-none px-0 py-3 text-left font-semibold focus-visible:outline-2 focus-visible:outline-ring">
          <span aria-hidden className="fold-callout-icon" />
          <span aria-hidden className="callout-icon" />
          <span className="callout-title-inner" dangerouslySetInnerHTML={{ __html: title }} />
        </Collapsible.Trigger>
        <Collapsible.Content className="callout-collapse-panel">
          <div className="callout-content flow-root" dangerouslySetInnerHTML={{ __html: content }} />
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
