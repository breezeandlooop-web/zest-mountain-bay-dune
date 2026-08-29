import { i as __toESM } from "../_runtime.mjs";
import { a as PRODUCT_STATUSES, t as CHECKLIST_LABELS } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Pause, i as Square, s as Play } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, E as unitCost, S as materialCostForProduct, d as pct, m as useStudio, u as money, w as suggestedRetail, x as liveTrueCost, y as labourCost } from "./router-D-9UDxAx.mjs";
import { a as ProductThumb, i as PageHeader, s as StatusPill } from "./shared-B8h2AmBE.mjs";
import { i as contentFromProduct } from "./factories-BppLBeFw.mjs";
import { t as Checkbox } from "./checkbox-DgLJxv4b.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-BmiNw2SN.mjs";
import { i as Textarea, n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-form-mz3lcT0I.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductForm({ product: initial, isNew, onSave }) {
	const materials = useStudio((s) => s.materials);
	const upsertContent = useStudio((s) => s.upsertContent);
	const markFinished = useStudio((s) => s.markProductFinished);
	const duplicate = useStudio((s) => s.duplicateProduct);
	const archive = useStudio((s) => s.archiveProduct);
	const restore = useStudio((s) => s.restoreProduct);
	const toggleTimer = useStudio((s) => s.toggleTimer);
	const addManualTime = useStudio((s) => s.addManualTime);
	const live = useStudio((s) => s.products.find((p) => p.id === initial.id) ?? initial);
	const [p, setP] = (0, import_react.useState)(initial);
	const [archiveOpen, setArchiveOpen] = (0, import_react.useState)(false);
	const [finishOpen, setFinishOpen] = (0, import_react.useState)(false);
	const [manualHours, setManualHours] = (0, import_react.useState)("");
	const [addMat, setAddMat] = (0, import_react.useState)("");
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		setP((prev) => {
			const fromStore = live;
			return {
				...fromStore,
				...prev,
				hoursWorked: fromStore.hoursWorked,
				timerRunning: fromStore.timerRunning,
				timerStartedAt: fromStore.timerStartedAt,
				status: fromStore.status,
				quantityMade: fromStore.quantityMade,
				quantityAvailable: fromStore.quantityAvailable,
				frozenTrueCost: fromStore.frozenTrueCost,
				contentChecklist: fromStore.contentChecklist
			};
		});
	}, [
		live.hoursWorked,
		live.timerRunning,
		live.status,
		live.contentChecklist,
		live.quantityAvailable
	]);
	const working = {
		...live,
		...p,
		hoursWorked: live.hoursWorked,
		timerRunning: live.timerRunning,
		materials: p.materials,
		contentChecklist: live.contentChecklist
	};
	const matCost = materialCostForProduct(working, materials);
	const labour = labourCost(working);
	const cost = liveTrueCost(working, materials);
	const profit = working.sellingPrice - cost;
	const margin = working.sellingPrice ? profit / working.sellingPrice * 100 : 0;
	const suggested = suggestedRetail(working, materials);
	const below = working.sellingPrice > 0 && margin < working.targetMargin * 100 - .05;
	const elapsed = useTimerTick(live);
	const patch = (partial) => setP((x) => ({
		...x,
		...partial
	}));
	const save = () => {
		onSave({
			...working,
			name: working.name.trim() || "Untitled piece"
		});
		toast("Saved on this device.");
	};
	const createContent = () => {
		const saved = {
			...working,
			name: working.name.trim() || "Untitled piece"
		};
		onSave(saved);
		const draft = contentFromProduct(saved);
		upsertContent(draft);
		navigate({
			to: "/content/$contentId",
			params: { contentId: draft.id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Make",
				title: isNew ? "New product" : working.name || "Untitled piece",
				sub: working.category,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: working.status })
			}),
			working.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[16/9] max-h-72 overflow-hidden rounded-xl bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductThumb, {
					src: working.imageUrl,
					swatch: working.swatch,
					alt: working.name,
					className: "w-full h-full object-cover"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-24 rounded-xl overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductThumb, {
					swatch: working.swatch,
					alt: working.name
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.name,
							onChange: (e) => patch({ name: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: p.category,
							onChange: (e) => patch({ category: e.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: p.status,
							onChange: (e) => patch({ status: e.target.value }),
							children: PRODUCT_STATUSES.filter((s) => s !== "archived").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s.replace("-", " ")
							}, s))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Colour swatch",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "color",
							value: p.swatch,
							onChange: (e) => patch({ swatch: e.target.value }),
							className: "h-11 p-1"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quantity made",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: p.quantityMade,
							onChange: (e) => patch({ quantityMade: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quantity available",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							value: p.quantityAvailable,
							onChange: (e) => patch({ quantityAvailable: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Selling price (BBD)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							step: "0.01",
							value: p.sellingPrice,
							onChange: (e) => patch({ sellingPrice: Number(e.target.value) })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Wholesale price",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							step: "0.01",
							value: p.wholesalePrice ?? "",
							onChange: (e) => patch({ wholesalePrice: e.target.value ? Number(e.target.value) : void 0 })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Target margin",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 0,
							max: 90,
							value: Math.round(p.targetMargin * 100),
							onChange: (e) => patch({ targetMargin: Number(e.target.value) / 100 })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "md:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description / concept",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: p.description,
								onChange: (e) => patch({ description: e.target.value }),
								rows: 3
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg text-navy mb-3",
					children: "Cost & pricing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-paper p-4 shadow-card space-y-3",
					children: [
						p.materials.map((line) => {
							const m = materials.find((x) => x.id === line.materialId);
							if (!m) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "flex-1 text-sm",
										children: m.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.05",
										className: "w-24",
										value: line.quantity,
										onChange: (e) => patch({ materials: p.materials.map((l) => l.materialId === line.materialId ? {
											...l,
											quantity: Number(e.target.value)
										} : l) })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "w-24 text-right text-sm tabular text-muted",
										children: money(line.quantity * unitCost(m), { cents: true })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs text-clay",
										onClick: () => patch({ materials: p.materials.filter((l) => l.materialId !== line.materialId) }),
										children: "Remove"
									})
								]
							}, line.materialId);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: addMat,
								onChange: (e) => setAddMat(e.target.value),
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Add a material from Stock"
								}), materials.filter((m) => !p.materials.some((l) => l.materialId === m.id)).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.id,
									children: m.name
								}, m.id))]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								disabled: !addMat,
								onClick: () => {
									patch({ materials: [...p.materials, {
										materialId: addMat,
										quantity: 1
									}] });
									setAddMat("");
								},
								children: "Add"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 md:grid-cols-2 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Packaging cost",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.01",
										value: p.packagingCost,
										onChange: (e) => patch({ packagingCost: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Other direct costs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.01",
										value: p.otherDirectCosts,
										onChange: (e) => patch({ otherDirectCosts: Number(e.target.value) })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Hours worked",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.1",
										value: live.hoursWorked,
										readOnly: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Labour rate / hour",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										step: "0.5",
										value: p.labourRate,
										onChange: (e) => patch({ labourRate: Number(e.target.value) })
									})
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 grid grid-cols-2 md:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "Material cost",
							value: money(matCost, { cents: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "Packaging / direct",
							value: money(p.packagingCost + p.otherDirectCosts, { cents: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "Labour cost",
							value: money(labour, { cents: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "True cost to make",
							value: money(cost, { cents: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "Gross profit / unit",
							value: money(profit, { cents: true })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostStat, {
							label: "Gross margin",
							value: working.sellingPrice ? pct(margin) : "—",
							warn: below
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"Suggested retail at ",
						Math.round(p.targetMargin * 100),
						"% target:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-navy tabular",
							children: money(suggested)
						})
					]
				}),
				below ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-clay",
					children: [
						"This price is below your target margin. Consider ",
						money(Math.ceil(suggested)),
						" or reduce costs."
					]
				}) : null,
				!working.sellingPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "I need a selling price before I can assess this product’s margin."
				}) : null
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg text-navy mb-3",
					children: "Production"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Start date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: p.startDate ?? "",
								onChange: (e) => patch({ startDate: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Target completion",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: p.targetCompletionDate ?? "",
								onChange: (e) => patch({ targetCompletionDate: e.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Production notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: p.productionNotes,
									onChange: (e) => patch({ productionNotes: e.target.value })
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => toggleTimer(working.id),
							disabled: isNew,
							children: [live.timerRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), live.timerRunning ? "Pause" : "Start timer"]
						}),
						live.timerRunning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => toggleTimer(working.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-4" }), " Stop"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular text-muted ml-1",
							children: elapsed
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex gap-2 max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						step: "0.25",
						min: 0,
						placeholder: "Hours",
						value: manualHours,
						onChange: (e) => setManualHours(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "soft",
						disabled: !manualHours || isNew,
						onClick: () => {
							addManualTime(working.id, Number(manualHours));
							setManualHours("");
						},
						children: "Add time"
					})]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg text-navy mb-3",
					children: "Content checklist"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid sm:grid-cols-2 gap-1 rounded-xl bg-paper p-3 shadow-card",
					children: CHECKLIST_LABELS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: live.contentChecklist[item.key],
						onChange: () => useStudio.getState().toggleChecklist(working.id, item.key),
						label: item.label
					}, item.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					variant: "outline",
					onClick: createContent,
					children: "Create Content"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "seaglass",
						onClick: save,
						children: "Save"
					}),
					!isNew && working.status !== "finished" && working.status !== "selling" && working.status !== "archived" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setFinishOpen(true),
						children: "Mark finished"
					}) : null,
					!isNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							const id = duplicate(working.id);
							if (id) navigate({
								to: "/make/$productId",
								params: { productId: id }
							});
						},
						children: "Duplicate product"
					}) : null,
					!isNew && working.status !== "archived" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setArchiveOpen(true),
						children: "Archive"
					}) : null,
					working.status === "archived" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => restore(working.id),
						children: "Restore"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: archiveOpen,
				onOpenChange: setArchiveOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Archive this product?",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "You can restore it later. Sales history stays with the original."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "clay",
							onClick: () => {
								archive(working.id);
								setArchiveOpen(false);
								navigate({ to: "/make" });
							},
							children: "Archive"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setArchiveOpen(false),
							children: "Cancel"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: finishOpen,
				onOpenChange: setFinishOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					title: "Mark this finished?",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Status becomes Finished, available inventory increases, and material usage is taken from Stock. Historical cost will be fixed."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "seaglass",
							onClick: () => {
								onSave(working);
								markFinished(working.id);
								setFinishOpen(false);
								toast("Marked finished. Create content while the piece is still in your hands.");
							},
							children: "Mark finished"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => {
								onSave(working);
								markFinished(working.id);
								setFinishOpen(false);
								createContent();
							},
							children: "Mark finished and create content"
						})]
					})]
				})
			})
		]
	});
}
function CostStat({ label, value, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-paper px-3 py-3 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.12em] text-soft",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 tabular ${warn ? "text-clay" : "text-navy"}`,
			children: value
		})]
	});
}
function useTimerTick(product) {
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		if (!product.timerRunning) return;
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, [product.timerRunning]);
	const extra = product.timerRunning && product.timerStartedAt ? (now - product.timerStartedAt) / 36e5 : 0;
	const hours = product.hoursWorked + extra;
	const h = Math.floor(hours);
	const m = Math.floor((hours - h) * 60);
	return (0, import_react.useMemo)(() => `${h}h ${String(m).padStart(2, "0")}m`, [h, m]);
}
//#endregion
export { ProductForm as t };
