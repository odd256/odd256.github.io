"use client";

import {
  CopyButton as CopyButtonPrimitive,
  CopyButtonIcon,
  useCopyButton,
  type CopyButtonProps as CopyButtonPrimitiveProps,
} from "@animate-ui/react/primitives/buttons/copy";
import { AnimateIcon } from "@animate-ui/react/icons";
import { Check } from "@/components/animate-ui/icons/hugeicons/check";
import { Copy01 } from "@/components/animate-ui/icons/hugeicons/copy-01";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type CopyButtonProps = Omit<CopyButtonPrimitiveProps, "children"> &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    size?: "default" | "xs" | "sm" | "lg";
  };

const sizes = {
  default: "size-9",
  xs: "size-7 [&_svg]:size-3.5",
  sm: "size-8",
  lg: "size-10",
};

function CopyFeedback() {
  const { copied } = useCopyButton();

  return (
    <>
      <CopyButtonIcon
        icon={<Copy01 aria-hidden size={16} className="size-4" />}
        copiedIcon={<Check aria-hidden size={16} className="size-4" animate />}
      />
      <span className="sr-only" role="status">{copied ? "已复制" : ""}</span>
    </>
  );
}

export function CopyButton({ className, variant = "default", size = "default", ...props }: CopyButtonProps) {
  return (
    <AnimateIcon animateOnHover animateOnTap completeOnStop asChild>
      <CopyButtonPrimitive
        type="button"
        aria-label="复制代码"
        className={cn(buttonVariants({ variant, size: "icon" }), sizes[size], "rounded-md", className)}
        {...props}
      >
        <CopyFeedback />
      </CopyButtonPrimitive>
    </AnimateIcon>
  );
}
