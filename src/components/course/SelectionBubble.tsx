"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";
import { NotebookPen } from "lucide-react";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";

interface SelectionBubbleProps {
  containerRef: RefObject<HTMLDivElement | null>;
  onSaveHighlight?: (text: string, prefix: string, suffix: string) => void;
}

export function SelectionBubble({ containerRef, onSaveHighlight }: SelectionBubbleProps) {
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

    // Persist highlight using CSS Custom Highlight API (no DOM mutation)
    // This avoids React reconciliation errors from modifying React-managed DOM
    try {
      const range = selection.getRangeAt(0).cloneRange();
      addHighlightRange(range);

      // Extract prefix/suffix context for disambiguation on restore
      if (onSaveHighlight) {
        const prefix = extractContext(range, "before", 30);
        const suffix = extractContext(range, "after", 30);
        onSaveHighlight(text, prefix, suffix);
      }
    } catch {
      // Silently ignore — highlight is cosmetic only
    }

    setPendingClip(text);
    open("notebook");
    selection.removeAllRanges();
    setVisible(false);
  }, [setPendingClip, open, onSaveHighlight]);

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

/**
 * Extract text context before or after a Range for disambiguation on restore.
 * Walks sibling text nodes to gather surrounding characters.
 */
function extractContext(
  range: Range,
  direction: "before" | "after",
  charCount: number
): string {
  try {
    // Use the range's container to get surrounding text
    const container = range.commonAncestorContainer;
    const parent =
      container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : (container as HTMLElement);
    if (!parent) return "";

    // Get the full text content of a reasonable ancestor
    const ancestor = parent.closest("p, li, h1, h2, h3, h4, h5, h6, td, blockquote, div") || parent;
    const fullText = ancestor.textContent || "";
    const selectedText = range.toString();

    // Find the selection within the ancestor text
    const idx = fullText.indexOf(selectedText);
    if (idx === -1) return "";

    if (direction === "before") {
      return fullText.slice(Math.max(0, idx - charCount), idx);
    } else {
      const afterStart = idx + selectedText.length;
      return fullText.slice(afterStart, afterStart + charCount);
    }
  } catch {
    return "";
  }
}

/**
 * Persist a highlight range using the CSS Custom Highlight API.
 * This does NOT mutate the DOM — it registers ranges with the browser
 * which are then styled via the ::highlight() CSS pseudo-element.
 * Falls back gracefully (no highlight) in unsupported browsers.
 */
const HIGHLIGHT_NAME = "notebook-clips";

function addHighlightRange(range: Range) {
  // CSS Custom Highlight API — available in modern browsers
  if (!("Highlight" in window) || !CSS.highlights) return;

  const existing = CSS.highlights.get(HIGHLIGHT_NAME);
  if (existing) {
    existing.add(range);
  } else {
    const highlight = new Highlight(range);
    highlight.priority = 1;
    CSS.highlights.set(HIGHLIGHT_NAME, highlight);
  }
}
