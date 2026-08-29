import type { ContentChecklist, Material, Product, Sale } from "./types";

export function landedCost(m: Material) {
  return m.purchaseCost + m.shipping + m.duties;
}

export function unitCost(m: Material) {
  if (!m.usableUnits) return 0;
  return landedCost(m) / m.usableUnits;
}

export function inventoryValue(m: Material) {
  return m.quantityOnHand * unitCost(m);
}

export function materialCostForProduct(product: Product, materials: Material[]) {
  return product.materials.reduce((sum, line) => {
    const mat = materials.find((m) => m.id === line.materialId);
    if (!mat) return sum;
    return sum + line.quantity * unitCost(mat);
  }, 0);
}

export function labourCost(product: Product) {
  return product.hoursWorked * product.labourRate;
}

export function liveTrueCost(product: Product, materials: Material[]) {
  return (
    materialCostForProduct(product, materials) +
    product.packagingCost +
    product.otherDirectCosts +
    labourCost(product)
  );
}

export function trueCost(product: Product, materials: Material[]) {
  if (product.frozenTrueCost != null && (product.status === "finished" || product.status === "selling" || product.status === "retired" || product.status === "archived")) {
    return product.frozenTrueCost;
  }
  return liveTrueCost(product, materials);
}

export function grossProfit(product: Product, materials: Material[]) {
  return product.sellingPrice - trueCost(product, materials);
}

export function grossMargin(product: Product, materials: Material[]) {
  if (!product.sellingPrice) return 0;
  return (grossProfit(product, materials) / product.sellingPrice) * 100;
}

export function suggestedRetail(product: Product, materials: Material[]) {
  const cost = liveTrueCost(product, materials);
  const t = product.targetMargin;
  if (t <= 0 || t >= 1) return cost;
  return cost / (1 - t);
}

export function contentProgress(c: ContentChecklist) {
  const keys = Object.keys(c) as (keyof ContentChecklist)[];
  const done = keys.filter((k) => c[k]).length;
  return { done, total: keys.length };
}

export function isLowStock(m: Material) {
  return m.quantityOnHand <= m.reorderLevel;
}

export function saleTrueCost(sale: Sale, products: Product[], materials: Material[]) {
  const product = sale.productId ? products.find((p) => p.id === sale.productId) : undefined;
  if (!product) return 0;
  return trueCost(product, materials) * sale.quantity;
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
