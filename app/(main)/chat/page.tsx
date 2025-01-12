import { cookies } from "next/headers";
import { Chat } from "@/components/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/ai/models";
import { Id } from "@/convex/_generated/dataModel";

export default async function ChatPage({ id }: { id: Id<"chats"> }) {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id || DEFAULT_MODEL_NAME;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedVisibilityType="private"
        selectedModelId={selectedModelId}
      />
    </>
  );
}
