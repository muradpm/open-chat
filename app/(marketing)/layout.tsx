import { Header } from "./_components/header";

import { GridPattern } from "@/components/grid-pattern";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <GridPattern />
      <Header />
      <main className="flex-grow relative z-10">
        <div className="max-w-2xl mx-auto text-center pt-64">{children}</div>
      </main>
    </div>
  );
}
