import { useEffect, useRef } from "react";
import { Message } from "ai";

export function useScrollChat(messages: Message[]) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    if (!viewport) return;

    const scroll = () =>
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });

    requestAnimationFrame(scroll);
  }, [messages]);

  return scrollRef;
}
