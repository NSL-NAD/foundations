"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type ToolsTab = "notebook" | "chat";

interface ToolsPanelContextValue {
  isOpen: boolean;
  activeTab: ToolsTab;
  moduleSlug: string;
  lessonSlug: string;
  open: (tab?: ToolsTab) => void;
  close: () => void;
  toggle: (tab?: ToolsTab) => void;
  setActiveTab: (tab: ToolsTab) => void;
  setLessonContext: (moduleSlug: string, lessonSlug: string) => void;
}

const ToolsPanelContext = createContext<ToolsPanelContextValue | null>(null);

export function ToolsPanelProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ToolsTab>("notebook");
  const [moduleSlug, setModuleSlug] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");

  const open = useCallback(
    (tab?: ToolsTab) => {
      if (tab) setActiveTab(tab);
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(
    (tab?: ToolsTab) => {
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
        setIsOpen(true);
      } else {
        setIsOpen((prev) => !prev);
      }
    },
    [activeTab]
  );

  const setLessonContext = useCallback(
    (newModuleSlug: string, newLessonSlug: string) => {
      setModuleSlug(newModuleSlug);
      setLessonSlug(newLessonSlug);
    },
    []
  );

  return (
    <ToolsPanelContext.Provider
      value={{
        isOpen,
        activeTab,
        moduleSlug,
        lessonSlug,
        open,
        close,
        toggle,
        setActiveTab,
        setLessonContext,
      }}
    >
      {children}
    </ToolsPanelContext.Provider>
  );
}

export function useToolsPanel() {
  const context = useContext(ToolsPanelContext);
  if (!context) {
    throw new Error("useToolsPanel must be used within ToolsPanelProvider");
  }
  return context;
}
