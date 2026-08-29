import { useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Check, MoreHorizontal, Plus } from "lucide-react";
import { Hummingbird } from "@/components/hummingbird";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState, SectionTitle } from "@/components/shared";
import { useStudio } from "@/lib/store";
import { pulse, photographyGap } from "@/lib/selectors";
import { getMoves, emptyMove } from "@/lib/recommend";
import { greeting, money, prettyDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { isLowStock } from "@/lib/calc";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const data = useStudio();
  const router = useRouter();
  const toggleTask = useStudio((s) => s.toggleTask);
  const deferTask = useStudio((s) => s.deferTask);
  const addTask = useStudio((s) => s.addTask);
  const setMovingOpen = useStudio((s) => s.setMovingOpen);
  const [addOpen, setAddOpen] = useState(false);
  const [why, setWhy] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  const metrics = pulse(data);
  const gap = photographyGap(data);
  const moves = getMoves(data);
  const next = moves[0] ?? emptyMove();
  const today = format(new Date(), "yyyy-MM-dd");
  const tasks = data.tasks.filter((t) => !t.deferredTo || t.deferredTo <= today).slice(0, 5);
  const low = data.materials.filter(isLowStock);
  const unpaid = data.sales.filter((s) => s.status === "awaiting");
  const expensesHigh = metrics.operating > metrics.sales * 0.7 && metrics.sales > 0;

  const emptyStudio = data.products.length === 0 && data.materials.length === 0;

  if (emptyStudio) {
    return (
      <EmptyState
        title="Your studio is ready when you are."
        body="Add your first product or material to begin. The dashboard will start connecting the dots."
        action={
          <Button asChild variant="seaglass">
            <Link to="/make/new">Add a product</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-soft">Home</p>
        <h1 className="mt-1 text-[1.85rem] md:text-[2.15rem] text-navy">
          {greeting()}, {data.settings.ownerName}.
        </h1>
        <p className="mt-1 text-sm text-muted">{format(new Date(), "EEEE, d MMMM")}</p>
      </header>

      <section>
        <SectionTitle>Business Pulse</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <PulseCard label="Cash available" value={money(metrics.cashAvailable)} to="/money" note="On hand, not promised" />
          <PulseCard label="This month’s sales" value={money(metrics.sales)} to="/money" note="Paid only" />
          <PulseCard label="Open orders" value={String(metrics.openOrders)} to="/money" note="Including unpaid" />
          <PulseCard label="Inventory value" value={money(Math.round(metrics.inventoryValue))} to="/stock" note="Materials on hand" />
          <PulseCard label="Finished products" value={String(metrics.finishedProducts)} to="/make" note="Finished or selling" />
          <PulseCard label="Content ready" value={String(metrics.contentReady)} to="/content" note="Waiting to publish" />
        </div>
      </section>

      <section>
        <SectionTitle
          action={
            <button type="button" onClick={() => setAddOpen(true)} className="text-sm text-seaglass inline-flex items-center gap-1">
              <Plus className="size-3.5" /> Add task
            </button>
          }
        >
          Today
        </SectionTitle>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted rounded-xl bg-paper px-4 py-6 shadow-card">
            Nothing urgent today. Capture a task or ask the hummingbird what matters most.
          </p>
        ) : (
          <ul className="rounded-xl bg-paper shadow-card divide-y divide-line">
            {tasks.map((task) => {
              const href = taskHref(task.linkedKind, task.linkedId);
              return (
                <li key={task.id} className="flex items-center gap-2 px-3 min-h-14">
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className={cn(
                      "size-11 shrink-0 inline-flex items-center justify-center",
                    )}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border",
                        task.completed ? "bg-seaglass border-seaglass text-ivory" : "border-navy/30",
                      )}
                    >
                      {task.completed ? <Check className="size-3" strokeWidth={2.4} /> : null}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex-1 text-left py-3"
                    onClick={() => href && router.history.push(href)}
                  >
                    <p className={cn("text-sm", task.completed && "line-through text-muted")}>{task.title}</p>
                    <p className="text-xs text-soft">{prettyDate(task.dueDate)} · {task.priority}</p>
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      className="size-11 inline-flex items-center justify-center text-muted"
                      aria-label="Task menu"
                      onClick={() => setMenu(menu === task.id ? null : task.id)}
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                    {menu === task.id ? (
                      <div className="absolute right-0 top-10 z-10 w-40 rounded-md bg-paper py-1 shadow-card-hover">
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-secondary"
                          onClick={() => {
                            deferTask(task.id);
                            setMenu(null);
                          }}
                        >
                          Defer to tomorrow
                        </button>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-xl bg-paper p-5 md:p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Hummingbird className="size-6 text-seaglass" />
          <p className="text-[11px] uppercase tracking-[0.18em] text-soft">Your Next Move</p>
        </div>
        <h2 className="font-display text-2xl text-navy mt-3 text-balance">{next.title}</h2>
        <p className="mt-2 text-sm text-muted max-w-xl">{next.why}</p>
        {why ? (
          <ul className="mt-4 space-y-1.5">
            {next.signals.map((s) => (
              <li key={s} className="text-sm text-navy pl-3 border-l-2 border-seaglass">
                {s}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Button variant="seaglass" onClick={() => router.history.push(next.href)}>
            Start now
          </Button>
          <Button variant="outline" onClick={() => setWhy((v) => !v)}>
            See why
          </Button>
          <Button variant="ghost" onClick={() => setMovingOpen(true)}>
            Choose another action
          </Button>
        </div>
      </section>

      <section className="rounded-xl bg-paper p-5 shadow-card">
        <SectionTitle>This Week’s Opportunity</SectionTitle>
        {gap.finished === 0 ? (
          <p className="text-sm text-muted">Add products, materials, or expenses and the dashboard will begin connecting the dots.</p>
        ) : (
          <>
            <p className="text-sm text-muted">
              You have {gap.finished} finished products, but only {gap.withPhoto} have photography marked complete.
              {gap.missing[0] ? ` Photographing the ${gap.missing.map((p) => p.name).slice(0, 2).join(" and ")} unlocks listings and content.` : ""}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/content">Open Content</Link>
            </Button>
          </>
        )}
      </section>

      <section>
        <SectionTitle>Attention Needed</SectionTitle>
        <ul className="space-y-2">
          {low.map((m) => (
            <li key={m.id}>
              <Link to="/stock/$materialId" params={{ materialId: m.id }} className="flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card">
                <span className="mt-1 size-2 rounded-full bg-amber shrink-0" />
                <span className="text-sm">
                  <span className="font-medium">{m.name}</span> is below reorder level.
                </span>
              </Link>
            </li>
          ))}
          {unpaid.map((s) => (
            <li key={s.id}>
              <Link to="/money" className="flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card">
                <span className="mt-1 size-2 rounded-full bg-clay shrink-0" />
                <span className="text-sm">One order needs customer follow-up — {s.itemName}, {money(s.total)}.</span>
              </Link>
            </li>
          ))}
          {expensesHigh ? (
            <li>
              <Link to="/money" className="flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card">
                <span className="mt-1 size-2 rounded-full bg-amber shrink-0" />
                <span className="text-sm">This month’s expenses are approaching the monthly sales total.</span>
              </Link>
            </li>
          ) : null}
          {low.length === 0 && unpaid.length === 0 && !expensesHigh ? (
            <li className="text-sm text-muted px-1">Nothing exceptional. The studio is holding.</li>
          ) : null}
        </ul>
      </section>

      <AddTaskDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={(t) => {
          addTask(t);
          setAddOpen(false);
        }}
        products={data.products}
      />
    </div>
  );
}

function PulseCard({ label, value, to, note }: { label: string; value: string; to: string; note: string }) {
  return (
    <Link to={to} className="rounded-xl bg-paper p-4 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-150">
      <p className="text-[11px] uppercase tracking-[0.14em] text-soft">{label}</p>
      <p className="mt-2 font-display text-2xl tabular text-navy">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </Link>
  );
}

function taskHref(kind?: string, id?: string) {
  if (!kind || !id) return undefined;
  if (kind === "product") return `/make/${id}`;
  if (kind === "content") return `/content/${id}`;
  if (kind === "material") return `/stock/${id}`;
  if (kind === "sale" || kind === "order") return "/money";
  return undefined;
}

function AddTaskDialog({
  open,
  onOpenChange,
  onSave,
  products,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (t: { title: string; dueDate: string; priority: "high" | "medium" | "low"; linkedKind?: "product"; linkedId?: string }) => void;
  products: { id: string; name: string }[];
}) {
  const [title, setTitle] = useState("");
  const [due, setDue] = useState(format(new Date(), "yyyy-MM-dd"));
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [linked, setLinked] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Add task">
        <div className="mt-4 space-y-3">
          <Field label="Title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs doing?" />
          </Field>
          <Field label="Due">
            <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          </Field>
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as "high" | "medium" | "low")}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
          </Field>
          <Field label="Linked product">
            <Select value={linked} onChange={(e) => setLinked(e.target.value)}>
              <option value="">None</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Button
            className="w-full"
            variant="seaglass"
            disabled={!title.trim()}
            onClick={() =>
              onSave({
                title: title.trim(),
                dueDate: due,
                priority,
                linkedKind: linked ? "product" : undefined,
                linkedId: linked || undefined,
              })
            }
          >
            Save task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
