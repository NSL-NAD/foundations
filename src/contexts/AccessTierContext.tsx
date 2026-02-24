"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AccessTier } from "@/lib/access";

const AccessTierContext = createContext<AccessTier>("full");

export function AccessTierProvider({
  tier,
  children,
}: {
  tier: AccessTier;
  children: ReactNode;
}) {
  return (
    <AccessTierContext.Provider value={tier}>
      {children}
    </AccessTierContext.Provider>
  );
}

export function useAccessTier(): AccessTier {
  return useContext(AccessTierContext);
}
