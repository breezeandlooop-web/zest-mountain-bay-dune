import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-11 w-full rounded-md bg-ivory px-3 text-sm text-navy shadow-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
