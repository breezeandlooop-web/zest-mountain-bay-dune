import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Button, i as Route$5, m as useStudio } from "./router-D-9UDxAx.mjs";
import { n as EmptyState } from "./shared-B8h2AmBE.mjs";
import { t as ContentForm } from "./content-form-CrUpBroA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content._contentId-DDwplHh0.js
var import_jsx_runtime = require_jsx_runtime();
function ContentDetail() {
	const { contentId } = Route$5.useParams();
	const item = useStudio((s) => s.content.find((c) => c.id === contentId));
	const upsert = useStudio((s) => s.upsertContent);
	const navigate = useNavigate();
	if (!item) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "This idea is not in the studio.",
		body: "Return to Content to see the pipeline.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => navigate({ to: "/content" }),
			children: "Back to Content"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentForm, {
		item,
		onSave: upsert
	});
}
//#endregion
export { ContentDetail as component };
