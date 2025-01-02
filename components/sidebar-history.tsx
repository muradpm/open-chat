"use client";

import { useEffect } from "react";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { ChatItem } from "@/components/chat-item";
import { Chat } from "@/types/chat";
import { cn } from "@/lib/utils";

interface SidebarHistoryProps {
  userId: string;
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  selectedChat: Chat | null;
}

type GroupedChats = {
  today: Chat[];
  yesterday: Chat[];
  lastWeek: Chat[];
  lastMonth: Chat[];
  older: Chat[];
};

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date();
  const oneWeekAgo = subWeeks(now, 1);
  const oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats
  );
};

export const SidebarHistory = ({
  chats,
  onChatSelect,
  selectedChat,
}: SidebarHistoryProps) => {
  useEffect(() => {
    if (chats?.length > 0 && !selectedChat) {
      onChatSelect(chats[0]);
    }
  }, [chats, selectedChat, onChatSelect]);

  const groupedChats = groupChatsByDate(chats || []);

  return (
    <div className="flex flex-col gap-6">
      {groupedChats.today.length > 0 && (
        <div>
          <div className="px-2 py-1 text-xs text-muted-foreground">Today</div>
          {groupedChats.today.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => onChatSelect(chat)}
              className={cn({
                "text-foreground bg-primary/10":
                  selectedChat && chat._id === selectedChat._id,
              })}
            />
          ))}
        </div>
      )}

      {groupedChats.yesterday.length > 0 && (
        <div>
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Yesterday
          </div>
          {groupedChats.yesterday.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => onChatSelect(chat)}
              className={cn({
                "text-foreground bg-primary/10":
                  selectedChat && chat._id === selectedChat._id,
              })}
            />
          ))}
        </div>
      )}

      {groupedChats.lastWeek.length > 0 && (
        <div>
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Last 7 days
          </div>
          {groupedChats.lastWeek.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => onChatSelect(chat)}
              className={cn({
                "text-foreground bg-primary/10":
                  selectedChat && chat._id === selectedChat._id,
              })}
            />
          ))}
        </div>
      )}

      {groupedChats.lastMonth.length > 0 && (
        <div>
          <div className="px-2 py-1 text-xs text-muted-foreground">
            Last 30 days
          </div>
          {groupedChats.lastMonth.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => onChatSelect(chat)}
              className={cn({
                "text-foreground bg-primary/10":
                  selectedChat && chat._id === selectedChat._id,
              })}
            />
          ))}
        </div>
      )}

      {groupedChats.older.length > 0 && (
        <div>
          <div className="px-2 py-1 text-xs text-muted-foreground">Older</div>
          {groupedChats.older.map((chat) => (
            <ChatItem
              key={chat._id}
              chat={chat}
              onClick={() => onChatSelect(chat)}
              className={cn({
                "text-foreground bg-primary/10":
                  selectedChat && chat._id === selectedChat._id,
              })}
            />
          ))}
        </div>
      )}
    </div>
  );
};
