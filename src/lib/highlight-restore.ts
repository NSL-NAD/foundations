/**
 * Restore saved highlights on lesson content by searching the DOM text
 * for matching strings and re-creating CSS Custom Highlight API ranges.
 *
 * Uses a TreeWalker to build a flat text representation with node/offset
 * mappings, then performs text searches with prefix/suffix context for
 * disambiguation when the same text appears multiple times.
 */

const HIGHLIGHT_NAME = "notebook-clips";

interface SavedHighlight {
  highlighted_text: string;
  prefix_context: string;
  suffix_context: string;
}

interface TextSegment {
  node: Text;
  start: number; // offset in the flat string
  end: number;
}

/**
 * Build a flat string from all text nodes inside a container,
 * along with a mapping array that tracks which node owns each character range.
 */
function buildTextMap(container: HTMLElement): {
  text: string;
  segments: TextSegment[];
} {
  const segments: TextSegment[] = [];
  let offset = 0;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    const len = node.textContent?.length ?? 0;
    if (len === 0) continue;
    segments.push({ node, start: offset, end: offset + len });
    offset += len;
  }

  // Build the full text string from all segments
  const text = segments.map((s) => s.node.textContent).join("");

  return { text, segments };
}

/**
 * Find the character offset of a highlight's text within the flat string,
 * using prefix/suffix context for disambiguation when duplicates exist.
 */
function findMatchOffset(
  fullText: string,
  highlight: SavedHighlight
): number | null {
  const needle = highlight.highlighted_text;
  if (!needle) return null;

  // Find all occurrences
  const occurrences: number[] = [];
  let searchFrom = 0;
  while (searchFrom < fullText.length) {
    const idx = fullText.indexOf(needle, searchFrom);
    if (idx === -1) break;
    occurrences.push(idx);
    searchFrom = idx + 1;
  }

  if (occurrences.length === 0) return null;
  if (occurrences.length === 1) return occurrences[0];

  // Multiple occurrences — use prefix/suffix context to disambiguate
  const prefix = highlight.prefix_context;
  const suffix = highlight.suffix_context;

  let bestIdx = occurrences[0];
  let bestScore = -1;

  for (const idx of occurrences) {
    let score = 0;

    // Check prefix match
    if (prefix) {
      const before = fullText.slice(Math.max(0, idx - prefix.length), idx);
      if (before.endsWith(prefix)) {
        score += prefix.length;
      } else {
        // Partial match scoring
        for (let i = 0; i < Math.min(before.length, prefix.length); i++) {
          if (before[before.length - 1 - i] === prefix[prefix.length - 1 - i]) {
            score += 1;
          } else {
            break;
          }
        }
      }
    }

    // Check suffix match
    if (suffix) {
      const after = fullText.slice(
        idx + needle.length,
        idx + needle.length + suffix.length
      );
      if (after.startsWith(suffix)) {
        score += suffix.length;
      } else {
        // Partial match scoring
        for (let i = 0; i < Math.min(after.length, suffix.length); i++) {
          if (after[i] === suffix[i]) {
            score += 1;
          } else {
            break;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  }

  return bestIdx;
}

/**
 * Convert a flat-string character range into a DOM Range spanning text nodes.
 */
function createRangeFromOffset(
  segments: TextSegment[],
  startOffset: number,
  endOffset: number
): Range | null {
  let startNode: Text | null = null;
  let startNodeOffset = 0;
  let endNode: Text | null = null;
  let endNodeOffset = 0;

  for (const seg of segments) {
    if (!startNode && seg.end > startOffset) {
      startNode = seg.node;
      startNodeOffset = startOffset - seg.start;
    }
    if (seg.end >= endOffset) {
      endNode = seg.node;
      endNodeOffset = endOffset - seg.start;
      break;
    }
  }

  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    range.setStart(startNode, startNodeOffset);
    range.setEnd(endNode, endNodeOffset);
    return range;
  } catch {
    return null;
  }
}

/**
 * Restore all saved highlights on the given container element.
 * Registers ranges with the CSS Custom Highlight API.
 */
export function restoreHighlights(
  containerEl: HTMLElement,
  highlights: SavedHighlight[]
): void {
  if (!highlights.length) return;
  if (!("Highlight" in window) || !CSS.highlights) return;

  const { text, segments } = buildTextMap(containerEl);
  if (!text || !segments.length) return;

  const ranges: Range[] = [];

  for (const highlight of highlights) {
    const offset = findMatchOffset(text, highlight);
    if (offset === null) continue;

    const range = createRangeFromOffset(
      segments,
      offset,
      offset + highlight.highlighted_text.length
    );
    if (range) {
      ranges.push(range);
    }
  }

  if (ranges.length === 0) return;

  // Get or create the highlight registry
  const existing = CSS.highlights.get(HIGHLIGHT_NAME);
  if (existing) {
    // Add restored ranges to existing highlight set
    for (const range of ranges) {
      existing.add(range);
    }
  } else {
    const highlightObj = new Highlight(...ranges);
    highlightObj.priority = 1;
    CSS.highlights.set(HIGHLIGHT_NAME, highlightObj);
  }
}

/**
 * Clear all highlights from the CSS Custom Highlight API registry.
 * Called when navigating away from a lesson to prevent stale ranges.
 */
export function clearHighlights(): void {
  if (!CSS.highlights) return;
  CSS.highlights.delete(HIGHLIGHT_NAME);
}
