import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Chip, EmptyState, FilterRow, PageHeader, SectionTitle, StatusPill } from "@/components/shared";
import { useStudio } from "@/lib/store";
import { moneySnapshot } from "@/lib/selectors";
import { money, pct, prettyDate } from "@/lib/format";
import { isLowStock } from "@/lib/calc";

type Search = { buy?: string; amount?: string };

export const Route = createFileRoute("/money")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    buy: typeof s.buy === "string" ? s.buy : undefined,
    amount: typeof s.amount === "string" ? s.amount : undefined,
  }),
  component: MoneyPage,
});

function MoneyPage() {
  const data = useStudio();
  const search = Route.useSearch();
  const setPeriod = useStudio((s) => s.setPeriod);
  const addSale = useStudio((s) => s.addSale);
  const addExpense = useStudio((s) => s.addExpense);
  const addDraw = useStudio((s) => s.addDraw);
  const patchSale = useStudio((s) => s.patchSale);
  const snap = moneySnapshot(data);
  const [saleOpen, setSaleOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [drawOpen, setDrawOpen] = useState(false);

  const [purchaseName, setPurchaseName] = useState(search.buy ?? "Natural cotton yarn");
  const [purchaseAmt, setPurchaseAmt] = useState(Number(search.amount ?? 120));
  const [purchaseDate, setPurchaseDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [essential, setEssential] = useState(true);
  const [expectedSales, setExpectedSales] = useState(0);

  const empty = data.sales.length === 0 && data.expenses.length === 0;

  const decision = useMemo(() => {
    const upcoming = snap.upcoming;
    const remaining = snap.cashAvailable - purchaseAmt - upcoming + expectedSales;
    const buffer = data.settings.operatingBuffer;
    const lowYarn = data.materials.some((m) => isLowStock(m) && m.type === "yarn");
    if (remaining >= buffer && (essential || lowYarn)) {
      return {
        label: "Buy" as const,
        reason: "You remain above your current operating buffer and this purchase supports current demand or reorder needs.",
      };
    }
    if (remaining < buffer && (essential || lowYarn) && remaining > 0) {
      return {
        label: "Partial buy" as const,
        reason: "Cash is limited, but some stock is needed to fulfill or protect near-term sales.",
      };
    }
    return {
      label: "Hold" as const,
      reason: "Known commitments plus the purchase would take cash below your operating buffer, and no confirmed sales offset it.",
    };
  }, [snap.cashAvailable, snap.upcoming, purchaseAmt, expectedSales, essential, data.settings.operatingBuffer, data.materials]);

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Money"
        title="Money"
        sub="Simple numbers. Honest decisions."
        action={
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="seaglass" onClick={() => setSaleOpen(true)}>
              Add sale
            </Button>
            <Button size="sm" variant="outline" onClick={() => setExpOpen(true)}>
              Add expense
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDrawOpen(true)}>
              Record owner draw
            </Button>
          </div>
        }
      />

      <FilterRow>
        <Chip active={data.period === "this-month"} onClick={() => setPeriod("this-month")}>
          This month
        </Chip>
        <Chip active={data.period === "last-month"} onClick={() => setPeriod("last-month")}>
          Last month
        </Chip>
      </FilterRow>

      {empty ? (
        <EmptyState
          title="Add a sale or expense to begin seeing the financial shape of Breeze & Loop."
          body="Numbers stay on this device. Nothing is sent to a bank or a shop."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Metric label="Sales" value={money(snap.salesRevenue)} note="Paid in this period" />
            <Metric label="Direct product costs" value={money(snap.directCosts)} note="True cost of sold units" />
            <Metric label="Operating expenses" value={money(snap.operating)} note="Non-product spend" />
            <Metric label="Operating profit" value={money(snap.operatingProfit)} note="After operating costs" />
            <Metric label="Cash available" value={money(snap.cashAvailable)} note="Received, not promised" />
            <Metric label="Expected cash" value={money(snap.expectedCash)} note="Unpaid orders" />
          </div>

          <section>
            <SectionTitle>Recent sales</SectionTitle>
            <ul className="rounded-xl bg-paper shadow-card divide-y divide-line">
              {snap.paidSales.concat(snap.awaiting).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{s.itemName}</p>
                    <p className="text-xs text-muted">
                      {prettyDate(s.date)} · qty {s.quantity}
                      {s.customer ? ` · ${s.customer}` : ""}
                    </p>
                  </div>
                  <p className="tabular text-sm">{money(s.total)}</p>
                  <button
                    type="button"
                    onClick={() => patchSale(s.id, { status: s.status === "paid" ? "awaiting" : "paid" })}
                  >
                    <StatusPill status={s.status} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle>Recent expenses</SectionTitle>
            <ul className="rounded-xl bg-paper shadow-card divide-y divide-line">
              {snap.expenses.map((e) => (
                <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <p className="text-sm">{e.description}</p>
                    <p className="text-xs text-muted">
                      {prettyDate(e.date)} · {e.category}
                    </p>
                  </div>
                  <p className="tabular text-sm">{money(e.amount, { cents: true })}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <SectionTitle>Product profitability</SectionTitle>
            <div className="overflow-x-auto rounded-xl bg-paper shadow-card">
              <table className="w-full text-sm">
                <thead className="text-left text-[11px] uppercase tracking-[0.12em] text-soft">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-3 py-3 font-medium">Units</th>
                    <th className="px-3 py-3 font-medium">Revenue</th>
                    <th className="px-3 py-3 font-medium">True cost</th>
                    <th className="px-3 py-3 font-medium">Profit</th>
                    <th className="px-4 py-3 font-medium">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {snap.profitability.map((p) => (
                    <tr key={p.name}>
                      <td className="px-4 py-3">{p.name}</td>
                      <td className="px-3 py-3 tabular">{p.units}</td>
                      <td className="px-3 py-3 tabular">{money(p.revenue)}</td>
                      <td className="px-3 py-3 tabular">{money(p.cost, { cents: true })}</td>
                      <td className="px-3 py-3 tabular">{money(p.profit, { cents: true })}</td>
                      <td className="px-4 py-3 tabular">{pct(p.margin)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <SectionTitle>Upcoming commitments</SectionTitle>
            <ul className="rounded-xl bg-paper shadow-card divide-y divide-line">
              {data.commitments.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {c.name}
                    <span className="text-muted"> · {prettyDate(c.date)}</span>
                  </span>
                  <span className="tabular">{money(c.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <section className="rounded-xl bg-paper p-5 shadow-card">
        <h2 className="font-display text-lg text-navy">Can I afford this?</h2>
        <p className="text-xs text-muted mt-1">A planning aid, not financial advice.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="Planned purchase">
            <Input value={purchaseName} onChange={(e) => setPurchaseName(e.target.value)} />
          </Field>
          <Field label="Amount">
            <Input type="number" value={purchaseAmt} onChange={(e) => setPurchaseAmt(Number(e.target.value))} />
          </Field>
          <Field label="Expected date">
            <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </Field>
          <Field label="Need">
            <Select value={essential ? "essential" : "optional"} onChange={(e) => setEssential(e.target.value === "essential")}>
              <option value="essential">Essential</option>
              <option value="optional">Optional</option>
            </Select>
          </Field>
          <Field label="Expected sales before purchase" className="md:col-span-2">
            <Input type="number" value={expectedSales} onChange={(e) => setExpectedSales(Number(e.target.value))} />
          </Field>
        </div>
        <dl className="mt-4 space-y-1.5 text-sm">
          <Row k="Current cash" v={money(snap.cashAvailable)} />
          <Row k={`Planned purchase · ${purchaseName}`} v={`−${money(purchaseAmt)}`} />
          <Row k="Upcoming known expenses" v={`−${money(snap.upcoming)}`} />
          {expectedSales ? <Row k="Expected sales" v={money(expectedSales)} /> : null}
          <Row
            k="Cash remaining after known commitments"
            v={money(snap.cashAvailable - purchaseAmt - snap.upcoming + expectedSales)}
          />
        </dl>
        <div className="mt-4 rounded-lg bg-secondary px-4 py-3">
          <p className="text-[11px] uppercase tracking-[0.14em] text-soft">Recommendation</p>
          <p className="font-display text-xl mt-1">{decision.label}</p>
          <p className="text-sm text-muted mt-1">{decision.reason}</p>
        </div>
      </section>

      <SaleDialog
        open={saleOpen}
        onOpenChange={setSaleOpen}
        products={data.products}
        onSave={(s) => {
          addSale(s);
          setSaleOpen(false);
          toast("Sale recorded.");
        }}
      />
      <ExpenseDialog
        open={expOpen}
        onOpenChange={setExpOpen}
        onSave={(e) => {
          addExpense(e);
          setExpOpen(false);
          toast("Expense recorded.");
        }}
      />
      <DrawDialog
        open={drawOpen}
        onOpenChange={setDrawOpen}
        onSave={(d) => {
          addDraw(d);
          setDrawOpen(false);
          toast("Owner draw recorded.");
        }}
      />
    </div>
  );
}

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-xl bg-paper p-4 shadow-card">
      <p className="text-[11px] uppercase tracking-[0.12em] text-soft">{label}</p>
      <p className="mt-2 font-display text-2xl tabular">{value}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{k}</span>
      <span className="tabular">{v}</span>
    </div>
  );
}

function SaleDialog({
  open,
  onOpenChange,
  onSave,
  products,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: { id: string; name: string; sellingPrice: number }[];
  onSave: (s: { date: string; productId?: string; itemName: string; quantity: number; total: number; status: "paid" | "awaiting"; customer?: string }) => void;
}) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(products[0]?.sellingPrice ?? 0);
  const [status, setStatus] = useState<"paid" | "awaiting">("paid");
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const product = products.find((p) => p.id === productId);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Add sale">
        <div className="mt-4 space-y-3">
          <Field label="Item">
            <Select
              value={productId}
              onChange={(e) => {
                setProductId(e.target.value);
                const p = products.find((x) => x.id === e.target.value);
                if (p) setTotal(p.sellingPrice * qty);
              }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Quantity">
            <Input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => {
                const q = Number(e.target.value);
                setQty(q);
                if (product) setTotal(product.sellingPrice * q);
              }}
            />
          </Field>
          <Field label="Sales total">
            <Input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
          </Field>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as "paid" | "awaiting")}>
              <option value="paid">Paid</option>
              <option value="awaiting">Awaiting payment</option>
            </Select>
          </Field>
          <Field label="Customer">
            <Input value={customer} onChange={(e) => setCustomer(e.target.value)} />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Button
            className="w-full"
            variant="seaglass"
            onClick={() =>
              onSave({
                date,
                productId: productId || undefined,
                itemName: product?.name ?? "Sale",
                quantity: qty,
                total,
                status,
                customer: customer || undefined,
              })
            }
          >
            Save sale
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExpenseDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (e: { date: string; category: string; description: string; amount: number; productRelated: boolean }) => void;
}) {
  const [category, setCategory] = useState("Materials");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const productRelated = category === "Materials" || category === "Packaging";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Add expense">
        <div className="mt-4 space-y-3">
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>Materials</option>
              <option>Packaging</option>
              <option>Transport</option>
              <option>Market fees</option>
              <option>Marketing</option>
              <option>Studio</option>
            </Select>
          </Field>
          <Field label="Description">
            <Input value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Amount">
            <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Button
            className="w-full"
            variant="seaglass"
            disabled={!description || !amount}
            onClick={() => onSave({ date, category, description, amount, productRelated })}
          >
            Save expense
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DrawDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (d: { date: string; amount: number; notes: string }) => void;
}) {
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Record owner draw">
        <div className="mt-4 space-y-3">
          <Field label="Amount">
            <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          </Field>
          <Field label="Notes">
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <Field label="Date">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Button className="w-full" variant="seaglass" disabled={!amount} onClick={() => onSave({ date, amount, notes })}>
            Save draw
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
