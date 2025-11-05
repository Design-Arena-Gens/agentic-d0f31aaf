"use client";
import React, { useMemo, useState } from "react";
import { LeftToolbar, type Tool } from "./components/LeftToolbar";
import { RightSidebar, type ChatMessage } from "./components/RightSidebar";
import { CanvasArea, type DesignElement, createImage, createShape, createText } from "./components/CanvasArea";

export default function Page() {
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [elements, setElements] = useState<DesignElement[]>(() => [
    createText("Design fearlessly with Vizara ?"),
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", role: "ai", content: "Hello! I?m Vizara. Ask me to add or style elements on the canvas." },
  ]);

  const addShape = () => setElements((prev) => [...prev, createShape()]);
  const addText = () => setElements((prev) => [...prev, createText("Your headline here")]);
  const addImage = (url?: string) => { if (!url) return; setElements((prev) => [...prev, createImage(url)]); };

  const handleSend = (content: string) => {
    const user: ChatMessage = { id: String(Math.random()), role: "user", content };
    setMessages((prev) => [...prev, user]);

    // Naive command parsing for demo purposes
    const lower = content.toLowerCase();
    const actions: string[] = [];
    if (lower.includes("headline") || lower.includes("text")) { addText(); actions.push("headline"); }
    if (lower.includes("button")) { setElements((prev) => [...prev, { id: id(), type: 'shape', x: 120, y: 420, width: 160, height: 48 }]); actions.push("button"); }
    const imageUrl = extractUrl(content);
    if (lower.includes("image") && imageUrl) { addImage(imageUrl); actions.push("image"); }

    const reply = actions.length
      ? `Added ${actions.join(", ")}. You can drag to reposition.`
      : `I can add headlines, shapes, and images. Try: "Add a bold headline and a primary button."`;

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: String(Math.random()), role: "ai", content: reply }]);
    }, 400);
  };

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <div className="brand-badge">VZ</div>
          Vizara
        </div>
        <div className="top-actions">
          <button onClick={() => { setElements([]); setMessages([{ id: 'r', role: 'ai', content: 'Fresh canvas ready.' }]); }}>New</button>
          <button className="primary" onClick={() => alert('This is a demo build of Vizara.')}>Export</button>
        </div>
      </header>

      <LeftToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onAddShape={addShape}
        onAddText={addText}
        onAddImage={addImage}
      />

      <CanvasArea
        elements={elements}
        setElements={(updater) => setElements((prev) => updater(prev))}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        activeTool={activeTool}
      />

      <RightSidebar messages={messages} onSend={handleSend} />
    </>
  );
}

function id() { return Math.random().toString(36).slice(2); }

function extractUrl(s: string): string | null {
  const match = s.match(/https?:\/\/\S+/);
  return match ? match[0] : null;
}
