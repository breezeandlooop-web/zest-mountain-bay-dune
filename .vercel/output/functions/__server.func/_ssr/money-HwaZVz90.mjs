import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, a as Route$8, d as pct, f as prettyDate, m as useStudio, u as money, v as isLowStock } from "./router-D-9UDxAx.mjs";
import { i as PageHeader, n as EmptyState, o as SectionTitle, r as FilterRow, s as StatusPill, t as Chip } from "./shared-B8h2AmBE.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-BmiNw2SN.mjs";
import { i as Textarea, n as Input, r as Select, t as Field } from "./select-DfkdF2gf.mjs";
import { t as moneySnapshot } from "./selectors-tcHAIeK5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/money-HwaZVz90.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MoneyPage() {
	const data = useStudio();
	const search = Route$8.useSearch();
	const setPeriod = useStudio((s) => s.setPeriod);
	const addSale = useStudio((s) => s.addSale);
	const addExpense = useStudio((s) => s.addExpense);
	const addDraw = useStudio((s) => s.addDraw);
	const patchSale = useStudio((s) => s.patchSale);
	const snap = moneySnapshot(data);
	const [saleOpen, setSaleOpen] = (0, import_react.useState)(false);
	const [expOpen, setExpOpen] = (0, import_react.useState)(false);
	const [drawOpen, setDrawOpen] = (0, import_react.useState)(false);
	const [purchaseName, setPurchaseName] = (0, import_react.useState)(search.buy ?? "Natural cotton yarn");
	const [purchaseAmt, setPurchaseAmt] = (0, import_react.useState)(Number(search.amount ?? 120));
	const [purchaseDate, setPurchaseDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const [essential, setEssential] = (0, import_react.useState)(true);
	const [expectedSales, setExpectedSales] = (0, import_react.useState)(0);
	const empty = data.sales.length === 0 && data.expenses.length === 0;
	const decision = (0, import_react.useMemo)(() => {
		const upcoming = snap.upcoming;
		const remaining = snap.cashAvailable - purchaseAmt - upcoming + expectedSales;
		const buffer = data.settings.operatingBuffer;
		const lowYarn = data.materials.some((m) => isLowStock(m) && m.type === "yarn");
		if (remaining >= buffer && (essential || lowYarn)) return {
			label: "Buy",
			reason: "You remain above your current operating buffer and this purchase supports current demand or reorder needs."
		};
		if (remaining < buffer && (essential || lowYarn) && remaining > 0) return {
			label: "Partial buy",
			reason: "Cash is limited, but some stock is needed to fulfill or protect near-term sales."
		};
		return {
			label: "Hold",
			reason: "Known commitments plus the purchase would take cash below your operating buffer, and no confirmed sales offset it."
		};
	}, [
		snap.cashAvailable,
		snap.upcoming,
		purchaseAmt,
		expectedSales,
		essential,
		data.settings.operatingBuffer,
		data.materials
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Money",
				title: "Money",
				sub: "Simple numbers. Honest decisions.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "seaglass",
							onClick: () => setSaleOpen(true),
							children: "Add sale"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setExpOpen(true),
							children: "Add expense"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => setDrawOpen(true),
							children: "Record owner draw"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FilterRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: data.period === "this-month",
				onClick: () => setPeriod("this-month"),
				children: "This month"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: data.period === "last-month",
				onClick: () => setPeriod("last-month"),
				children: "Last month"
			})] }),
			empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Add a sale or expense to begin seeing the financial shape of Breeze & Loop.",
				body: "Numbers stay on this device. Nothing is sent to a bank or a shop."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Sales",
							value: money(snap.salesRevenue),
							note: "Paid in this period"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Direct product costs",
							value: money(snap.directCosts),
							note: "True cost of sold units"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Operating expenses",
							value: money(snap.operating),
							note: "Non-product spend"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Operating profit",
							value: money(snap.operatingProfit),
							note: "After operating costs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Cash available",
							value: money(snap.cashAvailable),
							note: "Received, not promised"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
							label: "Expected cash",
							value: money(snap.expectedCash),
							note: "Unpaid orders"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Recent sales" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "rounded-xl bg-paper shadow-card divide-y divide-line",
					children: snap.paidSales.concat(snap.awaiting).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: s.itemName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										prettyDate(s.date),
										" · qty ",
										s.quantity,
										s.customer ? ` · ${s.customer}` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "tabular text-sm",
								children: money(s.total)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => patchSale(s.id, { status: s.status === "paid" ? "awaiting" : "paid" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: s.status })
							})
						]
					}, s.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Recent expenses" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "rounded-xl bg-paper shadow-card divide-y divide-line",
					children: snap.expenses.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: e.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									prettyDate(e.date),
									" · ",
									e.category
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "tabular text-sm",
							children: money(e.amount, { cents: true })
						})]
					}, e.id))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Product profitability" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-xl bg-paper shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-[11px] uppercase tracking-[0.12em] text-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Units"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Revenue"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "True cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-3 font-medium",
									children: "Profit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Margin"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-line",
							children: snap.profitability.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 tabular",
									children: p.units
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 tabular",
									children: money(p.revenue)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 tabular",
									children: money(p.cost, { cents: true })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-3 tabular",
									children: money(p.profit, { cents: true })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 tabular",
									children: pct(p.margin)
								})
							] }, p.name))
						})]
					})
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, { children: "Upcoming commitments" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "rounded-xl bg-paper shadow-card divide-y divide-line",
					children: data.commitments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [" · ", prettyDate(c.date)]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular",
							children: money(c.amount)
						})]
					}, c.id))
				})] })
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-paper p-5 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg text-navy",
						children: "Can I afford this?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted mt-1",
						children: "A planning aid, not financial advice."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Planned purchase",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: purchaseName,
									onChange: (e) => setPurchaseName(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Amount",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: purchaseAmt,
									onChange: (e) => setPurchaseAmt(Number(e.target.value))
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Expected date",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: purchaseDate,
									onChange: (e) => setPurchaseDate(e.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Need",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: essential ? "essential" : "optional",
									onChange: (e) => setEssential(e.target.value === "essential"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "essential",
										children: "Essential"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "optional",
										children: "Optional"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Expected sales before purchase",
								className: "md:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: expectedSales,
									onChange: (e) => setExpectedSales(Number(e.target.value))
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 space-y-1.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Current cash",
								v: money(snap.cashAvailable)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: `Planned purchase · ${purchaseName}`,
								v: `−${money(purchaseAmt)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Upcoming known expenses",
								v: `−${money(snap.upcoming)}`
							}),
							expectedSales ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Expected sales",
								v: money(expectedSales)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Cash remaining after known commitments",
								v: money(snap.cashAvailable - purchaseAmt - snap.upcoming + expectedSales)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-lg bg-secondary px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-[0.14em] text-soft",
								children: "Recommendation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xl mt-1",
								children: decision.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted mt-1",
								children: decision.reason
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaleDialog, {
				open: saleOpen,
				onOpenChange: setSaleOpen,
				products: data.products,
				onSave: (s) => {
					addSale(s);
					setSaleOpen(false);
					toast("Sale recorded.");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExpenseDialog, {
				open: expOpen,
				onOpenChange: setExpOpen,
				onSave: (e) => {
					addExpense(e);
					setExpOpen(false);
					toast("Expense recorded.");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawDialog, {
				open: drawOpen,
				onOpenChange: setDrawOpen,
				onSave: (d) => {
					addDraw(d);
					setDrawOpen(false);
					toast("Owner draw recorded.");
				}
			})
		]
	});
}
function Metric({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-paper p-4 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] uppercase tracking-[0.12em] text-soft",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-display text-2xl tabular",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: note
			})
		]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular",
			children: v
		})]
	});
}
function SaleDialog({ open, onOpenChange, onSave, products }) {
	const [productId, setProductId] = (0, import_react.useState)(products[0]?.id ?? "");
	const [qty, setQty] = (0, import_react.useState)(1);
	const [total, setTotal] = (0, import_react.useState)(products[0]?.sellingPrice ?? 0);
	const [status, setStatus] = (0, import_react.useState)("paid");
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const product = products.find((p) => p.id === productId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Add sale",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Item",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
							value: productId,
							onChange: (e) => {
								setProductId(e.target.value);
								const p = products.find((x) => x.id === e.target.value);
								if (p) setTotal(p.sellingPrice * qty);
							},
							children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.id,
								children: p.name
							}, p.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Quantity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							min: 1,
							value: qty,
							onChange: (e) => {
								const q = Number(e.target.value);
								setQty(q);
								if (product) setTotal(product.sellingPrice * q);
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sales total",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: total,
							onChange: (e) => setTotal(Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: status,
							onChange: (e) => setStatus(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "paid",
								children: "Paid"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "awaiting",
								children: "Awaiting payment"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Customer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: customer,
							onChange: (e) => setCustomer(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "seaglass",
						onClick: () => onSave({
							date,
							productId: productId || void 0,
							itemName: product?.name ?? "Sale",
							quantity: qty,
							total,
							status,
							customer: customer || void 0
						}),
						children: "Save sale"
					})
				]
			})
		})
	});
}
function ExpenseDialog({ open, onOpenChange, onSave }) {
	const [category, setCategory] = (0, import_react.useState)("Materials");
	const [description, setDescription] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)(0);
	const [date, setDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	const productRelated = category === "Materials" || category === "Packaging";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Add expense",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Materials" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Packaging" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Transport" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Market fees" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Marketing" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Studio" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: description,
							onChange: (e) => setDescription(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							step: "0.01",
							value: amount,
							onChange: (e) => setAmount(Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "seaglass",
						disabled: !description || !amount,
						onClick: () => onSave({
							date,
							category,
							description,
							amount,
							productRelated
						}),
						children: "Save expense"
					})
				]
			})
		})
	});
}
function DrawDialog({ open, onOpenChange, onSave }) {
	const [amount, setAmount] = (0, import_react.useState)(0);
	const [notes, setNotes] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Record owner draw",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: amount,
							onChange: (e) => setAmount(Number(e.target.value))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: notes,
							onChange: (e) => setNotes(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (e) => setDate(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "seaglass",
						disabled: !amount,
						onClick: () => onSave({
							date,
							amount,
							notes
						}),
						children: "Save draw"
					})
				]
			})
		})
	});
}
//#endregion
export { MoneyPage as component };
