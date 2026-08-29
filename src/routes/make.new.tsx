import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/product-form";
import { blankProduct } from "@/lib/factories";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/make/new")({ component: NewProduct });

function NewProduct() {
  const upsert = useStudio((s) => s.upsertProduct);
  const labour = useStudio((s) => s.settings.labourRateDefault);
  const navigate = useNavigate();
  const product = { ...blankProduct(), labourRate: labour };

  return (
    <ProductForm
      product={product}
      isNew
      onSave={(p) => {
        upsert(p);
        void navigate({ to: "/make/$productId", params: { productId: p.id } });
      }}
    />
  );
}
