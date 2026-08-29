import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addDays, format } from "date-fns";
import type {
  AppData,
  Commitment,
  ContentItem,
  Expense,
  Goal,
  Material,
  OwnerDraw,
  Product,
  Sale,
  Settings,
  Task,
} from "./types";
import { cloneSeed } from "./seed";
import { liveTrueCost } from "./calc";
import { uid } from "./utils";

type Period = "this-month" | "last-month" | "custom";

type Store = AppData & {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  period: Period;
  customFrom?: string;
  customTo?: string;
  setPeriod: (p: Period, range?: { from: string; to: string }) => void;
  movingOpen: boolean;
  setMovingOpen: (v: boolean) => void;
  resetStudio: () => void;
  setSaveError: (v: boolean) => void;
  retrySave: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  setGoal: (g: Goal) => void;

  upsertProduct: (p: Product) => void;
  patchProduct: (id: string, patch: Partial<Product>) => void;
  duplicateProduct: (id: string) => string | null;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;
  markProductFinished: (id: string) => void;
  toggleTimer: (id: string) => void;
  addManualTime: (id: string, hours: number) => void;
  setBomLine: (productId: string, materialId: string, quantity: number) => void;
  removeBomLine: (productId: string, materialId: string) => void;
  toggleChecklist: (productId: string, key: keyof Product["contentChecklist"]) => void;

  upsertMaterial: (m: Material) => void;
  patchMaterial: (id: string, patch: Partial<Material>) => void;
  receiveStock: (
    id: string,
    data: { quantity: number; purchaseCost: number; shipping: number; duties: number; usableUnits: number },
  ) => void;

  upsertContent: (c: ContentItem) => void;
  patchContent: (id: string, patch: Partial<ContentItem>) => void;
  setContentStatus: (id: string, status: ContentItem["status"]) => void;
  publishContent: (id: string, channel: string, date: string) => void;

  addTask: (t: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: string) => void;
  deferTask: (id: string) => void;
  removeTask: (id: string) => void;

  addSale: (s: Omit<Sale, "id">) => void;
  patchSale: (id: string, patch: Partial<Sale>) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  addDraw: (d: Omit<OwnerDraw, "id">) => void;
  addCommitment: (c: Omit<Commitment, "id">) => void;
  removeCommitment: (id: string) => void;

  dismissMove: (id: string) => void;
  clearDismissed: () => void;
};

function flushTimer(p: Product): Product {
  if (!p.timerRunning || !p.timerStartedAt) return p;
  const extra = (Date.now() - p.timerStartedAt) / 3_600_000;
  return {
    ...p,
    hoursWorked: Math.round((p.hoursWorked + extra) * 100) / 100,
    timerRunning: false,
    timerStartedAt: undefined,
  };
}

