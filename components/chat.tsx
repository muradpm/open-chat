"use client";

import { useChat } from "ai/react";
import { MemoizedMarkdown } from "./memoized-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatHeader } from "@/components/chat-header";
import { Send } from "lucide-react";
import { useScrollChat } from "@/hooks/use-scroll-chat";

export function Chat({
  selectedModelId,
  isReadonly,
}: {
  selectedModelId: string;
  isReadonly: boolean;
}) {
  const { messages } = useChat({
    id: "chat",
    experimental_throttle: 50,
  });

  const scrollRef = useScrollChat(messages);

  return (
    <>
      <ChatHeader selectedModelId={selectedModelId} isReadonly={isReadonly} />

      <div className="flex flex-col h-[calc(100vh-3rem)] max-w-3xl mx-auto px-4 space-y-4">
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
        <MessageInput
          selectedModelId={selectedModelId}
          isReadonly={isReadonly}
        />
      </div>
    </>
  );
}

const MessageInput = ({
  selectedModelId,
  isReadonly,
}: {
  selectedModelId: string;
  isReadonly: boolean;
}) => {
  const { input, handleSubmit, handleInputChange } = useChat({
    id: "chat",
    body: { modelId: selectedModelId, isReadonly },
    experimental_throttle: 50,
  });

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
