import { getServerStatus } from "@/lib/serverStatus";
import { Header } from "@/components/Header";
import { StatusCard } from "@/components/StatusCard";
import { JoinGuide } from "@/components/JoinGuide";
import { ModInstallation } from "@/components/ModInstallation";
import { ModCatalog } from "@/components/ModCatalog";
import { ServerRules } from "@/components/ServerRules";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const initialStatus = await getServerStatus();

  return (
    <div className="flex-1 flex flex-col">
      <Header serverName={initialStatus.serverName} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Live Status Card */}
        <StatusCard initialStatus={initialStatus} />

        {/* How to Connect */}
        <JoinGuide />

        {/* Mod Installation Guide & Download */}
        <ModInstallation />

        {/* Interactive Mod Catalog */}
        <ModCatalog />

        {/* Server Rules & Backup Details */}
        <ServerRules />
      </main>

      <Footer />
    </div>
  );
}
