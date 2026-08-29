import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, m as useStudio, n as Route$1 } from "./router-D-9UDxAx.mjs";
import { n as EmptyState } from "./shared-B8h2AmBE.mjs";
import { t as MaterialForm } from "./material-form-CmEa-wgT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock._materialId-BU-x8r9Q.js
var import_jsx_runtime = require_jsx_runtime();
function MaterialPage() {
	const { materialId } = Route$1.useParams();
	const material = useStudio((s) => s.materials.find((m) => m.id === materialId));
	const upsert = useStudio((s) => s.upsertMaterial);
	const navigate = useNavigate();
	if (!material) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "This material is not in the library.",
		body: "Return to Stock to see what is on hand.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => navigate({ to: "/stock" }),
			children: "Back to Stock"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialForm, {
		material,
		onSave: upsert
	});
}
//#endregion
export { MaterialPage as component };
