import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as useStudio } from "./router-D-9UDxAx.mjs";
import { r as blankProduct } from "./factories-BppLBeFw.mjs";
import { t as ProductForm } from "./product-form-mz3lcT0I.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/make.new-Dd23ziEH.js
var import_jsx_runtime = require_jsx_runtime();
function NewProduct() {
	const upsert = useStudio((s) => s.upsertProduct);
	const labour = useStudio((s) => s.settings.labourRateDefault);
	const navigate = useNavigate();
	const product = {
		...blankProduct(),
		labourRate: labour
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
		product,
		isNew: true,
		onSave: (p) => {
			upsert(p);
			navigate({
				to: "/make/$productId",
				params: { productId: p.id }
			});
		}
	});
}
//#endregion
export { NewProduct as component };
