"use client";

import { useChat } from "ai/react";
import { Messages, MessageInput } from "@/components/messages";
import { ChatHeader } from "@/components/chat-header";

export function Chat({
  id,
  selectedModelId,
}: {
  id: string;
  selectedModelId: string;
}) {
  const { messages, isLoading } = useChat({
    id,
    experimental_throttle: 100,
    body: {
      id,
      model: selectedModelId,
    },
  });

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader chatId={id} selectedModelId={selectedModelId} />
      <Messages messages={messages} isLoading={isLoading} chatId={id} />
      <MessageInput />
    </div>
  );
}
