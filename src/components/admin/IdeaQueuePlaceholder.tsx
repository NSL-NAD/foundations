import { Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function IdeaQueuePlaceholder() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Lightbulb className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-heading text-lg font-semibold">Idea Queue</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Weekly content ideas generated from Sonar research, GSC data, and
          trending topics will appear here.
        </p>
        <Badge variant="secondary" className="mt-4">
          Coming soon
        </Badge>
      </CardContent>
    </Card>
  );
}
