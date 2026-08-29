import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as EMPTY_CHECKLIST, o as cn, s as uid } from "./utils-BEOGomfO.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Scissors, f as CircleDollarSign, l as Layers, m as Camera, n as UserRound, r as TriangleAlert, t as X, u as House } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { l as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { a as format, c as differenceInCalendarDays, i as isToday, l as addDays, n as parseISO } from "../_libs/date-fns.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D-9UDxAx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function Hummingbird({ className, title }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		fill: "none",
		className: cn("text-navy", className),
		role: title ? "img" : "presentation",
		"aria-hidden": title ? void 0 : true,
		"aria-label": title,
		children: [
			title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: title }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M8 30.5c8.2-1.8 14.4-1.2 18.8 1.4",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M27.2 32.2c2.8 3.4 4.6 8.2 4.2 13.4",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M31.4 33.4c6.8-1.2 12.6 1.4 16.8 6.6 2.2 2.6 4.8 3.8 8.6 3.2-3.4 2.8-8.2 3.6-12.4 1.6-3.2-1.6-5.2-4.6-7.2-8.2",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M30.8 31.6c.4-6.8 4.2-12.4 10.6-16.2 2.8-1.6 1.6 4.2-.2 6.8-2.2 3.2-6.2 6-10.4 7.4Z",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M33.6 30.2c3.6-4.8 4.8-10.2 2.4-16.4 4.8 3.2 8.2 8.4 8.6 14.2",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M42.8 28.4c1.2-2.4 3.6-3.8 6.4-4.2",
				stroke: "currentColor",
				strokeWidth: "1.4",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "44.6",
				cy: "27.2",
				r: "0.9",
				fill: "currentColor"
			})
		]
	});
}
function Wordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("font-display tracking-tight text-navy", className),
		children: [
			"Breeze ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-seaglass",
				children: "&"
			}),
			" Loop"
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seaglass/60 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-navy text-ivory hover:bg-navy-deep",
			seaglass: "bg-seaglass text-ivory hover:bg-seaglass-deep",
			clay: "bg-clay text-ivory hover:bg-clay/90",
			outline: "bg-transparent text-navy shadow-card hover:shadow-card-hover",
			ghost: "bg-transparent text-navy hover:bg-secondary",
			soft: "bg-secondary text-navy hover:bg-line",
			link: "text-seaglass underline-offset-4 hover:underline active:scale-100"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-[13px]",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var checklist = (partial = {}) => ({
	...EMPTY_CHECKLIST,
	...partial
});
var MATERIALS = [
	{
		id: "m-natural-cotton",
		name: "Natural Cotton Yarn",
		type: "yarn",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "Undyed cream, DK, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 12,
		quantityOnHand: 3,
		purchaseCost: 132,
		shipping: 12,
		duties: 6,
		usableUnits: 12,
		reorderLevel: 4,
		lastPurchased: "2026-08-02",
		notes: "Workhorse yarn for totes and holders. Softens beautifully after a cool wash.",
		imageUrl: "/materials/natural-cotton.jpg"
	},
	{
		id: "m-purple-cotton",
		name: "Purple Cotton Yarn",
		type: "yarn",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "Deep violet, DK, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 10,
		quantityOnHand: 7,
		purchaseCost: 108,
		shipping: 8,
		duties: 2,
		usableUnits: 10,
		reorderLevel: 3,
		lastPurchased: "2026-08-02",
		notes: "The bottle-holder colour. Photograph in shade — it reads richer than in noon sun.",
		imageUrl: "/materials/purple-cotton.jpg"
	},
	{
		id: "m-brass-drings",
		name: "Brass D-rings",
		type: "hardware",
		supplier: "Harbour Findings",
		supplierLocation: "Port of Spain",
		variant: "25mm, unlacquered brass",
		purchaseUnit: "unit",
		quantityPurchased: 40,
		quantityOnHand: 24,
		purchaseCost: 48,
		shipping: 8,
		duties: 2,
		usableUnits: 40,
		reorderLevel: 12,
		lastPurchased: "2026-07-18",
		notes: "Will patina. A feature, not a flaw."
	},
	{
		id: "m-kraft-tags",
		name: "Kraft Hang Tags",
		type: "packaging",
		supplier: "Press & Grain",
		supplierLocation: "Speightstown",
		variant: "Letterpress, hummingbird mark",
		purchaseUnit: "unit",
		quantityPurchased: 50,
		quantityOnHand: 18,
		purchaseCost: 32,
		shipping: 8.5,
		duties: 2,
		usableUnits: 50,
		reorderLevel: 20,
		lastPurchased: "2026-08-07",
		notes: "Tied with waxed linen. Reorder before the next market."
	},
	{
		id: "m-dust-bags",
		name: "Reusable Dust Bags",
		type: "packaging",
		supplier: "Soft Goods Atelier",
		supplierLocation: "Castries",
		variant: "Unbleached cotton, drawstring",
		purchaseUnit: "unit",
		quantityPurchased: 20,
		quantityOnHand: 14,
		purchaseCost: 36,
		shipping: 6.4,
		duties: 1.6,
		usableUnits: 20,
		reorderLevel: 10,
		lastPurchased: "2026-08-07",
		notes: "Customers keep these. Worth the cost."
	},
	{
		id: "m-seafoam-cotton",
		name: "Seafoam Cotton Yarn",
		type: "yarn",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "Sea-glass green, DK, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 8,
		quantityOnHand: 5,
		purchaseCost: 88,
		shipping: 6.4,
		duties: 1.6,
		usableUnits: 8,
		reorderLevel: 3,
		lastPurchased: "2026-07-22",
		notes: "Reads as water in photographs. Pair with natural."
	},
	{
		id: "m-coral-cotton",
		name: "Coral Cotton Yarn",
		type: "yarn",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "Muted clay, DK, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 6,
		quantityOnHand: 4,
		purchaseCost: 66,
		shipping: 5.4,
		duties: 1.8,
		usableUnits: 6,
		reorderLevel: 2,
		lastPurchased: "2026-07-22",
		notes: "Use sparingly — it is the accent, not the field."
	},
	{
		id: "m-linen-blend",
		name: "Natural Linen Blend",
		type: "yarn",
		supplier: "Atlantic Mill Ends",
		supplierLocation: "Lisbon via Bridgetown",
		variant: "Linen/cotton, aran, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 8,
		quantityOnHand: 4,
		purchaseCost: 104,
		shipping: 10,
		duties: 2,
		usableUnits: 8,
		reorderLevel: 2,
		lastPurchased: "2026-07-11",
		notes: "Structure for market totes. Blooms after blocking."
	},
	{
		id: "m-indigo-cotton",
		name: "Indigo Cotton Yarn",
		type: "yarn",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "Deep indigo, DK, 100g",
		purchaseUnit: "skein",
		quantityPurchased: 4,
		quantityOnHand: 2,
		purchaseCost: 48,
		shipping: 3.2,
		duties: .8,
		usableUnits: 4,
		reorderLevel: 2,
		lastPurchased: "2026-06-30",
		notes: "May crock slightly when new. Rinse before making."
	},
	{
		id: "m-snaps",
		name: "Magnetic Snaps",
		type: "hardware",
		supplier: "Harbour Findings",
		supplierLocation: "Port of Spain",
		variant: "18mm, antique brass",
		purchaseUnit: "unit",
		quantityPurchased: 24,
		quantityOnHand: 12,
		purchaseCost: 42,
		shipping: 6.8,
		duties: 1.6,
		usableUnits: 24,
		reorderLevel: 8,
		lastPurchased: "2026-07-18",
		notes: ""
	},
	{
		id: "m-leather-handles",
		name: "Leather Handles",
		type: "hardware",
		supplier: "Shore Hide",
		supplierLocation: "Oistins",
		variant: "Vegetable tan, 60cm pair",
		purchaseUnit: "pair",
		quantityPurchased: 10,
		quantityOnHand: 4,
		purchaseCost: 72,
		shipping: 10,
		duties: 3,
		usableUnits: 10,
		reorderLevel: 3,
		lastPurchased: "2026-07-04",
		notes: "Darken with handling. Do not oil before first sale."
	},
	{
		id: "m-cotton-cord",
		name: "Cotton Cord",
		type: "hardware",
		supplier: "Island Fibre Co.",
		supplierLocation: "Bridgetown, Barbados",
		variant: "4mm, natural",
		purchaseUnit: "metre",
		quantityPurchased: 30,
		quantityOnHand: 10,
		purchaseCost: 42,
		shipping: 9,
		duties: 3,
		usableUnits: 30,
		reorderLevel: 8,
		lastPurchased: "2026-06-20",
		notes: ""
	},
	{
		id: "m-tissue",
		name: "Tissue Paper",
		type: "packaging",
		supplier: "Press & Grain",
		supplierLocation: "Speightstown",
		variant: "Ivory, acid-free",
		purchaseUnit: "sheet",
		quantityPurchased: 80,
		quantityOnHand: 30,
		purchaseCost: 22,
		shipping: 4.4,
		duties: 1.6,
		usableUnits: 80,
		reorderLevel: 20,
		lastPurchased: "2026-08-07",
		notes: ""
	},
	{
		id: "m-twill-tape",
		name: "Cotton Twill Tape",
		type: "hardware",
		supplier: "Soft Goods Atelier",
		supplierLocation: "Castries",
		variant: "15mm, natural",
		purchaseUnit: "metre",
		quantityPurchased: 25,
		quantityOnHand: 15,
		purchaseCost: 16,
		shipping: 5.5,
		duties: 1,
		usableUnits: 25,
		reorderLevel: 8,
		lastPurchased: "2026-06-20",
		notes: ""
	},
	{
		id: "m-hook-5mm",
		name: "Crochet Hook 5mm",
		type: "tools",
		supplier: "Studio Cupboard",
		supplierLocation: "Home studio",
		variant: "Birch, inline",
		purchaseUnit: "unit",
		quantityPurchased: 3,
		quantityOnHand: 2,
		purchaseCost: 18,
		shipping: 1.5,
		duties: 0,
		usableUnits: 3,
		reorderLevel: 1,
		lastPurchased: "2026-05-12",
		notes: "Not for sale. Track so replacements are ordered before a market week."
	},
	{
		id: "m-blocking-mats",
		name: "Blocking Mats",
		type: "tools",
		supplier: "Studio Cupboard",
		supplierLocation: "Home studio",
		variant: "Puzzle set, 9 tiles",
		purchaseUnit: "set",
		quantityPurchased: 1,
		quantityOnHand: 1,
		purchaseCost: 28,
		shipping: 5.8,
		duties: 0,
		usableUnits: 1,
		reorderLevel: 0,
		lastPurchased: "2026-03-02",
		notes: "Keep out of noon sun — they warp."
	},
	{
		id: "m-care-cards",
		name: "Care Cards",
		type: "packaging",
		supplier: "Press & Grain",
		supplierLocation: "Speightstown",
		variant: "Letterpress, cotton care",
		purchaseUnit: "unit",
		quantityPurchased: 50,
		quantityOnHand: 25,
		purchaseCost: 16,
		shipping: 3.2,
		duties: .8,
		usableUnits: 50,
		reorderLevel: 15,
		lastPurchased: "2026-08-07",
		notes: ""
	},
	{
		id: "m-waxed-linen",
		name: "Waxed Linen Thread",
		type: "hardware",
		supplier: "Harbour Findings",
		supplierLocation: "Port of Spain",
		variant: "Natural, 50m spool",
		purchaseUnit: "spool",
		quantityPurchased: 4,
		quantityOnHand: 3,
		purchaseCost: 16.4,
		shipping: 2.4,
		duties: .4,
		usableUnits: 4,
		reorderLevel: 1,
		lastPurchased: "2026-07-18",
		notes: "For tags and handle wrapping."
	}
];
var PRODUCTS = [
	{
		id: "p-purple-holder",
		name: "Purple Water Bottle Holder",
		category: "Accessories",
		status: "in-production",
		description: "A close-fit cotton holder for moving through the island with a bottle at your hip. Deep violet, brass D-ring, meant to be used hard.",
		imageUrl: "/products/purple-holder.jpg",
		swatch: "#5C3A7A",
		quantityMade: 0,
		quantityAvailable: 0,
		sellingPrice: 48,
		wholesalePrice: 28,
		targetMargin: .65,
		packagingCost: 1.12,
		otherDirectCosts: 0,
		hoursWorked: .4,
		labourRate: 5,
		startDate: "2026-08-22",
		targetCompletionDate: "2026-08-29",
		productionNotes: "Last round of the mesh body. Attach D-ring and weave in ends this morning.",
		contentChecklist: checklist({ makingVideo: true }),
		materials: [
			{
				materialId: "m-purple-cotton",
				quantity: .85
			},
			{
				materialId: "m-brass-drings",
				quantity: 2
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			}
		],
		stockDeducted: false,
		timerRunning: false
	},
	{
		id: "p-tide-tote",
		name: "Tide Tote",
		category: "Bags",
		status: "finished",
		description: "A generous market tote in natural and seafoam cotton. Leather handles, magnetic snap, room for a week's fruit.",
		imageUrl: "/products/tide-tote.jpg",
		swatch: "#7FA392",
		quantityMade: 2,
		quantityAvailable: 1,
		sellingPrice: 145,
		wholesalePrice: 85,
		targetMargin: .64,
		packagingCost: .65,
		otherDirectCosts: 0,
		hoursWorked: .2,
		labourRate: 5,
		startDate: "2026-07-28",
		targetCompletionDate: "2026-08-12",
		productionNotes: "Blocked and tagged. Needs photography before listing.",
		contentChecklist: checklist({ productDescription: true }),
		materials: [
			{
				materialId: "m-natural-cotton",
				quantity: 2.2
			},
			{
				materialId: "m-seafoam-cotton",
				quantity: .8
			},
			{
				materialId: "m-leather-handles",
				quantity: 1
			},
			{
				materialId: "m-snaps",
				quantity: 1
			},
			{
				materialId: "m-dust-bags",
				quantity: 1
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			}
		],
		frozenTrueCost: 52.4,
		stockDeducted: true,
		timerRunning: false
	},
	{
		id: "p-island-market",
		name: "Island Market Tote",
		category: "Bags",
		status: "prototype",
		description: "A structured tote in linen blend for Saturday market runs. Firmer body than the Tide Tote, with a quieter colour story.",
		imageUrl: "/products/island-market-tote.jpg",
		swatch: "#D9C7A8",
		quantityMade: 1,
		quantityAvailable: 0,
		sellingPrice: 165,
		wholesalePrice: 95,
		targetMargin: .63,
		packagingCost: .75,
		otherDirectCosts: 0,
		hoursWorked: 0,
		labourRate: 5,
		startDate: "2026-08-08",
		targetCompletionDate: "2026-09-04",
		productionNotes: "Prototype in hand. Customer already waiting on the first finished piece.",
		contentChecklist: checklist({
			productPhoto: true,
			lifestyleShot: true
		}),
		materials: [
			{
				materialId: "m-linen-blend",
				quantity: 2
			},
			{
				materialId: "m-natural-cotton",
				quantity: 1.2
			},
			{
				materialId: "m-leather-handles",
				quantity: 1
			},
			{
				materialId: "m-brass-drings",
				quantity: 2
			},
			{
				materialId: "m-dust-bags",
				quantity: 1
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			},
			{
				materialId: "m-twill-tape",
				quantity: 2
			}
		],
		stockDeducted: false,
		timerRunning: false
	},
	{
		id: "p-wine-holder",
		name: "Wine Bottle Holder",
		category: "Accessories",
		status: "selling",
		description: "A gift-ready holder for a bottle of wine. Plum and natural cotton, brass ring, meant for a table or a walk to dinner.",
		imageUrl: "/products/wine-holder.jpg",
		swatch: "#6B3A4A",
		quantityMade: 14,
		quantityAvailable: 4,
		sellingPrice: 42,
		wholesalePrice: 24,
		targetMargin: .65,
		packagingCost: .9,
		otherDirectCosts: 0,
		hoursWorked: .3,
		labourRate: 5,
		startDate: "2026-06-02",
		productionNotes: "Steady seller at Sunday market.",
		contentChecklist: checklist({
			productPhoto: true,
			detailShot: true,
			productDescription: true,
			listingReady: true,
			story: true
		}),
		materials: [
			{
				materialId: "m-purple-cotton",
				quantity: .4
			},
			{
				materialId: "m-natural-cotton",
				quantity: .4
			},
			{
				materialId: "m-brass-drings",
				quantity: 1
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			}
		],
		frozenTrueCost: 14.5,
		stockDeducted: true,
		timerRunning: false
	},
	{
		id: "p-seafoam-clutch",
		name: "Seafoam Clutch",
		category: "Bags",
		status: "finished",
		description: "An envelope clutch in sea-glass cotton. Evening, market, or a notebook.",
		imageUrl: "/products/seafoam-clutch.jpg",
		swatch: "#6FA394",
		quantityMade: 3,
		quantityAvailable: 2,
		sellingPrice: 78,
		targetMargin: .64,
		packagingCost: 1.1,
		otherDirectCosts: 0,
		hoursWorked: .5,
		labourRate: 5,
		contentChecklist: checklist({
			productPhoto: true,
			productDescription: true
		}),
		materials: [
			{
				materialId: "m-seafoam-cotton",
				quantity: 1.1
			},
			{
				materialId: "m-snaps",
				quantity: 1
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			},
			{
				materialId: "m-dust-bags",
				quantity: 1
			}
		],
		frozenTrueCost: 28,
		stockDeducted: true,
		timerRunning: false,
		productionNotes: ""
	},
	{
		id: "p-coral-pouch",
		name: "Coral Market Pouch",
		category: "Accessories",
		status: "finished",
		description: "A small pouch for coins, keys, and a lipstick. Muted clay cotton.",
		imageUrl: "/products/coral-pouch.jpg",
		swatch: "#C26A56",
		quantityMade: 5,
		quantityAvailable: 3,
		sellingPrice: 55,
		targetMargin: .64,
		packagingCost: .8,
		otherDirectCosts: 0,
		hoursWorked: .35,
		labourRate: 5,
		contentChecklist: checklist({ productPhoto: true }),
		materials: [
			{
				materialId: "m-coral-cotton",
				quantity: .7
			},
			{
				materialId: "m-cotton-cord",
				quantity: .8
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			}
		],
		frozenTrueCost: 19,
		stockDeducted: true,
		timerRunning: false,
		productionNotes: ""
	},
	{
		id: "p-driftwood",
		name: "Driftwood Crossbody",
		category: "Bags",
		status: "selling",
		description: "A hands-free bag in driftwood beige. Long strap, quiet hardware.",
		imageUrl: "/products/driftwood-crossbody.jpg",
		swatch: "#C4B49A",
		quantityMade: 3,
		quantityAvailable: 1,
		sellingPrice: 128,
		targetMargin: .63,
		packagingCost: 1.2,
		otherDirectCosts: 0,
		hoursWorked: .6,
		labourRate: 5,
		contentChecklist: checklist({
			productPhoto: true,
			detailShot: true,
			lifestyleShot: true,
			productDescription: true,
			listingReady: true
		}),
		materials: [
			{
				materialId: "m-natural-cotton",
				quantity: 1.6
			},
			{
				materialId: "m-linen-blend",
				quantity: .8
			},
			{
				materialId: "m-cotton-cord",
				quantity: 1.2
			},
			{
				materialId: "m-snaps",
				quantity: 1
			},
			{
				materialId: "m-dust-bags",
				quantity: 1
			}
		],
		frozenTrueCost: 46,
		stockDeducted: true,
		timerRunning: false,
		productionNotes: ""
	},
	{
		id: "p-sunrise-sling",
		name: "Sunrise Bottle Sling",
		category: "Accessories",
		status: "finished",
		description: "A peach and natural bottle sling for morning walks.",
		imageUrl: "/products/sunrise-sling.jpg",
		swatch: "#E0A07A",
		quantityMade: 4,
		quantityAvailable: 2,
		sellingPrice: 48,
		targetMargin: .65,
		packagingCost: 1.12,
		otherDirectCosts: 0,
		hoursWorked: .4,
		labourRate: 5,
		contentChecklist: checklist({
			productPhoto: true,
			detailShot: true
		}),
		materials: [
			{
				materialId: "m-coral-cotton",
				quantity: .5
			},
			{
				materialId: "m-natural-cotton",
				quantity: .4
			},
			{
				materialId: "m-brass-drings",
				quantity: 2
			},
			{
				materialId: "m-kraft-tags",
				quantity: 1
			}
		],
		frozenTrueCost: 16.5,
		stockDeducted: true,
		timerRunning: false,
		productionNotes: ""
	},
	{
		id: "p-harbour-shopper",
		name: "Harbour Shopper",
		category: "Bags",
		status: "idea",
		description: "A fold-flat shopper for the fish market. Indigo and natural. Still a sketch.",
		swatch: "#3D4F6F",
		quantityMade: 0,
		quantityAvailable: 0,
		sellingPrice: 135,
		targetMargin: .64,
		packagingCost: 1,
		otherDirectCosts: 0,
		hoursWorked: 0,
		labourRate: 5,
		contentChecklist: checklist(),
		materials: [{
			materialId: "m-indigo-cotton",
			quantity: 2
		}, {
			materialId: "m-natural-cotton",
			quantity: 1
		}],
		stockDeducted: false,
		timerRunning: false,
		productionNotes: ""
	},
	{
		id: "p-night-bloom",
		name: "Night Bloom Wrap",
		category: "Accessories",
		status: "in-production",
		description: "A light evening wrap in indigo and seafoam. Slow work, for September.",
		swatch: "#2C3A55",
		quantityMade: 0,
		quantityAvailable: 0,
		sellingPrice: 185,
		targetMargin: .62,
		packagingCost: 1.4,
		otherDirectCosts: 0,
		hoursWorked: 2.5,
		labourRate: 5,
		startDate: "2026-08-18",
		targetCompletionDate: "2026-09-12",
		productionNotes: "Body in progress. Do not rush — this is the September story piece.",
		contentChecklist: checklist({ makingVideo: true }),
		materials: [{
			materialId: "m-indigo-cotton",
			quantity: 1.5
		}, {
			materialId: "m-seafoam-cotton",
			quantity: 1.2
		}],
		stockDeducted: false,
		timerRunning: false
	},
	{
		id: "p-salt-air",
		name: "Salt Air Scarf",
		category: "Accessories",
		status: "archived",
		description: "An earlier scarf experiment. Retired from the active line; pattern notes kept.",
		swatch: "#B7C4C0",
		quantityMade: 2,
		quantityAvailable: 0,
		sellingPrice: 95,
		targetMargin: .6,
		packagingCost: .6,
		otherDirectCosts: 0,
		hoursWorked: 1.2,
		labourRate: 5,
		contentChecklist: checklist({ productPhoto: true }),
		materials: [{
			materialId: "m-natural-cotton",
			quantity: 2
		}],
		frozenTrueCost: 32,
		stockDeducted: true,
		timerRunning: false,
		productionNotes: "Archived after two made. Too close to the wrap."
	}
];
var shot = (...items) => items;
var SEED = {
	products: PRODUCTS,
	materials: MATERIALS,
	content: [
		{
			id: "c-market-morning",
			title: "Market Morning Reel",
			pillar: "Island living",
			format: "reel",
			status: "ready",
			linkedProductId: "p-island-market",
			coreMessage: "The tote is made for the same morning the island already lives.",
			hook: "Before the fruit is gone, the bag is already on your shoulder.",
			caption: "Saturday starts at the stall. The Island Market Tote was made for mangoes, limes, and the walk home in the heat. Would you carry this colour into your day?",
			cta: "Would you carry this colour into your day?",
			shotList: shot("Hands lifting the tote off a wooden stall", "Fruit settling into the body of the bag", "Walking away, strap on shoulder, sea in the distance"),
			assets: [
				{
					label: "Cut footage",
					done: true
				},
				{
					label: "Caption",
					done: true
				},
				{
					label: "Cover frame",
					done: true
				}
			],
			targetDate: "2026-08-29",
			channel: "Instagram"
		},
		{
			id: "c-tide-sun",
			title: "Tide Tote in the Sun",
			pillar: "Products",
			format: "carousel",
			status: "captured",
			linkedProductId: "p-tide-tote",
			coreMessage: "The Tide Tote belongs in daylight, not on a white sweep.",
			hook: "It looks like the water it was named for.",
			caption: "Natural cotton, seafoam, leather that will darken. Photographed where it will actually live.",
			cta: "Save this for your next market morning.",
			shotList: shot("Tote on sand", "Handle detail", "Interior snap", "Worn on the shoulder"),
			assets: [
				{
					label: "Raw photos",
					done: true
				},
				{
					label: "Selects",
					done: false
				},
				{
					label: "Caption",
					done: false
				}
			],
			targetDate: "2026-08-31"
		},
		{
			id: "c-yarn-to-carry",
			title: "From Yarn to Carry-on",
			pillar: "Making",
			format: "reel",
			status: "idea",
			linkedProductId: "p-purple-holder",
			coreMessage: "A skein of purple cotton becomes a bottle holder made for moving through the island.",
			hook: "From a skein of purple cotton to a bottle holder made for moving through the island.",
			caption: "",
			cta: "Would you carry this colour into your day?",
			shotList: shot("Yarn texture", "Hands making", "Hardware detail", "Finished product in use", "Coastal location reveal"),
			assets: [{
				label: "Making clip",
				done: false
			}, {
				label: "Finished clip",
				done: false
			}]
		},
		{
			id: "c-cotton-matters",
			title: "Why Cotton Matters Here",
			pillar: "Fibre and yarn education",
			format: "carousel",
			status: "editing",
			linkedMaterialId: "m-natural-cotton",
			coreMessage: "Cotton is not a trend here. It is what the climate asks for.",
			hook: "Why this fibre, on this island.",
			caption: "Cotton breathes in August. It softens with salt air. It is the honest choice for bags that will be used, not stored.",
			cta: "What fibre do you reach for in the heat?",
			shotList: shot("Skein close-up", "Hands winding", "Finished tote in sun", "Wash care card"),
			assets: [{
				label: "Slides drafted",
				done: true
			}, {
				label: "Type set",
				done: false
			}],
			targetDate: "2026-09-02"
		},
		{
			id: "c-hummingbird-mark",
			title: "The Hummingbird on the Tag",
			pillar: "Hummingbird / brand world",
			format: "story",
			status: "idea",
			coreMessage: "The mark is a line, not a mascot. It is the pause between making and selling.",
			hook: "A small bird, a small tag, a whole studio.",
			caption: "",
			cta: "Look for it on the next piece you pick up.",
			shotList: shot("Letterpress tag", "Waxed linen knot", "Tag on a finished bag"),
			assets: [{
				label: "Tag photo",
				done: false
			}]
		},
		{
			id: "c-porch-light",
			title: "Porch Light Making",
			pillar: "Founder story",
			format: "reel",
			status: "idea",
			coreMessage: "Most of the work happens after the heat drops.",
			hook: "The studio is a porch and a lamp.",
			caption: "",
			cta: "This is where the Tide Tote was finished.",
			shotList: shot("Hands in lamplight", "Hook and yarn", "Night insects, quiet"),
			assets: [{
				label: "Clip",
				done: false
			}]
		},
		{
			id: "c-sea-grape",
			title: "Sea Grape Hour",
			pillar: "Nature",
			format: "photo",
			status: "captured",
			coreMessage: "Colour notes from the coast, not from a trend deck.",
			hook: "The palette is already outside.",
			caption: "Sea grape, wet sand, the inside of a conch. This is how seafoam got into the tote.",
			cta: "Save for colour notes.",
			shotList: shot("Sea grape leaves", "Wet sand", "Yarn beside the leaf"),
			assets: [{
				label: "Photos",
				done: true
			}, {
				label: "Selects",
				done: true
			}]
		},
		{
			id: "c-wine-gift",
			title: "Take a Bottle, Beautifully",
			pillar: "Products",
			format: "carousel",
			status: "ready",
			linkedProductId: "p-wine-holder",
			coreMessage: "The wine holder is the easiest gift in the line.",
			hook: "Do not wrap the bottle. Carry it.",
			caption: "The Wine Bottle Holder is ready now — plum, natural, a brass ring. A gift that does not look like it came from a shop.",
			cta: "Message to reserve one for this weekend.",
			shotList: shot("Holder on table", "Bottle sliding in", "Walking out the door"),
			assets: [{
				label: "Photos",
				done: true
			}, {
				label: "Caption",
				done: true
			}],
			targetDate: "2026-08-29",
			channel: "Instagram"
		},
		{
			id: "c-listing-tide",
			title: "Tide Tote listing copy",
			pillar: "Products",
			format: "product-listing",
			status: "idea",
			linkedProductId: "p-tide-tote",
			coreMessage: "Need photography before this can go live.",
			hook: "A tote named for the water it faces.",
			caption: "",
			cta: "Available this week.",
			shotList: shot("Hero", "Detail", "In use", "Scale"),
			assets: [{
				label: "Copy draft",
				done: false
			}]
		},
		{
			id: "c-sunday-table",
			title: "Sunday Table",
			pillar: "Island living",
			format: "photo",
			status: "published",
			publishedDate: "2026-08-03",
			channel: "Instagram",
			coreMessage: "The market table is a studio, once a week.",
			hook: "Same cloth, new work.",
			caption: "Sunday at the table. Come say hello.",
			cta: "Find us until noon.",
			shotList: [],
			assets: []
		},
		{
			id: "c-hands-mesh",
			title: "The Mesh That Holds Water",
			pillar: "Making",
			format: "reel",
			status: "editing",
			linkedProductId: "p-purple-holder",
			coreMessage: "Show the stitch that makes the bottle stay.",
			hook: "It has to hold. That is the whole brief.",
			caption: "",
			cta: "Watch the last round.",
			shotList: shot("Hook entering stitch", "Bottle test", "D-ring attach"),
			assets: [{
				label: "Raw clip",
				done: true
			}, {
				label: "Cut",
				done: false
			}]
		},
		{
			id: "c-founder-why",
			title: "Why I Make Bags, Not Clothes",
			pillar: "Founder story",
			format: "email",
			status: "idea",
			coreMessage: "Bags leave the studio and go into other people's days.",
			hook: "I wanted the work to be used.",
			caption: "",
			cta: "Reply and tell me what you carry.",
			shotList: [],
			assets: [{
				label: "Outline",
				done: false
			}]
		},
		{
			id: "c-coastal-palette",
			title: "A Palette Taken from the Shore",
			pillar: "Coastal Caribbean life",
			format: "carousel",
			status: "idea",
			coreMessage: "Navy, sand, sea-glass, clay. Not a moodboard — a walk.",
			hook: "These colours were not chosen in software.",
			caption: "",
			cta: "Which one is your weather?",
			shotList: shot("Sand", "Water", "Clay pot", "Yarn"),
			assets: []
		},
		{
			id: "c-blocking",
			title: "How a Tote Learns Its Shape",
			pillar: "Making",
			format: "photo",
			status: "captured",
			linkedProductId: "p-tide-tote",
			coreMessage: "Blocking is the quiet half of making.",
			hook: "It looks unfinished until it is pinned.",
			caption: "",
			cta: "Save this if you make.",
			shotList: shot("Wet tote", "Pins", "Dry in morning light"),
			assets: [{
				label: "Photos",
				done: true
			}]
		},
		{
			id: "c-dust-bag",
			title: "The Bag Inside the Bag",
			pillar: "Products",
			format: "story",
			status: "idea",
			linkedMaterialId: "m-dust-bags",
			coreMessage: "Packaging that is kept is not packaging.",
			hook: "You will use this again.",
			caption: "",
			cta: "Swipe for the cotton dust bag.",
			shotList: shot("Dust bag texture", "Tote going in"),
			assets: []
		},
		{
			id: "c-published-wine",
			title: "Two Wine Holders, One Table",
			pillar: "Products",
			format: "photo",
			status: "published",
			linkedProductId: "p-wine-holder",
			publishedDate: "2026-08-06",
			channel: "Instagram",
			coreMessage: "Social proof from a real dinner.",
			hook: "They left together.",
			caption: "Both sold before noon.",
			cta: "",
			shotList: [],
			assets: []
		},
		{
			id: "c-published-yarn",
			title: "New Skein, Old Light",
			pillar: "Fibre and yarn education",
			format: "photo",
			status: "published",
			linkedMaterialId: "m-purple-cotton",
			publishedDate: "2026-08-09",
			channel: "Instagram",
			coreMessage: "Introduce the purple before the holder is finished.",
			hook: "This is the colour of the next holder.",
			caption: "Purple cotton, still in the skein.",
			cta: "",
			shotList: [],
			assets: []
		},
		{
			id: "c-published-walk",
			title: "A Walk with the Crossbody",
			pillar: "Coastal Caribbean life",
			format: "reel",
			status: "published",
			linkedProductId: "p-driftwood",
			publishedDate: "2026-08-14",
			channel: "TikTok",
			coreMessage: "The, not styled.",
			hook: "Hands free for the rest of the day.",
			caption: "Driftwood Crossbody, first wear.",
			cta: "",
			shotList: [],
			assets: []
		},
		{
			id: "c-published-market",
			title: "Thank you, Sunday",
			pillar: "Island living",
			format: "story",
			status: "published",
			publishedDate: "2026-08-17",
			channel: "Instagram",
			coreMessage: "Close the market day with gratitude, not a hard sell.",
			hook: "Packed up, sunburnt, sold through.",
			caption: "See you next week.",
			cta: "",
			shotList: [],
			assets: []
		},
		{
			id: "c-clutch-evening",
			title: "Seafoam after Six",
			pillar: "Products",
			format: "photo",
			status: "idea",
			linkedProductId: "p-seafoam-clutch",
			coreMessage: "The clutch is the evening piece in a daytime line.",
			hook: "Not everything is for the market.",
			caption: "",
			cta: "Would you take this out after dark?",
			shotList: shot("Clutch on linen", "Open with a key", "Held in one hand"),
			assets: []
		}
	],
	tasks: [
		{
			id: "t-finish-purple",
			title: "Finish Purple Water Bottle Holder",
			dueDate: "2026-08-29",
			priority: "high",
			completed: false,
			linkedKind: "product",
			linkedId: "p-purple-holder"
		},
		{
			id: "t-photo-tide",
			title: "Photograph Tide Tote",
			dueDate: "2026-08-29",
			priority: "high",
			completed: false,
			linkedKind: "product",
			linkedId: "p-tide-tote"
		},
		{
			id: "t-post-market",
			title: "Post “Market Morning” Reel",
			dueDate: "2026-08-29",
			priority: "medium",
			completed: false,
			linkedKind: "content",
			linkedId: "c-market-morning"
		},
		{
			id: "t-order-yarn",
			title: "Order natural cotton yarn",
			dueDate: "2026-08-29",
			priority: "high",
			completed: false,
			linkedKind: "material",
			linkedId: "m-natural-cotton"
		},
		{
			id: "t-follow-up",
			title: "Follow up with Island Market customer",
			dueDate: "2026-08-29",
			priority: "high",
			completed: false,
			linkedKind: "order",
			linkedId: "o-island-market"
		}
	],
	sales: [
		{
			id: "s1",
			date: "2026-08-01",
			productId: "p-seafoam-clutch",
			itemName: "Seafoam Clutch",
			quantity: 1,
			total: 78,
			status: "paid"
		},
		{
			id: "s2",
			date: "2026-08-03",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 2,
			total: 84,
			status: "paid"
		},
		{
			id: "s3",
			date: "2026-08-04",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 2,
			total: 84,
			status: "paid"
		},
		{
			id: "s4",
			date: "2026-08-06",
			productId: "p-sunrise-sling",
			itemName: "Sunrise Bottle Sling",
			quantity: 2,
			total: 96,
			status: "paid"
		},
		{
			id: "s5",
			date: "2026-08-08",
			productId: "p-coral-pouch",
			itemName: "Coral Market Pouch",
			quantity: 1,
			total: 55,
			status: "paid"
		},
		{
			id: "s6",
			date: "2026-08-09",
			productId: "p-driftwood",
			itemName: "Driftwood Crossbody",
			quantity: 1,
			total: 128,
			status: "paid"
		},
		{
			id: "s7",
			date: "2026-08-10",
			productId: "p-tide-tote",
			itemName: "Tide Tote",
			quantity: 1,
			total: 145,
			status: "paid"
		},
		{
			id: "s8",
			date: "2026-08-11",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 3,
			total: 126,
			status: "paid"
		},
		{
			id: "s9",
			date: "2026-08-13",
			productId: "p-salt-air",
			itemName: "Salt Air Scarf",
			quantity: 1,
			total: 157,
			status: "paid"
		},
		{
			id: "s10",
			date: "2026-08-14",
			productId: "p-tide-tote",
			itemName: "Tide Tote",
			quantity: 1,
			total: 145,
			status: "paid"
		},
		{
			id: "s11",
			date: "2026-08-16",
			productId: "p-seafoam-clutch",
			itemName: "Seafoam Clutch",
			quantity: 1,
			total: 78,
			status: "paid"
		},
		{
			id: "s12",
			date: "2026-08-17",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 2,
			total: 84,
			status: "paid"
		},
		{
			id: "s13",
			date: "2026-08-18",
			productId: "p-purple-holder",
			itemName: "Custom Water Bottle Holder",
			quantity: 2,
			total: 110,
			status: "paid",
			customer: "Walk-in"
		},
		{
			id: "s14",
			date: "2026-08-19",
			productId: "p-coral-pouch",
			itemName: "Coral Market Pouch",
			quantity: 2,
			total: 110,
			status: "paid"
		},
		{
			id: "s15",
			date: "2026-08-21",
			productId: "p-sunrise-sling",
			itemName: "Sunrise Bottle Sling",
			quantity: 1,
			total: 48,
			status: "paid"
		},
		{
			id: "s16",
			date: "2026-08-23",
			productId: "p-driftwood",
			itemName: "Driftwood Crossbody",
			quantity: 1,
			total: 128,
			status: "paid"
		},
		{
			id: "s17",
			date: "2026-08-24",
			productId: "p-island-market",
			itemName: "Island Market Tote",
			quantity: 1,
			total: 165,
			status: "awaiting",
			customer: "Island Market customer"
		},
		{
			id: "s18",
			date: "2026-08-25",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 2,
			total: 84,
			status: "paid"
		},
		{
			id: "s19",
			date: "2026-08-27",
			productId: "p-seafoam-clutch",
			itemName: "Seafoam Clutch",
			quantity: 1,
			total: 78,
			status: "paid"
		},
		{
			id: "s20",
			date: "2026-08-28",
			productId: "p-wine-holder",
			itemName: "Wine Bottle Holder",
			quantity: 1,
			total: 42,
			status: "paid"
		}
	],
	expenses: [
		{
			id: "e1",
			date: "2026-08-02",
			category: "Materials",
			description: "Purple cotton yarn",
			amount: 82.6,
			productRelated: true
		},
		{
			id: "e2",
			date: "2026-08-05",
			category: "Studio",
			description: "Studio contribution",
			amount: 150,
			productRelated: false
		},
		{
			id: "e3",
			date: "2026-08-07",
			category: "Packaging",
			description: "Kraft tags and dust bags",
			amount: 54,
			productRelated: true
		},
		{
			id: "e4",
			date: "2026-08-12",
			category: "Transport",
			description: "Market and product shoot travel",
			amount: 48,
			productRelated: false
		},
		{
			id: "e5",
			date: "2026-08-15",
			category: "Market fees",
			description: "Sunday market table",
			amount: 90,
			productRelated: false
		},
		{
			id: "e6",
			date: "2026-08-20",
			category: "Studio",
			description: "Phone and internet",
			amount: 45,
			productRelated: false
		},
		{
			id: "e7",
			date: "2026-08-22",
			category: "Marketing",
			description: "Small campaign test",
			amount: 60,
			productRelated: false
		},
		{
			id: "e8",
			date: "2026-08-26",
			category: "Studio",
			description: "Props and market sundries",
			amount: 32,
			productRelated: false
		}
	],
	draws: [{
		id: "d1",
		date: "2026-08-20",
		amount: 200,
		notes: "August owner draw"
	}],
	orders: [
		{
			id: "o-purple-batch",
			customerName: "Sunday market hold",
			productId: "p-purple-holder",
			productName: "Purple Water Bottle Holder",
			quantity: 1,
			total: 48,
			status: "open",
			dueDate: "2026-08-29",
			notes: "Finish today so it can be photographed and tabled."
		},
		{
			id: "o-island-market",
			customerName: "Island Market customer",
			productId: "p-island-market",
			productName: "Island Market Tote",
			quantity: 1,
			total: 165,
			status: "awaiting-payment",
			dueDate: "2026-08-30",
			notes: "Prototype shown; customer asked to collect. Payment still outstanding."
		},
		{
			id: "o-custom-sling",
			customerName: "Leah M.",
			productId: "p-sunrise-sling",
			productName: "Sunrise Bottle Sling",
			quantity: 1,
			total: 48,
			status: "open",
			dueDate: "2026-09-02",
			notes: "Colour confirmed. Use remaining coral cotton."
		}
	],
	commitments: [{
		id: "k1",
		name: "Sunday market table",
		amount: 90,
		date: "2026-08-31",
		essential: true
	}, {
		id: "k2",
		name: "Phone and internet",
		amount: 54,
		date: "2026-09-03",
		essential: true
	}],
	settings: {
		ownerName: "Arlette",
		operatingBuffer: 300,
		openingCash: 141.6,
		currentGoal: "consistency",
		labourRateDefault: 5
	},
	dismissedMoveIds: [],
	saveError: false
};
function cloneSeed() {
	return structuredClone(SEED);
}
function landedCost(m) {
	return m.purchaseCost + m.shipping + m.duties;
}
function unitCost(m) {
	if (!m.usableUnits) return 0;
	return landedCost(m) / m.usableUnits;
}
function inventoryValue(m) {
	return m.quantityOnHand * unitCost(m);
}
function materialCostForProduct(product, materials) {
	return product.materials.reduce((sum, line) => {
		const mat = materials.find((m) => m.id === line.materialId);
		if (!mat) return sum;
		return sum + line.quantity * unitCost(mat);
	}, 0);
}
function labourCost(product) {
	return product.hoursWorked * product.labourRate;
}
function liveTrueCost(product, materials) {
	return materialCostForProduct(product, materials) + product.packagingCost + product.otherDirectCosts + labourCost(product);
}
function trueCost(product, materials) {
	if (product.frozenTrueCost != null && (product.status === "finished" || product.status === "selling" || product.status === "retired" || product.status === "archived")) return product.frozenTrueCost;
	return liveTrueCost(product, materials);
}
function grossProfit(product, materials) {
	return product.sellingPrice - trueCost(product, materials);
}
function grossMargin(product, materials) {
	if (!product.sellingPrice) return 0;
	return grossProfit(product, materials) / product.sellingPrice * 100;
}
function suggestedRetail(product, materials) {
	const cost = liveTrueCost(product, materials);
	const t = product.targetMargin;
	if (t <= 0 || t >= 1) return cost;
	return cost / (1 - t);
}
function contentProgress(c) {
	const keys = Object.keys(c);
	return {
		done: keys.filter((k) => c[k]).length,
		total: keys.length
	};
}
function isLowStock(m) {
	return m.quantityOnHand <= m.reorderLevel;
}
function saleTrueCost(sale, products, materials) {
	const product = sale.productId ? products.find((p) => p.id === sale.productId) : void 0;
	if (!product) return 0;
	return trueCost(product, materials) * sale.quantity;
}
function flushTimer(p) {
	if (!p.timerRunning || !p.timerStartedAt) return p;
	const extra = (Date.now() - p.timerStartedAt) / 36e5;
	return {
		...p,
		hoursWorked: Math.round((p.hoursWorked + extra) * 100) / 100,
		timerRunning: false,
		timerStartedAt: void 0
	};
}
var useStudio = create()(persist((set, get) => ({
	...cloneSeed(),
	hydrated: false,
	period: "this-month",
	movingOpen: false,
	setHydrated: (v) => set({ hydrated: v }),
	setPeriod: (p, range) => set({
		period: p,
		customFrom: range?.from,
		customTo: range?.to
	}),
	setMovingOpen: (v) => set({ movingOpen: v }),
	resetStudio: () => set({
		...cloneSeed(),
		hydrated: true,
		period: "this-month",
		movingOpen: false
	}),
	setSaveError: (v) => set({ saveError: v }),
	retrySave: () => {
		try {
			const { saveError: _s, hydrated: _h, period, customFrom, customTo, movingOpen, ...data } = get();
			localStorage.setItem("breeze-loop-os-v1", JSON.stringify({
				state: {
					...data,
					period,
					customFrom,
					customTo
				},
				version: 1
			}));
			set({ saveError: false });
		} catch {
			set({ saveError: true });
		}
	},
	updateSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	setGoal: (g) => set({ settings: {
		...get().settings,
		currentGoal: g
	} }),
	upsertProduct: (p) => set((s) => {
		const i = s.products.findIndex((x) => x.id === p.id);
		const products = [...s.products];
		if (i >= 0) products[i] = p;
		else products.unshift(p);
		return { products };
	}),
	patchProduct: (id, patch) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...p,
		...patch
	} : p) })),
	duplicateProduct: (id) => {
		const src = get().products.find((p) => p.id === id);
		if (!src) return null;
		const copy = {
			...structuredClone(src),
			id: uid("p"),
			name: `${src.name} (variation)`,
			status: "idea",
			quantityMade: 0,
			quantityAvailable: 0,
			frozenTrueCost: void 0,
			stockDeducted: false,
			timerRunning: false,
			timerStartedAt: void 0,
			hoursWorked: 0
		};
		set((s) => ({ products: [copy, ...s.products] }));
		return copy.id;
	},
	archiveProduct: (id) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...flushTimer(p),
		status: "archived"
	} : p) })),
	restoreProduct: (id) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...p,
		status: "idea"
	} : p) })),
	markProductFinished: (id) => set((s) => {
		const products = s.products.map((p) => {
			if (p.id !== id) return p;
			const flushed = flushTimer(p);
			const cost = liveTrueCost(flushed, s.materials);
			return {
				...flushed,
				status: "finished",
				quantityMade: Math.max(1, flushed.quantityMade),
				quantityAvailable: flushed.quantityAvailable + Math.max(1, flushed.quantityMade || 1),
				frozenTrueCost: cost,
				stockDeducted: true
			};
		});
		const product = s.products.find((p) => p.id === id);
		let materials = s.materials;
		if (product && !product.stockDeducted) {
			const qty = Math.max(1, product.quantityMade || 1);
			materials = s.materials.map((m) => {
				const line = product.materials.find((l) => l.materialId === m.id);
				if (!line) return m;
				return {
					...m,
					quantityOnHand: Math.max(0, round2(m.quantityOnHand - line.quantity * qty))
				};
			});
		}
		return {
			products,
			materials
		};
	}),
	toggleTimer: (id) => set((s) => ({ products: s.products.map((p) => {
		if (p.id !== id) return p;
		if (p.timerRunning) return flushTimer(p);
		return {
			...p,
			timerRunning: true,
			timerStartedAt: Date.now()
		};
	}) })),
	addManualTime: (id, hours) => set((s) => ({ products: s.products.map((p) => p.id === id ? {
		...p,
		hoursWorked: Math.max(0, round2(p.hoursWorked + hours))
	} : p) })),
	setBomLine: (productId, materialId, quantity) => set((s) => ({ products: s.products.map((p) => {
		if (p.id !== productId) return p;
		const rest = p.materials.filter((l) => l.materialId !== materialId);
		const materials = quantity > 0 ? [...rest, {
			materialId,
			quantity
		}] : rest;
		return {
			...p,
			materials
		};
	}) })),
	removeBomLine: (productId, materialId) => set((s) => ({ products: s.products.map((p) => p.id === productId ? {
		...p,
		materials: p.materials.filter((l) => l.materialId !== materialId)
	} : p) })),
	toggleChecklist: (productId, key) => set((s) => ({ products: s.products.map((p) => p.id === productId ? {
		...p,
		contentChecklist: {
			...p.contentChecklist,
			[key]: !p.contentChecklist[key]
		}
	} : p) })),
	upsertMaterial: (m) => set((s) => {
		const i = s.materials.findIndex((x) => x.id === m.id);
		const materials = [...s.materials];
		if (i >= 0) materials[i] = m;
		else materials.unshift(m);
		return { materials };
	}),
	patchMaterial: (id, patch) => set((s) => ({ materials: s.materials.map((m) => m.id === id ? {
		...m,
		...patch
	} : m) })),
	receiveStock: (id, data) => set((s) => ({ materials: s.materials.map((m) => {
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
			lastPurchased: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")
		};
	}) })),
	upsertContent: (c) => set((s) => {
		const i = s.content.findIndex((x) => x.id === c.id);
		const content = [...s.content];
		if (i >= 0) content[i] = c;
		else content.unshift(c);
		return { content };
	}),
	patchContent: (id, patch) => set((s) => ({ content: s.content.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) })),
	setContentStatus: (id, status) => set((s) => ({ content: s.content.map((c) => c.id === id ? {
		...c,
		status
	} : c) })),
	publishContent: (id, channel, date) => set((s) => {
		const item = s.content.find((c) => c.id === id);
		const content = s.content.map((c) => c.id === id ? {
			...c,
			status: "published",
			channel,
			publishedDate: date
		} : c);
		let products = s.products;
		if (item?.linkedProductId) products = s.products.map((p) => {
			if (p.id !== item.linkedProductId) return p;
			const next = { ...p.contentChecklist };
			if (item.format === "reel") next.reel = true;
			if (item.format === "story") next.story = true;
			if (item.format === "photo" || item.format === "carousel") next.productPhoto = true;
			if (item.format === "product-listing") next.listingReady = true;
			return {
				...p,
				contentChecklist: next
			};
		});
		return {
			content,
			products
		};
	}),
	addTask: (t) => set((s) => ({ tasks: [{
		...t,
		id: uid("t"),
		completed: false
	}, ...s.tasks] })),
	toggleTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		completed: !t.completed
	} : t) })),
	deferTask: (id) => set((s) => ({ tasks: s.tasks.map((t) => t.id === id ? {
		...t,
		deferredTo: format(addDays(/* @__PURE__ */ new Date(), 1), "yyyy-MM-dd")
	} : t) })),
	removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
	addSale: (sale) => set((s) => ({ sales: [{
		...sale,
		id: uid("s")
	}, ...s.sales] })),
	patchSale: (id, patch) => set((s) => ({ sales: s.sales.map((x) => x.id === id ? {
		...x,
		...patch
	} : x) })),
	addExpense: (e) => set((s) => ({ expenses: [{
		...e,
		id: uid("e")
	}, ...s.expenses] })),
	addDraw: (d) => set((s) => ({ draws: [{
		...d,
		id: uid("d")
	}, ...s.draws] })),
	addCommitment: (c) => set((s) => ({ commitments: [{
		...c,
		id: uid("k")
	}, ...s.commitments] })),
	removeCommitment: (id) => set((s) => ({ commitments: s.commitments.filter((c) => c.id !== id) })),
	dismissMove: (id) => set((s) => ({ dismissedMoveIds: [...s.dismissedMoveIds, id] })),
	clearDismissed: () => set({ dismissedMoveIds: [] })
}), {
	name: "breeze-loop-os-v1",
	storage: createJSONStorage(() => localStorage),
	skipHydration: true,
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
		customTo: s.customTo
	}),
	onRehydrateStorage: () => (state, error) => {
		if (error) state?.setSaveError(true);
	}
}));
function round2(n) {
	return Math.round(n * 100) / 100;
}
function money(n, opts) {
	const abs = Math.abs(n);
	const formatted = opts?.cents || abs % 1 !== 0 ? abs.toLocaleString("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}) : abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
	return `${n < 0 ? "−" : ""}$${formatted}`;
}
function pct(n) {
	if (!Number.isFinite(n)) return "—";
	return `${n.toFixed(1)}%`;
}
function prettyDate(iso) {
	try {
		const d = parseISO(iso);
		if (isToday(d)) return "Today";
		return format(d, "d MMM");
	} catch {
		return iso;
	}
}
function longDate(d = /* @__PURE__ */ new Date()) {
	return format(d, "EEEE, d MMMM");
}
function monthLabel(d = /* @__PURE__ */ new Date()) {
	return format(d, "MMMM yyyy");
}
function greeting(d = /* @__PURE__ */ new Date()) {
	const h = d.getHours();
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function statusLabel(status) {
	return status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
function formatLabel(formatKey) {
	if (formatKey === "product-listing") return "Product listing";
	if (formatKey === "photo") return "Photo";
	return statusLabel(formatKey);
}
function daysUntil(iso) {
	if (!iso) return 99;
	try {
		return differenceInCalendarDays(parseISO(iso), /* @__PURE__ */ new Date());
	} catch {
		return 99;
	}
}
function goalBoost(goal, family) {
	if (goal === "sales" && (family === 3 || family === 6)) return -.2;
	if (goal === "cash-protection" && (family === 5 || family === 4)) return -.2;
	if (goal === "product-launch" && (family === 2 || family === 3)) return -.2;
	if (goal === "consistency" && family === 7) return -.2;
	if (goal === "community-growth" && (family === 7 || family === 8)) return -.2;
	return 0;
}
function getMoves(data) {
	const { products, materials, content, sales, orders, tasks, settings, dismissedMoveIds } = data;
	const moves = [];
	const goal = settings.currentGoal;
	for (const order of orders.filter((o) => o.status === "open" || o.status === "awaiting-payment")) {
		const due = daysUntil(order.dueDate);
		if (due > 3) continue;
		const product = products.find((p) => p.id === order.productId);
		if (order.status === "awaiting-payment") continue;
		if (product && (product.status === "in-production" || product.status === "prototype" || product.status === "idea")) moves.push({
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
				`Expected value ${money(order.total)}.`
			],
			tradeoff: "Choosing this delays photography on finished pieces that could be listed today."
		});
	}
	for (const order of orders.filter((o) => o.status === "open")) {
		const due = daysUntil(order.dueDate);
		if (due > 2) continue;
		const product = products.find((p) => p.id === order.productId);
		if (product && (product.status === "finished" || product.status === "selling") && product.quantityAvailable > 0) moves.push({
			id: `fulfill-${order.id}`,
			title: `Prepare ${order.productName} for ${order.customerName}`,
			why: `The piece is ready. Packing it today keeps a promised date.`,
			minutes: 20,
			href: `/make/${product.id}`,
			actionLabel: "Open product",
			priority: 1 + goalBoost(goal, 1),
			signals: [`Order due ${due <= 0 ? "today" : `in ${due} day${due === 1 ? "" : "s"}`}.`, `${product.quantityAvailable} available.`]
		});
	}
	for (const p of products.filter((p) => p.status === "finished" || p.status === "selling")) {
		const progress = contentProgress(p.contentChecklist);
		if (!(!p.contentChecklist.productPhoto || !p.contentChecklist.listingReady)) continue;
		const missing = !p.contentChecklist.productPhoto ? "photography" : !p.contentChecklist.listingReady ? "a listing" : "content";
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
				p.quantityAvailable ? `${p.quantityAvailable} available to sell.` : "No units on hand."
			],
			tradeoff: "This does not finish work already on the hook."
		});
	}
	for (const m of materials.filter(isLowStock)) {
		const usedBy = products.filter((p) => (p.status === "in-production" || p.status === "prototype" || p.status === "idea") && p.materials.some((l) => l.materialId === m.id));
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
				`Supplier: ${m.supplier}, ${m.supplierLocation}.`
			],
			tradeoff: "Spending cash now versus finishing a piece that is already on the table."
		});
	}
	for (const sale of sales.filter((s) => s.status === "awaiting")) moves.push({
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
			`Operating buffer is ${money(settings.operatingBuffer)}.`
		],
		tradeoff: "A follow-up is short; it does not create a new piece to photograph."
	});
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
			signals: [`${order.productName} · ${money(order.total)}.`, order.notes].filter(Boolean)
		});
	}
	const highMargin = products.filter((p) => (p.status === "finished" || p.status === "selling") && p.sellingPrice).map((p) => ({
		p,
		m: grossMargin(p, materials)
	})).filter((x) => x.m >= 63).sort((a, b) => b.m - a.m);
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
			signals: [
				`Gross margin ${m.toFixed(1)}%.`,
				`${p.quantityAvailable} available.`,
				`Price ${money(p.sellingPrice)}.`
			],
			tradeoff: "This is strategic, not urgent. It should not jump a deadline."
		});
	}
	for (const c of content.filter((c) => c.status === "ready")) {
		const due = daysUntil(c.targetDate);
		moves.push({
			id: `post-${c.id}`,
			title: `Post “${c.title}”`,
			why: due <= 0 ? "It is ready and scheduled for today. Publishing it keeps the studio visible without a new shoot." : "It is already in the ready column. A small push gets it out of the studio.",
			minutes: 20,
			href: `/content/${c.id}`,
			actionLabel: "Open content",
			priority: 7 + goalBoost(goal, 7),
			signals: [
				`${c.pillar} · ${c.format}.`,
				c.targetDate ? due <= 0 ? "Targeted for today." : `Target ${c.targetDate}.` : "No date set.",
				c.linkedProductId ? `Linked to ${products.find((p) => p.id === c.linkedProductId)?.name ?? "a product"}.` : "Standalone piece."
			]
		});
	}
	const idea = content.find((c) => c.status === "idea");
	if (idea) moves.push({
		id: `shape-${idea.id}`,
		title: `Shape “${idea.title}”`,
		why: "A quiet planning task. Useful if the urgent work is already in motion.",
		minutes: 20,
		href: `/content/${idea.id}`,
		actionLabel: "Open idea",
		priority: 8 + goalBoost(goal, 8),
		signals: [`${idea.pillar}.`, idea.hook || idea.coreMessage],
		tradeoff: "Creative work that does not move cash or stock today."
	});
	const openTask = tasks.find((t) => !t.completed && !t.deferredTo);
	if (openTask && !moves.some((m) => m.title === openTask.title)) {
		const href = openTask.linkedKind === "product" ? `/make/${openTask.linkedId}` : openTask.linkedKind === "content" ? `/content/${openTask.linkedId}` : openTask.linkedKind === "material" ? `/stock/${openTask.linkedId}` : openTask.linkedKind === "sale" || openTask.linkedKind === "order" ? "/money" : "/";
		moves.push({
			id: `task-${openTask.id}`,
			title: openTask.title,
			why: "It is already on today’s list.",
			minutes: 20,
			href,
			actionLabel: "Open",
			priority: 8,
			signals: [`Priority ${openTask.priority}.`, `Due ${openTask.dueDate}.`]
		});
	}
	const unique = /* @__PURE__ */ new Map();
	for (const m of moves) {
		if (dismissedMoveIds.includes(m.id)) continue;
		const prev = unique.get(m.id);
		if (!prev || m.priority < prev.priority) unique.set(m.id, m);
	}
	return [...unique.values()].sort((a, b) => a.priority - b.priority || a.minutes - b.minutes);
}
function emptyMove() {
	return {
		id: "empty",
		title: "Add one true thing",
		why: "I can help you choose a next move once I know a little more. Add one product, material, or task—or tell me what you are trying to accomplish this week.",
		minutes: 10,
		href: "/make/new",
		actionLabel: "Add a product",
		priority: 9,
		signals: ["The studio is still empty of records."]
	};
}
function GetMeMoving() {
	const open = useStudio((s) => s.movingOpen);
	const setOpen = useStudio((s) => s.setMovingOpen);
	const data = useStudio();
	const addTask = useStudio((s) => s.addTask);
	const dismissMove = useStudio((s) => s.dismissMove);
	const router = useRouter();
	const [index, setIndex] = (0, import_react.useState)(0);
	const [signals, setSignals] = (0, import_react.useState)(false);
	const moves = getMoves(data);
	const move = moves[index] ?? emptyMove();
	const hasAnother = moves.length > index + 1;
	const close = () => {
		setOpen(false);
		setIndex(0);
		setSignals(false);
	};
	const start = () => {
		close();
		if (move.href) router.history.push(move.href);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
		open,
		onOpenChange: (v) => {
			if (!v) close();
			else setOpen(true);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Portal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, { className: "fixed inset-0 z-50 bg-navy/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Content, {
			className: "fixed bottom-0 left-0 right-0 z-50 outline-none md:left-auto md:top-0 md:h-full md:w-[420px] md:rounded-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-t-xl md:rounded-none bg-paper shadow-card-hover max-h-[92dvh] overflow-y-auto px-5 pt-3 pb-8 md:px-7 md:pt-8 md:h-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-line md:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "size-7 text-seaglass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] uppercase tracking-[0.18em] text-soft",
								children: "Your next move"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: close,
							className: "size-11 inline-flex items-center justify-center rounded-md text-muted hover:bg-secondary",
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-[1.7rem] text-navy mt-4 text-balance",
						children: move.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted leading-relaxed",
						children: move.why
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-xs uppercase tracking-[0.16em] text-soft",
						children: [
							"Estimated focus time · ",
							move.minutes,
							" minutes"
						]
					}),
					signals ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-5 space-y-2 border-t border-line pt-4",
						children: [move.signals.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-navy pl-3 border-l-2 border-seaglass",
							children: s
						}, s)), move.tradeoff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm text-muted pt-2",
							children: move.tradeoff
						}) : null]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "seaglass",
								onClick: start,
								children: move.actionLabel
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setSignals((v) => !v),
								children: signals ? "Hide signals" : "See supporting signals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: !hasAnother,
								onClick: () => {
									setIndex((i) => i + 1);
									setSignals(false);
								},
								children: "Give me another option"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									addTask({
										title: move.title,
										dueDate: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
										priority: "high"
									});
									close();
								},
								children: "Make this a task"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									if (move.id !== "empty") dismissMove(move.id);
									close();
								},
								children: "Dismiss for today"
							})
						]
					}),
					hasAnother && index > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted",
						children: move.tradeoff ?? "A slower option than the one before it."
					}) : null
				]
			})
		})] })
	});
}
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/make",
		label: "Make",
		icon: Scissors
	},
	{
		to: "/stock",
		label: "Stock",
		icon: Layers
	},
	{
		to: "/content",
		label: "Content",
		icon: Camera
	},
	{
		to: "/money",
		label: "Money",
		icon: CircleDollarSign
	}
];
function useActivePath() {
	return useRouterState({ select: (s) => s.location.pathname });
}
function isActive(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function AppShell({ children }) {
	const pathname = useActivePath();
	const saveError = useStudio((s) => s.saveError);
	const retrySave = useStudio((s) => s.retrySave);
	const setHydrated = useStudio((s) => s.setHydrated);
	const hydrated = useStudio((s) => s.hydrated);
	const setMovingOpen = useStudio((s) => s.setMovingOpen);
	(0, import_react.useEffect)(() => {
		useStudio.persist.rehydrate().then(() => setHydrated(true));
	}, [setHydrated]);
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh paper-grain flex items-center justify-center bg-sand",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "mx-auto size-10 text-navy" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-2xl text-navy",
					children: "Breeze & Loop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Opening the studio…"
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-sand text-navy paper-grain",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "hidden md:flex fixed inset-y-0 left-0 w-56 flex-col bg-navy-deep text-ivory z-30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 pt-6 pb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "size-7 text-seaglass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "text-lg text-ivory" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[11px] uppercase tracking-[0.18em] text-ivory/50",
							children: "Owner OS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 px-3 space-y-1",
						children: NAV.map((item) => {
							const active = isActive(pathname, item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex items-center gap-3 rounded-md px-3 h-11 text-sm transition-colors", active ? "bg-seaglass text-ivory" : "text-ivory/75 hover:bg-ivory/8 hover:text-ivory"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-4",
									strokeWidth: 1.6
								}), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-5 py-4 text-[11px] text-ivory/40",
						children: monthLabel()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 bg-sand/90 backdrop-blur-sm border-b border-line md:pl-56",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center justify-between px-4 md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "size-6 text-seaglass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { className: "text-lg" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden md:block text-sm text-muted",
							children: longDate()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "md:hidden text-xs text-muted",
								children: longDate()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/settings",
								"aria-label": "Profile and settings",
								className: "size-11 inline-flex items-center justify-center rounded-md text-navy hover:bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
									className: "size-4",
									strokeWidth: 1.6
								})
							})]
						})
					]
				}), saveError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 md:px-8 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 rounded-lg bg-amber-soft px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-navy",
							children: "Your latest changes could not be saved. Your information is still here on this device. Try again."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: retrySave,
							children: "Retry"
						})]
					})
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "md:pl-56 pb-28 md:pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-paper/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = isActive(pathname, item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex flex-col items-center justify-center gap-0.5 h-14 text-[11px]", active ? "text-seaglass" : "text-muted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-4",
								strokeWidth: active ? 2 : 1.6
							}), item.label]
						}, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setMovingOpen(true),
				className: "fixed z-40 right-4 bottom-20 md:right-8 md:bottom-8 h-12 pl-3 pr-4 rounded-full bg-navy text-ivory shadow-card-hover flex items-center gap-2",
				"aria-label": "Get Me Moving",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hummingbird, { className: "size-6 text-seaglass" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "Get Me Moving"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GetMeMoving, {})
		]
	});
}
var styles_default = "/assets/styles-DZ424EXA.css";
var APP_NAME = "Breeze & Loop Owner OS";
var Route$12 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#1A2744"
			},
			{
				name: "description",
				content: "A private owner operating system for Breeze & Loop — decide what to make, post, buy, or hold."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "top-center",
				toastOptions: { className: "font-sans bg-paper text-navy shadow-card border-0" }
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-CQcnnwvM.mjs");
var Route$11 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./content-8369n8u9.mjs");
var Route$10 = createFileRoute("/content")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./make-B59aDUVh.mjs");
var Route$9 = createFileRoute("/make")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./money-HwaZVz90.mjs");
var Route$8 = createFileRoute("/money")({
	validateSearch: (s) => ({
		buy: typeof s.buy === "string" ? s.buy : void 0,
		amount: typeof s.amount === "string" ? s.amount : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./settings-BXyeG8kb.mjs");
var Route$7 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./stock-BOyGb2P7.mjs");
var Route$6 = createFileRoute("/stock")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./content._contentId-DDwplHh0.mjs");
var Route$5 = createFileRoute("/content/$contentId")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./content.new-CYOx2d5T.mjs");
var Route$4 = createFileRoute("/content/new")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./make._productId-6iWUqzkt.mjs");
var Route$3 = createFileRoute("/make/$productId")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./make.new-Dd23ziEH.mjs");
var Route$2 = createFileRoute("/make/new")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./stock._materialId-BU-x8r9Q.mjs");
var Route$1 = createFileRoute("/stock/$materialId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./stock.new-Dxdv5VZI.mjs");
var Route = createFileRoute("/stock/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var ContentRoute = Route$10.update({
	id: "/content",
	path: "/content",
	getParentRoute: () => Route$12
});
var MakeRoute = Route$9.update({
	id: "/make",
	path: "/make",
	getParentRoute: () => Route$12
});
var MoneyRoute = Route$8.update({
	id: "/money",
	path: "/money",
	getParentRoute: () => Route$12
});
var SettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$12
});
var StockRoute = Route$6.update({
	id: "/stock",
	path: "/stock",
	getParentRoute: () => Route$12
});
var ContentContentIdRoute = Route$5.update({
	id: "/$contentId",
	path: "/$contentId",
	getParentRoute: () => ContentRoute
});
var ContentNewRoute = Route$4.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => ContentRoute
});
var MakeProductIdRoute = Route$3.update({
	id: "/$productId",
	path: "/$productId",
	getParentRoute: () => MakeRoute
});
var MakeNewRoute = Route$2.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => MakeRoute
});
var StockMaterialIdRoute = Route$1.update({
	id: "/$materialId",
	path: "/$materialId",
	getParentRoute: () => StockRoute
});
var StockNewRoute = Route.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => StockRoute
});
var ContentRouteChildren = {
	ContentContentIdRoute,
	ContentNewRoute
};
var ContentRouteWithChildren = ContentRoute._addFileChildren(ContentRouteChildren);
var MakeRouteChildren = {
	MakeProductIdRoute,
	MakeNewRoute
};
var MakeRouteWithChildren = MakeRoute._addFileChildren(MakeRouteChildren);
var StockRouteChildren = {
	StockMaterialIdRoute,
	StockNewRoute
};
var rootRouteChildren = {
	IndexRoute,
	ContentRoute: ContentRouteWithChildren,
	MakeRoute: MakeRouteWithChildren,
	MoneyRoute,
	SettingsRoute,
	StockRoute: StockRoute._addFileChildren(StockRouteChildren)
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { saleTrueCost as C, Button as D, unitCost as E, Hummingbird as O, materialCostForProduct as S, trueCost as T, inventoryValue as _, Route$8 as a, landedCost as b, formatLabel as c, pct as d, prettyDate as f, grossMargin as g, contentProgress as h, Route$5 as i, greeting as l, useStudio as m, Route$1 as n, emptyMove as o, statusLabel as p, Route$3 as r, getMoves as s, router_exports as t, money as u, isLowStock as v, suggestedRetail as w, liveTrueCost as x, labourCost as y };
