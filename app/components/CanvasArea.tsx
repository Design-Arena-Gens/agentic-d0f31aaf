"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import type { Tool } from "./LeftToolbar";

export type DesignElement = {
  id: string;
  type: "text" | "image" | "shape" | "path";
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  text?: string;
  src?: string;
  path?: string; // SVG path d
  color?: string;
};

export function CanvasArea(props: {
  elements: DesignElement[];
  setElements: (updater: (prev: DesignElement[]) => DesignElement[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  activeTool: Tool;
}) {
  const { elements, setElements, selectedId, setSelectedId, activeTool } = props;

  const stageRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [drawing, setDrawing] = useState<{ points: { x: number; y: number }[] } | null>(null);

  const handlePointerDownStage = (e: React.PointerEvent) => {
    if (activeTool === "draw") {
      const pt = localPoint(e);
      setDrawing({ points: [pt, pt] });
    } else if (activeTool === "select") {
      setSelectedId(null);
    }
  };

  const handlePointerMoveStage = (e: React.PointerEvent) => {
    if (drawing) {
      const pt = localPoint(e);
      setDrawing({ points: [...drawing.points, pt] });
    }
  };

  const handlePointerUpStage = () => {
    if (drawing && drawing.points.length > 2) {
      const d = pointsToPath(drawing.points);
      const id = cryptoId();
      setElements((prev) => [
        ...prev,
        { id, type: "path", x: 0, y: 0, path: d, color: "#5b9dff" },
      ]);
    }
    setDrawing(null);
  };

  const onElementPointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    if (activeTool === "erase") {
      setElements((prev) => prev.filter((el) => el.id !== id));
      return;
    }
    if (activeTool === "select") {
      const el = elements.find((el) => el.id === id);
      if (!el) return;
      const pt = localPoint(e);
      setSelectedId(id);
      setDragState({ id, offsetX: pt.x - el.x, offsetY: pt.y - el.y });
    }
  };

  const onStagePointerMove = (e: React.PointerEvent) => {
    if (dragState) {
      const pt = localPoint(e);
      const nx = pt.x - dragState.offsetX;
      const ny = pt.y - dragState.offsetY;
      setElements((prev) => prev.map((el) => (el.id === dragState.id ? { ...el, x: nx, y: ny } : el)));
    }
    handlePointerMoveStage(e);
  };

  const onStagePointerUp = (e: React.PointerEvent) => {
    setDragState(null);
    handlePointerUpStage();
  };

  const drawingPath = useMemo(() => (drawing ? pointsToPath(drawing.points) : null), [drawing]);

  return (
    <div className="canvas" onPointerUp={onStagePointerUp}>
      <div
        className="canvas-inner"
        onPointerDown={handlePointerDownStage}
        onPointerMove={onStagePointerMove}
      >
        <div className="stage" ref={stageRef}>
          {/* Render elements */}
          {elements.map((el) => (
            <ElementView
              key={el.id}
              el={el}
              selected={selectedId === el.id}
              onPointerDown={(e) => onElementPointerDown(e, el.id)}
            />
          ))}
          {/* Live drawing overlay */}
          {drawingPath && (
            <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <path d={drawingPath} stroke="#5b9dff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <div className="onboarding">
            <div className="bubble">
              <strong>Welcome to Vizara.</strong> Use the left toolbar to add text, shapes, or draw. Or ask the AI on the right to make changes on the canvas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function localPoint(e: React.PointerEvent): { x: number; y: number } {
    const rect = stageRef.current?.getBoundingClientRect();
    const x = (e.clientX - (rect?.left ?? 0));
    const y = (e.clientY - (rect?.top ?? 0));
    return { x, y };
  }
}

function ElementView({ el, selected, onPointerDown }: { el: DesignElement; selected: boolean; onPointerDown: (e: React.PointerEvent) => void }) {
  const style: React.CSSProperties = {
    left: el.x,
    top: el.y,
    width: el.width,
    height: el.height,
  };
  if (el.type === "text") {
    return (
      <div className={clsx("layer text-layer", selected && "selected")} style={style} onPointerDown={onPointerDown}>
        <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: 0.2 }}>{el.text}</div>
      </div>
    );
  }
  if (el.type === "image") {
    return (
      <div className={clsx("layer", selected && "selected")} style={style} onPointerDown={onPointerDown}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={el.src} alt="" style={{ width: el.width, height: el.height, borderRadius: 12, display: 'block', objectFit: 'cover', border: '1px solid rgba(148,163,184,0.2)' }} />
      </div>
    );
  }
  if (el.type === "shape") {
    return (
      <div className={clsx("layer", selected && "selected")} style={{ ...style, background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)", borderRadius: 12 }} onPointerDown={onPointerDown} />
    );
  }
  if (el.type === "path") {
    return (
      <svg className={clsx("layer", selected && "selected")} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} onPointerDown={onPointerDown}>
        <path d={el.path || ""} stroke={el.color || "#5b9dff"} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
}

export function createText(text: string): DesignElement {
  return { id: cryptoId(), type: "text", x: 80, y: 80, text, width: 420, height: 60 };
}
export function createShape(): DesignElement {
  return { id: cryptoId(), type: "shape", x: 120, y: 180, width: 360, height: 180 };
}
export function createImage(url: string): DesignElement {
  return { id: cryptoId(), type: "image", x: 160, y: 120, width: 360, height: 220, src: url };
}

function pointsToPath(points: { x: number; y: number }[]): string {
  if (!points.length) return "";
  const d = ["M", points[0].x.toFixed(1), points[0].y.toFixed(1), ...points.slice(1).flatMap(p => ["L", p.x.toFixed(1), p.y.toFixed(1)])];
  return d.join(" ");
}

function cryptoId() {
  if (typeof crypto !== "undefined" && 'randomUUID' in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}
