import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Chip, EmptyState, FilterRow, PageHeader, ProductThumb, StatusPill } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";
import { inventoryValue, isLowStock, unitCost } from "@/lib/calc";
import { money } from "@/lib/format";
import type { MaterialType } from "@/lib/types";

export const Route = createFileRoute("/stock")({ component: StockPage });

const FILTERS: { id: "all" | "low" | MaterialType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "yarn", label: "Yarn" },
  { id: "hardware", label: "Hardware" },
  { id: "packaging", label: "Packaging" },
  { id: "tools", label: "Tools" },
  { id: "low", label: "Low stock" },
];

function StockPage() {
  const materials = useStudio((s) => s.materials);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const visible = materials.filter((m) => {
    if (filter === "all") return true;
    if (filter === "low") return isLowStock(m);
    return m.type === filter;
  });
  const value = materials.reduce((n, m) => n + inventoryValue(m), 0);
  const low = materials.filter(isLowStock).length;

  return (
    <div>
      <PageHeader
        kicker="Stock"
        title="Stock"
        sub="Materials, packaging, and the true cost behind each piece."
        action={
          <Button asChild variant="seaglass">
            <Link to="/stock/new">Add material</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <Summary label="Materials on hand" value={String(materials.length)} />
        <Summary label="Inventory value" value={money(Math.round(value))} />
        <Summary label="Low-stock items" value={String(low)} />
      </div>

      <FilterRow>
        {FILTERS.map((f) => (
          <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </FilterRow>

      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Your material library starts here."
            body="Add yarn, findings, packaging, or anything you use to make and ship a piece."
            action={
              <Button asChild variant="seaglass">
                <Link to="/stock/new">Add material</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-5 rounded-xl bg-paper shadow-card divide-y divide-line">
          {visible.map((m) => {
            const lowItem = isLowStock(m);
            return (
              <li key={m.id}>
                <Link
                  to="/stock/$materialId"
                  params={{ materialId: m.id }}
                  className="flex items-center gap-3 px-3 py-3 min-h-16"
                >
                  <div className="size-12 rounded-md overflow-hidden bg-secondary shrink-0">
                    <ProductThumb src={m.imageUrl} swatch={m.type === "yarn" ? "#D9C7A8" : "#C4B49A"} alt={m.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{m.name}</p>
                    <p className="text-xs text-muted">
                      {m.quantityOnHand} {m.purchaseUnit}
                      {m.quantityOnHand === 1 ? "" : "s"} · {money(unitCost(m), { cents: true })} / {m.purchaseUnit}
                    </p>
                  </div>
                  <StatusPill status={lowItem ? "reorder" : "healthy"} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper p-3 shadow-card">
      <p className="text-[11px] uppercase tracking-[0.12em] text-soft">{label}</p>
      <p className="mt-1 font-display text-xl tabular">{value}</p>
    </div>
  );
}
