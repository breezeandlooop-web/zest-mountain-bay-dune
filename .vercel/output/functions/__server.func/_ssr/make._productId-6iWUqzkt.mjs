import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, m as useStudio, r as Route$3 } from "./router-D-9UDxAx.mjs";
import { n as EmptyState } from "./shared-B8h2AmBE.mjs";
import { t as ProductForm } from "./product-form-mz3lcT0I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/make._productId-6iWUqzkt.js
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const { productId } = Route$3.useParams();
	const product = useStudio((s) => s.products.find((p) => p.id === productId));
	const upsert = useStudio((s) => s.upsertProduct);
	const navigate = useNavigate();
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "This piece is not in the studio.",
		body: "It may have been removed. Return to Make to see what is on the hook.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => navigate({ to: "/make" }),
			children: "Back to Make"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		product,
		onSave: (p) => {
			upsert(p);
		}
	});
}
//#endregion
export { ProductPage as component };
