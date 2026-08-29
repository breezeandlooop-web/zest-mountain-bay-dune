import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Hummingbird } from "@/components/hummingbird";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { emptyMove, getMoves } from "@/lib/recommend";
import { format } from "date-fns";

export function GetMeMoving() {
  const open = useStudio((s) => s.movingOpen);
  const setOpen = useStudio((s) => s.setMovingOpen);
  const data = useStudio();
  const addTask = useStudio((s) => s.addTask);
  const dismissMove = useStudio((s) => s.dismissMove);
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [signals, setSignals] = useState(false);

  const moves = getMoves(data);
  const move = moves[index] ?? emptyMove();
  const hasAnother = moves.length > index + 1;

  const close = () => {
    setOpen(false);
    setIndex(0);
    setSignals(false);
  };

  const start = () => {
    close();
    if (move.href) router.history.push(move.href);
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
        else setOpen(true);
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-navy/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 outline-none md:left-auto md:top-0 md:h-full md:w-[420px] md:rounded-none">
          <div className="rounded-t-xl md:rounded-none bg-paper shadow-card-hover max-h-[92dvh] overflow-y-auto px-5 pt-3 pb-8 md:px-7 md:pt-8 md:h-full">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line md:hidden" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Hummingbird className="size-7 text-seaglass" />
                <p className="text-[11px] uppercase tracking-[0.18em] text-soft">Your next move</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="size-11 inline-flex items-center justify-center rounded-md text-muted hover:bg-secondary"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <h2 className="font-display text-[1.7rem] text-navy mt-4 text-balance">{move.title}</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">{move.why}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-soft">
              Estimated focus time · {move.minutes} minutes
            </p>

            {signals ? (
              <ul className="mt-5 space-y-2 border-t border-line pt-4">
                {move.signals.map((s) => (
                  <li key={s} className="text-sm text-navy pl-3 border-l-2 border-seaglass">
                    {s}
                  </li>
                ))}
                {move.tradeoff ? <li className="text-sm text-muted pt-2">{move.tradeoff}</li> : null}
              </ul>
            ) : null}

            <div className="mt-6 flex flex-col gap-2">
              <Button variant="seaglass" onClick={start}>
                {move.actionLabel}
              </Button>
              <Button variant="outline" onClick={() => setSignals((v) => !v)}>
                {signals ? "Hide signals" : "See supporting signals"}
              </Button>
              <Button
                variant="ghost"
                disabled={!hasAnother}
                onClick={() => {
                  setIndex((i) => i + 1);
                  setSignals(false);
                }}
              >
                Give me another option
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  addTask({
                    title: move.title,
                    dueDate: format(new Date(), "yyyy-MM-dd"),
                    priority: "high",
                  });
                  close();
                }}
              >
                Make this a task
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  if (move.id !== "empty") dismissMove(move.id);
                  close();
                }}
              >
                Dismiss for today
              </Button>
            </div>
            {hasAnother && index > 0 ? (
              <p className="mt-4 text-xs text-muted">{move.tradeoff ?? "A slower option than the one before it."}</p>
            ) : null}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
