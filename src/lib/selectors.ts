import {
  addMonths,
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import type { AppData } from "./types";
import { inventoryValue, isLowStock, saleTrueCost, trueCost } from "./calc";
import { contentProgress } from "./calc";

export type DateRange = { start: Date; end: Date };

export function rangeFor(
  data: { period: string; customFrom?: string; customTo?: string },
  ref = new Date(),
): DateRange {
  if (data.period === "last-month") {
    const d = subMonths(ref, 1);
    return { start: startOfMonth(d), end: endOfMonth(d) };
  }
  if (data.period === "custom" && data.customFrom && data.customTo) {
    return { start: parseISO(data.customFrom), end: parseISO(data.customTo) };
  }
  return { start: startOfMonth(ref), end: endOfMonth(ref) };
}

function inRange(iso: string, range: DateRange) {
  try {
    return isWithinInterval(parseISO(iso), range);
  } catch {
    return false;
  }
}

export function moneySnapshot(
  data: AppData & { period: string; customFrom?: string; customTo?: string },
  ref = new Date(),
) {
  const range = rangeFor(data, ref);
  const paidSales = data.sales.filter((s) => s.status === "paid" && inRange(s.date, range));
  const awaiting = data.sales.filter((s) => s.status === "awaiting" && inRange(s.date, range));
  const expenses = data.expenses.filter((e) => inRange(e.date, range));
  const draws = data.draws.filter((d) => inRange(d.date, range));
  const salesRevenue = paidSales.reduce((n, s) => n + s.total, 0);
  const expectedCash = awaiting.reduce((n, s) => n + s.total, 0);
  const directCosts = paidSales.reduce((n, s) => n + saleTrueCost(s, data.products, data.materials), 0);
  const operating = expenses.filter((e) => !e.productRelated).reduce((n, e) => n + e.amount, 0);
  const allPaidOut = expenses.reduce((n, e) => n + e.amount, 0) + draws.reduce((n, d) => n + d.amount, 0);
  const grossProfit = salesRevenue - directCosts;
  const grossMargin = salesRevenue ? (grossProfit / salesRevenue) * 100 : 0;
  const operatingProfit = grossProfit - operating;
  const cashAvailable = data.settings.openingCash + salesRevenue - allPaidOut;
  const upcoming = data.commitments.reduce((n, c) => n + c.amount, 0);

  const byProduct = new Map<string, { name: string; units: number; revenue: number; cost: number }>();
  for (const s of paidSales) {
    const key = s.productId ?? s.itemName;
    const cur = byProduct.get(key) ?? { name: s.itemName, units: 0, revenue: 0, cost: 0 };
    cur.units += s.quantity;
    cur.revenue += s.total;
    cur.cost += saleTrueCost(s, data.products, data.materials);
    byProduct.set(key, cur);
  }

  return {
    range,
    paidSales,
    awaiting,
    expenses,
    draws,
    salesRevenue,
    expectedCash,
    directCosts,
    operating,
    grossProfit,
    grossMargin,
    operatingProfit,
    cashAvailable,
    upcoming,
    profitability: [...byProduct.values()].map((p) => ({
      ...p,
      profit: p.revenue - p.cost,
      margin: p.revenue ? ((p.revenue - p.cost) / p.revenue) * 100 : 0,
    })),
  };
}

export function pulse(data: AppData & { period: string; customFrom?: string; customTo?: string }) {
  const money = moneySnapshot(data);
  const stockValue = data.materials.reduce((n, m) => n + inventoryValue(m), 0);
  const finished = data.products.filter((p) => p.status === "finished" || p.status === "selling").length;
  const contentReady = data.content.filter((c) => c.status === "ready").length;
  const openOrders = data.orders.filter((o) => o.status === "open" || o.status === "awaiting-payment").length;
  const lowStock = data.materials.filter(isLowStock).length;
  const materialsOnHand = data.materials.length;
  return {
    cashAvailable: money.cashAvailable,
    sales: money.salesRevenue,
    openOrders,
    inventoryValue: stockValue,
    finishedProducts: finished,
    contentReady,
    lowStock,
    materialsOnHand,
    expectedCash: money.expectedCash,
    operating: money.operating,
  };
}

export function photographyGap(data: AppData) {
  const finished = data.products.filter((p) => p.status === "finished" || p.status === "selling");
  const withPhoto = finished.filter((p) => p.contentChecklist.productPhoto);
  const missing = finished.filter((p) => !p.contentChecklist.productPhoto);
  return { finished: finished.length, withPhoto: withPhoto.length, missing };
}

export function nextMonth(ref = new Date()) {
  return addMonths(ref, 1);
}

export function productContentScore(data: AppData, productId: string) {
  const p = data.products.find((x) => x.id === productId);
  if (!p) return { done: 0, total: 8 };
  return contentProgress(p.contentChecklist);
}

export function productCost(data: AppData, productId: string) {
  const p = data.products.find((x) => x.id === productId);
  if (!p) return 0;
  return trueCost(p, data.materials);
}
