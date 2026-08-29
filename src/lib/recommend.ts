import { differenceInCalendarDays, parseISO } from "date-fns";
import type { AppData, Goal } from "./types";
import { contentProgress, grossMargin, isLowStock } from "./calc";
import { money } from "./format";

export type Move = {
  id: string;
  title: string;
  why: string;
  minutes: number;
  href: string;
  signals: string[];
  tradeoff?: string;
  priority: number;
  actionLabel: string;
};

function daysUntil(iso?: string) {
  if (!iso) return 99;
  try {
    return differenceInCalendarDays(parseISO(iso), new Date());
  } catch {
    return 99;
  }
}

function goalBoost(goal: Goal, family: number) {
  if (goal === "sales" && (family === 3 || family === 6)) return -0.2;
  if (goal === "cash-protection" && (family === 5 || family === 4)) return -0.2;
  if (goal === "product-launch" && (family === 2 || family === 3)) return -0.2;
  if (goal === "consistency" && family === 7) return -0.2;
  if (goal === "community-growth" && (family === 7 || family === 8)) return -0.2;
  return 0;
}

export function getMoves(data: AppData): Move[] {
  const { products, materials, content, sales, orders, tasks, settings, dismissedMoveIds } = data;
  const moves: Move[] = [];
  const goal = settings.currentGoal;

  for (const order of orders.filter((o) => o.status === "open" || o.status === "awaiting-payment")) {
    const due = daysUntil(order.dueDate);
    if (due > 3) continue;
    const product = products.find((p) => p.id === order.productId);
    if (order.status === "awaiting-payment") continue;
    if (product && (product.status === "in-production" || product.status === "prototype" || product.status === "idea")) {
      moves.push({
        id: `finish-${product.id}`,
        title: `Finish the ${product.name}`,
        why: `It completes the current production batch and gives you an item ready for today’s product content.`,
        minutes: 45,
        href: `/make/${product.id}`,
        actionLabel: "Start now",
        priority: 2 + goalBoost(goal, 2),
        signals: [
          `${order.customerName} is waiting on ${order.quantity} × ${order.productName}.`,
          due <= 0 ? "Due today." : `Due in ${due} day${due === 1 ? "" : "s"}.`,
          product.productionNotes || "In production.",
          `Expected value ${money(order.total)}.`,
        ],
        tradeoff: "Choosing this delays photography on finished pieces that could be listed today.",
      });
    }
  }

  for (const order of orders.filter((o) => o.status === "open")) {
    const due = daysUntil(order.dueDate);
    if (due > 2) continue;
    const product = products.find((p) => p.id === order.productId);
    if (product && (product.status === "finished" || product.status === "selling") && product.quantityAvailable > 0) {
      moves.push({
        id: `fulfill-${order.id}`,
        title: `Prepare ${order.productName} for ${order.customerName}`,
        why: `The piece is ready. Packing it today keeps a promised date.`,
        minutes: 20,
        href: `/make/${product.id}`,
        actionLabel: "Open product",
        priority: 1 + goalBoost(goal, 1),
        signals: [
          `Order due ${due <= 0 ? "today" : `in ${due} day${due === 1 ? "" : "s"}`}.`,
          `${product.quantityAvailable} available.`,
        ],
      });
    }
  }

  for (const p of products.filter((p) => p.status === "finished" || p.status === "selling")) {
    const progress = contentProgress(p.contentChecklist);
    const blocked = !p.contentChecklist.productPhoto || !p.contentChecklist.listingReady;
    if (!blocked) continue;
    const missing = !p.contentChecklist.productPhoto
      ? "photography"
      : !p.contentChecklist.listingReady
        ? "a listing"
        : "content";
    moves.push({
      id: `photo-${p.id}`,
      title: p.contentChecklist.productPhoto ? `List the ${p.name}` : `Photograph the ${p.name}`,
      why: `It is finished, has no completed product ${missing === "photography" ? "photography" : missing}, and completing it unlocks both a listing and today’s content.`,
      minutes: 45,
      href: `/make/${p.id}`,
      actionLabel: "Start now",
      priority: 3 + goalBoost(goal, 3),
      signals: [
        `Status: ${p.status === "selling" ? "Selling" : "Finished"}.`,
        `Content checklist ${progress.done} of ${progress.total}.`,
        `Selling price ${money(p.sellingPrice)} · margin ${grossMargin(p, materials).toFixed(1)}%.`,
        p.quantityAvailable ? `${p.quantityAvailable} available to sell.` : "No units on hand.",
      ],
      tradeoff: "This does not finish work already on the hook.",
    });
  }

  for (const m of materials.filter(isLowStock)) {
    const usedBy = products.filter(
      (p) =>
        (p.status === "in-production" || p.status === "prototype" || p.status === "idea") &&
        p.materials.some((l) => l.materialId === m.id),
    );
    moves.push({
      id: `reorder-${m.id}`,
      title: `Order ${m.name.toLowerCase()}`,
      why: `${m.name} is below reorder level${usedBy[0] ? ` and is needed for ${usedBy[0].name}` : ""}.`,
      minutes: 15,
      href: `/stock/${m.id}`,
      actionLabel: "Reorder",
      priority: 4 + goalBoost(goal, 4),
      signals: [
        `${m.quantityOnHand} ${m.purchaseUnit}${m.quantityOnHand === 1 ? "" : "s"} on hand · reorder at ${m.reorderLevel}.`,
        usedBy.length ? `Used in ${usedBy.map((p) => p.name).join(", ")}.` : "Protects upcoming makes.",
        `Supplier: ${m.supplier}, ${m.supplierLocation}.`,
      ],
      tradeoff: "Spending cash now versus finishing a piece that is already on the table.",
    });
  }

  for (const sale of sales.filter((s) => s.status === "awaiting")) {
    moves.push({
      id: `followup-${sale.id}`,
      title: `Follow up on the ${sale.itemName} payment`,
      why: `It is ${money(sale.total)} in expected cash, while you have a yarn purchase and market fee coming up.`,
      minutes: 10,
      href: "/money",
      actionLabel: "Open Money",
      priority: 5 + goalBoost(goal, 5),
      signals: [
        `${sale.customer ?? "Customer"} · ${money(sale.total)} awaiting.`,
        "Unpaid orders are not cash on hand.",
        `Operating buffer is ${money(settings.operatingBuffer)}.`,
      ],
      tradeoff: "A follow-up is short; it does not create a new piece to photograph.",
    });
  }

  for (const order of orders.filter((o) => o.status === "awaiting-payment")) {
    if (moves.some((m) => m.id.startsWith("followup-") && m.title.includes(order.productName))) continue;
    moves.push({
      id: `followup-order-${order.id}`,
      title: `Follow up with ${order.customerName}`,
      why: `${money(order.total)} is promised, not received. A short message protects the week’s cash.`,
      minutes: 10,
      href: "/money",
      actionLabel: "Open Money",
      priority: 5 + goalBoost(goal, 5),
      signals: [`${order.productName} · ${money(order.total)}.`, order.notes].filter(Boolean) as string[],
    });
  }

  const highMargin = products
    .filter((p) => (p.status === "finished" || p.status === "selling") && p.sellingPrice)
    .map((p) => ({ p, m: grossMargin(p, materials) }))
    .filter((x) => x.m >= 63)
    .sort((a, b) => b.m - a.m);
  if (highMargin[0]) {
    const { p, m } = highMargin[0];
    moves.push({
      id: `feature-${p.id}`,
      title: `Feature the ${p.name}`,
      why: `It is one of your higher-margin pieces and already exists. Giving it air time is cheaper than starting a new make.`,
      minutes: 25,
      href: `/make/${p.id}`,
      actionLabel: "Open product",
      priority: 6 + goalBoost(goal, 6),
      signals: [`Gross margin ${m.toFixed(1)}%.`, `${p.quantityAvailable} available.`, `Price ${money(p.sellingPrice)}.`],
      tradeoff: "This is strategic, not urgent. It should not jump a deadline.",
    });
  }

  for (const c of content.filter((c) => c.status === "ready")) {
    const due = daysUntil(c.targetDate);
    moves.push({
      id: `post-${c.id}`,
      title: `Post “${c.title}”`,
      why:
        due <= 0
          ? "It is ready and scheduled for today. Publishing it keeps the studio visible without a new shoot."
          : "It is already in the ready column. A small push gets it out of the studio.",
      minutes: 20,
      href: `/content/${c.id}`,
      actionLabel: "Open content",
      priority: 7 + goalBoost(goal, 7),
      signals: [
        `${c.pillar} · ${c.format}.`,
        c.targetDate ? (due <= 0 ? "Targeted for today." : `Target ${c.targetDate}.`) : "No date set.",
        c.linkedProductId
          ? `Linked to ${products.find((p) => p.id === c.linkedProductId)?.name ?? "a product"}.`
          : "Standalone piece.",
      ],
    });
  }

  const idea = content.find((c) => c.status === "idea");
  if (idea) {
    moves.push({
      id: `shape-${idea.id}`,
      title: `Shape “${idea.title}”`,
      why: "A quiet planning task. Useful if the urgent work is already in motion.",
      minutes: 20,
      href: `/content/${idea.id}`,
      actionLabel: "Open idea",
      priority: 8 + goalBoost(goal, 8),
      signals: [`${idea.pillar}.`, idea.hook || idea.coreMessage],
      tradeoff: "Creative work that does not move cash or stock today.",
    });
  }

  const openTask = tasks.find((t) => !t.completed && !t.deferredTo);
  if (openTask && !moves.some((m) => m.title === openTask.title)) {
    const href =
      openTask.linkedKind === "product"
        ? `/make/${openTask.linkedId}`
        : openTask.linkedKind === "content"
          ? `/content/${openTask.linkedId}`
          : openTask.linkedKind === "material"
            ? `/stock/${openTask.linkedId}`
            : openTask.linkedKind === "sale" || openTask.linkedKind === "order"
              ? "/money"
              : "/";
    moves.push({
      id: `task-${openTask.id}`,
      title: openTask.title,
      why: "It is already on today’s list.",
      minutes: 20,
      href,
      actionLabel: "Open",
      priority: 8,
      signals: [`Priority ${openTask.priority}.`, `Due ${openTask.dueDate}.`],
    });
  }

  const unique = new Map<string, Move>();
  for (const m of moves) {
    if (dismissedMoveIds.includes(m.id)) continue;
    const prev = unique.get(m.id);
    if (!prev || m.priority < prev.priority) unique.set(m.id, m);
  }

  return [...unique.values()].sort((a, b) => a.priority - b.priority || a.minutes - b.minutes);
}

export function emptyMove(): Move {
  return {
    id: "empty",
    title: "Add one true thing",
    why: "I can help you choose a next move once I know a little more. Add one product, material, or task—or tell me what you are trying to accomplish this week.",
    minutes: 10,
    href: "/make/new",
    actionLabel: "Add a product",
    priority: 9,
    signals: ["The studio is still empty of records."],
  };
}
