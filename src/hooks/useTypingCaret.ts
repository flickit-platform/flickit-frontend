// useTypingCaret.ts
import { useState, useRef, useEffect, useCallback } from "react";

export function useTypingCaret(idleMs = 500) {
  const [isTyping, set] = useState(false);
  const t = useRef<number | null>(null);

  const kick = useCallback(() => {
    set(true);
    if (t.current !== null) window.clearTimeout(t.current);
    t.current = globalThis.setTimeout(() => set(false), idleMs);
  }, [idleMs]);

  useEffect(() => {
    return () => {
      if (t.current !== null) {
        window.clearTimeout(t.current);
      }
    };
  }, []);

  return {
    isTyping,
    inputBind: {
      onKeyDown: kick,
      onInput: kick,
      onChange: kick,
      onCompositionStart: () => set(true),
      onCompositionEnd: kick,
      onBlur: () => set(false),
    },
  };
}
