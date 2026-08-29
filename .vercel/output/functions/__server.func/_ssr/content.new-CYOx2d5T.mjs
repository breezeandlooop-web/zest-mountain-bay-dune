import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { m as useStudio } from "./router-D-9UDxAx.mjs";
import { t as blankContent } from "./factories-BppLBeFw.mjs";
import { t as ContentForm } from "./content-form-CrUpBroA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content.new-CYOx2d5T.js
var import_jsx_runtime = require_jsx_runtime();
function NewContent() {
	const upsert = useStudio((s) => s.upsertContent);
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentForm, {
		item: blankContent(),
		isNew: true,
		onSave: (c) => {
			upsert(c);
			navigate({
				to: "/content/$contentId",
				params: { contentId: c.id }
			});
		}
	});
}
//#endregion
export { NewContent as component };
