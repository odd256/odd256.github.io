"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@/components/animate-ui/components/headless/accordion";

interface CollapsibleCalloutProps {
  type: string;
  title: string;
  content: string;
  isDefaultCollapsed?: boolean;
}

export function CollapsibleCallout({
  type,
  title,
  content,
  isDefaultCollapsed = false,
}: CollapsibleCalloutProps) {
  return (
    <Accordion className="w-full">
      <AccordionItem 
        className="border-none w-full px-0" 
        defaultOpen={!isDefaultCollapsed}
      >
        {({ open }) => (
          <div 
            className={`callout callout-${type} collapsible is-animated w-full px-4`}
            data-callout={type}
            {...(open ? { open: true } : {})}
          >
            <AccordionButton 
              showArrow={false}
              className="callout-title cursor-pointer select-none w-full justify-start py-3 px-0 border-none font-semibold focus-visible:ring-0 focus-visible:outline-none hover:no-underline"
            >
              <div className="fold-callout-icon" />
              <div className="callout-icon" />
              <div 
                className="callout-title-inner" 
                dangerouslySetInnerHTML={{ __html: title }} 
              />
            </AccordionButton>

            <AccordionPanel className="callout-content pt-0 pb-4 flex flex-col">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </AccordionPanel>
          </div>
        )}
      </AccordionItem>
    </Accordion>
  );
}
