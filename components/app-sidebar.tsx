"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";
import { PlusIcon, LoaderIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Authenticated } from "convex/react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface NewChatButtonProps {
  userId: Id<"users">;
  disabled?: boolean;
}

export const AppSidebar = ({ userId, disabled }: NewChatButtonProps) => {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { mutate, pending } = useApiMutation(api.chats.createChat);

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
      <SidebarHeader />
      <SidebarMenu>
        <div className="flex flex-row justify-between items-center px-2">
          <Link
            href="/"
            onClick={() => {
              setOpenMobile(false);
            }}
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
                  setOpenMobile(false);
                  onClick();
                }}
              >
                {pending ? <LoaderIcon /> : <PlusIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end">New chat</TooltipContent>
          </Tooltip>
        </div>
      </SidebarMenu>
      <SidebarContent>
        {/*        Put the sidebar-history.tsx here>*/}
      </SidebarContent>
      <SidebarFooter>
        <Authenticated>
          <UserNav />
        </Authenticated>
      </SidebarFooter>
    </Sidebar>
  );
};
