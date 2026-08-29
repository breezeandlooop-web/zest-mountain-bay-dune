import { o as cn } from "./utils-BEOGomfO.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { p as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkbox-DgLJxv4b.js
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ checked, onChange, label, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: cn("group flex items-center gap-3 text-left min-h-11", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex size-5 shrink-0 items-center justify-center rounded-[5px] transition-colors", checked ? "bg-seaglass text-ivory" : "bg-ivory shadow-card"),
			children: checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
				className: "size-3.5",
				strokeWidth: 2.4
			}) : null
		}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-navy",
			children: label
		}) : null]
	});
}
//#endregion
export { Checkbox as t };
