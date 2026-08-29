import "../_runtime.mjs";
import { o as cn } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Field({ label, children, hint, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("flex flex-col gap-1.5", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[13px] font-medium tracking-wide text-muted",
				children: label
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-soft",
				children: hint
			}) : null
		]
	});
}
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-md bg-ivory px-3 text-sm text-navy shadow-card", "placeholder:text-soft file:border-0 file:bg-transparent", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md bg-ivory px-3 py-2.5 text-sm text-navy shadow-card", "placeholder:text-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50", "disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("flex h-11 w-full rounded-md bg-ivory px-3 text-sm text-navy shadow-card", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/50", className),
		...props,
		children
	});
}
//#endregion
export { Textarea as i, Input as n, Select as r, Field as t };
