import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader, ProductThumb, StatusPill } from "@/components/shared";
import { contentFromProduct } from "@/lib/factories";
import {
  CHECKLIST_LABELS,
  PRODUCT_STATUSES,
  type Product,
  type ProductStatus,
} from "@/lib/types";
import {
  labourCost,
  liveTrueCost,
  materialCostForProduct,
  suggestedRetail,
  unitCost,
} from "@/lib/calc";
import { money, pct } from "@/lib/format";
import { useStudio } from "@/lib/store";

export function ProductForm({
  product: initial,
  isNew,
  onSave,
}: {
  product: Product;
  isNew?: boolean;
  onSave: (p: Product) => void;
}) {
  const materials = useStudio((s) => s.materials);
  const upsertContent = useStudio((s) => s.upsertContent);
  const markFinished = useStudio((s) => s.markProductFinished);
  const duplicate = useStudio((s) => s.duplicateProduct);
  const archive = useStudio((s) => s.archiveProduct);
  const restore = useStudio((s) => s.restoreProduct);
  const toggleTimer = useStudio((s) => s.toggleTimer);
  const addManualTime = useStudio((s) => s.addManualTime);
  const live = useStudio((s) => s.products.find((p) => p.id === initial.id) ?? initial);
  const [p, setP] = useState(initial);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [manualHours, setManualHours] = useState("");
  const [addMat, setAddMat] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setP((prev) => {
      const fromStore = live;
      return {
        ...fromStore,
        ...prev,
        hoursWorked: fromStore.hoursWorked,
        timerRunning: fromStore.timerRunning,
        timerStartedAt: fromStore.timerStartedAt,
        status: fromStore.status,
        quantityMade: fromStore.quantityMade,
        quantityAvailable: fromStore.quantityAvailable,
        frozenTrueCost: fromStore.frozenTrueCost,
        contentChecklist: fromStore.contentChecklist,
      };
    });
  }, [live.hoursWorked, live.timerRunning, live.status, live.contentChecklist, live.quantityAvailable]);

  const working: Product = { ...live, ...p, hoursWorked: live.hoursWorked, timerRunning: live.timerRunning, materials: p.materials, contentChecklist: live.contentChecklist };
  const matCost = materialCostForProduct(working, materials);
  const labour = labourCost(working);
  const cost = liveTrueCost(working, materials);
  const profit = working.sellingPrice - cost;
  const margin = working.sellingPrice ? (profit / working.sellingPrice) * 100 : 0;
  const suggested = suggestedRetail(working, materials);
  const below = working.sellingPrice > 0 && margin < working.targetMargin * 100 - 0.05;

  const elapsed = useTimerTick(live);

  const patch = (partial: Partial<Product>) => setP((x) => ({ ...x, ...partial }));

  const save = () => {
    onSave({ ...working, name: working.name.trim() || "Untitled piece" });
    toast("Saved on this device.");
  };

  const createContent = () => {
    const saved = { ...working, name: working.name.trim() || "Untitled piece" };
    onSave(saved);
    const draft = contentFromProduct(saved);
    upsertContent(draft);
    void navigate({ to: "/content/$contentId", params: { contentId: draft.id } });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Make"
        title={isNew ? "New product" : working.name || "Untitled piece"}
        sub={working.category}
        action={<StatusPill status={working.status} />}
      />

      {working.imageUrl ? (
        <div className="aspect-[16/9] max-h-72 overflow-hidden rounded-xl bg-secondary">
          <ProductThumb src={working.imageUrl} swatch={working.swatch} alt={working.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-24 rounded-xl overflow-hidden">
          <ProductThumb swatch={working.swatch} alt={working.name} />
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Field label="Name">
          <Input value={p.name} onChange={(e) => patch({ name: e.target.value })} />
        </Field>
        <Field label="Category">
          <Input value={p.category} onChange={(e) => patch({ category: e.target.value })} />
        </Field>
        <Field label="Status">
          <Select value={p.status} onChange={(e) => patch({ status: e.target.value as ProductStatus })}>
            {PRODUCT_STATUSES.filter((s) => s !== "archived").map((s) => (
              <option key={s} value={s}>
                {s.replace("-", " ")}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Colour swatch">
          <Input type="color" value={p.swatch} onChange={(e) => patch({ swatch: e.target.value })} className="h-11 p-1" />
        </Field>
        <Field label="Quantity made">
          <Input type="number" min={0} value={p.quantityMade} onChange={(e) => patch({ quantityMade: Number(e.target.value) })} />
        </Field>
        <Field label="Quantity available">
          <Input type="number" min={0} value={p.quantityAvailable} onChange={(e) => patch({ quantityAvailable: Number(e.target.value) })} />
        </Field>
        <Field label="Selling price (BBD)">
          <Input type="number" min={0} step="0.01" value={p.sellingPrice} onChange={(e) => patch({ sellingPrice: Number(e.target.value) })} />
        </Field>
        <Field label="Wholesale price">
          <Input
            type="number"
            min={0}
            step="0.01"
            value={p.wholesalePrice ?? ""}
            onChange={(e) => patch({ wholesalePrice: e.target.value ? Number(e.target.value) : undefined })}
          />
        </Field>
        <Field label="Target margin">
          <Input
            type="number"
            min={0}
            max={90}
            value={Math.round(p.targetMargin * 100)}
            onChange={(e) => patch({ targetMargin: Number(e.target.value) / 100 })}
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Description / concept">
            <Textarea value={p.description} onChange={(e) => patch({ description: e.target.value })} rows={3} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-navy mb-3">Cost & pricing</h2>
        <div className="rounded-xl bg-paper p-4 shadow-card space-y-3">
          {p.materials.map((line) => {
            const m = materials.find((x) => x.id === line.materialId);
            if (!m) return null;
            return (
              <div key={line.materialId} className="flex items-center gap-3">
                <p className="flex-1 text-sm">{m.name}</p>
                <Input
                  type="number"
                  min={0}
                  step="0.05"
                  className="w-24"
                  value={line.quantity}
                  onChange={(e) =>
                    patch({
                      materials: p.materials.map((l) =>
                        l.materialId === line.materialId ? { ...l, quantity: Number(e.target.value) } : l,
                      ),
                    })
                  }
                />
                <p className="w-24 text-right text-sm tabular text-muted">{money(line.quantity * unitCost(m), { cents: true })}</p>
                <button
                  type="button"
                  className="text-xs text-clay"
                  onClick={() => patch({ materials: p.materials.filter((l) => l.materialId !== line.materialId) })}
                >
                  Remove
                </button>
              </div>
            );
          })}
          <div className="flex gap-2">
            <Select value={addMat} onChange={(e) => setAddMat(e.target.value)} className="flex-1">
              <option value="">Add a material from Stock</option>
              {materials
                .filter((m) => !p.materials.some((l) => l.materialId === m.id))
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
            </Select>
            <Button
              variant="outline"
              disabled={!addMat}
              onClick={() => {
                patch({ materials: [...p.materials, { materialId: addMat, quantity: 1 }] });
                setAddMat("");
              }}
            >
              Add
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 pt-2">
            <Field label="Packaging cost">
              <Input type="number" min={0} step="0.01" value={p.packagingCost} onChange={(e) => patch({ packagingCost: Number(e.target.value) })} />
            </Field>
            <Field label="Other direct costs">
              <Input type="number" min={0} step="0.01" value={p.otherDirectCosts} onChange={(e) => patch({ otherDirectCosts: Number(e.target.value) })} />
            </Field>
            <Field label="Hours worked">
              <Input type="number" min={0} step="0.1" value={live.hoursWorked} readOnly />
            </Field>
            <Field label="Labour rate / hour">
              <Input type="number" min={0} step="0.5" value={p.labourRate} onChange={(e) => patch({ labourRate: Number(e.target.value) })} />
            </Field>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          <CostStat label="Material cost" value={money(matCost, { cents: true })} />
          <CostStat label="Packaging / direct" value={money(p.packagingCost + p.otherDirectCosts, { cents: true })} />
          <CostStat label="Labour cost" value={money(labour, { cents: true })} />
          <CostStat label="True cost to make" value={money(cost, { cents: true })} />
          <CostStat label="Gross profit / unit" value={money(profit, { cents: true })} />
          <CostStat label="Gross margin" value={working.sellingPrice ? pct(margin) : "—"} warn={below} />
        </dl>
        <p className="mt-3 text-sm text-muted">
          Suggested retail at {Math.round(p.targetMargin * 100)}% target:{" "}
          <span className="text-navy tabular">{money(suggested)}</span>
        </p>
        {below ? (
          <p className="mt-2 text-sm text-clay">
            This price is below your target margin. Consider {money(Math.ceil(suggested))} or reduce costs.
          </p>
        ) : null}
        {!working.sellingPrice ? (
          <p className="mt-2 text-sm text-muted">I need a selling price before I can assess this product’s margin.</p>
        ) : null}
      </section>

      <section>
        <h2 className="font-display text-lg text-navy mb-3">Production</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Start date">
            <Input type="date" value={p.startDate ?? ""} onChange={(e) => patch({ startDate: e.target.value })} />
          </Field>
          <Field label="Target completion">
            <Input type="date" value={p.targetCompletionDate ?? ""} onChange={(e) => patch({ targetCompletionDate: e.target.value })} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Production notes">
              <Textarea value={p.productionNotes} onChange={(e) => patch({ productionNotes: e.target.value })} />
            </Field>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => toggleTimer(working.id)} disabled={isNew}>
            {live.timerRunning ? <Pause className="size-4" /> : <Play className="size-4" />}
            {live.timerRunning ? "Pause" : "Start timer"}
          </Button>
          {live.timerRunning ? (
            <Button variant="ghost" onClick={() => toggleTimer(working.id)}>
              <Square className="size-4" /> Stop
            </Button>
          ) : null}
          <p className="text-sm tabular text-muted ml-1">{elapsed}</p>
        </div>
        <div className="mt-3 flex gap-2 max-w-xs">
          <Input
            type="number"
            step="0.25"
            min={0}
            placeholder="Hours"
            value={manualHours}
            onChange={(e) => setManualHours(e.target.value)}
          />
          <Button
            variant="soft"
            disabled={!manualHours || isNew}
            onClick={() => {
              addManualTime(working.id, Number(manualHours));
              setManualHours("");
            }}
          >
            Add time
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-navy mb-3">Content checklist</h2>
        <div className="grid sm:grid-cols-2 gap-1 rounded-xl bg-paper p-3 shadow-card">
          {CHECKLIST_LABELS.map((item) => (
            <Checkbox
              key={item.key}
              checked={live.contentChecklist[item.key]}
              onChange={() =>
                useStudio.getState().toggleChecklist(working.id, item.key)
              }
              label={item.label}
            />
          ))}
        </div>
        <Button className="mt-4" variant="outline" onClick={createContent}>
          Create Content
        </Button>
      </section>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button variant="seaglass" onClick={save}>
          Save
        </Button>
        {!isNew && working.status !== "finished" && working.status !== "selling" && working.status !== "archived" ? (
          <Button variant="outline" onClick={() => setFinishOpen(true)}>
            Mark finished
          </Button>
        ) : null}
        {!isNew ? (
          <Button
            variant="ghost"
            onClick={() => {
              const id = duplicate(working.id);
              if (id) void navigate({ to: "/make/$productId", params: { productId: id } });
            }}
          >
            Duplicate product
          </Button>
        ) : null}
        {!isNew && working.status !== "archived" ? (
          <Button variant="ghost" onClick={() => setArchiveOpen(true)}>
            Archive
          </Button>
        ) : null}
        {working.status === "archived" ? (
          <Button variant="outline" onClick={() => restore(working.id)}>
            Restore
          </Button>
        ) : null}
      </div>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent title="Archive this product?">
          <p className="mt-2 text-sm text-muted">You can restore it later. Sales history stays with the original.</p>
          <div className="mt-5 flex gap-2">
            <Button
              variant="clay"
              onClick={() => {
                archive(working.id);
                setArchiveOpen(false);
                void navigate({ to: "/make" });
              }}
            >
              Archive
            </Button>
            <Button variant="ghost" onClick={() => setArchiveOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={finishOpen} onOpenChange={setFinishOpen}>
        <DialogContent title="Mark this finished?">
          <p className="mt-2 text-sm text-muted">
            Status becomes Finished, available inventory increases, and material usage is taken from Stock. Historical cost will be fixed.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              variant="seaglass"
              onClick={() => {
                onSave(working);
                markFinished(working.id);
                setFinishOpen(false);
                toast("Marked finished. Create content while the piece is still in your hands.");
              }}
            >
              Mark finished
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onSave(working);
                markFinished(working.id);
                setFinishOpen(false);
                createContent();
              }}
            >
              Mark finished and create content
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CostStat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg bg-paper px-3 py-3 shadow-card">
      <p className="text-[11px] uppercase tracking-[0.12em] text-soft">{label}</p>
      <p className={`mt-1 tabular ${warn ? "text-clay" : "text-navy"}`}>{value}</p>
    </div>
  );
}

function useTimerTick(product: Product) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!product.timerRunning) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [product.timerRunning]);
  const extra = product.timerRunning && product.timerStartedAt ? (now - product.timerStartedAt) / 3_600_000 : 0;
  const hours = product.hoursWorked + extra;
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return useMemo(() => `${h}h ${String(m).padStart(2, "0")}m`, [h, m]);
}
