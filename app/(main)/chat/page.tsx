import { cookies } from "next/headers";
import { Chat } from "@/components/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/models";

export default async function ChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get("model-id")?.value;

  const selectedModelId =
    models.find((model) => model.id === modelIdFromCookie)?.id ||
    DEFAULT_MODEL_NAME;

  return (
    <>
      <Chat id="chat" selectedModelId={selectedModelId} />;
    </>
  );
}
