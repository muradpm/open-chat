import { cookies } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Chat } from "@/components/chat";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_MODEL_NAME, models } from "@/lib/models";

interface ChatPageProps {
  userId: Id<"users">;
}

export default async function ChatIdPage({ userId }: ChatPageProps) {
  const chat = fetchQuery(api.chats.getUserChats, { userId });

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  if (!chat) {
    notFound();
  }

  return <Chat id="chat" selectedModelId={selectedModelId} />;
}
