import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MaterialForm } from "@/components/material-form";
import { blankMaterial } from "@/lib/factories";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/stock/new")({ component: NewMaterial });

function NewMaterial() {
  const upsert = useStudio((s) => s.upsertMaterial);
  const navigate = useNavigate();
  return (
    <MaterialForm
      material={blankMaterial()}
      isNew
      onSave={(m) => {
        upsert(m);
        void navigate({ to: "/stock/$materialId", params: { materialId: m.id } });
      }}
    />
  );
}
