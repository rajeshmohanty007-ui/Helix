import AppShell from "@/components/layouts/AppShell";

export default function AppLayout({ children }) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}