export const useStudio = create<Store>()(
  persist(
    (set, get) => ({
      ...cloneSeed(),
      hydrated: true,
      period: "this-month",
      movingOpen: false,
      setHydrated: (v) => set({ hydrated: v }),
      setPeriod: (p, range) =>
        set({
          period: p,
          customFrom: range?.from,
          customTo: range?.to,
        }),
      setMovingOpen: (v) => set({ movingOpen: v }),
      resetStudio: () => set({ ...cloneSeed(), hydrated: true, period: "this-month", movingOpen: false }),
      setSaveError: (v) => set({ saveError: v }),
      retrySave: () => {
        try {
          const { saveError: _s, hydrated: _h, period, customFrom, customTo, movingOpen, ...data } = get();
          localStorage.setItem("breeze-loop-os-v1", JSON.stringify({ state: { ...data, period, customFrom, customTo }, version: 1 }));
          set({ saveError: false });
        } catch {
          set({ saveError: true });
        }
      },
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      setGoal: (g) => set({ settings: { ...get().settings, currentGoal: g } }),

      upsertProduct: (p) =>
        set((s) => {
          const i = s.products.findIndex((x) => x.id === p.id);
          const products = [...s.products];
          if (i >= 0) products[i] = p;
          else products.unshift(p);
          return { products };
        }),
      patchProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      duplicateProduct: (id) => {
        const src = get().products.find((p) => p.id === id);
        if (!src) return null;
        const copy: Product = {
          ...structuredClone(src),
          id: uid("p"),
          name: `${src.name} (variation)`,
          status: "idea",
          quantityMade: 0,
          quantityAvailable: 0,
          frozenTrueCost: undefined,
          stockDeducted: false,
          timerRunning: false,
          timerStartedAt: undefined,
          hoursWorked: 0,
        };
        set((s) => ({ products: [copy, ...s.products] }));
        return copy.id;
      },
      archiveProduct: (id) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...flushTimer(p), status: "archived" as const } : p)),
        })),
      restoreProduct: (id) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, status: "idea" as const } : p)),
        })),
      markProductFinished: (id) =>
        set((s) => {
          const products = s.products.map((p) => {
            if (p.id !== id) return p;
            const flushed = flushTimer(p);
            const cost = liveTrueCost(flushed, s.materials);
            return {
              ...flushed,
              status: "finished" as const,
              quantityMade: Math.max(1, flushed.quantityMade),
              quantityAvailable: flushed.quantityAvailable + Math.max(1, flushed.quantityMade || 1),
              frozenTrueCost: cost,
              stockDeducted: true,
            };
          });
          const product = s.products.find((p) => p.id === id);
          let materials = s.materials;
          if (product && !product.stockDeducted) {
            const qty = Math.max(1, product.quantityMade || 1);
            materials = s.materials.map((m) => {
              const line = product.materials.find((l) => l.materialId === m.id);
              if (!line) return m;
              return { ...m, quantityOnHand: Math.max(0, round2(m.quantityOnHand - line.quantity * qty)) };
            });
          }
          return { products, materials };
        }),
      toggleTimer: (id) =>
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== id) return p;
            if (p.timerRunning) return flushTimer(p);
            return { ...p, timerRunning: true, timerStartedAt: Date.now() };
          }),
        })),
      addManualTime: (id, hours) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, hoursWorked: Math.max(0, round2(p.hoursWorked + hours)) } : p,
          ),
        })),
      setBomLine: (productId, materialId, quantity) =>
        set((s) => ({
          products: s.products.map((p) => {
            if (p.id !== productId) return p;
            const rest = p.materials.filter((l) => l.materialId !== materialId);
            const materials = quantity > 0 ? [...rest, { materialId, quantity }] : rest;
            return { ...p, materials };
          }),
        })),
      removeBomLine: (productId, materialId) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId ? { ...p, materials: p.materials.filter((l) => l.materialId !== materialId) } : p,
          ),
        })),
      toggleChecklist: (productId, key) =>
        set((s) => ({
          products: s.products.map((p) =>
            p.id === productId
              ? { ...p, contentChecklist: { ...p.contentChecklist, [key]: !p.contentChecklist[key] } }
              : p,
          ),
        })),

      upsertMaterial: (m) =>
        set((s) => {
          const i = s.materials.findIndex((x) => x.id === m.id);
          const materials = [...s.materials];
          if (i >= 0) materials[i] = m;
          else materials.unshift(m);
          return { materials };
        }),
      patchMaterial: (id, patch) =>
        set((s) => ({
          materials: s.materials.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      receiveStock: (id, data) =>
        set((s) => ({
          materials: s.materials.map((m) => {
            if (m.id !== id) return m;
            const purchaseCost = m.purchaseCost + data.purchaseCost;
            const shipping = m.shipping + data.shipping;
            const duties = m.duties + data.duties;
            const usableUnits = m.usableUnits + data.usableUnits;
            return {
              ...m,
              quantityPurchased: m.quantityPurchased + data.quantity,
              quantityOnHand: m.quantityOnHand + data.quantity,
              purchaseCost,
              shipping,
              duties,
              usableUnits,
              lastPurchased: format(new Date(), "yyyy-MM-dd"),
            };
          }),
        })),

      upsertContent: (c) =>
        set((s) => {
          const i = s.content.findIndex((x) => x.id === c.id);
          const content = [...s.content];
          if (i >= 0) content[i] = c;
          else content.unshift(c);
          return { content };
        }),
      patchContent: (id, patch) =>
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      setContentStatus: (id, status) =>
        set((s) => ({
          content: s.content.map((c) => (c.id === id ? { ...c, status } : c)),
        })),
      publishContent: (id, channel, date) =>
        set((s) => {
          const item = s.content.find((c) => c.id === id);
          const content = s.content.map((c) =>
            c.id === id ? { ...c, status: "published" as const, channel, publishedDate: date } : c,
          );
          let products = s.products;
          if (item?.linkedProductId) {
            products = s.products.map((p) => {
              if (p.id !== item.linkedProductId) return p;
              const next = { ...p.contentChecklist };
              if (item.format === "reel") next.reel = true;
              if (item.format === "story") next.story = true;
              if (item.format === "photo" || item.format === "carousel") next.productPhoto = true;
              if (item.format === "product-listing") next.listingReady = true;
              return { ...p, contentChecklist: next };
            });
          }
          return { content, products };
        }),

      addTask: (t) => set((s) => ({ tasks: [{ ...t, id: uid("t"), completed: false }, ...s.tasks] })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        })),
      deferTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, deferredTo: format(addDays(new Date(), 1), "yyyy-MM-dd") } : t,
          ),
        })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addSale: (sale) => set((s) => ({ sales: [{ ...sale, id: uid("s") }, ...s.sales] })),
      patchSale: (id, patch) =>
        set((s) => ({
          sales: s.sales.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      addExpense: (e) => set((s) => ({ expenses: [{ ...e, id: uid("e") }, ...s.expenses] })),
      addDraw: (d) => set((s) => ({ draws: [{ ...d, id: uid("d") }, ...s.draws] })),
      addCommitment: (c) => set((s) => ({ commitments: [{ ...c, id: uid("k") }, ...s.commitments] })),
      removeCommitment: (id) => set((s) => ({ commitments: s.commitments.filter((c) => c.id !== id) })),

      dismissMove: (id) => set((s) => ({ dismissedMoveIds: [...s.dismissedMoveIds, id] })),
      clearDismissed: () => set({ dismissedMoveIds: [] }),
    }),
    {
      name: "breeze-loop-os-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
      partialize: (s) => ({
        products: s.products,
        materials: s.materials,
        content: s.content,
        tasks: s.tasks,
        sales: s.sales,
        expenses: s.expenses,
        draws: s.draws,
        orders: s.orders,
        commitments: s.commitments,
        settings: s.settings,
        dismissedMoveIds: s.dismissedMoveIds,
        saveError: s.saveError,
        period: s.period,
        customFrom: s.customFrom,
        customTo: s.customTo,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) state?.setSaveError(true);
      },
    },
  ),
);

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function useHydrateStudio() {
  const setHydrated = useStudio((s) => s.setHydrated);
  const hydrated = useStudio((s) => s.hydrated);
  return { hydrated, setHydrated };
}
