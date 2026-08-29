import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ContentForm } from "@/components/content-form";
import { blankContent } from "@/lib/factories";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/content/new")({ component: NewContent });

function NewContent() {
  const upsert = useStudio((s) => s.upsertContent);
  const navigate = useNavigate();
  return (
    <ContentForm
      item={blankContent()}
      isNew
      onSave={(c) => {
        upsert(c);
        void navigate({ to: "/content/$contentId", params: { contentId: c.id } });
      }}
    />
  );
}
