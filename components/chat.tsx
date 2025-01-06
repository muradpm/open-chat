"use client";

import { useChat } from "ai/react";
import { Messages } from "@/components/messages";
import { MessageInput } from "@/components/message-input";
import { ChatHeader } from "@/components/chat-header";
import { memo, useState } from "react";
import type { Attachment, Message } from "ai";
import { VisibilityType } from "@/hooks/use-chat-visibility";
import { Id } from "@/convex/_generated/dataModel";

function PureChat({
  id,
  initialMessages,
  selectedModelId,
  selectedVisibilityType,
}: {
  id: string | Id<"chats">;
  initialMessages: Array<Message>;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
}) {
  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    reload,
    append,
  } = useChat({
    id,
    initialMessages,
    experimental_throttle: 100,
    body: {
      id,
      model: selectedModelId,
    },
  });

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader
        chatId={id}
        selectedModelId={selectedModelId}
        selectedVisibilityType={selectedVisibilityType}
      />
      <Messages
        messages={messages}
        isLoading={isLoading}
        chatId={id}
        setMessages={setMessages}
        reload={reload}
      />
      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MessageInput
          chatId={id}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          messages={messages}
          setMessages={setMessages}
          append={append}
          handleSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}

export const Chat = memo(PureChat);
