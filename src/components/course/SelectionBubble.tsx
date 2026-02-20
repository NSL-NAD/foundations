"use client";

import { useState, useEffect, useCallback, type RefObject } from "react";
import { NotebookPen, Eye } from "lucide-react";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";

interface SelectionBubbleProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function SelectionBubble({ containerRef }: SelectionBubbleProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { setPendingClip, open } = useToolsPanel();

  // "View Note" tooltip state
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const hideBubble = useCallback(() => {
    setVisible(false);
  }, []);

  const handleAddToNotebook = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (!text) return;

    // Wrap selected text in <mark> to persist highlight
    try {
      const range = selection.getRangeAt(0);
      const mark = document.createElement("mark");
      mark.className = "notebook-highlight";
      range.surroundContents(mark);
    } catch {
      // surroundContents can fail if selection spans multiple elements
      // In that case, use a different approach: wrap each text node
      const range = selection.getRangeAt(0);
      highlightRange(range);
    }

    setPendingClip(text);
    open("notebook");
    selection.removeAllRanges();
    setVisible(false);
  }, [setPendingClip, open]);

  // Handle clicking "View Note" tooltip
  const handleViewNote = useCallback(() => {
    open("notebook");
    setTooltipVisible(false);
  }, [open]);

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
      // If clicking inside the bubble or tooltip, don't hide
      const target = e.target as HTMLElement;
      if (target.closest("[data-selection-bubble]") || target.closest("[data-highlight-tooltip]")) return;
      setVisible(false);
    }

    function handleScroll() {
      setVisible(false);
      setTooltipVisible(false);
    }

    function handleSelectionChange() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        setVisible(false);
      }
    }

    // Hover over .notebook-highlight → show "View Note" tooltip
    function handleMouseOver(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const highlight = target.closest(".notebook-highlight") as HTMLElement | null;
      if (!highlight) return;

      const rect = highlight.getBoundingClientRect();
      const tooltipWidth = 120;
      const tooltipHeight = 36;

      let tx = rect.left + rect.width / 2 - tooltipWidth / 2;
      let ty = rect.top - tooltipHeight - 8;

      tx = Math.max(8, Math.min(tx, window.innerWidth - tooltipWidth - 8));
      if (ty < 8) {
        ty = rect.bottom + 8;
      }

      setTooltipPosition({ x: tx, y: ty });
      setTooltipVisible(true);
    }

    function handleMouseOut(e: MouseEvent) {
      const target = e.relatedTarget as HTMLElement | null;
      // If moving to the tooltip itself or another highlight, don't hide
      if (target?.closest(".notebook-highlight") || target?.closest("[data-highlight-tooltip]")) return;
      setTooltipVisible(false);
    }

    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("scroll", handleScroll, true);
    document.addEventListener("selectionchange", handleSelectionChange);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("selectionchange", handleSelectionChange);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [containerRef, hideBubble]);

  return (
    <>
      {/* "Add to Notebook" selection bubble */}
      {visible && (
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
      )}

      {/* "View Note" tooltip on hover over highlights */}
      {tooltipVisible && (
        <div
          data-highlight-tooltip
          className="highlight-tooltip visible"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <button
            onClick={handleViewNote}
            className="flex items-center gap-1.5 rounded-full bg-foreground/85 px-3 py-1.5 text-background shadow-md transition-colors hover:bg-foreground active:scale-95"
          >
            <Eye className="h-3 w-3" />
            <span className="text-[11px] font-medium">View Note</span>
          </button>
          {/* Caret pointing down */}
          <div className="flex justify-center">
            <div className="h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-foreground/85" />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Highlight a range that spans multiple elements.
 * Walks through text nodes in the range and wraps each in a <mark>.
 */
function highlightRange(range: Range) {
  const treeWalker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(node);
        return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) < 0 &&
          range.compareBoundaryPoints(Range.START_TO_END, nodeRange) > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const textNodes: Text[] = [];
  while (treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode as Text);
  }

  for (const textNode of textNodes) {
    const mark = document.createElement("mark");
    mark.className = "notebook-highlight";
    const parent = textNode.parentNode;
    if (parent && !(parent as Element).closest?.(".notebook-highlight")) {
      parent.insertBefore(mark, textNode);
      mark.appendChild(textNode);
    }
  }
}
