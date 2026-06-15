export type DiagramType = "flowchart" | "decision_tree" | "backwards";

export interface Diagram {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  mermaid_code: string;
  diagram_type: DiagramType;
  voice_transcript: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDiagramInput {
  title: string;
  description?: string;
  mermaid_code: string;
  diagram_type: DiagramType;
  voice_transcript?: string;
}

export interface UpdateDiagramInput {
  title?: string;
  description?: string;
  mermaid_code?: string;
  diagram_type?: DiagramType;
  voice_transcript?: string;
}
