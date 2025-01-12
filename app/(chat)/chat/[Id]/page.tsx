import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Chat } from "@/components/chat";
import { Id } from "@/convex/_generated/dataModel";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { convertToUIMessages } from "@/lib/utils";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export default async function Page(props: { params: Promise<{ id: Id<"chats"> }> }) {
  const params = await props.params;
  const chat = await fetchQuery(api.chats.getChatById, {
    id: params.id,
  });

  if (!chat) {
    notFound();
  }

  const session = await fetchQuery(
    api.users.getAuthenticatedUser,
    {},
    { token: await convexAuthNextjsToken() }
  );

  if (chat.visibility === "private") {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await fetchQuery(api.messages.getMessagesByChatId, {
    chatId: chat._id,
  });

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;
  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  return (
    <Chat
      id={chat._id}
      initialMessages={convertToUIMessages(messagesFromDb)}
      selectedModelId={selectedModelId}
      selectedVisibilityType={chat.visibility}
    />
  );
}
