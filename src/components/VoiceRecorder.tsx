"use client";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface VoiceRecorderProps {
  onTranscriptReady: (transcript: string) => void;
}

export function VoiceRecorder({ onTranscriptReady }: VoiceRecorderProps) {
  const { isListening, transcript, interimTranscript, isSupported, error, start, stop, reset } =
    useSpeechRecognition(onTranscriptReady);

  if (!isSupported) {
    return (
      <div className="p-4 rounded-xl border border-yellow-800 bg-yellow-900/20 text-yellow-300 text-sm">
        Voice input requires Chrome or Edge. Use the text box below instead.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={isListening ? stop : start}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
            isListening
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "text-white"
          }`}
          style={!isListening ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}
        >
          {isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Stop recording
            </>
          ) : (
            <>
              <span>🎙️</span>
              Start speaking
            </>
          )}
        </button>

        {(transcript || interimTranscript) && (
          <button onClick={reset} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Clear
          </button>
        )}
      </div>

      {(transcript || interimTranscript) && (
        <div className="p-3 rounded-lg bg-gray-900 border border-gray-700 text-sm min-h-[60px]">
          <span className="text-gray-200">{transcript}</span>
          <span className="text-gray-500 italic">{interimTranscript}</span>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm">Error: {error}. Try clicking the mic button again.</p>
      )}
    </div>
  );
}
