"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidRendererProps {
  code: string;
}

export function MermaidRenderer({ code }: MermaidRendererProps) {
  const id = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code?.trim() || !containerRef.current) return;
    let cancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#6366f1",
            primaryTextColor: "#e8e8f0",
            primaryBorderColor: "#4f46e5",
            lineColor: "#6b7280",
            secondaryColor: "#1f1f2e",
            tertiaryColor: "#16162a",
            background: "#0a0a0f",
            mainBkg: "#1a1a2e",
            nodeBorder: "#4f46e5",
            clusterBkg: "#1f1f2e",
            titleColor: "#e8e8f0",
            edgeLabelBackground: "#1a1a2e",
          },
        });

        const { svg } = await mermaid.render(`m${id}`, code);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Invalid diagram syntax");
      }
    };

    render();
    return () => { cancelled = true; };
  }, [code, id]);

  if (!code?.trim()) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600 text-sm">
        Your diagram will appear here
      </div>
    );
  }

  return (
    <div className="relative">
      {error ? (
        <div className="p-4 rounded-xl border border-red-800 bg-red-900/20 text-red-300 text-sm">
          <p className="font-medium mb-1">Diagram syntax error</p>
          <p className="text-xs text-red-400 font-mono">{error}</p>
        </div>
      ) : (
        <div ref={containerRef} className="mermaid-container flex justify-center p-4 overflow-auto" />
      )}
    </div>
  );
}
