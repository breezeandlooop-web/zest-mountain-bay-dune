import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn("group flex items-center gap-3 text-left min-h-11", className)}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-[5px] transition-colors",
          checked ? "bg-seaglass text-ivory" : "bg-ivory shadow-card",
        )}
      >
        {checked ? <Check className="size-3.5" strokeWidth={2.4} /> : null}
      </span>
      {label ? <span className="text-sm text-navy">{label}</span> : null}
    </button>
  );
}
