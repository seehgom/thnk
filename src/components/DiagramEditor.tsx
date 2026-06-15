"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { VoiceRecorder } from "./VoiceRecorder";
import { MermaidRenderer } from "./MermaidRenderer";
import type { Diagram, DiagramType } from "@/types/diagram";

interface DiagramEditorProps {
  initial?: Diagram;
}

const TYPE_LABELS: Record<DiagramType, string> = {
  flowchart: "Flowchart",
  decision_tree: "Decision Tree",
  backwards: "Backwards Mapping",
};

const TYPE_DESCRIPTIONS: Record<DiagramType, string> = {
  flowchart: "Step-by-step process",
  decision_tree: "Branching decisions",
  backwards: "Goal → starting point",
};

export function DiagramEditor({ initial }: DiagramEditorProps) {
  const router = useRouter();
  const [diagramType, setDiagramType] = useState<DiagramType>(initial?.diagram_type || "backwards");
  const [mermaidCode, setMermaidCode] = useState(initial?.mermaid_code || "");
  const [transcript, setTranscript] = useState(initial?.voice_transcript || "");
  const [title, setTitle] = useState(initial?.title || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [showCode, setShowCode] = useState(false);

  const generateDiagram = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setTranscript(text);
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, diagramType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setMermaidCode(data.mermaidCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }, [diagramType]);

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      generateDiagram(manualInput.trim());
      setManualInput("");
    }
  };

  const saveDiagram = async () => {
    if (!mermaidCode) return;
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const body = {
        title: title || "Untitled Diagram",
        mermaid_code: mermaidCode,
        diagram_type: diagramType,
        voice_transcript: transcript || null,
        description: transcript || null,
      };

      const isUpdate = !!initial?.id;
      const url = isUpdate ? `/api/diagrams/${initial.id}` : "/api/diagrams";
      const method = isUpdate ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setSaveMessage("Saved!");
      if (!isUpdate) router.push(`/dashboard/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Diagram type selector */}
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(TYPE_LABELS) as DiagramType[]).map((type) => (
          <button
            key={type}
            onClick={() => setDiagramType(type)}
            className={`p-3 rounded-xl border text-left transition-all ${
              diagramType === type
                ? "border-indigo-500 bg-indigo-900/30 text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <div className="font-medium text-sm">{TYPE_LABELS[type]}</div>
            <div className="text-xs text-gray-500 mt-0.5">{TYPE_DESCRIPTIONS[type]}</div>
          </button>
        ))}
      </div>

      {/* Voice recorder */}
      <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/30 space-y-4">
        <h3 className="text-sm font-medium text-gray-300">
          {diagramType === "backwards"
            ? "🎙️ Describe your goal — we'll map the steps backwards"
            : "🎙️ Describe your process or decision"}
        </h3>
        <VoiceRecorder onTranscriptReady={generateDiagram} />

        <div className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
            placeholder="Or type your description here…"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleManualSubmit}
            disabled={!manualInput.trim() || isGenerating}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40 transition-opacity"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Generate
          </button>
        </div>
      </div>

      {/* Status / error */}
      {isGenerating && (
        <div className="flex items-center gap-2 text-sm text-indigo-400">
          <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          Generating diagram…
        </div>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Diagram output */}
      {mermaidCode && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {TYPE_LABELS[diagramType]}
            </span>
            <button
              onClick={() => setShowCode(!showCode)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showCode ? "Show diagram" : "Show code"}
            </button>
          </div>

          {showCode ? (
            <textarea
              value={mermaidCode}
              onChange={(e) => setMermaidCode(e.target.value)}
              className="w-full p-4 bg-transparent text-xs font-mono text-gray-300 resize-none focus:outline-none"
              rows={12}
            />
          ) : (
            <MermaidRenderer code={mermaidCode} />
          )}
        </div>
      )}

      {/* Save controls */}
      {mermaidCode && (
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Diagram title…"
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={saveDiagram}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition-opacity"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            {isSaving ? "Saving…" : initial ? "Update" : "Save"}
          </button>
          {saveMessage && <span className="text-sm text-green-400">{saveMessage}</span>}
        </div>
      )}
    </div>
  );
}
