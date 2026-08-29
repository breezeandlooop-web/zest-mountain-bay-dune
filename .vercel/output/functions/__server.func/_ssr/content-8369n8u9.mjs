import { i as __toESM } from "../_runtime.mjs";
import { o as cn, r as CONTENT_PILLARS } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, c as formatLabel, m as useStudio } from "./router-D-9UDxAx.mjs";
import { i as PageHeader, n as EmptyState, r as FilterRow, s as StatusPill, t as Chip } from "./shared-B8h2AmBE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-8369n8u9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"idea",
	"captured",
	"editing",
	"ready",
	"published"
];
function ContentPage() {
	const content = useStudio((s) => s.content);
	const products = useStudio((s) => s.products);
	const setStatus = useStudio((s) => s.setContentStatus);
	const [stage, setStage] = (0, import_react.useState)("all");
	const [pillar, setPillar] = (0, import_react.useState)("all");
	const month = (/* @__PURE__ */ new Date()).getMonth();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const counts = {
		idea: content.filter((c) => c.status === "idea").length,
		captured: content.filter((c) => c.status === "captured").length,
		editing: content.filter((c) => c.status === "editing").length,
		ready: content.filter((c) => c.status === "ready").length,
		published: content.filter((c) => {
			if (c.status !== "published" || !c.publishedDate) return false;
			const d = new Date(c.publishedDate);
			return d.getMonth() === month && d.getFullYear() === year;
		}).length
	};
	const visible = content.filter((c) => {
		if (stage !== "all" && c.status !== stage) return false;
		if (pillar !== "all" && c.pillar !== pillar) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Content Studio",
			title: "Content Studio",
			sub: "Capture the story while you make the work.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "seaglass",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/content/new",
					children: "New content idea"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-5 gap-2 mb-5",
			children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setStage(stage === s ? "all" : s),
				className: cn("rounded-xl bg-paper p-3 shadow-card text-left", stage === s && "ring-1 ring-seaglass"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-[0.12em] text-soft",
					children: s === "published" ? "Published" : s
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl tabular mt-1",
					children: s === "published" ? counts.published : counts[s]
				})]
			}, s))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: pillar === "all",
			onClick: () => setPillar("all"),
			children: "All pillars"
		}), CONTENT_PILLARS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: pillar === p,
			onClick: () => setPillar(p),
			children: p
		}, p))] }),
		visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Good content begins with a real moment.",
				body: "Capture an idea, a product detail, or something island life just handed you.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "seaglass",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/content/new",
						children: "New content idea"
					})
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-2",
			children: visible.map((c) => {
				const linked = products.find((p) => p.id === c.linkedProductId)?.name ?? (c.linkedMaterialId ? "Material" : null);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-paper shadow-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/content/$contentId",
						params: { contentId: c.id },
						className: "block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted mt-1",
								children: [
									c.pillar,
									" · ",
									formatLabel(c.format),
									linked ? ` · ${linked}` : ""
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: c.status })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2 overflow-x-auto",
						children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setStatus(c.id, s),
							className: cn("h-8 px-2.5 rounded-full text-xs shrink-0", c.status === s ? "bg-navy text-ivory" : "bg-secondary text-muted"),
							children: s
						}, s))
					})]
				}, c.id);
			})
		})
	] });
}
//#endregion
export { ContentPage as component };
