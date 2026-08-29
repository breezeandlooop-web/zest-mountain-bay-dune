import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader } from "@/components/shared";
import { useStudio } from "@/lib/store";
import type { Goal } from "@/lib/types";
import { money } from "@/lib/format";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const GOALS: { id: Goal; label: string; note: string }[] = [
  { id: "sales", label: "Sales", note: "List and follow through on pieces that can earn." },
  { id: "consistency", label: "Consistency", note: "Keep making and posting in a sustainable rhythm." },
  { id: "product-launch", label: "Product launch", note: "Finish and photograph what is almost ready." },
  { id: "cash-protection", label: "Cash protection", note: "Collect what is owed and pause optional spend." },
  { id: "community-growth", label: "Community growth", note: "Publish ready work and tell the studio story." },
];

function SettingsPage() {
  const settings = useStudio((s) => s.settings);
  const update = useStudio((s) => s.updateSettings);
  const reset = useStudio((s) => s.resetStudio);
  const clearDismissed = useStudio((s) => s.clearDismissed);

  return (
    <div className="space-y-8 max-w-lg">
      <PageHeader kicker="Studio" title="Profile & settings" sub="This is a private cockpit. Nothing here is public." />

      <Field label="Your name">
        <Input value={settings.ownerName} onChange={(e) => update({ ownerName: e.target.value })} />
      </Field>
      <Field label="Operating cash buffer" hint={`Default ${money(300)}. Used by “Can I afford this?”`}>
        <Input
          type="number"
          value={settings.operatingBuffer}
          onChange={(e) => update({ operatingBuffer: Number(e.target.value) })}
        />
      </Field>
      <Field label="Opening cash (this month’s starting point)">
        <Input
          type="number"
          step="0.01"
          value={settings.openingCash}
          onChange={(e) => update({ openingCash: Number(e.target.value) })}
        />
      </Field>
      <Field label="Default labour rate / hour">
        <Input
          type="number"
          value={settings.labourRateDefault}
          onChange={(e) => update({ labourRateDefault: Number(e.target.value) })}
        />
      </Field>
      <Field label="Current goal">
        <Select value={settings.currentGoal} onChange={(e) => update({ currentGoal: e.target.value as Goal })}>
          {GOALS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </Select>
      </Field>
      <p className="text-sm text-muted">{GOALS.find((g) => g.id === settings.currentGoal)?.note}</p>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => { clearDismissed(); toast("Today’s dismissed moves are back."); }}>
          Restore dismissed moves
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            if (confirm("Reset the studio to the original sample records? Your edits on this device will be replaced.")) {
              reset();
              toast("Sample studio restored.");
            }
          }}
        >
          Restore sample studio
        </Button>
      </div>
    </div>
  );
}
