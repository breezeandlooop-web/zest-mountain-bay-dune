import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as useStudio } from "./router-D-9UDxAx.mjs";
import { n as blankMaterial } from "./factories-BppLBeFw.mjs";
import { t as MaterialForm } from "./material-form-CmEa-wgT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stock.new-Dxdv5VZI.js
var import_jsx_runtime = require_jsx_runtime();
function NewMaterial() {
	const upsert = useStudio((s) => s.upsertMaterial);
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialForm, {
		material: blankMaterial(),
		isNew: true,
		onSave: (m) => {
			upsert(m);
			navigate({
				to: "/stock/$materialId",
				params: { materialId: m.id }
			});
		}
	});
}
//#endregion
export { NewMaterial as component };
