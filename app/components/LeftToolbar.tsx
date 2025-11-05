"use client";
import { clsx } from "clsx";
import React from "react";

export type Tool = "select" | "add" | "text" | "image" | "draw" | "erase";

export function LeftToolbar(props: {
  activeTool: Tool;
  setActiveTool: (t: Tool) => void;
  onAddShape: () => void;
  onAddText: () => void;
  onAddImage: (url?: string) => void;
}) {
  const { activeTool, setActiveTool, onAddShape, onAddText, onAddImage } = props;

  const handleImage = () => {
    setActiveTool("image");
    const url = typeof window !== "undefined" ? window.prompt("Paste image URL") ?? undefined : undefined;
    if (url) onAddImage(url);
  };

  return (
    <aside className="leftbar">
      <div className="tools">
        <button
          className={clsx("tool-btn", activeTool === "select" && "active")}
          title="Select (V)"
          onClick={() => setActiveTool("select")}
        >
          <SelectIcon />
        </button>
        <button
          className={clsx("tool-btn", activeTool === "add" && "active")}
          title="Add Shape"
          onClick={() => {
            setActiveTool("add");
            onAddShape();
          }}
        >
          <PlusIcon />
        </button>
        <button
          className={clsx("tool-btn", activeTool === "text" && "active")}
          title="Add Text (T)"
          onClick={() => {
            setActiveTool("text");
            onAddText();
          }}
        >
          <TextIcon />
        </button>
        <button
          className={clsx("tool-btn", activeTool === "image" && "active")}
          title="Add Image"
          onClick={handleImage}
        >
          <ImageIcon />
        </button>
        <button
          className={clsx("tool-btn", activeTool === "draw" && "active")}
          title="Draw (D)"
          onClick={() => setActiveTool("draw")}
        >
          <PencilIcon />
        </button>
        <button
          className={clsx("tool-btn", activeTool === "erase" && "active")}
          title="Erase (E)"
          onClick={() => setActiveTool("erase")}
        >
          <EraserIcon />
        </button>
      </div>
    </aside>
  );
}

function SelectIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 3v18l4-4h7a1 1 0 0 0 .8-1.6L6 3z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 6h16M10 6v12m4-12v12" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 13l2.5-2.5L14 14l2-2 3 3" />
      <circle cx="8" cy="9" r="1.5" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}
function EraserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 17l9-9a2 2 0 0 1 3 0l6 6-6 6H9z" />
    </svg>
  );
}
