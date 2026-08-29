import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BEOGomfO.js
var EMPTY_CHECKLIST = {
	productPhoto: false,
	detailShot: false,
	lifestyleShot: false,
	makingVideo: false,
	productDescription: false,
	listingReady: false,
	story: false,
	reel: false
};
var PRODUCT_STATUSES = [
	"idea",
	"prototype",
	"in-production",
	"finished",
	"selling",
	"retired",
	"archived"
];
var CONTENT_PILLARS = [
	"Coastal Caribbean life",
	"Making",
	"Nature",
	"Hummingbird / brand world",
	"Island living",
	"Products",
	"Founder story",
	"Fibre and yarn education"
];
var CONTENT_FORMATS = [
	"reel",
	"carousel",
	"photo",
	"story",
	"product-listing",
	"email"
];
var CHECKLIST_LABELS = [
	{
		key: "productPhoto",
		label: "Product photo"
	},
	{
		key: "detailShot",
		label: "Detail shot"
	},
	{
		key: "lifestyleShot",
		label: "Lifestyle shot"
	},
	{
		key: "makingVideo",
		label: "Making video"
	},
	{
		key: "productDescription",
		label: "Product description"
	},
	{
		key: "listingReady",
		label: "Listing ready"
	},
	{
		key: "story",
		label: "Story"
	},
	{
		key: "reel",
		label: "Reel"
	}
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}
//#endregion
export { PRODUCT_STATUSES as a, EMPTY_CHECKLIST as i, CONTENT_FORMATS as n, cn as o, CONTENT_PILLARS as r, uid as s, CHECKLIST_LABELS as t };
