import { format, isToday, parseISO, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export function money(n: number, opts?: { cents?: boolean }) {
  const abs = Math.abs(n);
  const formatted =
    opts?.cents || abs % 1 !== 0
      ? abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const sign = n < 0 ? "−" : "";
  return `${sign}$${formatted}`;
}

export function pct(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(1)}%`;
}

export function qty(n: number, unit?: string) {
  const value = Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
  return unit ? `${value} ${unit}${n === 1 ? "" : unit.endsWith("s") ? "" : ""}` : value;
}

export function prettyDate(iso: string) {
  try {
    const d = parseISO(iso);
    if (isToday(d)) return "Today";
    return format(d, "d MMM");
  } catch {
    return iso;
  }
}

export function longDate(d = new Date()) {
  return format(d, "EEEE, d MMMM");
}

export function monthLabel(d = new Date()) {
  return format(d, "MMMM yyyy");
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function inMonth(iso: string, ref = new Date()) {
  const d = parseISO(iso);
  return isWithinInterval(d, { start: startOfMonth(ref), end: endOfMonth(ref) });
}

export function statusLabel(status: string) {
  return status
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatLabel(formatKey: string) {
  if (formatKey === "product-listing") return "Product listing";
  if (formatKey === "photo") return "Photo";
  return statusLabel(formatKey);
}
