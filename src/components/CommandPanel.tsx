import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Radio, 
  Shield, 
  RefreshCw, 
  Power, 
  Settings, 
  Terminal,
  Activity,
  Lock
} from "lucide-react";
import { toast } from "sonner";

export const CommandPanel = () => {
  const [meshActive, setMeshActive] = useState(true);
  const [cryptoMode, setCryptoMode] = useState("TLS 1.3 + PQC");

  const handleCommand = (command: string) => {
    toast.success(`Command executed: ${command}`, {
      description: `Timestamp: ${new Date().toLocaleTimeString()}`,
    });
  };

  const commands = [
    {
      label: "REFRESH TOPOLOGY",
      icon: RefreshCw,
      action: () => handleCommand("REFRESH_TOPOLOGY"),
      variant: "default" as const,
    },
    {
      label: "OPTIMIZE ROUTES",
      icon: Activity,
      action: () => handleCommand("OPTIMIZE_ROUTES"),
      variant: "default" as const,
    },
    {
      label: "ROTATE KEYS",
      icon: Lock,
      action: () => handleCommand("ROTATE_KEYS"),
      variant: "default" as const,
    },
    {
      label: "CONFIGURE",
      icon: Settings,
      action: () => handleCommand("OPEN_CONFIG"),
      variant: "outline" as const,
    },
  ];

  return (
    <Card className="border-border bg-card p-4">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-primary">
        <Terminal className="h-4 w-4" />
        COMMAND & CONTROL
      </h3>

      {/* Status Indicators */}
      <div className="mb-4 space-y-2 rounded border border-border/50 bg-background/50 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">MESH STATUS</span>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={meshActive ? "border-primary text-primary" : "border-accent text-accent"}
            >
              {meshActive ? "ACTIVE" : "INACTIVE"}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setMeshActive(!meshActive);
                handleCommand(`MESH_${meshActive ? "DISABLE" : "ENABLE"}`);
              }}
              className="h-6 w-6 p-0"
            >
              <Power className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">CRYPTO MODE</span>
          <Badge variant="outline" className="border-primary text-primary">
            <Shield className="mr-1 h-3 w-3" />
            {cryptoMode}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">PROTOCOLS</span>
          <div className="flex gap-1">
            <Badge variant="outline" className="border-primary/50 text-[10px] text-primary">
              802.11s
            </Badge>
            <Badge variant="outline" className="border-primary/50 text-[10px] text-primary">
              DTN BPv7
            </Badge>
          </div>
        </div>
      </div>

      {/* Command Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {commands.map((cmd, idx) => (
          <Button
            key={idx}
            variant={cmd.variant}
            size="sm"
            onClick={cmd.action}
            className="h-auto flex-col gap-1 py-2"
          >
            <cmd.icon className="h-4 w-4" />
            <span className="text-[10px]">{cmd.label}</span>
          </Button>
        ))}
      </div>

      {/* System Log */}
      <div className="mt-4 rounded border border-border/50 bg-background/50 p-2">
        <div className="mb-1 text-[10px] text-muted-foreground">SYSTEM LOG</div>
        <div className="space-y-1 font-mono text-[10px] text-foreground/70">
          <div>[02:45:33] Route optimization complete</div>
          <div>[02:45:12] Key rotation successful</div>
          <div>[02:44:58] Node NODE-003 battery low</div>
          <div>[02:44:32] Topology refresh complete</div>
        </div>
      </div>
    </Card>
  );
};
