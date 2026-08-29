import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Field } from "@/components/ui/label";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PageHeader, StatusPill } from "@/components/shared";
import { generateContentDraft } from "@/lib/generate-draft";
import { localCaptionDraft } from "@/lib/factories";
import type { ContentFormat, ContentItem, ContentPillar, ContentStatus } from "@/lib/types";
import { CONTENT_FORMATS, CONTENT_PILLARS } from "@/lib/types";
import { useStudio } from "@/lib/store";
import { format } from "date-fns";

const STAGES: ContentStatus[] = ["idea", "captured", "editing", "ready", "published"];

export function ContentForm({
  item: initial,
  isNew,
  onSave,
}: {
  item: ContentItem;
  isNew?: boolean;
  onSave: (c: ContentItem) => void;
}) {
  const products = useStudio((s) => s.products);
  const materials = useStudio((s) => s.materials);
  const publish = useStudio((s) => s.publishContent);
  const [c, setC] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [pubOpen, setPubOpen] = useState(false);
  const [channel, setChannel] = useState(c.channel ?? "Instagram");
  const [pubDate, setPubDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const patch = (p: Partial<ContentItem>) => setC((x) => ({ ...x, ...p }));

  const generate = async () => {
    setBusy(true);
    const product = products.find((p) => p.id === c.linkedProductId);
    try {
      const result = await generateContentDraft({
        data: {
          title: c.title,
          productName: product?.name,
          pillar: c.pillar,
          format: c.format,
          message: c.coreMessage,
        },
      });
      if (result.ok) {
        patch({
          hook: result.hook,
          caption: result.caption,
          cta: result.cta,
          shotList: result.shotList,
        });
        toast(result.source === "grok" ? "Draft ready — edit before you keep it." : "Studio draft ready — edit before you keep it.");
      }
    } catch {
      const fallback = localCaptionDraft({
        title: c.title,
        productName: product?.name,
        pillar: c.pillar,
        format: c.format,
        message: c.coreMessage,
      });
      patch(fallback);
      toast("Studio draft ready — edit before you keep it.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Content"
        title={isNew ? "New content idea" : c.title || "Untitled"}
        sub={c.pillar}
        action={<StatusPill status={c.status} />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Working title">
          <Input value={c.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Pillar">
          <Select value={c.pillar} onChange={(e) => patch({ pillar: e.target.value as ContentPillar })}>
            {CONTENT_PILLARS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Format">
          <Select value={c.format} onChange={(e) => patch({ format: e.target.value as ContentFormat })}>
            {CONTENT_FORMATS.map((f) => (
              <option key={f} value={f}>
                {f.replace("-", " ")}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={c.status} onChange={(e) => patch({ status: e.target.value as ContentStatus })}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Linked product">
          <Select
            value={c.linkedProductId ?? ""}
            onChange={(e) => patch({ linkedProductId: e.target.value || undefined })}
          >
            <option value="">None</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Linked material">
          <Select
            value={c.linkedMaterialId ?? ""}
            onChange={(e) => patch({ linkedMaterialId: e.target.value || undefined })}
          >
            <option value="">None</option>
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </Field>
        <div className="md:col-span-2">
          <Field label="Core message">
            <Textarea value={c.coreMessage} onChange={(e) => patch({ coreMessage: e.target.value })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Hook">
            <Input value={c.hook} onChange={(e) => patch({ hook: e.target.value })} />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field label="Caption draft">
            <Textarea rows={5} value={c.caption} onChange={(e) => patch({ caption: e.target.value })} />
          </Field>
        </div>
        <Field label="CTA">
          <Input value={c.cta} onChange={(e) => patch({ cta: e.target.value })} />
        </Field>
        <Field label="Target post date">
          <Input type="date" value={c.targetDate ?? ""} onChange={(e) => patch({ targetDate: e.target.value })} />
        </Field>
        <div className="md:col-span-2">
          <Field label="Shot list (one per line)">
            <Textarea
              rows={5}
              value={c.shotList.join("\n")}
              onChange={(e) => patch({ shotList: e.target.value.split("\n") })}
            />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-[13px] font-medium tracking-wide text-muted mb-2">Asset checklist</p>
        <div className="rounded-xl bg-paper p-3 shadow-card space-y-1">
          {c.assets.map((a, i) => (
            <Checkbox
              key={`${a.label}-${i}`}
              checked={a.done}
              onChange={(v) =>
                patch({
                  assets: c.assets.map((x, idx) => (idx === i ? { ...x, done: v } : x)),
                })
              }
              label={a.label}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="seaglass"
          onClick={() => {
            onSave({ ...c, title: c.title.trim() || "Untitled idea" });
            toast("Saved on this device.");
          }}
        >
          Save
        </Button>
        <Button variant="outline" disabled={busy} onClick={() => void generate()}>
          {busy ? "Writing…" : "Generate draft"}
        </Button>
        {c.status !== "published" ? (
          <Button variant="outline" onClick={() => setPubOpen(true)}>
            Mark published
          </Button>
        ) : null}
      </div>

      <Dialog open={pubOpen} onOpenChange={setPubOpen}>
        <DialogContent title="Where did this go out?">
          <div className="mt-4 space-y-3">
            <Field label="Channel">
              <Select value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option>Instagram</option>
                <option>TikTok</option>
                <option>Website</option>
                <option>Email</option>
              </Select>
            </Field>
            <Field label="Published date">
              <Input type="date" value={pubDate} onChange={(e) => setPubDate(e.target.value)} />
            </Field>
            <Button
              className="w-full"
              variant="seaglass"
              onClick={() => {
                onSave(c);
                publish(c.id, channel, pubDate);
                setPubOpen(false);
                toast("Marked published. Nothing was posted automatically.");
              }}
            >
              Save as published
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
