import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      tone: {
        navy: "bg-navy/8 text-navy",
        seaglass: "bg-seaglass-soft text-seaglass-deep",
        clay: "bg-clay-soft text-clay",
        amber: "bg-amber-soft text-navy",
        muted: "bg-secondary text-muted",
      },
    },
    defaultVariants: { tone: "navy" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export function statusTone(status: string) {
  if (status === "reorder" || status === "awaiting" || status === "awaiting-payment") return "amber" as const;
  if (status === "healthy" || status === "selling" || status === "ready" || status === "published" || status === "paid")
    return "seaglass" as const;
  if (status === "archived" || status === "retired") return "muted" as const;
  if (status === "in-production" || status === "editing") return "clay" as const;
  return "navy" as const;
}
