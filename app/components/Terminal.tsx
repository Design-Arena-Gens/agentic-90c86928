"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Play, TerminalSquare } from "lucide-react";
import type { CommandOutput } from "@/lib/types";
import { runCommand } from "@/app/actions/executeCommand";
import { OutputRenderer } from "./OutputRenderer";

const welcomeBanner = [`agentic cli v0.1.0`, `Type 'help' to explore capabilities.`];

type HistoryEntry = {
  id: string;
  command: string;
  outputs: CommandOutput[];
  timestamp: Date;
};

const presetCommands = [
  "help",
  "tasks --status in-progress",
  "task A-143",
  "plan tighten activation funnel",
  "compose pulse; workflow"
];

export function Terminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const notebookScaffold = useMemo(() => {
    return presetCommands.map((command, index) => (
      <button
        key={command}
        type="button"
        className="inline-flex items-center gap-2 rounded border border-terminal-secondary/40 bg-white/5 px-3 py-2 text-xs uppercase tracking-widest text-terminal-secondary transition hover:border-terminal-accent/60 hover:text-terminal-accent"
        onClick={() => {
          setInput(command);
          inputRef.current?.focus();
        }}
      >
        <Play className="h-3 w-3" />
        <span>{index + 1}</span>
        <span>{command}</span>
      </button>
    ));
  }, []);

  const execute = useCallback(
    (command: string) => {
      if (!command.trim()) {
        return;
      }

      startTransition(async () => {
        try {
          const outputs = await runCommand(command);
          setHistory((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              command,
              outputs,
              timestamp: new Date()
            }
          ]);
          setInput("");
          setHistoryIndex(null);
        } catch (error) {
          setHistory((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              command,
              outputs: [
                {
                  type: "error",
                  title: "Execution failed",
                  body: error instanceof Error ? error.message : String(error)
                }
              ],
              timestamp: new Date()
            }
          ]);
        }
      });
    },
    [startTransition]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        execute(input.trim());
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setHistoryIndex((index) => {
          const newIndex = index === null ? history.length - 1 : Math.max(index - 1, 0);
          const entry = history[newIndex];
          if (entry) {
            setInput(entry.command);
          }
          return newIndex;
        });
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setHistoryIndex((index) => {
          if (index === null) {
            setInput("");
            return null;
          }
          const newIndex = Math.min(index + 1, history.length - 1);
          if (newIndex === history.length - 1) {
            setInput(history[newIndex]?.command ?? "");
            return newIndex;
          }
          if (newIndex >= history.length) {
            setInput("");
            return null;
          }
          setInput(history[newIndex]?.command ?? "");
          return newIndex;
        });
      }
    },
    [execute, history, input]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-10">
      <header className="space-y-3 rounded border border-terminal-secondary/30 bg-black/30 p-6 shadow-xl">
        <div className="flex items-center gap-3 text-terminal-secondary">
          <TerminalSquare className="h-5 w-5 text-terminal-accent" />
          <div className="text-sm uppercase tracking-[0.4em] text-terminal-foreground/80">Agentic CLI</div>
        </div>
        <p className="text-sm text-terminal-foreground/70">
          Operate an agent-first workflow from a web-native command surface. All commands are deterministic and
          stateless in this sandboxed snapshot.
        </p>
        <div className="flex flex-wrap gap-2 pt-3">{notebookScaffold}</div>
      </header>

      <main className="flex-1 space-y-6 rounded border border-terminal-secondary/30 bg-black/40 p-6">
        <section>
          <div className="space-y-1 text-xs text-terminal-secondary">
            {welcomeBanner.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </section>
        <section className="space-y-8">
          {history.map((entry) => (
            <article key={entry.id} className="space-y-4">
              <header className="flex items-center gap-3">
                <span className="text-terminal-accent">$</span>
                <span className="text-terminal-foreground/90">{entry.command}</span>
                <span className="text-xs uppercase tracking-widest text-terminal-secondary">
                  {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </header>
              <div className="space-y-5 border-l border-terminal-secondary/40 pl-6">
                {entry.outputs.map((output, index) => (
                  <OutputRenderer key={index} output={output} />
                ))}
              </div>
            </article>
          ))}
        </section>
      </main>

      <form
        className="sticky bottom-0 rounded border border-terminal-secondary/40 bg-black/50 px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          execute(input.trim());
        }}
      >
        <label className="flex items-center gap-3 text-terminal-foreground/80">
          <span className="text-terminal-accent">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (try 'help')"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-terminal-secondary"
            disabled={isPending}
            aria-label="Command bar"
          />
        </label>
      </form>
    </div>
  );
}
