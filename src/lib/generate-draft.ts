import { createServerFn } from "@tanstack/react-start";
import { localCaptionDraft } from "./factories";

type DraftInput = {
  title: string;
  productName?: string;
  pillar?: string;
  format?: string;
  message?: string;
};

export const generateContentDraft = createServerFn({ method: "POST" })
  .validator((input: DraftInput) => input)
  .handler(async ({ data }) => {
    const fallback = localCaptionDraft(data);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: true as const, source: "studio" as const, ...fallback };
    }
    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 400,
          messages: [
            {
              role: "system",
              content:
                "You write short, editable content drafts for Breeze & Loop, a Caribbean fibre arts studio. Quiet, specific, never bubbly or salesy. Return JSON only: {hook, caption, cta, shotList: string[5]}.",
            },
            {
              role: "user",
              content: JSON.stringify(data),
            },
          ],
        }),
      });
      if (!res.ok) return { ok: true as const, source: "studio" as const, ...fallback };
      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      const text = body.choices[0]?.message.content ?? "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart < 0 || jsonEnd < 0) return { ok: true as const, source: "studio" as const, ...fallback };
      const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1)) as {
        hook?: string;
        caption?: string;
        cta?: string;
        shotList?: string[];
      };
      return {
        ok: true as const,
        source: "grok" as const,
        hook: parsed.hook || fallback.hook,
        caption: parsed.caption || fallback.caption,
        cta: parsed.cta || fallback.cta,
        shotList: parsed.shotList?.length ? parsed.shotList : fallback.shotList,
      };
    } catch {
      return { ok: true as const, source: "studio" as const, ...fallback };
    }
  });
