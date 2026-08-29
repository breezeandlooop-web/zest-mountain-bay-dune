import { i as __toESM } from "../_runtime.mjs";
import { n as CONTENT_FORMATS, r as CONTENT_PILLARS } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, m as useStudio } from "./router-D-9UDxAx.mjs";
import { i as PageHeader, s as StatusPill } from "./shared-B8h2AmBE.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as localCaptionDraft } from "./factories-BppLBeFw.mjs";
import { t as Checkbox } from "./checkbox-DgLJxv4b.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-BmiNw2SN.mjs";
import { i as Textarea, n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-form-CrUpBroA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var generateContentDraft = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("bf7aa4748e3177edfb40cc55c39e759bf491e6189d38e1ee26255c9a83dfc5de"));
var STAGES = [
	"idea",
	"captured",
	"editing",
	"ready",
	"published"
];
function ContentForm({ item: initial, isNew, onSave }) {
	const products = useStudio((s) => s.products);
	const materials = useStudio((s) => s.materials);
	const publish = useStudio((s) => s.publishContent);
	const [c, setC] = (0, import_react.useState)(initial);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [pubOpen, setPubOpen] = (0, import_react.useState)(false);
	const [channel, setChannel] = (0, import_react.useState)(c.channel ?? "Instagram");
	const [pubDate, setPubDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const patch = (p) => setC((x) => ({
		...x,
		...p
	}));
	const generate = async () => {
		setBusy(true);
		const product = products.find((p) => p.id === c.linkedProductId);
		try {
			const result = await generateContentDraft({ data: {
				title: c.title,
				productName: product?.name,
				pillar: c.pillar,
				format: c.format,
				message: c.coreMessage
			} });
			if (result.ok) {
				patch({
					hook: result.hook,
					caption: result.caption,
					cta: result.cta,
					shotList: result.shotList
				});
				toast(result.source === "grok" ? "Draft ready — edit before you keep it." : "Studio draft ready — edit before you keep it.");
			}
		} catch {
			const fallback = localCaptionDraft({
				title: c.title,
				productName: product?.name,
				pillar: c.pillar,
				format: c.format,
				message: c.coreMessage
			});
			patch(fallback);
			toast("Studio draft ready — edit before you keep it.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Content",
				title: isNew ? "New content idea" : c.title || "Untitled",
				sub: c.pillar,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: c.status })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Working title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: c.title,
							onChange: (e) => patch({ title: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Pillar",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: c.pillar,
							onChange: (e) => patch({ pillar: e.target.value }),
							children: CONTENT_PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p,
								children: p
							}, p))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Format",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: c.format,
							onChange: (e) => patch({ format: e.target.value }),
							children: CONTENT_FORMATS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: f,
								children: f.replace("-", " ")
							}, f))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: c.status,
							onChange: (e) => patch({ status: e.target.value }),
							children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Linked product",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: c.linkedProductId ?? "",
							onChange: (e) => patch({ linkedProductId: e.target.value || void 0 }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Linked material",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: c.linkedMaterialId ?? "",
							onChange: (e) => patch({ linkedMaterialId: e.target.value || void 0 }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: m.id,
								children: m.name
							}, m.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Core message",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: c.coreMessage,
								onChange: (e) => patch({ coreMessage: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Hook",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: c.hook,
								onChange: (e) => patch({ hook: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Caption draft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 5,
								value: c.caption,
								onChange: (e) => patch({ caption: e.target.value })
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "CTA",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: c.cta,
							onChange: (e) => patch({ cta: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Target post date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: c.targetDate ?? "",
							onChange: (e) => patch({ targetDate: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Shot list (one per line)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 5,
								value: c.shotList.join("\n"),
								onChange: (e) => patch({ shotList: e.target.value.split("\n") })
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] font-medium tracking-wide text-muted mb-2",
				children: "Asset checklist"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl bg-paper p-3 shadow-card space-y-1",
				children: c.assets.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: a.done,
					onChange: (v) => patch({ assets: c.assets.map((x, idx) => idx === i ? {
						...x,
						done: v
					} : x) }),
					label: a.label
				}, `${a.label}-${i}`))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "seaglass",
						onClick: () => {
							onSave({
								...c,
								title: c.title.trim() || "Untitled idea"
							});
							toast("Saved on this device.");
						},
						children: "Save"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: busy,
						onClick: () => void generate(),
						children: busy ? "Writing…" : "Generate draft"
					}),
					c.status !== "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setPubOpen(true),
						children: "Mark published"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: pubOpen,
				onOpenChange: setPubOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Where did this go out?",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Channel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: channel,
									onChange: (e) => setChannel(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Instagram" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "TikTok" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Website" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Email" })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Published date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: pubDate,
									onChange: (e) => setPubDate(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								variant: "seaglass",
								onClick: () => {
									onSave(c);
									publish(c.id, channel, pubDate);
									setPubOpen(false);
									toast("Marked published. Nothing was posted automatically.");
								},
								children: "Save as published"
							})
						]
					})
				})
			})
		]
	});
}
//#endregion
export { ContentForm as t };
