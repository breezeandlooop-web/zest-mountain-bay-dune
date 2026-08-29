import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as cn } from "./utils-BEOGomfO.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as statusLabel } from "./router-D-9UDxAx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shared-B8h2AmBE.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { tone: {
		navy: "bg-navy/8 text-navy",
		seaglass: "bg-seaglass-soft text-seaglass-deep",
		clay: "bg-clay-soft text-clay",
		amber: "bg-amber-soft text-navy",
		muted: "bg-secondary text-muted"
	} },
	defaultVariants: { tone: "navy" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
function statusTone(status) {
	if (status === "reorder" || status === "awaiting" || status === "awaiting-payment") return "amber";
	if (status === "healthy" || status === "selling" || status === "ready" || status === "published" || status === "paid") return "seaglass";
	if (status === "archived" || status === "retired") return "muted";
	if (status === "in-production" || status === "editing") return "clay";
	return "navy";
}
function PageHeader({ kicker, title, sub, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.18em] text-soft mb-1",
				children: kicker
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[1.75rem] md:text-[2rem] text-navy",
				children: title
			}),
			sub ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted max-w-xl",
				children: sub
			}) : null
		] }), action]
	});
}
function EmptyState({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-paper px-6 py-12 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl text-navy",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted max-w-md mx-auto",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex justify-center",
				children: action
			}) : null
		]
	});
}
function ProductThumb({ src, swatch, alt, className }) {
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: cn("product-photo size-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("size-full", className),
		style: { background: `linear-gradient(145deg, ${swatch}, color-mix(in oklab, ${swatch} 70%, white))` },
		"aria-label": alt
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: statusTone(status),
		children: statusLabel(status)
	});
}
function SectionTitle({ children, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-3 mb-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg text-navy",
			children
		}), action]
	});
}
function FilterRow({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1",
		children
	});
}
function Chip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 shrink-0 rounded-full px-3.5 text-sm transition-colors", active ? "bg-navy text-ivory" : "bg-paper text-navy shadow-card hover:shadow-card-hover"),
		children
	});
}
//#endregion
export { ProductThumb as a, PageHeader as i, EmptyState as n, SectionTitle as o, FilterRow as r, StatusPill as s, Chip as t };
