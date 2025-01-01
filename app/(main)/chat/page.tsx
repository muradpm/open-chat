import { Chat } from "@/components/chat";

export default function ChatPage() {
  return (
    <main>
      <Chat selectedModelId="llama3.2:1b" isReadonly={false} />
    </main>
  );
}
