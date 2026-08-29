import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/badge";

export function PageHeader({
  kicker,
  title,
  sub,
  action,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        {kicker ? <p className="text-[11px] uppercase tracking-[0.18em] text-soft mb-1">{kicker}</p> : null}
        <h1 className="text-[1.75rem] md:text-[2rem] text-navy">{title}</h1>
        {sub ? <p className="mt-1 text-sm text-muted max-w-xl">{sub}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl bg-paper px-6 py-12 text-center shadow-card">
      <h2 className="font-display text-xl text-navy">{title}</h2>
      <p className="mt-2 text-sm text-muted max-w-md mx-auto">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ProductThumb({
  src,
  swatch,
  alt,
  className,
}: {
  src?: string;
  swatch: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return <img src={src} alt={alt} className={cn("product-photo size-full object-cover", className)} />;
  }
  return (
    <div
      className={cn("size-full", className)}
      style={{
        background: `linear-gradient(145deg, ${swatch}, color-mix(in oklab, ${swatch} 70%, white))`,
      }}
      aria-label={alt}
    />
  );
}

export function StatusPill({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-3">
      <h2 className="font-display text-lg text-navy">{children}</h2>
      {action}
    </div>
  );
}

export function TextLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={cn("text-sm text-seaglass hover:text-seaglass-deep", className)}>
      {children}
    </Link>
  );
}

export function FilterRow({ children }: { children: ReactNode }) {
  return <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">{children}</div>;
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors",
        active ? "bg-navy text-ivory" : "bg-paper text-navy shadow-card hover:shadow-card-hover",
      )}
    >
      {children}
    </button>
  );
}
