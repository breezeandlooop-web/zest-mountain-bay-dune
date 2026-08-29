import { type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Camera,
  CircleDollarSign,
  House,
  Layers,
  Scissors,
  UserRound,
} from "lucide-react";
import { Hummingbird, Wordmark } from "@/components/hummingbird";
import { GetMeMoving } from "@/components/get-me-moving";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { longDate, monthLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: House },
  { to: "/make", label: "Make", icon: Scissors },
  { to: "/stock", label: "Stock", icon: Layers },
  { to: "/content", label: "Content", icon: Camera },
  { to: "/money", label: "Money", icon: CircleDollarSign },
] as const;

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useActivePath();
  const saveError = useStudio((s) => s.saveError);
  const retrySave = useStudio((s) => s.retrySave);
  const setMovingOpen = useStudio((s) => s.setMovingOpen);

  return (
    <div className="min-h-dvh bg-sand text-navy paper-grain">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-56 flex-col bg-navy-deep text-ivory z-30">
        <div className="px-5 pt-6 pb-8">
          <div className="flex items-center gap-2">
            <Hummingbird className="size-7 text-seaglass" />
            <Wordmark className="text-lg text-ivory" />
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-ivory/50">Owner OS</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 h-11 text-sm transition-colors",
                  active ? "bg-seaglass text-ivory" : "text-ivory/75 hover:bg-ivory/8 hover:text-ivory",
                )}
              >
                <Icon className="size-4" strokeWidth={1.6} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="px-5 py-4 text-[11px] text-ivory/40">{monthLabel()}</p>
      </aside>

      <header className="sticky top-0 z-20 bg-sand/90 backdrop-blur-sm border-b border-line md:pl-56">
        <div className="flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <Hummingbird className="size-6 text-seaglass" />
            <Wordmark className="text-lg" />
          </div>
          <p className="hidden md:block text-sm text-muted">{longDate()}</p>
          <div className="flex items-center gap-2">
            <p className="md:hidden text-xs text-muted">{longDate()}</p>
            <Link
              to="/settings"
              aria-label="Profile and settings"
              className="size-11 inline-flex items-center justify-center rounded-md text-navy hover:bg-secondary"
            >
              <UserRound className="size-4" strokeWidth={1.6} />
            </Link>
          </div>
        </div>
        {saveError ? (
          <div className="px-4 md:px-8 pb-3">
            <div className="flex items-start justify-between gap-3 rounded-lg bg-amber-soft px-4 py-3">
              <p className="text-sm text-navy">
                Your latest changes could not be saved. Your information is still here on this device. Try again.
              </p>
              <Button size="sm" variant="outline" onClick={retrySave}>
                Retry
              </Button>
            </div>
          </div>
        ) : null}
      </header>

      <main className="md:pl-56 pb-28 md:pb-12">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-14 text-[11px]",
                  active ? "text-seaglass" : "text-muted",
                )}
              >
                <Icon className="size-4" strokeWidth={active ? 2 : 1.6} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        type="button"
        onClick={() => setMovingOpen(true)}
        className="fixed z-40 right-4 bottom-20 md:right-8 md:bottom-8 h-12 pl-3 pr-4 rounded-full bg-navy text-ivory shadow-card-hover flex items-center gap-2"
        aria-label="Get Me Moving"
      >
        <Hummingbird className="size-6 text-seaglass" />
        <span className="text-sm font-medium">Get Me Moving</span>
      </button>

      <GetMeMoving />
    </div>
  );
}
