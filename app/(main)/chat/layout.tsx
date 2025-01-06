import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await fetchQuery(api.users.getCurrentUser);

  return (
    <>
      <SidebarProvider>
        <AppSidebar userId={user?._id ?? null} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
