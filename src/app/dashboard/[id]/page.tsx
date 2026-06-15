import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { DiagramEditor } from "@/components/DiagramEditor";
import { DeleteButton } from "@/components/DeleteButton";
import { notFound } from "next/navigation";
import type { Diagram } from "@/types/diagram";

export default async function DiagramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("diagrams")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error || !data) notFound();
  const diagram = data as Diagram;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{diagram.title}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Last updated{" "}
            {new Date(diagram.updated_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <DeleteButton diagramId={diagram.id} />
      </div>
      <DiagramEditor initial={diagram} />
    </div>
  );
}
