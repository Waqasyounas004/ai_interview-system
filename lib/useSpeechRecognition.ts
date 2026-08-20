"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Minimal shape of the Web Speech API that TypeScript's default DOM lib
// doesn't declare (it's still non-standard / vendor-prefixed on window).
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionErrorEventLike {
  error: string;
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

export type SpeechRecognitionErrorKind =
  | "not-allowed"
  | "no-speech"
  | "network"
  | "other"
  | null;

interface UseSpeechRecognitionOptions {
  /** Called once per finalized chunk of speech (not on interim/partial words). */
  onFinalChunk: (text: string) => void;
  lang?: string;
}

interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  interimText: string;
  error: SpeechRecognitionErrorKind;
  start: () => void;
  stop: () => void;
}

/**
 * Thin wrapper around the browser's native Web Speech API (SpeechRecognition /
 * webkitSpeechRecognition). Client-side only, no API key or backend call
 * involved — the browser itself performs the transcription.
 *
 * Runs in continuous + interimResults mode and auto-restarts if the browser
 * ends the session on its own mid-listen (a known Chrome quirk), so the mic
 * stays "on" until the caller explicitly calls stop().
 */
export function useSpeechRecognition({
  onFinalChunk,
  lang = "en-US",
}: UseSpeechRecognitionOptions): UseSpeechRecognitionResult {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [error, setError] = useState<SpeechRecognitionErrorKind>(null);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const wantsListeningRef = useRef(false);
  const onFinalChunkRef = useRef(onFinalChunk);

  useEffect(() => {
    onFinalChunkRef.current = onFinalChunk;
  }, [onFinalChunk]);

  const isSupported =
    typeof window !== "undefined" &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition!;
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || "";
        if (result.isFinal) {
          const trimmed = transcript.trim();
          if (trimmed) onFinalChunkRef.current(trimmed);
        } else {
          interim += transcript;
        }
      }
      setInterimText(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("not-allowed");
        wantsListeningRef.current = false;
        setIsListening(false);
      } else if (event.error === "no-speech") {
        // Not fatal — recognition.onend will fire next and, since the user
        // still wants to listen, it gets restarted automatically below.
        setError("no-speech");
      } else if (event.error === "network") {
        setError("network");
      } else {
        setError("other");
      }
    };

    recognition.onend = () => {
      setInterimText("");
      // Chrome sometimes ends a continuous session on its own (e.g. after a
      // pause). If the user hasn't explicitly stopped it, pick back up.
      if (wantsListeningRef.current) {
        try {
          recognition.start();
        } catch {
          // start() throws if called while already starting/running; safe to ignore.
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      wantsListeningRef.current = false;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [isSupported, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    wantsListeningRef.current = true;
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch {
      // Already running — ignore.
    }
  }, []);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;
    wantsListeningRef.current = false;
    setIsListening(false);
    setInterimText("");
    recognitionRef.current.stop();
  }, []);

  return { isSupported, isListening, interimText, error, start, stop };
}
