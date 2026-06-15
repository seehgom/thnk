import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import type { Diagram } from "@/types/diagram";

const TYPE_LABELS = {
  flowchart: "Flowchart",
  decision_tree: "Decision Tree",
  backwards: "Backwards",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const supabase = createSupabaseClient();
  const { data: diagrams } = await supabase
    .from("diagrams")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Diagrams</h1>
        <Link
          href="/dashboard/new"
          className="px-4 py-2 rounded-xl font-medium text-white text-sm"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        >
          + New diagram
        </Link>
      </div>

      {!diagrams?.length ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="text-5xl">🎙️</div>
          <h2 className="text-xl font-medium text-white">No diagrams yet</h2>
          <p className="text-gray-500 max-w-sm">
            Speak a goal or describe a process and watch it become a visual diagram.
          </p>
          <Link
            href="/dashboard/new"
            className="px-6 py-2.5 rounded-xl font-medium text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Create your first diagram
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(diagrams as Diagram[]).map((diagram) => (
            <Link
              key={diagram.id}
              href={`/dashboard/${diagram.id}`}
              className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-indigo-700 transition-colors space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                  {diagram.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-900/40 text-indigo-300 border border-indigo-800 shrink-0 ml-2">
                  {TYPE_LABELS[diagram.diagram_type] || diagram.diagram_type}
                </span>
              </div>

              {diagram.voice_transcript && (
                <p className="text-xs text-gray-500 line-clamp-2">{diagram.voice_transcript}</p>
              )}

              <p className="text-xs text-gray-600">
                {new Date(diagram.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
