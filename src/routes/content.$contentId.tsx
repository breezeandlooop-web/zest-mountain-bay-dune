import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ContentForm } from "@/components/content-form";
import { EmptyState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useStudio } from "@/lib/store";

export const Route = createFileRoute("/content/$contentId")({ component: ContentDetail });

function ContentDetail() {
  const { contentId } = Route.useParams();
  const item = useStudio((s) => s.content.find((c) => c.id === contentId));
  const upsert = useStudio((s) => s.upsertContent);
  const navigate = useNavigate();
  if (!item) {
    return (
      <EmptyState
        title="This idea is not in the studio."
        body="Return to Content to see the pipeline."
        action={
          <Button variant="outline" onClick={() => navigate({ to: "/content" })}>
            Back to Content
          </Button>
        }
      />
    );
  }
  return <ContentForm item={item} onSave={upsert} />;
}
