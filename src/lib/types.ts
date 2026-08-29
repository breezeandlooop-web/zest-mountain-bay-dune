export type ProductStatus =
  | "idea"
  | "prototype"
  | "in-production"
  | "finished"
  | "selling"
  | "retired"
  | "archived";

export type MaterialType = "yarn" | "hardware" | "packaging" | "tools";

export type ContentStatus = "idea" | "captured" | "editing" | "ready" | "published";

export type ContentFormat =
  | "reel"
  | "carousel"
  | "photo"
  | "story"
  | "product-listing"
  | "email";

export type ContentPillar =
  | "Coastal Caribbean life"
  | "Making"
  | "Nature"
  | "Hummingbird / brand world"
  | "Island living"
  | "Products"
  | "Founder story"
  | "Fibre and yarn education";

export type Goal =
  | "sales"
  | "consistency"
  | "product-launch"
  | "cash-protection"
  | "community-growth";

export type TaskPriority = "high" | "medium" | "low";

export type LinkedKind = "product" | "content" | "material" | "sale" | "order";

export type ContentChecklist = {
  productPhoto: boolean;
  detailShot: boolean;
  lifestyleShot: boolean;
  makingVideo: boolean;
  productDescription: boolean;
  listingReady: boolean;
  story: boolean;
  reel: boolean;
};

export type BomLine = {
  materialId: string;
  quantity: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  status: ProductStatus;
  description: string;
  imageUrl?: string;
  swatch: string;
  quantityMade: number;
  quantityAvailable: number;
  sellingPrice: number;
  wholesalePrice?: number;
  targetMargin: number;
  packagingCost: number;
  otherDirectCosts: number;
  hoursWorked: number;
  labourRate: number;
  startDate?: string;
  targetCompletionDate?: string;
  productionNotes: string;
  contentChecklist: ContentChecklist;
  materials: BomLine[];
  frozenTrueCost?: number;
  stockDeducted: boolean;
  timerRunning: boolean;
  timerStartedAt?: number;
};

export type Material = {
  id: string;
  name: string;
  type: MaterialType;
  supplier: string;
  supplierLocation: string;
  variant: string;
  purchaseUnit: string;
  quantityPurchased: number;
  quantityOnHand: number;
  purchaseCost: number;
  shipping: number;
  duties: number;
  usableUnits: number;
  reorderLevel: number;
  lastPurchased: string;
  notes: string;
  imageUrl?: string;
};

export type ContentAsset = { label: string; done: boolean };

export type ContentItem = {
  id: string;
  title: string;
  pillar: ContentPillar;
  format: ContentFormat;
  status: ContentStatus;
  linkedProductId?: string;
  linkedMaterialId?: string;
  coreMessage: string;
  hook: string;
  caption: string;
  cta: string;
  shotList: string[];
  assets: ContentAsset[];
  targetDate?: string;
  publishedDate?: string;
  channel?: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  deferredTo?: string;
  linkedKind?: LinkedKind;
  linkedId?: string;
};

export type Sale = {
  id: string;
  date: string;
  productId?: string;
  itemName: string;
  quantity: number;
  total: number;
  status: "paid" | "awaiting";
  customer?: string;
};

export type Expense = {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  productRelated: boolean;
};

export type OwnerDraw = {
  id: string;
  date: string;
  amount: number;
  notes: string;
};

export type Order = {
  id: string;
  customerName: string;
  productId?: string;
  productName: string;
  quantity: number;
  total: number;
  status: "open" | "awaiting-payment" | "fulfilled";
  dueDate?: string;
  notes: string;
};

export type Commitment = {
  id: string;
  name: string;
  amount: number;
  date: string;
  essential: boolean;
};

export type Settings = {
  ownerName: string;
  operatingBuffer: number;
  openingCash: number;
  currentGoal: Goal;
  labourRateDefault: number;
};

export type AppData = {
  products: Product[];
  materials: Material[];
  content: ContentItem[];
  tasks: Task[];
  sales: Sale[];
  expenses: Expense[];
  draws: OwnerDraw[];
  orders: Order[];
  commitments: Commitment[];
  settings: Settings;
  dismissedMoveIds: string[];
  saveError: boolean;
};

export const EMPTY_CHECKLIST: ContentChecklist = {
  productPhoto: false,
  detailShot: false,
  lifestyleShot: false,
  makingVideo: false,
  productDescription: false,
  listingReady: false,
  story: false,
  reel: false,
};

export const PRODUCT_STATUSES: ProductStatus[] = [
  "idea",
  "prototype",
  "in-production",
  "finished",
  "selling",
  "retired",
  "archived",
];

export const CONTENT_PILLARS: ContentPillar[] = [
  "Coastal Caribbean life",
  "Making",
  "Nature",
  "Hummingbird / brand world",
  "Island living",
  "Products",
  "Founder story",
  "Fibre and yarn education",
];

export const CONTENT_FORMATS: ContentFormat[] = [
  "reel",
  "carousel",
  "photo",
  "story",
  "product-listing",
  "email",
];

export const CHECKLIST_LABELS: { key: keyof ContentChecklist; label: string }[] = [
  { key: "productPhoto", label: "Product photo" },
  { key: "detailShot", label: "Detail shot" },
  { key: "lifestyleShot", label: "Lifestyle shot" },
  { key: "makingVideo", label: "Making video" },
  { key: "productDescription", label: "Product description" },
  { key: "listingReady", label: "Listing ready" },
  { key: "story", label: "Story" },
  { key: "reel", label: "Reel" },
];
