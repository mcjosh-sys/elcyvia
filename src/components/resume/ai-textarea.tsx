"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { cn } from "cn";

interface AITextareaProps {
  value: string;
  onChange: (value: string) => void;
  fieldType: string;
  context?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

export function AITextarea({
  value,
  onChange,
  fieldType,
  context,
  placeholder,
  rows = 4,
  className,
  id,
}: AITextareaProps) {
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchCompletion = useCallback(
    async (text: string) => {
      if (!text.trim() || !enabled) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setIsLoading(true);

      try {
        const res = await fetch("/api/ai/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentText: text,
            fieldType,
            context,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) return;
        const data = await res.json();
        if (data.completion) {
          setCompletion(data.completion);
        }
      } catch {
        // AbortError or network error — ignore
      } finally {
        setIsLoading(false);
      }
    },
    [fieldType, context, enabled]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      abortRef.current?.abort();
    };
  }, []);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value;
    onChange(newValue);
    setCompletion("");

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (enabled && newValue.trim()) {
      debounceTimer.current = setTimeout(() => {
        fetchCompletion(newValue);
      }, 2000);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab" && completion) {
      e.preventDefault();
      onChange(value + completion);
      setCompletion("");
    } else if (e.key === "Escape" && completion) {
      setCompletion("");
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Textarea
          id={id}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          className={cn("resize-y pr-8", className)}
        />

        {/* Ghost text overlay */}
        {completion && (
          <div
            className="absolute inset-0 pointer-events-none p-3 text-sm whitespace-pre-wrap overflow-hidden"
            aria-hidden="true"
          >
            <span className="invisible">{value}</span>
            <span className="text-muted-foreground/50">{completion}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        {isLoading && (
          <Sparkles className="size-3 text-primary animate-pulse" />
        )}
        <button
          type="button"
          onClick={() => {
            setEnabled(!enabled);
            if (!enabled) setCompletion("");
          }}
          className={cn(
            "size-5 rounded flex items-center justify-center transition-colors",
            enabled
              ? "text-primary hover:bg-primary/10"
              : "text-muted-foreground/40 hover:bg-muted"
          )}
          title={enabled ? "Disable AI suggestions" : "Enable AI suggestions"}
        >
          <Sparkles className="size-3" />
        </button>
      </div>

      {/* Hint */}
      {completion && (
        <p className="text-[10px] text-muted-foreground mt-1">
          Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Tab</kbd> to
          accept ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> to dismiss
        </p>
      )}
    </div>
  );
}
