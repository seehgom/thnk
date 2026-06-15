import Anthropic from "@anthropic-ai/sdk";
import type { DiagramType } from "@/types/diagram";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a diagram generation assistant. Convert spoken descriptions into valid Mermaid.js diagram syntax.

Rules:
- Return ONLY the Mermaid code — no explanation, no markdown fences, no backticks
- Keep node labels concise (under 7 words each)
- Ensure the output is syntactically valid Mermaid
- Use meaningful, descriptive node IDs (not just A, B, C)`;

function buildUserMessage(transcript: string, type: DiagramType): string {
  if (type === "backwards") {
    return `The user described this goal:
"${transcript}"

Generate a backwards-tracking Mermaid flowchart (flowchart LR).
Start by identifying the FINAL GOAL as the rightmost node.
Then work backwards: ask "what must happen immediately before this?" for each step.
Continue until you reach the very first action someone can take today.
The leftmost node should be the earliest starting action, rightmost is the goal achieved.
Show 4-8 steps total.`;
  }

  if (type === "decision_tree") {
    return `The user described this decision or process:
"${transcript}"

Generate a Mermaid decision tree diagram (flowchart TD).
Use diamond shapes for decisions: DecisionNode{Question?}
Use rectangle shapes for outcomes/actions: Node[Action or Outcome]
Include Yes/No or relevant labels on branches.
Show the key decision points clearly.`;
  }

  return `The user described this process:
"${transcript}"

Generate a Mermaid flowchart diagram (flowchart TD) showing the steps.
Show 4-8 steps in logical order.`;
}

export async function generateMermaidDiagram(
  transcript: string,
  type: DiagramType
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(transcript, type) }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Strip markdown fences if Claude included them anyway
  return text
    .replace(/^```(?:mermaid)?\n?/i, "")
    .replace(/\n?```$/, "")
    .trim();
}
