import type { ContentItem, Material, Product } from "./types";
import { EMPTY_CHECKLIST } from "./types";
import { uid } from "./utils";

export function blankProduct(): Product {
  return {
    id: uid("p"),
    name: "",
    category: "Accessories",
    status: "idea",
    description: "",
    swatch: "#4F8B78",
    quantityMade: 0,
    quantityAvailable: 0,
    sellingPrice: 0,
    targetMargin: 0.65,
    packagingCost: 0,
    otherDirectCosts: 0,
    hoursWorked: 0,
    labourRate: 5,
    productionNotes: "",
    contentChecklist: { ...EMPTY_CHECKLIST },
    materials: [],
    stockDeducted: false,
    timerRunning: false,
  };
}

export function blankMaterial(): Material {
  return {
    id: uid("m"),
    name: "",
    type: "yarn",
    supplier: "",
    supplierLocation: "",
    variant: "",
    purchaseUnit: "skein",
    quantityPurchased: 0,
    quantityOnHand: 0,
    purchaseCost: 0,
    shipping: 0,
    duties: 0,
    usableUnits: 1,
    reorderLevel: 0,
    lastPurchased: new Date().toISOString().slice(0, 10),
    notes: "",
  };
}

export function blankContent(): ContentItem {
  return {
    id: uid("c"),
    title: "",
    pillar: "Making",
    format: "reel",
    status: "idea",
    coreMessage: "",
    hook: "",
    caption: "",
    cta: "",
    shotList: [],
    assets: [
      { label: "Hero frame", done: false },
      { label: "Caption", done: false },
    ],
  };
}

export function contentFromProduct(product: Product): ContentItem {
  const colour = product.name.toLowerCase();
  return {
    id: uid("c"),
    title: `From yarn to ${product.name}`,
    pillar: "Products",
    format: "reel",
    status: "idea",
    linkedProductId: product.id,
    coreMessage: `${product.name} — ${product.description || product.category.toLowerCase()} made to be used.`,
    hook: `From a skein of ${colour.includes("purple") ? "purple cotton" : "cotton"} to a ${product.category.toLowerCase().replace(/s$/, "")} made for moving through the island.`,
    caption: `${product.name} is ${product.status === "finished" || product.status === "selling" ? "ready" : "coming off the hook"}. ${product.description} Would you carry this colour into your day?`,
    cta: "Would you carry this colour into your day?",
    shotList: [
      "Yarn texture",
      "Hands making",
      "Hardware detail",
      "Finished product in use",
      "Coastal location reveal",
    ],
    assets: [
      { label: "Product photo", done: product.contentChecklist.productPhoto },
      { label: "Detail shot", done: product.contentChecklist.detailShot },
      { label: "Lifestyle shot", done: product.contentChecklist.lifestyleShot },
      { label: "Making video", done: product.contentChecklist.makingVideo },
      { label: "Caption", done: false },
    ],
  };
}

export function localCaptionDraft(input: {
  title: string;
  productName?: string;
  pillar?: string;
  format?: string;
  message?: string;
}) {
  const subject = input.productName || input.title;
  return {
    hook: input.message || `A real moment with ${subject}.`,
    caption: `${subject} — made slowly, meant to be used in the heat and the salt air. This is not a drop. It is a piece leaving the studio.\n\n${input.message ?? ""}`.trim(),
    cta: "Would you carry this colour into your day?",
    shotList: [
      "Close texture of the fibre",
      "Hands at work, unhurried",
      "A hardware or seam detail",
      "The finished piece in use",
      "A coastal or porch reveal",
    ],
  };
}
