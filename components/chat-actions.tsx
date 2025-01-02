"use client";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";

export const ChatActions = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  const { mutate: removeChat } = useApiMutation(api.chats.removeChat);

  const onDelete = () => {
    const promise = removeChat({ id });
    toast.promise(promise, {
      loading: "Deleting...",
      success: "Chat deleted",
      error: "Failed to delete chat",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-[160px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span>Share</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                className="cursor-pointer flex-row justify-between"
                // onClick={() => {
                //   setVisibilityType('private');
                // }}
              >
                <div className="flex flex-row gap-2 items-center">
                  <span>Private</span>
                </div>
                {/* {visibilityType === 'private' ? (
                    <CheckCircleFillIcon />
                  ) : null} */}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex-row justify-between"
                // onClick={() => {
                //   setVisibilityType('public');
                // }}
              >
                <div className="flex flex-row gap-2 items-center">
                  <span>Public</span>
                </div>
                {/* {visibilityType === 'public' ? <CheckCircleFillIcon /> : null} */}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
          onClick={onDelete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
