import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, m as useStudio, u as money } from "./router-D-9UDxAx.mjs";
import { i as PageHeader } from "./shared-B8h2AmBE.mjs";
import { n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BXyeG8kb.js
var import_jsx_runtime = require_jsx_runtime();
var GOALS = [
	{
		id: "sales",
		label: "Sales",
		note: "List and follow through on pieces that can earn."
	},
	{
		id: "consistency",
		label: "Consistency",
		note: "Keep making and posting in a sustainable rhythm."
	},
	{
		id: "product-launch",
		label: "Product launch",
		note: "Finish and photograph what is almost ready."
	},
	{
		id: "cash-protection",
		label: "Cash protection",
		note: "Collect what is owed and pause optional spend."
	},
	{
		id: "community-growth",
		label: "Community growth",
		note: "Publish ready work and tell the studio story."
	}
];
function SettingsPage() {
	const settings = useStudio((s) => s.settings);
	const update = useStudio((s) => s.updateSettings);
	const reset = useStudio((s) => s.resetStudio);
	const clearDismissed = useStudio((s) => s.clearDismissed);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Studio",
				title: "Profile & settings",
				sub: "This is a private cockpit. Nothing here is public."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Your name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: settings.ownerName,
					onChange: (e) => update({ ownerName: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Operating cash buffer",
				hint: `Default ${money(300)}. Used by “Can I afford this?”`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: settings.operatingBuffer,
					onChange: (e) => update({ operatingBuffer: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Opening cash (this month’s starting point)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.01",
					value: settings.openingCash,
					onChange: (e) => update({ openingCash: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Default labour rate / hour",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: settings.labourRateDefault,
					onChange: (e) => update({ labourRateDefault: Number(e.target.value) })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Current goal",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
					value: settings.currentGoal,
					onChange: (e) => update({ currentGoal: e.target.value }),
					children: GOALS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: g.id,
						children: g.label
					}, g.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: GOALS.find((g) => g.id === settings.currentGoal)?.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => {
						clearDismissed();
						toast("Today’s dismissed moves are back.");
					},
					children: "Restore dismissed moves"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						if (confirm("Reset the studio to the original sample records? Your edits on this device will be replaced.")) {
							reset();
							toast("Sample studio restored.");
						}
					},
					children: "Restore sample studio"
				})]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
