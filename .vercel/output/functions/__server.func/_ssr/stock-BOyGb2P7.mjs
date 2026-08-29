import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, E as unitCost, _ as inventoryValue, m as useStudio, u as money, v as isLowStock } from "./router-D-9UDxAx.mjs";
import { a as ProductThumb, i as PageHeader, n as EmptyState, r as FilterRow, s as StatusPill, t as Chip } from "./shared-B8h2AmBE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock-BOyGb2P7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "yarn",
		label: "Yarn"
	},
	{
		id: "hardware",
		label: "Hardware"
	},
	{
		id: "packaging",
		label: "Packaging"
	},
	{
		id: "tools",
		label: "Tools"
	},
	{
		id: "low",
		label: "Low stock"
	}
];
function StockPage() {
	const materials = useStudio((s) => s.materials);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const visible = materials.filter((m) => {
		if (filter === "all") return true;
		if (filter === "low") return isLowStock(m);
		return m.type === filter;
	});
	const value = materials.reduce((n, m) => n + inventoryValue(m), 0);
	const low = materials.filter(isLowStock).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Stock",
			title: "Stock",
			sub: "Materials, packaging, and the true cost behind each piece.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "seaglass",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/stock/new",
					children: "Add material"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-3 mb-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
					label: "Materials on hand",
					value: String(materials.length)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
					label: "Inventory value",
					value: money(Math.round(value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Summary, {
					label: "Low-stock items",
					value: String(low)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterRow, { children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
			active: filter === f.id,
			onClick: () => setFilter(f.id),
			children: f.label
		}, f.id)) }),
		visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Your material library starts here.",
				body: "Add yarn, findings, packaging, or anything you use to make and ship a piece.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "seaglass",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/stock/new",
						children: "Add material"
					})
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 rounded-xl bg-paper shadow-card divide-y divide-line",
			children: visible.map((m) => {
				const lowItem = isLowStock(m);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/stock/$materialId",
					params: { materialId: m.id },
					className: "flex items-center gap-3 px-3 py-3 min-h-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-12 rounded-md overflow-hidden bg-secondary shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductThumb, {
								src: m.imageUrl,
								swatch: m.type === "yarn" ? "#D9C7A8" : "#C4B49A",
								alt: m.name
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium truncate",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									m.quantityOnHand,
									" ",
									m.purchaseUnit,
									m.quantityOnHand === 1 ? "" : "s",
									" · ",
									money(unitCost(m), { cents: true }),
									" / ",
									m.purchaseUnit
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: lowItem ? "reorder" : "healthy" })
					]
				}) }, m.id);
			})
		})
	] });
}
function Summary({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-paper p-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.12em] text-soft",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-display text-xl tabular",
			children: value
		})]
	});
}
//#endregion
export { StockPage as component };
