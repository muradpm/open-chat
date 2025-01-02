"use client";

import { Button } from "@/components/ui/button";
import { MoreIcon } from "@/components/icons";
import { Chat } from "@/types/chat";
import { ChatActions } from "@/components/chat-actions";

interface ChatItemProps {
  chat: Chat;
  className?: string;
  onClick: () => void;
}

export const ChatItem = ({ chat, className, onClick }: ChatItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`group flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors ${className}`}
    >
      <div className="flex items-center truncate max-w-[80%]">
        <span className="truncate text-sm">{chat.title}</span>
      </div>
      <ChatActions id={chat._id} title={chat.title} align="end" side="right">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </ChatActions>
    </div>
  );
};
