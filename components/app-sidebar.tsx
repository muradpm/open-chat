"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Authenticated } from "convex/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from "@/components/ui/sidebar";
import { SidebarHistory } from "@/components/sidebar-history";
import { Id } from "@/convex/_generated/dataModel";

interface AppSidebarProps {
  userId: Id<"users"> | null;
}

export function AppSidebar({ userId }: AppSidebarProps) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

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
                OpenChat
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push("/chat");
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarContent>
          <SidebarHistory userId={userId} />
        </SidebarContent>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Authenticated>
          <SidebarUserNav />
        </Authenticated>
      </SidebarFooter>
    </Sidebar>
  );
}
