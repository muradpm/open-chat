"use client";

import { Message, ChatRequestOptions } from "ai";
import { memo } from "react";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { PreviewMessage, ThinkingMessage } from "./message";
import equal from "fast-deep-equal";
import { Id } from "@/convex/_generated/dataModel";

type Vote = {
  messageId: Id<"messages">;
  chatId: Id<"chats">;
  isUpvoted: boolean;
};

interface MessagesProps {
  messages: Array<Message>;
  votes: Array<Vote> | undefined;
  isLoading: boolean;
  chatId: Id<"chats">;
  setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  isReadonly?: boolean;
}

function PureMessages({
  messages,
  votes,
  isLoading,
  chatId,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div ref={messagesEndRef} className="shrink-0 min-w-[24px] min-h-[24px]" />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return equal(prevProps.messages, nextProps.messages);
});
