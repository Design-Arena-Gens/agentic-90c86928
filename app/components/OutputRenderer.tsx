"use client";

import type { CommandOutput } from "@/lib/types";

export function OutputRenderer({ output }: { output: CommandOutput }) {
  switch (output.type) {
    case "text":
      return (
        <section className="space-y-2">
          {output.title ? <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3> : null}
          <pre className="whitespace-pre-wrap leading-relaxed text-sm text-terminal-foreground/90">{output.body}</pre>
        </section>
      );
    case "list":
      return (
        <section className="space-y-2">
          {output.title ? <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3> : null}
          <ul className="space-y-1 text-sm text-terminal-foreground/90">
            {output.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-terminal-secondary">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "tasks":
      return (
        <section className="space-y-3">
          {output.title ? <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3> : null}
          <div className="grid gap-2">
            {output.tasks.map((task) => (
              <article key={task.id} className="rounded border border-terminal-secondary/30 bg-white/5 p-3">
                <header className="flex items-center justify-between text-xs uppercase tracking-widest text-terminal-secondary">
                  <span>{task.id}</span>
                  <span>{task.status}</span>
                </header>
                <h4 className="mt-2 text-sm font-semibold text-terminal-foreground">{task.title}</h4>
                <p className="mt-1 text-xs text-terminal-foreground/70">{task.summary}</p>
                <footer className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase text-terminal-secondary">
                  <span>owner: {task.owner}</span>
                  <span>priority: {task.priority}</span>
                  <span>
                    tags: {task.tags.join(", ")}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </section>
      );
    case "workflow":
      return (
        <section className="space-y-3">
          <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3>
          <ol className="space-y-3 text-sm">
            {output.steps.map((step) => (
              <li
                key={step.id}
                className="rounded border border-terminal-secondary/40 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-terminal-secondary">
                  <span>{step.label}</span>
                  <span>{step.status}</span>
                </div>
                <p className="mt-2 text-terminal-foreground/80">{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      );
    case "table":
      return (
        <section className="space-y-2 overflow-x-auto">
          {output.title ? <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3> : null}
          <table className="min-w-full divide-y divide-terminal-secondary/40 text-sm">
            <thead className="uppercase text-terminal-secondary">
              <tr>
                {output.columns.map((column) => (
                  <th key={column} className="px-3 py-2 text-left font-medium tracking-widest">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-terminal-secondary/20 text-terminal-foreground/90">
              {output.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-3 py-2 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    case "json":
      return (
        <section className="space-y-2">
          {output.title ? <h3 className="text-terminal-accent text-sm uppercase tracking-widest">{output.title}</h3> : null}
          <pre className="overflow-x-auto rounded bg-black/40 p-3 text-xs text-terminal-foreground/80">
            {JSON.stringify(output.data, null, 2)}
          </pre>
        </section>
      );
    case "error":
      return (
        <section className="space-y-2">
          {output.title ? (
            <h3 className="text-red-400 text-sm uppercase tracking-widest">{output.title}</h3>
          ) : null}
          <p className="text-sm text-red-300">{output.body}</p>
        </section>
      );
    default:
      return null;
  }
}
