"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ diagramId }: { diagramId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await fetch(`/api/diagrams/${diagramId}`, { method: "DELETE" });
    router.push("/dashboard");
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Delete this diagram?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-sm px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-sm text-gray-600 hover:text-red-400 transition-colors"
    >
      Delete
    </button>
  );
}
