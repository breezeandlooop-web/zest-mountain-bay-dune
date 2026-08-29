import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  title?: string;
};

export function Hummingbird({ className, title }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={cn("text-navy", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M8 30.5c8.2-1.8 14.4-1.2 18.8 1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M27.2 32.2c2.8 3.4 4.6 8.2 4.2 13.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M31.4 33.4c6.8-1.2 12.6 1.4 16.8 6.6 2.2 2.6 4.8 3.8 8.6 3.2-3.4 2.8-8.2 3.6-12.4 1.6-3.2-1.6-5.2-4.6-7.2-8.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30.8 31.6c.4-6.8 4.2-12.4 10.6-16.2 2.8-1.6 1.6 4.2-.2 6.8-2.2 3.2-6.2 6-10.4 7.4Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M33.6 30.2c3.6-4.8 4.8-10.2 2.4-16.4 4.8 3.2 8.2 8.4 8.6 14.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42.8 28.4c1.2-2.4 3.6-3.8 6.4-4.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="44.6" cy="27.2" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display tracking-tight text-navy", className)}>
      Breeze <span className="text-seaglass">&</span> Loop
    </span>
  );
}
