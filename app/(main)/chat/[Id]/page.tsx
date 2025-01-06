import { cookies } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Chat } from "@/components/chat";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_MODEL_NAME, models } from "@/lib/models";
import { convertToUIMessages } from "@/lib/utils";

interface ChatPageProps {
  params: { Id: string };
}

export default async function ChatIdPage({ params }: ChatPageProps) {
  const chat = await fetchQuery(api.chats.getChatById, {
    id: params.Id as Id<"chats">,
  });

  if (!chat) {
    notFound();
  }

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  // Get messages for this chat
  const messages = await fetchQuery(api.messages.getMessagesByChatId, {
    chatId: chat._id,
  });

  return (
    <Chat
      id={chat._id}
      initialMessages={convertToUIMessages(messages)}
      selectedModelId={selectedModelId}
      selectedVisibilityType={chat.visibility}
    />
  );
}
