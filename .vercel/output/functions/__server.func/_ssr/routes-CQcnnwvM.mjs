import { i as __toESM } from "../_runtime.mjs";
import { o as cn } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as useRouter, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Ellipsis, o as Plus, p as Check } from "../_libs/lucide-react.mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { D as Button, O as Hummingbird, f as prettyDate, l as greeting, m as useStudio, o as emptyMove, s as getMoves, u as money, v as isLowStock } from "./router-D-9UDxAx.mjs";
import { n as EmptyState, o as SectionTitle } from "./shared-B8h2AmBE.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-BmiNw2SN.mjs";
import { n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
import { n as photographyGap, r as pulse } from "./selectors-tcHAIeK5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CQcnnwvM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = useStudio();
	const router = useRouter();
	const toggleTask = useStudio((s) => s.toggleTask);
	const deferTask = useStudio((s) => s.deferTask);
	const addTask = useStudio((s) => s.addTask);
	const setMovingOpen = useStudio((s) => s.setMovingOpen);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [why, setWhy] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(null);
	const metrics = pulse(data);
	const gap = photographyGap(data);
	const next = getMoves(data)[0] ?? emptyMove();
	const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
	const tasks = data.tasks.filter((t) => !t.deferredTo || t.deferredTo <= today).slice(0, 5);
	const low = data.materials.filter(isLowStock);
	const unpaid = data.sales.filter((s) => s.status === "awaiting");
	const expensesHigh = metrics.operating > metrics.sales * .7 && metrics.sales > 0;
	if (data.products.length === 0 && data.materials.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Your studio is ready when you are.",
		body: "Add your first product or material to begin. The dashboard will start connecting the dots.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "seaglass",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/make/new",
				children: "Add a product"
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-soft",
					children: "Home"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 text-[1.85rem] md:text-[2.15rem] text-navy",
					children: [
						greeting(),
						", ",
						data.settings.ownerName,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: format(/* @__PURE__ */ new Date(), "EEEE, d MMMM")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Business Pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "Cash available",
						value: money(metrics.cashAvailable),
						to: "/money",
						note: "On hand, not promised"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "This month’s sales",
						value: money(metrics.sales),
						to: "/money",
						note: "Paid only"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "Open orders",
						value: String(metrics.openOrders),
						to: "/money",
						note: "Including unpaid"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "Inventory value",
						value: money(Math.round(metrics.inventoryValue)),
						to: "/stock",
						note: "Materials on hand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "Finished products",
						value: String(metrics.finishedProducts),
						to: "/make",
						note: "Finished or selling"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PulseCard, {
						label: "Content ready",
						value: String(metrics.contentReady),
						to: "/content",
						note: "Waiting to publish"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setAddOpen(true),
					className: "text-sm text-seaglass inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add task"]
				}),
				children: "Today"
			}), tasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted rounded-xl bg-paper px-4 py-6 shadow-card",
				children: "Nothing urgent today. Capture a task or ask the hummingbird what matters most."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "rounded-xl bg-paper shadow-card divide-y divide-line",
				children: tasks.map((task) => {
					const href = taskHref(task.linkedKind, task.linkedId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 px-3 min-h-14",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleTask(task.id),
								className: cn("size-11 shrink-0 inline-flex items-center justify-center"),
								"aria-label": task.completed ? "Mark incomplete" : "Mark complete",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("flex size-5 items-center justify-center rounded-full border", task.completed ? "bg-seaglass border-seaglass text-ivory" : "border-navy/30"),
									children: task.completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "size-3",
										strokeWidth: 2.4
									}) : null
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex-1 text-left py-3",
								onClick: () => href && router.history.push(href),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-sm", task.completed && "line-through text-muted"),
									children: task.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-soft",
									children: [
										prettyDate(task.dueDate),
										" · ",
										task.priority
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-11 inline-flex items-center justify-center text-muted",
									"aria-label": "Task menu",
									onClick: () => setMenu(menu === task.id ? null : task.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
								}), menu === task.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute right-0 top-10 z-10 w-40 rounded-md bg-paper py-1 shadow-card-hover",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "w-full px-3 py-2 text-left text-sm hover:bg-secondary",
										onClick: () => {
											deferTask(task.id);
											setMenu(null);
										},
										children: "Defer to tomorrow"
									})
								}) : null]
							})
						]
					}, task.id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-paper p-5 md:p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "size-6 text-seaglass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] uppercase tracking-[0.18em] text-soft",
							children: "Your Next Move"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-navy mt-3 text-balance",
						children: next.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted max-w-xl",
						children: next.why
					}),
					why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1.5",
						children: next.signals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-navy pl-3 border-l-2 border-seaglass",
							children: s
						}, s))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "seaglass",
								onClick: () => router.history.push(next.href),
								children: "Start now"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setWhy((v) => !v),
								children: "See why"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setMovingOpen(true),
								children: "Choose another action"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-paper p-5 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "This Week’s Opportunity" }), gap.finished === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Add products, materials, or expenses and the dashboard will begin connecting the dots."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"You have ",
						gap.finished,
						" finished products, but only ",
						gap.withPhoto,
						" have photography marked complete.",
						gap.missing[0] ? ` Photographing the ${gap.missing.map((p) => p.name).slice(0, 2).join(" and ")} unlocks listings and content.` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/content",
						children: "Open Content"
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Attention Needed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2",
				children: [
					low.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/stock/$materialId",
						params: { materialId: m.id },
						className: "flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-2 rounded-full bg-amber shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: m.name
							}), " is below reorder level."]
						})]
					}) }, m.id)),
					unpaid.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/money",
						className: "flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-2 rounded-full bg-clay shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [
								"One order needs customer follow-up — ",
								s.itemName,
								", ",
								money(s.total),
								"."
							]
						})]
					}) }, s.id)),
					expensesHigh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/money",
						className: "flex items-start gap-3 rounded-xl bg-paper px-4 py-3 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 size-2 rounded-full bg-amber shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "This month’s expenses are approaching the monthly sales total."
						})]
					}) }) : null,
					low.length === 0 && unpaid.length === 0 && !expensesHigh ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted px-1",
						children: "Nothing exceptional. The studio is holding."
					}) : null
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddTaskDialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				onSave: (t) => {
					addTask(t);
					setAddOpen(false);
				},
				products: data.products
			})
		]
	});
}
function PulseCard({ label, value, to, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: "rounded-xl bg-paper p-4 shadow-card hover:shadow-card-hover transition-[box-shadow] duration-150",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.14em] text-soft",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl tabular text-navy",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: note
			})
		]
	});
}
function taskHref(kind, id) {
	if (!kind || !id) return void 0;
	if (kind === "product") return `/make/${id}`;
	if (kind === "content") return `/content/${id}`;
	if (kind === "material") return `/stock/${id}`;
	if (kind === "sale" || kind === "order") return "/money";
}
function AddTaskDialog({ open, onOpenChange, onSave, products }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [linked, setLinked] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Add task",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "What needs doing?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Due",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: due,
							onChange: (e) => setDue(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Priority",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: priority,
							onChange: (e) => setPriority(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "high",
									children: "High"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "medium",
									children: "Medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "low",
									children: "Low"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Linked product",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: linked,
							onChange: (e) => setLinked(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "seaglass",
						disabled: !title.trim(),
						onClick: () => onSave({
							title: title.trim(),
							dueDate: due,
							priority,
							linkedKind: linked ? "product" : void 0,
							linkedId: linked || void 0
						}),
						children: "Save task"
					})
				]
			})
		})
	});
}
//#endregion
export { Home as component };
