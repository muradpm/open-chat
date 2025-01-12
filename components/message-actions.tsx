import type { Message } from "ai";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { getMessageIdFromAnnotations } from "@/lib/utils";
import { CopyIcon, ThumbDownIcon, ThumbUpIcon } from "./icons";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { memo } from "react";
import equal from "fast-deep-equal";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type Vote = {
  messageId: Id<"messages">;
  chatId: Id<"chats">;
  isUpvoted: boolean;
};

export function PureMessageActions({
  chatId,
  message,
  vote,
  isLoading,
}: {
  chatId: Id<"chats">;
  message: Message;
  vote: Vote | undefined;
  isLoading: boolean;
}) {
  const voteMessage = useMutation(api.messages.voteMessage);

  const [_, copyToClipboard] = useCopyToClipboard();

  if (isLoading) return null;
  if (message.role === "user") return null;
  if (message.toolInvocations && message.toolInvocations.length > 0) return null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground"
              variant="outline"
              onClick={async () => {
                await copyToClipboard(message.content as string);
                toast.success("Copied to clipboard!");
              }}
            >
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              disabled={vote?.isUpvoted}
              variant="outline"
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message);

                toast.promise(
                  voteMessage({
                    chatId,
                    messageId,
                    isUpvoted: true,
                  }),
                  {
                    loading: "Upvoting response...",
                    success: () => "Upvoted response",
                    error: "Failed to upvote response.",
                  }
                );
              }}
            >
              <ThumbUpIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Upvote response</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="py-1 px-2 h-fit text-muted-foreground !pointer-events-auto"
              variant="outline"
              disabled={vote && !vote.isUpvoted}
              onClick={async () => {
                const messageId = getMessageIdFromAnnotations(message);

                toast.promise(
                  voteMessage({
                    chatId,
                    messageId,
                    isUpvoted: false,
                  }),
                  {
                    loading: "Downvoting response...",
                    success: () => "Downvoted response",
                    error: "Failed to downvote response.",
                  }
                );
              }}
            >
              <ThumbDownIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Downvote response</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export const MessageActions = memo(PureMessageActions, (prevProps, nextProps) => {
  if (!equal(prevProps.vote, nextProps.vote)) return false;
  if (prevProps.isLoading !== nextProps.isLoading) return false;

  return true;
});
