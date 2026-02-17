"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Loader2, Check } from "lucide-react";

interface NewStudent {
  id: string;
  email: string;
  product_type: string;
  created_at: string;
}

interface NewStudentsCardProps {
  students: NewStudent[];
}

export function NewStudentsCard({ students }: NewStudentsCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleViewedAll() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/viewed-students", {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          New Students
        </CardTitle>
        <UserPlus className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4" />
            All caught up — no new students
          </div>
        ) : (
          <>
            <div className="font-heading text-3xl font-bold">
              {students.length}
            </div>
            <div className="mt-3 max-h-[200px] space-y-2 overflow-y-auto">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between rounded-md border p-2.5 text-sm"
                >
                  <div>
                    <span className="font-medium">{student.email}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(student.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {student.product_type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewedAll}
              disabled={loading}
              className="mt-3 w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Viewed All
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
