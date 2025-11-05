"use client";
import React, { useState } from "react";

export type ChatMessage = { id: string; role: "user" | "ai"; content: string };

export function RightSidebar(props: {
  messages: ChatMessage[];
  onSend: (content: string) => void;
}) {
  const { messages, onSend } = props;
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    onSend(text);
  };

  return (
    <aside className="rightbar">
      <div className="card">
        <h3>Welcome, Designer</h3>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
          Ask Vizara to create layouts, add sections, or restyle elements.
          Try: <strong>?Add a bold hero headline and a button.?</strong>
        </div>
      </div>

      <div className="card">
        <h3>ChatCanvas</h3>
        <div className="chat">
          {messages.map((m) => (
            <div key={m.id} className={"msg " + (m.role === "ai" ? "ai" : "") }>
              <div className="bubble" style={{ fontSize: 13 }}>{m.content}</div>
            </div>
          ))}
        </div>
        <div className="input-row" style={{ marginTop: 10 }}>
          <input
            placeholder="Describe a change..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>

      <div className="card">
        <h3>Projects</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <ProjectItem name="Landing Mock" status="Active" />
          <ProjectItem name="Brand Kit" status="Draft" />
          <ProjectItem name="Mobile UI" status="Archived" />
        </div>
      </div>
    </aside>
  );
}

function ProjectItem({ name, status }: { name: string; status: string }) {
  const color = status === 'Active' ? 'var(--success)' : status === 'Draft' ? 'var(--brand-600)' : 'var(--muted)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
      <div>{name}</div>
      <div style={{ color, border: '1px solid rgba(148,163,184,0.2)', padding: '4px 8px', borderRadius: 6 }}>{status}</div>
    </div>
  );
}
