import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, E as unitCost, _ as inventoryValue, b as landedCost, m as useStudio, u as money, v as isLowStock } from "./router-D-9UDxAx.mjs";
import { a as ProductThumb, i as PageHeader, s as StatusPill } from "./shared-B8h2AmBE.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-BmiNw2SN.mjs";
import { i as Textarea, n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/material-form-CmEa-wgT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MaterialForm({ material: initial, isNew, onSave }) {
	const [m, setM] = (0, import_react.useState)(initial);
	const receiveStock = useStudio((s) => s.receiveStock);
	const [receiveOpen, setReceiveOpen] = (0, import_react.useState)(false);
	const [recv, setRecv] = (0, import_react.useState)({
		quantity: 1,
		purchaseCost: 0,
		shipping: 0,
		duties: 0,
		usableUnits: 1
	});
	const navigate = useNavigate();
	const patch = (p) => setM((x) => ({
		...x,
		...p
	}));
	const low = isLowStock(m);
	const needed = Math.max(0, m.reorderLevel + 2 - m.quantityOnHand);
	const est = unitCost(m) * needed;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Stock",
				title: isNew ? "Add material" : m.name || "Untitled",
				sub: m.variant,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: low ? "reorder" : "healthy" })
			}),
			m.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-square max-w-xs overflow-hidden rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductThumb, {
					src: m.imageUrl,
					swatch: "#D9C7A8",
					alt: m.name
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Material name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: m.name,
							onChange: (e) => patch({ name: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Type",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: m.type,
							onChange: (e) => patch({ type: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "yarn",
									children: "Yarn"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "hardware",
									children: "Hardware"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "packaging",
									children: "Packaging"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tools",
									children: "Tools"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Supplier",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: m.supplier,
							onChange: (e) => patch({ supplier: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Supplier location",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: m.supplierLocation,
							onChange: (e) => patch({ supplierLocation: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Colour, weight, size",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: m.variant,
							onChange: (e) => patch({ variant: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Purchase unit",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: m.purchaseUnit,
							onChange: (e) => patch({ purchaseUnit: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quantity purchased",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: m.quantityPurchased,
							onChange: (e) => patch({ quantityPurchased: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quantity on hand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: m.quantityOnHand,
							onChange: (e) => patch({ quantityOnHand: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Item purchase cost",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.01",
							value: m.purchaseCost,
							onChange: (e) => patch({ purchaseCost: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Shipping",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.01",
							value: m.shipping,
							onChange: (e) => patch({ shipping: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Duties / fees",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.01",
							value: m.duties,
							onChange: (e) => patch({ duties: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Usable units received",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: m.usableUnits,
							onChange: (e) => patch({ usableUnits: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reorder level",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: m.reorderLevel,
							onChange: (e) => patch({ reorderLevel: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Last purchased",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: m.lastPurchased,
							onChange: (e) => patch({ lastPurchased: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Notes / supplier link",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: m.notes,
								onChange: (e) => patch({ notes: e.target.value })
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Landed cost",
						value: money(landedCost(m), { cents: true })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Unit cost",
						value: money(unitCost(m), { cents: true })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Inventory value",
						value: money(inventoryValue(m), { cents: true })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "seaglass",
						onClick: () => {
							onSave({
								...m,
								name: m.name.trim() || "Untitled material"
							});
							toast("Saved on this device.");
						},
						children: "Save"
					}),
					!isNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setReceiveOpen(true),
						children: "Receive stock"
					}) : null,
					low ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => void navigate({
							to: "/money",
							search: {
								buy: m.name,
								amount: String(Math.round(est) || 120)
							}
						}),
						children: "Reorder"
					}) : null
				]
			}),
			low ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Suggested buy: ",
					needed,
					" ",
					m.purchaseUnit,
					"s from ",
					m.supplier || "your supplier",
					" · about ",
					money(Math.round(est) || 120),
					"."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: receiveOpen,
				onOpenChange: setReceiveOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Receive stock",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Quantity arriving",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: recv.quantity,
									onChange: (e) => setRecv({
										...recv,
										quantity: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Purchase cost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									value: recv.purchaseCost,
									onChange: (e) => setRecv({
										...recv,
										purchaseCost: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Shipping",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									value: recv.shipping,
									onChange: (e) => setRecv({
										...recv,
										shipping: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Duties",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									value: recv.duties,
									onChange: (e) => setRecv({
										...recv,
										duties: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Usable units",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: recv.usableUnits,
									onChange: (e) => setRecv({
										...recv,
										usableUnits: Number(e.target.value)
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								variant: "seaglass",
								onClick: () => {
									onSave(m);
									receiveStock(m.id, recv);
									setReceiveOpen(false);
									toast("Stock received. Unit cost now includes this landing.");
								},
								children: "Add to on hand"
							})
						]
					})
				})
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-paper px-3 py-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.12em] text-soft",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 tabular text-navy",
			children: value
		})]
	});
}
//#endregion
export { MaterialForm as t };
