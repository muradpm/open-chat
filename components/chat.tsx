"use client";

import { memo } from "react";
import { useChat } from "ai/react";
import { MemoizedMarkdown } from "./memoized-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatHeader } from "@/components/chat-header";
import { ArrowUpIcon, StopIcon } from "@/components/icons";
import { useScrollChat } from "@/hooks/use-scroll-chat";
import { Id } from "@/convex/_generated/dataModel";

export function Chat({
  id,
  selectedModelId,
}: {
  id: Id<"chats">;
  selectedModelId: string;
}) {
  const { messages } = useChat({
    id: "chat",
    experimental_throttle: 50,
  });

  const scrollRef = useScrollChat(messages);

  return (
    <>
      <ChatHeader selectedModelId={selectedModelId} />

      <div className="flex flex-col h-[calc(100vh-6rem)] max-w-3xl mx-auto px-4 space-y-4">
        <div className="flex-1">
          <ScrollArea className="h-[calc(100vh-12rem)] p-4" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 mb-4 items-start ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role !== "user" && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="https://avatar.vercel.sh/bot" />
                  </Avatar>
                )}
                <div
                  className={`flex items-center rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    <MemoizedMarkdown
                      id={message.id}
                      content={message.content}
                    />
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-7 w-7">
                    <AvatarFallback>U</AvatarFallback>
                    <AvatarImage src="https://avatar.vercel.sh/user" />
                  </Avatar>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
        <MessageInput selectedModelId={selectedModelId} />
      </div>
    </>
  );
}

const MessageInput = memo(
  ({ selectedModelId }: { selectedModelId: string }) => {
    const { input, handleSubmit, handleInputChange, isLoading, stop } = useChat(
      {
        id: "chat",
        body: { modelId: selectedModelId },
        experimental_throttle: 50,
      }
    );

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoading) {
        stop();
      } else {
        handleSubmit(e);
      }
    };

    return (
      <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={input.length === 0 && !isLoading}
        >
          {isLoading ? <StopIcon /> : <ArrowUpIcon />}
        </Button>
      </form>
    );
  },
  (prevProps, nextProps) =>
    prevProps.selectedModelId === nextProps.selectedModelId
);
