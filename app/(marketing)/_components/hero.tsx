import Link from "next/link";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex flex-col relative">
          <h1 className="text-6xl font-bold mb-4 relative">OpenChat</h1>
          <p className="text-xl text-muted-foreground">
            Chat with local LLM models on your own hardware
          </p>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Link href="/chat">
            <Button>Try it free now</Button>
          </Link>
          <div className="ml-4">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
