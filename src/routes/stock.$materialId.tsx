import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MaterialForm } from "@/components/material-form";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/stock/$materialId")({ component: MaterialPage });

function MaterialPage() {
  const { materialId } = Route.useParams();
  const material = useStudio((s) => s.materials.find((m) => m.id === materialId));
  const upsert = useStudio((s) => s.upsertMaterial);
  const navigate = useNavigate();
  if (!material) {
    return (
      <EmptyState
        title="This material is not in the library."
        body="Return to Stock to see what is on hand."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/stock" })}>
            Back to Stock
          </Button>
        }
      />
    );
  }
  return <MaterialForm material={material} onSave={upsert} />;
}
