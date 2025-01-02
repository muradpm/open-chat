"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Chat } from "@/components/chat";
import { Id } from "@/convex/_generated/dataModel";

interface ChatPageProps {
  userId: Id<"users">;
}

export default function ChatPage({ userId }: ChatPageProps) {
  const chat = useQuery(api.chats.getUserChats, { userId });

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  return <Chat />;
}
