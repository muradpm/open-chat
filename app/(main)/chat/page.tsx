import { cookies } from "next/headers";
import { Chat } from "@/components/chat";
import { DEFAULT_MODEL_NAME, models } from "@/lib/models";
import { generateUUID } from "@/lib/utils";

export default async function ChatPage() {
  const id = generateUUID();
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
      ;
    </>
  );
}
