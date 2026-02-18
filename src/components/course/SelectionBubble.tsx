"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";
import { NotebookPen } from "lucide-react";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";

interface SelectionBubbleProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function SelectionBubble({ containerRef }: SelectionBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setPendingClip, open } = useToolsPanel();

  const hideBubble = useCallback(() => {
    setVisible(false);
  }, []);

  const handleAddToNotebook = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    setPendingClip(text);
    open("notebook");
    selection.removeAllRanges();
    setVisible(false);
  }, [setPendingClip, open]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function isSelectionInContainer(selection: Selection): boolean {
      if (!selection.rangeCount) return false;
      const range = selection.getRangeAt(0);
      return container!.contains(range.commonAncestorContainer);
    }

    function showBubble() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
        return;
      }

      const text = selection.toString().trim();
      if (!text || !isSelectionInContainer(selection)) {
        setVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position centered above the selection, clamped to viewport
      const bubbleWidth = 180;
      const bubbleHeight = 40;
      const padding = 8;

      let x = rect.left + rect.width / 2 - bubbleWidth / 2;
      let y = rect.top - bubbleHeight - 10;

      // Clamp horizontal
      x = Math.max(padding, Math.min(x, window.innerWidth - bubbleWidth - padding));

      // If no room above, show below selection
      if (y < padding) {
        y = rect.bottom + 10;
      }

      setPosition({ x, y });
      setVisible(true);
    }

    function handleMouseUp() {
      // Small delay to let the selection finalize
      setTimeout(showBubble, 10);
    }

    function handleTouchEnd() {
      // Longer delay for mobile selection handles
      setTimeout(showBubble, 300);
    }

    function handleMouseDown(e: MouseEvent) {
      // If clicking inside the bubble, don't hide
      const target = e.target as HTMLElement;
      if (target.closest("[data-selection-bubble]")) return;
      setVisible(false);
    }

    function handleScroll() {
      setVisible(false);
    }

    function handleSelectionChange() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
      }
    }

    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("scroll", handleScroll, true);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [containerRef, hideBubble]);

  if (!visible) return null;

  return (
    <div
      data-selection-bubble
      className="fixed z-50 animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={handleAddToNotebook}
        className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-white shadow-lg transition-colors hover:bg-accent/90 active:scale-95"
      >
        <NotebookPen className="h-3.5 w-3.5" />
        <span className="text-xs font-medium uppercase tracking-wide">
          Add to Notebook
        </span>
      </button>
      {/* Caret pointing down */}
      <div className="flex justify-center">
        <div className="h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-accent" />
      </div>
    </div>
  );
}
