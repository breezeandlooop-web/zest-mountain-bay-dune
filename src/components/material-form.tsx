import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader, ProductThumb, StatusPill } from "@/components/shared";
import type { Material, MaterialType } from "@/lib/types";
import { inventoryValue, isLowStock, landedCost, unitCost } from "@/lib/calc";
import { money } from "@/lib/format";
import { useStudio } from "@/lib/store";

export function MaterialForm({
  material: initial,
  isNew,
  onSave,
}: {
  material: Material;
  isNew?: boolean;
  onSave: (m: Material) => void;
}) {
  const [m, setM] = useState(initial);
  const receiveStock = useStudio((s) => s.receiveStock);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [recv, setRecv] = useState({ quantity: 1, purchaseCost: 0, shipping: 0, duties: 0, usableUnits: 1 });
  const navigate = useNavigate();
  const patch = (p: Partial<Material>) => setM((x) => ({ ...x, ...p }));
  const low = isLowStock(m);
  const needed = Math.max(0, m.reorderLevel + 2 - m.quantityOnHand);
  const est = unitCost(m) * needed;

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Stock"
        title={isNew ? "Add material" : m.name || "Untitled"}
        sub={m.variant}
        action={<StatusPill status={low ? "reorder" : "healthy"} />}
      />
      {m.imageUrl ? (
        <div className="aspect-square max-w-xs overflow-hidden rounded-xl">
          <ProductThumb src={m.imageUrl} swatch="#D9C7A8" alt={m.name} />
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Material name">
          <Input value={m.name} onChange={(e) => patch({ name: e.target.value })} />
        </Field>
        <Field label="Type">
          <Select value={m.type} onChange={(e) => patch({ type: e.target.value as MaterialType })}>
            <option value="yarn">Yarn</option>
            <option value="hardware">Hardware</option>
            <option value="packaging">Packaging</option>
            <option value="tools">Tools</option>
          </Select>
        </Field>
        <Field label="Supplier">
          <Input value={m.supplier} onChange={(e) => patch({ supplier: e.target.value })} />
        </Field>
        <Field label="Supplier location">
          <Input value={m.supplierLocation} onChange={(e) => patch({ supplierLocation: e.target.value })} />
        </Field>
        <Field label="Colour, weight, size">
          <Input value={m.variant} onChange={(e) => patch({ variant: e.target.value })} />
        </Field>
        <Field label="Purchase unit">
          <Input value={m.purchaseUnit} onChange={(e) => patch({ purchaseUnit: e.target.value })} />
        </Field>
        <Field label="Quantity purchased">
          <Input type="number" value={m.quantityPurchased} onChange={(e) => patch({ quantityPurchased: Number(e.target.value) })} />
        </Field>
        <Field label="Quantity on hand">
          <Input type="number" value={m.quantityOnHand} onChange={(e) => patch({ quantityOnHand: Number(e.target.value) })} />
        </Field>
        <Field label="Item purchase cost">
          <Input type="number" step="0.01" value={m.purchaseCost} onChange={(e) => patch({ purchaseCost: Number(e.target.value) })} />
        </Field>
        <Field label="Shipping">
          <Input type="number" step="0.01" value={m.shipping} onChange={(e) => patch({ shipping: Number(e.target.value) })} />
        </Field>
        <Field label="Duties / fees">
          <Input type="number" step="0.01" value={m.duties} onChange={(e) => patch({ duties: Number(e.target.value) })} />
        </Field>
        <Field label="Usable units received">
          <Input type="number" value={m.usableUnits} onChange={(e) => patch({ usableUnits: Number(e.target.value) })} />
        </Field>
        <Field label="Reorder level">
          <Input type="number" value={m.reorderLevel} onChange={(e) => patch({ reorderLevel: Number(e.target.value) })} />
        </Field>
        <Field label="Last purchased">
          <Input type="date" value={m.lastPurchased} onChange={(e) => patch({ lastPurchased: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Notes / supplier link">
            <Textarea value={m.notes} onChange={(e) => patch({ notes: e.target.value })} />
          </Field>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <Stat label="Landed cost" value={money(landedCost(m), { cents: true })} />
        <Stat label="Unit cost" value={money(unitCost(m), { cents: true })} />
        <Stat label="Inventory value" value={money(inventoryValue(m), { cents: true })} />
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="seaglass"
          onClick={() => {
            onSave({ ...m, name: m.name.trim() || "Untitled material" });
            toast("Saved on this device.");
          }}
        >
          Save
        </Button>
        {!isNew ? (
          <Button variant="outline" onClick={() => setReceiveOpen(true)}>
            Receive stock
          </Button>
        ) : null}
        {low ? (
          <Button
            variant="outline"
            onClick={() =>
              void navigate({
                to: "/money",
                search: { buy: m.name, amount: String(Math.round(est) || 120) },
              })
            }
          >
            Reorder
          </Button>
        ) : null}
      </div>
      {low ? (
        <p className="text-sm text-muted">
          Suggested buy: {needed} {m.purchaseUnit}s from {m.supplier || "your supplier"} · about {money(Math.round(est) || 120)}.
        </p>
      ) : null}

      <Dialog open={receiveOpen} onOpenChange={setReceiveOpen}>
        <DialogContent title="Receive stock">
          <div className="mt-4 space-y-3">
            <Field label="Quantity arriving">
              <Input type="number" value={recv.quantity} onChange={(e) => setRecv({ ...recv, quantity: Number(e.target.value) })} />
            </Field>
            <Field label="Purchase cost">
              <Input type="number" step="0.01" value={recv.purchaseCost} onChange={(e) => setRecv({ ...recv, purchaseCost: Number(e.target.value) })} />
            </Field>
            <Field label="Shipping">
              <Input type="number" step="0.01" value={recv.shipping} onChange={(e) => setRecv({ ...recv, shipping: Number(e.target.value) })} />
            </Field>
            <Field label="Duties">
              <Input type="number" step="0.01" value={recv.duties} onChange={(e) => setRecv({ ...recv, duties: Number(e.target.value) })} />
            </Field>
            <Field label="Usable units">
              <Input type="number" value={recv.usableUnits} onChange={(e) => setRecv({ ...recv, usableUnits: Number(e.target.value) })} />
            </Field>
            <Button
              className="w-full"
              variant="seaglass"
              onClick={() => {
                onSave(m);
                receiveStock(m.id, recv);
                setReceiveOpen(false);
                toast("Stock received. Unit cost now includes this landing.");
              }}
            >
              Add to on hand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paper px-3 py-3 shadow-card">
      <p className="text-[11px] uppercase tracking-[0.12em] text-soft">{label}</p>
      <p className="mt-1 tabular text-navy">{value}</p>
    </div>
  );
}
