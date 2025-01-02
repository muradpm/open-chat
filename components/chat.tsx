"use client";

import { useChat } from "ai/react";
import { Messages, MessageInput } from "@/components/messages";
import { ChatHeader } from "@/components/chat-header";

export function Chat() {
  const { messages, isLoading } = useChat({
    id: "chat",
    experimental_throttle: 50,
  });

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader />
      <Messages messages={messages} isLoading={isLoading} chatId="chat" />
      <MessageInput />
    </div>
  );
}
