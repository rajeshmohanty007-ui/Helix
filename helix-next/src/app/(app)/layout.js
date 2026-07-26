import AppShell from "@/components/layouts/AppShell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }) {
  const session = await getServerSession(authOptions);
  if(!session) {
    redirect("/");
  }
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}