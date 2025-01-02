"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { PlusIcon, LoaderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Authenticated, useQuery } from "convex/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHistory } from "@/components/sidebar-history";
import { Chat } from "@/types/chat";

import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface AppSidebarProps {
  userId: Id<"users">;
  disabled?: boolean;
}

export const AppSidebar = ({ userId, disabled }: AppSidebarProps) => {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate, pending } = useApiMutation(api.chats.createChat);
  const chats = useQuery(api.chats.getUserChats, { userId });

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const onClick = () => {
    mutate({
      title: "Untitled",
      userId,
      visibility: "private",
      createdAt: Date.now(),
    }).then((id) => {
      router.push(`/chat/${id}`);
    });
  };

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => setOpenMobile(false)}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Chat
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  disabled={pending || disabled}
                  onClick={() => {
                    onClick();
                    setOpenMobile(false);
                    router.push("/chat");
                    router.refresh();
                  }}
                >
                  {pending ? <LoaderIcon /> : <PlusIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarHistory
          userId={userId}
          chats={chats || []}
          selectedChat={selectedChat}
          onChatSelect={(chat) => {
            setSelectedChat(chat);
            setOpenMobile(false);
            router.push(`/chat/${chat._id}`);
          }}
        />
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Authenticated>
          <SidebarUserNav />
        </Authenticated>
      </SidebarFooter>
    </Sidebar>
  );
};
