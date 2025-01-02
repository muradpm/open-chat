import { Message } from "ai";
import { memo } from "react";
import { useChat } from "ai/react";
import equal from "fast-deep-equal";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon, StopIcon } from "@/components/icons";
import { PreviewMessage, ThinkingMessage } from "./message";

interface MessagesProps {
  messages: Array<Message>;
  isLoading?: boolean;
  chatId: string;
  isReadonly?: boolean;
}

function PureMessages({
  messages,
  isLoading,
  chatId,
  isReadonly = false,
}: MessagesProps) {
  const { setMessages, reload } = useChat();
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={isLoading || false}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;
  return equal(prevProps.messages, nextProps.messages);
});

export const MessageInput = memo(() => {
  const { input, handleSubmit, handleInputChange, isLoading, stop } = useChat({
    id: "chat",
    experimental_throttle: 50,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      stop();
    } else {
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
    >
      <Input
        value={input}
        onChange={handleInputChange}
        placeholder="Send a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        {isLoading ? <StopIcon /> : <ArrowUpIcon />}
      </Button>
    </form>
  );
});
