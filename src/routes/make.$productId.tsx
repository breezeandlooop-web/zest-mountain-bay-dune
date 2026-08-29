import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/product-form";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/make/$productId")({ component: ProductPage });

function ProductPage() {
  const { productId } = Route.useParams();
  const product = useStudio((s) => s.products.find((p) => p.id === productId));
  const upsert = useStudio((s) => s.upsertProduct);
  const navigate = useNavigate();

  if (!product) {
    return (
      <EmptyState
        title="This piece is not in the studio."
        body="It may have been removed. Return to Make to see what is on the hook."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/make" })}>
            Back to Make
          </Button>
        }
      />
    );
  }

  return (
    <ProductForm
      product={product}
      onSave={(p) => {
        upsert(p);
      }}
    />
  );
}
