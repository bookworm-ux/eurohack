import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Radio, Zap, AlertTriangle, CheckCircle, Lock } from "lucide-react";

export const StatusDashboard = () => {
  const metrics = [
    { label: "ACTIVE NODES", value: "6/7", icon: Radio, status: "active" },
    { label: "AVG SIGNAL", value: "78%", icon: Radio, status: "active" },
    { label: "ENCRYPTED LINKS", value: "5/6", icon: Shield, status: "warning" },
    { label: "AVG BATTERY", value: "64%", icon: Zap, status: "warning" },
  ];

  const threats = [
    { id: 1, type: "VHF JAMMING", severity: "HIGH", location: "SECTOR-NE", time: "02:34:12" },
    { id: 2, type: "GPS DENIED", severity: "CRITICAL", location: "ALL", time: "00:00:00" },
    { id: 3, type: "DF DETECTION", severity: "MEDIUM", location: "NODE-006", time: "02:15:47" },
  ];

  const securityStatus = [
    { label: "TLS 1.3", status: true },
    { label: "IPsec/IKEv2", status: true },
    { label: "PQC Hybrid", status: true },
    { label: "FIPS 140-3", status: true },
    { label: "Zero Trust", status: true },
  ];

  return (
    <div className="space-y-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric, idx) => (
          <Card key={idx} className="border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="mt-1 text-2xl font-bold text-primary">{metric.value}</div>
              </div>
              <metric.icon
                className={`h-5 w-5 ${
                  metric.status === "active" ? "text-primary" : "text-secondary"
                }`}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Security Status */}
      <Card className="border-border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-primary">
          <Lock className="h-4 w-4" />
          SECURITY STATUS
        </h3>
        <div className="flex flex-wrap gap-2">
          {securityStatus.map((item, idx) => (
            <Badge
              key={idx}
              variant="outline"
              className={
                item.status
                  ? "border-primary/50 text-primary"
                  : "border-accent/50 text-accent"
              }
            >
              {item.status ? (
                <CheckCircle className="mr-1 h-3 w-3" />
              ) : (
                <AlertTriangle className="mr-1 h-3 w-3" />
              )}
              {item.label}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Threat Monitor */}
      <Card className="border-border bg-card p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-accent">
          <AlertTriangle className="h-4 w-4 tactical-blink" />
          THREAT MONITOR
        </h3>
        <div className="space-y-2">
          {threats.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between rounded border border-border/50 bg-background/50 p-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    threat.severity === "CRITICAL"
                      ? "border-accent text-accent"
                      : threat.severity === "HIGH"
                      ? "border-secondary text-secondary"
                      : "border-primary/50 text-primary"
                  }
                >
                  {threat.severity}
                </Badge>
                <span className="font-mono text-foreground">{threat.type}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>{threat.location}</span>
                <span className="font-mono">{threat.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
