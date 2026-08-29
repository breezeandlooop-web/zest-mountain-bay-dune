import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, T as trueCost, d as pct, g as grossMargin, h as contentProgress, m as useStudio, u as money } from "./router-D-9UDxAx.mjs";
import { a as ProductThumb, i as PageHeader, n as EmptyState, r as FilterRow, s as StatusPill, t as Chip } from "./shared-B8h2AmBE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/make-B59aDUVh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "idea",
		label: "Ideas"
	},
	{
		id: "in-production",
		label: "In Production"
	},
	{
		id: "finished",
		label: "Finished"
	},
	{
		id: "selling",
		label: "Selling"
	},
	{
		id: "archived",
		label: "Archived"
	}
];
function MakePage() {
	const products = useStudio((s) => s.products);
	const materials = useStudio((s) => s.materials);
	const [tab, setTab] = (0, import_react.useState)("all");
	const visible = products.filter((p) => {
		if (tab === "all") return p.status !== "archived";
		if (tab === "idea") return p.status === "idea" || p.status === "prototype";
		return p.status === tab;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Make",
			title: "Make",
			sub: "From idea to something ready to sell.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "seaglass",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/make/new",
					children: "New product"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, { children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: tab === t.id,
			onClick: () => setTab(t.id),
			children: t.label
		}, t.id)) }),
		visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No products yet.",
				body: "Begin with something you are making, testing, or dreaming up.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "seaglass",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/make/new",
						children: "New product"
					})
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2",
			children: visible.map((p) => {
				const cost = trueCost(p, materials);
				const margin = grossMargin(p, materials);
				const progress = contentProgress(p.contentChecklist);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/make/$productId",
					params: { productId: p.id },
					className: "rounded-xl bg-paper shadow-card hover:shadow-card-hover transition-[box-shadow] duration-150 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "aspect-[4/3] bg-secondary overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductThumb, {
							src: p.imageUrl,
							swatch: p.swatch,
							alt: p.name
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-navy",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted mt-0.5",
									children: p.category
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: p.status })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-3 gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-soft",
										children: "Price"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "tabular text-navy",
										children: money(p.sellingPrice)
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-soft",
										children: "Cost"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "tabular text-navy",
										children: money(cost, { cents: true })
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-soft",
										children: "Margin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: margin < p.targetMargin * 100 ? "tabular text-clay" : "tabular text-seaglass-deep",
										children: p.sellingPrice ? pct(margin) : "—"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted",
								children: [
									"Content ",
									progress.done,
									"/",
									progress.total
								]
							})
						]
					})]
				}, p.id);
			})
		})
	] });
}
//#endregion
export { MakePage as component };
