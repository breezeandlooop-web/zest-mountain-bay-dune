import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as localCaptionDraft } from "./factories-BppLBeFw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-draft-9BkvTIDb.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateContentDraft_createServerFn_handler = createServerRpc({
	id: "bf7aa4748e3177edfb40cc55c39e759bf491e6189d38e1ee26255c9a83dfc5de",
	name: "generateContentDraft",
	filename: "src/lib/generate-draft.ts"
}, (opts) => generateContentDraft.__executeServer(opts));
var generateContentDraft = createServerFn({ method: "POST" }).validator((input) => input).handler(generateContentDraft_createServerFn_handler, async ({ data }) => {
	const fallback = localCaptionDraft(data);
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		source: "studio",
		...fallback
	};
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				max_tokens: 400,
				messages: [{
					role: "system",
					content: "You write short, editable content drafts for Breeze & Loop, a Caribbean fibre arts studio. Quiet, specific, never bubbly or salesy. Return JSON only: {hook, caption, cta, shotList: string[5]}."
				}, {
					role: "user",
					content: JSON.stringify(data)
				}]
			})
		});
		if (!res.ok) return {
			ok: true,
			source: "studio",
			...fallback
		};
		const text = (await res.json()).choices[0]?.message.content ?? "";
		const jsonStart = text.indexOf("{");
		const jsonEnd = text.lastIndexOf("}");
		if (jsonStart < 0 || jsonEnd < 0) return {
			ok: true,
			source: "studio",
			...fallback
		};
		const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
		return {
			ok: true,
			source: "grok",
			hook: parsed.hook || fallback.hook,
			caption: parsed.caption || fallback.caption,
			cta: parsed.cta || fallback.cta,
			shotList: parsed.shotList?.length ? parsed.shotList : fallback.shotList
		};
	} catch {
		return {
			ok: true,
			source: "studio",
			...fallback
		};
	}
});
//#endregion
export { generateContentDraft_createServerFn_handler };
