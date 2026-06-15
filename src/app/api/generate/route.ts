import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { generateMermaidDiagram } from "@/lib/claude";
import type { DiagramType } from "@/types/diagram";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { transcript, diagramType } = await req.json() as { transcript: string; diagramType: DiagramType };

  if (!transcript?.trim()) {
    return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
  }

  const mermaidCode = await generateMermaidDiagram(transcript.trim(), diagramType || "flowchart");
  return NextResponse.json({ mermaidCode });
}
