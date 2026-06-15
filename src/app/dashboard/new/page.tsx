import { DiagramEditor } from "@/components/DiagramEditor";

export default function NewDiagramPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">New Diagram</h1>
        <p className="text-gray-500 text-sm mt-1">
          Speak or type your process, goal, or decision. AI will generate a diagram.
        </p>
      </div>
      <DiagramEditor />
    </div>
  );
}
