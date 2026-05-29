import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "../components/portfolio-chrome";
import { ClientVault } from "../components/ClientVault";

export const Route = createFileRoute("/vault")({
  component: VaultPage,
});

function VaultPage() {
  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative">
        {/* Background glow to anchor the vault card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <ClientVault />
      </div>
    </PageShell>
  );
}
