"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useNotebook } from "@/hooks/useNotebook";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { Loader2, Check, Bold, Italic, List, ListOrdered, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotebookEditorProps {
  userId: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function NotebookEditor({
  userId,
  moduleSlug,
  lessonSlug,
}: NotebookEditorProps) {
  const { content, setContent, isLoading, isSaving, lastSaved } = useNotebook({
    userId,
    moduleSlug,
    lessonSlug,
  });
  const { pendingClip, clearPendingClip } = useToolsPanel();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: "Take notes on this lesson...",
      }),
    ],
    content: "",
    editable: true,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    // Suppress SSR mismatch warnings
    immediatelyRender: false,
  });

  // Sync content from DB into editor when loading finishes
  useEffect(() => {
    if (!editor || isLoading) return;
    // Set content from DB once loaded (only if editor is still empty)
    if (content) {
      const currentText = editor.getText().trim();
      if (!currentText) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content, isLoading]);

  // Consume pending clip from highlight-to-notebook feature
  useEffect(() => {
    if (!pendingClip || isLoading || !editor) return;

    // Insert as a blockquote at the end
    editor
      .chain()
      .focus("end")
      .insertContent([
        // Add a blank line before if there's existing content
        ...(editor.getText().trim()
          ? [{ type: "paragraph" as const }]
          : []),
        {
          type: "blockquote" as const,
          content: [
            {
              type: "paragraph" as const,
              content: [{ type: "text" as const, text: pendingClip }],
            },
          ],
        },
        { type: "paragraph" as const },
      ])
      .run();

    clearPendingClip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingClip, isLoading, editor]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Notes for this lesson
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-primary" />
              <span>Saved</span>
            </>
          ) : null}
        </div>
      </div>

      {/* Toolbar */}
      {editor && (
        <div className="flex items-center gap-0.5 rounded-t-md border border-b-0 bg-muted/50 px-2 py-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </ToolbarButton>
          <div className="mx-1 h-4 w-px bg-border" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </ToolbarButton>
          <div className="mx-1 h-4 w-px bg-border" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </ToolbarButton>
        </div>
      )}

      {/* Editor */}
      <div
        className={cn(
          "tiptap-editor w-full resize-y rounded-md border bg-background focus-within:ring-2 focus-within:ring-primary/20",
          editor ? "rounded-t-none border-t-0" : "",
          isLoading && "opacity-50"
        )}
      >
        <EditorContent editor={editor} />
      </div>

      {editor && editor.getText().length > 0 && (
        <p className="text-right text-xs text-muted-foreground">
          {editor.getText().split(/\s+/).filter(Boolean).length} words
        </p>
      )}
    </div>
  );
}

/* Small toolbar button */
function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "rounded p-1.5 transition-colors hover:bg-accent/15",
        active && "bg-accent/15 text-accent"
      )}
    >
      {children}
    </button>
  );
}
