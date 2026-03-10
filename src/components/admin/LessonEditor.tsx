"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Image as ImageIcon,
  Video,
  Images,
  Wand2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { EditorPreview } from "./EditorPreview";
import { cn } from "@/lib/utils";

// CodeMirror imports
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";

interface LessonEditorProps {
  moduleSlug: string;
  lessonSlug: string;
  moduleTitle: string;
  lessonTitle: string;
  lessonType: string;
  lessonDuration: string;
  initialContent: string;
}

const COMPONENT_SNIPPETS = [
  {
    label: "Definition Card",
    template: `<DefinitionCard term="Term" definition="Definition text here." />`,
  },
  {
    label: "Course Quote",
    template: `<CourseQuote quote="Quote text here." author="Author Name" />`,
  },
  {
    label: "Tool Card",
    template: `<ToolCard name="Tool Name" description="What the tool does." url="https://example.com" />`,
  },
  {
    label: "Key Insight",
    template: `> This is a key insight that will be highlighted in a special callout box.`,
  },
  {
    label: "Callout Card",
    template: `**Label:** Description text that will render as a callout card.`,
  },
];

export function LessonEditor({
  moduleSlug,
  lessonSlug,
  moduleTitle,
  lessonTitle,
  lessonType,
  lessonDuration,
  initialContent,
}: LessonEditorProps) {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Media upload dialog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video" | "carousel">(
    "image"
  );

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString();
        setContent(newContent);
        setHasChanges(newContent !== initialContent);
        setSaveStatus("idle");
      }
    });

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        syntaxHighlighting(defaultHighlightStyle),
        oneDark,
        EditorView.lineWrapping,
        placeholder("Start writing your lesson content..."),
        updateListener,
        EditorView.theme({
          "&": {
            fontSize: "14px",
            minHeight: "500px",
          },
          ".cm-content": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: "16px",
            lineHeight: "1.6",
          },
          ".cm-gutters": {
            backgroundColor: "transparent",
            border: "none",
            color: "hsl(var(--muted-foreground))",
          },
          ".cm-scroller": {
            overflow: "auto",
          },
          "&.cm-focused": {
            outline: "none",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Insert text at the current cursor position in CodeMirror
  const insertAtCursor = useCallback((text: string) => {
    const view = viewRef.current;
    if (!view) return;

    const { from } = view.state.selection.main;
    view.dispatch({
      changes: { from, insert: text },
      selection: { anchor: from + text.length },
    });
    view.focus();
  }, []);

  // Handle save
  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("saving");
    setSaveError("");

    try {
      const res = await fetch("/api/admin/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, lessonSlug, content }),
      });

      if (res.ok) {
        setSaveStatus("saved");
        setHasChanges(false);
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        const data = await res.json();
        setSaveStatus("error");
        setSaveError(data.error || "Failed to save");
      }
    } catch {
      setSaveStatus("error");
      setSaveError("Network error — check your connection");
    } finally {
      setSaving(false);
    }
  }, [moduleSlug, lessonSlug, content]);

  // Keyboard shortcut for save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (hasChanges && !saving) {
          handleSave();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, hasChanges, saving]);

  // Handle media upload complete
  function handleUploadComplete(url: string, type: "image" | "video") {
    if (uploadType === "carousel") {
      // For carousel, we insert a placeholder — user can add more images
      insertAtCursor(
        `<ImageCarousel images={[{ src: "${url}", alt: "Description", caption: "" }]} />`
      );
    } else if (type === "video") {
      insertAtCursor(`<VideoBlock src="${url}" caption="" />`);
    } else {
      insertAtCursor(`![Description](${url})`);
    }
    setUploadOpen(false);
  }

  // Insert component snippet
  function handleInsertSnippet(template: string) {
    insertAtCursor("\n\n" + template + "\n\n");
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-foreground/10 bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() =>
              router.push(`/course/${moduleSlug}/${lessonSlug}`)
            }
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Button>

          <div className="hidden sm:block">
            <p className="text-xs text-muted-foreground">{moduleTitle}</p>
            <h1 className="text-sm font-semibold leading-tight">
              {lessonTitle}
            </h1>
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <span className="rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
              {lessonType}
            </span>
            {lessonDuration && (
              <span className="rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] text-muted-foreground">
                {lessonDuration}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save status indicator */}
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <Check className="h-3.5 w-3.5" />
              Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {saveError}
            </span>
          )}

          {hasChanges && (
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-500">
              Unsaved
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-1.5"
          >
            {showPreview ? (
              <EyeOff className="h-3.5 w-3.5" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="gap-1.5"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save & Deploy
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-foreground/10 bg-card/50 px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => {
            setUploadType("image");
            setUploadOpen(true);
          }}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          Image
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => {
            setUploadType("video");
            setUploadOpen(true);
          }}
        >
          <Video className="h-3.5 w-3.5" />
          Video
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => {
            setUploadType("carousel");
            setUploadOpen(true);
          }}
        >
          <Images className="h-3.5 w-3.5" />
          Carousel
        </Button>

        <div className="mx-1 h-4 w-px bg-foreground/10" />

        {/* Component snippets dropdown */}
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Components
          </Button>
          <div className="absolute left-0 top-full z-50 hidden min-w-[200px] rounded-md border bg-card p-1 shadow-lg group-hover:block">
            {COMPONENT_SNIPPETS.map((snippet) => (
              <button
                key={snippet.label}
                onClick={() => handleInsertSnippet(snippet.template)}
                className="w-full rounded px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted"
              >
                {snippet.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex flex-1 overflow-hidden">
        {/* CodeMirror editor */}
        <div
          className={cn(
            "flex-1 overflow-auto border-r border-foreground/10",
            showPreview ? "w-[60%]" : "w-full"
          )}
        >
          <div ref={editorRef} className="h-full" />
        </div>

        {/* Live preview */}
        {showPreview && (
          <div className="w-[40%] overflow-auto bg-background">
            <EditorPreview content={content} />
          </div>
        )}
      </div>

      {/* Media upload dialog */}
      <MediaUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        moduleSlug={moduleSlug}
        lessonSlug={lessonSlug}
        uploadType={uploadType}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
