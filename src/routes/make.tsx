import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chip, EmptyState, FilterRow, PageHeader, ProductThumb, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { contentProgress, grossMargin, trueCost } from "@/lib/calc";
import { money, pct } from "@/lib/format";
import type { ProductStatus } from "@/lib/types";

export const Route = createFileRoute("/make")({ component: MakePage });

const TABS: { id: ProductStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "idea", label: "Ideas" },
  { id: "in-production", label: "In Production" },
  { id: "finished", label: "Finished" },
  { id: "selling", label: "Selling" },
  { id: "archived", label: "Archived" },
];

function MakePage() {
  const products = useStudio((s) => s.products);
  const materials = useStudio((s) => s.materials);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");

  const visible = products.filter((p) => {
    if (tab === "all") return p.status !== "archived";
    if (tab === "idea") return p.status === "idea" || p.status === "prototype";
    return p.status === tab;
  });

  return (
    <div>
      <PageHeader
        kicker="Make"
        title="Make"
        sub="From idea to something ready to sell."
        action={
          <Button asChild variant="seaglass">
            <Link to="/make/new">New product</Link>
          </Button>
        }
      />
      <FilterRow>
        {TABS.map((t) => (
          <Chip key={t.id} active={tab === t.id} onClick={() => setTab(t.id)}>
            {t.label}
          </Chip>
        ))}
      </FilterRow>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No products yet."
            body="Begin with something you are making, testing, or dreaming up."
            action={
              <Button asChild variant="seaglass">
                <Link to="/make/new">New product</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {visible.map((p) => {
            const cost = trueCost(p, materials);
            const margin = grossMargin(p, materials);
            const progress = contentProgress(p.contentChecklist);
            return (
              <Link
                key={p.id}
                to="/make/$productId"
                params={{ productId: p.id }}
                className="rounded-xl bg-paper shadow-card hover:shadow-card-hover transition-[box-shadow] duration-150 overflow-hidden"
              >
                <div className="aspect-[4/3] bg-secondary overflow-hidden">
                  <ProductThumb src={p.imageUrl} swatch={p.swatch} alt={p.name} />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-navy">{p.name}</p>
                      <p className="text-xs text-muted mt-0.5">{p.category}</p>
                    </div>
                    <StatusPill status={p.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-soft">Price</p>
                      <p className="tabular text-navy">{money(p.sellingPrice)}</p>
                    </div>
                    <div>
                      <p className="text-soft">Cost</p>
                      <p className="tabular text-navy">{money(cost, { cents: true })}</p>
                    </div>
                    <div>
                      <p className="text-soft">Margin</p>
                      <p className={margin < p.targetMargin * 100 ? "tabular text-clay" : "tabular text-seaglass-deep"}>
                        {p.sellingPrice ? pct(margin) : "—"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    Content {progress.done}/{progress.total}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
