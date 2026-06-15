import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 50%, #080810 100%)" }}>
      <div className="max-w-2xl text-center space-y-8">
        <div className="space-y-3">
          <div className="text-6xl font-bold tracking-tight text-white">thnk</div>
          <p className="text-xl text-gray-400">Speak your process. See your thinking.</p>
        </div>

        <p className="text-gray-500 leading-relaxed">
          Dictate a goal, a process, or a decision — and watch it become a live diagram.
          Map steps backwards from your goal. Save and revisit your thinking.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-6 py-3 rounded-xl font-medium text-white"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Get started free
          </Link>
          <Link
            href="/sign-in"
            className="px-6 py-3 rounded-xl font-medium text-gray-300 border border-gray-700 hover:border-gray-500 transition-colors"
          >
            Sign in
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8 text-sm text-gray-500">
          <div className="p-4 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">🎙️</div>
            <div className="font-medium text-gray-300">Voice input</div>
            <div>Speak naturally</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">🔀</div>
            <div className="font-medium text-gray-300">Backwards mapping</div>
            <div>Goal → steps</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800">
            <div className="text-2xl mb-2">💾</div>
            <div className="font-medium text-gray-300">Save & revisit</div>
            <div>Full CRUD</div>
          </div>
        </div>
      </div>
    </main>
  );
}
