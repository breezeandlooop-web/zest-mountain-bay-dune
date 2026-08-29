import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-md bg-ivory px-3 text-sm text-navy shadow-card",
        "placeholder:text-soft file:border-0 file:bg-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-md bg-ivory px-3 py-2.5 text-sm text-navy shadow-card",
        "placeholder:text-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
