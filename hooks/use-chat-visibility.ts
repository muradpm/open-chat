"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type VisibilityType = "private" | "public";

interface UseChatVisibilityProps {
  chatId: Id<"chats">;
  initialVisibility: VisibilityType;
}

export function useChatVisibility({ chatId, initialVisibility }: UseChatVisibilityProps) {
  const [visibilityType, setLocalVisibilityType] =
    useState<VisibilityType>(initialVisibility);
  const updateVisibility = useMutation(api.chats.updateChatVisibility);

  const setVisibilityType = async (newVisibility: VisibilityType) => {
    setLocalVisibilityType(newVisibility);

    // Only update in database if it's a Convex ID
    if (typeof chatId === "object" && "_id" in chatId) {
      try {
        await updateVisibility({
          id: chatId,
          visibility: newVisibility,
        });
      } catch (error) {
        // Revert on error
        setLocalVisibilityType(visibilityType);
        console.error("Failed to update visibility:", error);
      }
    }
  };

  return {
    visibilityType,
    setVisibilityType,
  };
}
