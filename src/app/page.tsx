"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Status = {
  openclawVersion: string;
  nodeVersion: string;
  timestamp: string;
  agentName: string;
};

type Todo = { id: string; text: string; done: boolean };

const TODO_KEY = "bernard_dashboard_todos";

export default function Home() {
  const [status, setStatus] = useState<Status | null>(null);
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => null);

    const raw = localStorage.getItem(TODO_KEY);
    if (raw) setTodos(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  }, [todos]);

  const completeCount = useMemo(() => todos.filter((t) => t.done).length, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: newTodo.trim(), done: false },
      ...prev,
    ]);
    setNewTodo("");
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Bernard Control Dashboard</h1>
            <p className="text-zinc-400">Dark mode ops panel for OpenClaw runtime + task tracking.</p>
          </div>
          <Badge className="w-fit bg-violet-600/20 text-violet-300 border-violet-500/40">
            Live Agent View
          </Badge>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardDescription>Agent</CardDescription>
              <CardTitle>{status?.agentName ?? "Bernard"}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardDescription>OpenClaw Version</CardDescription>
              <CardTitle>{status?.openclawVersion ?? "loading..."}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardDescription>Node Runtime</CardDescription>
              <CardTitle>{status?.nodeVersion ?? "loading..."}</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardTitle>Bernard TODOs</CardTitle>
              <CardDescription>
                {completeCount}/{todos.length} complete
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add next task..."
                  className="bg-zinc-950 border-zinc-700"
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                />
                <Button onClick={addTodo}>Add</Button>
              </div>

              <div className="space-y-2">
                {todos.length === 0 && (
                  <p className="text-sm text-zinc-400">No tasks yet.</p>
                )}
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2"
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={todo.done}
                        onChange={() =>
                          setTodos((prev) =>
                            prev.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)),
                          )
                        }
                      />
                      <span className={todo.done ? "line-through text-zinc-500" : "text-zinc-200"}>{todo.text}</span>
                    </label>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setTodos((prev) => prev.filter((t) => t.id !== todo.id))}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/70 border-zinc-800">
            <CardHeader>
              <CardTitle>Session Pulse</CardTitle>
              <CardDescription>Useful quick stats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-300">
              <p>• Auto-update: enabled (daily)</p>
              <p>• Git brain backup: enabled</p>
              <p>• Last runtime check: {status ? new Date(status.timestamp).toLocaleString() : "loading..."}</p>
              <p>• Theme: dark / modern</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
