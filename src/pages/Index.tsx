import { NetworkTopology } from "@/components/NetworkTopology";
import { StatusDashboard } from "@/components/StatusDashboard";
import { CommandPanel } from "@/components/CommandPanel";
import { Badge } from "@/components/ui/badge";
import { Shield, Radio } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/10">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">TACTICAL MESH NETWORK</h1>
              <p className="text-xs text-muted-foreground">Ground-Based Command & Control // Sumy AO 2025</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary text-primary">
              <Shield className="mr-1 h-3 w-3" />
              ZERO-TRUST ENABLED
            </Badge>
            <Badge variant="outline" className="border-secondary text-secondary tactical-blink">
              GPS DENIED
            </Badge>
            <div className="ml-2 font-mono text-sm text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Topology */}
          <div className="lg:col-span-2">
            <NetworkTopology />
          </div>

          {/* Right Column - Status & Control */}
          <div className="space-y-4">
            <StatusDashboard />
            <CommandPanel />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 rounded border border-border/30 bg-card/30 p-4">
          <h3 className="mb-2 text-xs font-bold text-primary">SYSTEM ARCHITECTURE</h3>
          <div className="grid gap-2 text-[10px] text-muted-foreground md:grid-cols-3">
            <div>
              <strong className="text-foreground">Radio Layer:</strong> 802.11s/ah mesh, 802.15.4e/LoRa sensor backhaul
            </div>
            <div>
              <strong className="text-foreground">Security:</strong> TLS 1.3/mTLS, IPsec/IKEv2, PQC hybrid KEM, FIPS 140-3
            </div>
            <div>
              <strong className="text-foreground">Routing:</strong> DTN BPv7/BPSec for disruption tolerance, multi-hop mesh
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
