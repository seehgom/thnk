"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface SRResult {
  readonly isFinal: boolean;
  readonly [index: number]: { readonly transcript: string };
}

interface SREvent extends Event {
  readonly resultIndex: number;
  readonly results: { readonly length: number; readonly [index: number]: SRResult };
}

interface SRErrorEvent extends Event {
  readonly error: string;
}

interface SR extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SREvent) => void) | null;
  onerror: ((event: SRErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SR;
    webkitSpeechRecognition?: new () => SR;
  }
}

export interface SpeechState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  isSupported: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechRecognition(onFinalTranscript?: (t: string) => void): SpeechState {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SR | null>(null);
  const finalRef = useRef("");

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) return;
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRClass) return;
    const recognition = new SRClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SREvent) => {
      let interim = "";
      let final = finalRef.current;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        } else {
          interim += result[0].transcript;
        }
      }
      finalRef.current = final;
      setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: SRErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
      if (finalRef.current.trim() && onFinalTranscript) {
        onFinalTranscript(finalRef.current.trim());
      }
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [isSupported]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setIsListening(true);
    recognitionRef.current.start();
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    recognitionRef.current?.abort();
    finalRef.current = "";
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setError(null);
  }, []);

  return { isListening, transcript, interimTranscript, isSupported, error, start, stop, reset };
}
