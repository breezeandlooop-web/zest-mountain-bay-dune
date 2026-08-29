import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chip, EmptyState, FilterRow, PageHeader, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { formatLabel } from "@/lib/format";
import type { ContentPillar, ContentStatus } from "@/lib/types";
import { CONTENT_PILLARS } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/content")({ component: ContentPage });

const STAGES: ContentStatus[] = ["idea", "captured", "editing", "ready", "published"];

function ContentPage() {
  const content = useStudio((s) => s.content);
  const products = useStudio((s) => s.products);
  const setStatus = useStudio((s) => s.setContentStatus);
  const [stage, setStage] = useState<ContentStatus | "all">("all");
  const [pillar, setPillar] = useState<ContentPillar | "all">("all");

  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const counts = {
    idea: content.filter((c) => c.status === "idea").length,
    captured: content.filter((c) => c.status === "captured").length,
    editing: content.filter((c) => c.status === "editing").length,
    ready: content.filter((c) => c.status === "ready").length,
    published: content.filter((c) => {
      if (c.status !== "published" || !c.publishedDate) return false;
      const d = new Date(c.publishedDate);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
  };

  const visible = content.filter((c) => {
    if (stage !== "all" && c.status !== stage) return false;
    if (pillar !== "all" && c.pillar !== pillar) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        kicker="Content Studio"
        title="Content Studio"
        sub="Capture the story while you make the work."
        action={
          <Button asChild variant="seaglass">
            <Link to="/content/new">New content idea</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-5 gap-2 mb-5">
        {STAGES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStage(stage === s ? "all" : s)}
            className={cn(
              "rounded-xl bg-paper p-3 shadow-card text-left",
              stage === s && "ring-1 ring-seaglass",
            )}
          >
            <p className="text-[10px] uppercase tracking-[0.12em] text-soft">
              {s === "published" ? "Published" : s}
            </p>
            <p className="font-display text-xl tabular mt-1">{s === "published" ? counts.published : counts[s]}</p>
          </button>
        ))}
      </div>

      <FilterRow>
        <Chip active={pillar === "all"} onClick={() => setPillar("all")}>
          All pillars
        </Chip>
        {CONTENT_PILLARS.map((p) => (
          <Chip key={p} active={pillar === p} onClick={() => setPillar(p)}>
            {p}
          </Chip>
        ))}
      </FilterRow>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Good content begins with a real moment."
            body="Capture an idea, a product detail, or something island life just handed you."
            action={
              <Button asChild variant="seaglass">
                <Link to="/content/new">New content idea</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-5 space-y-2">
          {visible.map((c) => {
            const linked =
              products.find((p) => p.id === c.linkedProductId)?.name ??
              (c.linkedMaterialId ? "Material" : null);
            return (
              <li key={c.id} className="rounded-xl bg-paper shadow-card p-4">
                <Link to="/content/$contentId" params={{ contentId: c.id }} className="block">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-muted mt-1">
                        {c.pillar} · {formatLabel(c.format)}
                        {linked ? ` · ${linked}` : ""}
                      </p>
                    </div>
                    <StatusPill status={c.status} />
                  </div>
                </Link>
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(c.id, s)}
                      className={cn(
                        "h-8 px-2.5 rounded-full text-xs shrink-0",
                        c.status === s ? "bg-navy text-ivory" : "bg-secondary text-muted",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
