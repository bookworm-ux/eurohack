import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Radio, AlertTriangle, Zap } from "lucide-react";

interface Node {
  id: string;
  x: number;
  y: number;
  status: "active" | "warning" | "critical";
  signalStrength: number;
  encrypted: boolean;
  battery: number;
  hops: number;
}

interface Connection {
  from: string;
  to: string;
  strength: number;
  encrypted: boolean;
}

const generateMockNodes = (): Node[] => [
  { id: "NODE-001", x: 50, y: 50, status: "active", signalStrength: 95, encrypted: true, battery: 87, hops: 0 },
  { id: "NODE-002", x: 150, y: 100, status: "active", signalStrength: 88, encrypted: true, battery: 92, hops: 1 },
  { id: "NODE-003", x: 250, y: 80, status: "warning", signalStrength: 65, encrypted: true, battery: 34, hops: 2 },
  { id: "NODE-004", x: 350, y: 120, status: "active", signalStrength: 82, encrypted: true, battery: 78, hops: 3 },
  { id: "NODE-005", x: 150, y: 200, status: "active", signalStrength: 91, encrypted: true, battery: 85, hops: 2 },
  { id: "NODE-006", x: 300, y: 220, status: "critical", signalStrength: 45, encrypted: false, battery: 12, hops: 4 },
];

const generateConnections = (): Connection[] => [
  { from: "NODE-001", to: "NODE-002", strength: 92, encrypted: true },
  { from: "NODE-002", to: "NODE-003", strength: 76, encrypted: true },
  { from: "NODE-003", to: "NODE-004", strength: 73, encrypted: true },
  { from: "NODE-002", to: "NODE-005", strength: 89, encrypted: true },
  { from: "NODE-005", to: "NODE-006", strength: 58, encrypted: false },
  { from: "NODE-003", to: "NODE-006", strength: 62, encrypted: true },
];

export const NetworkTopology = () => {
  const [nodes, setNodes] = useState<Node[]>(generateMockNodes());
  const [connections] = useState<Connection[]>(generateConnections());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        signalStrength: Math.max(30, Math.min(100, node.signalStrength + (Math.random() - 0.5) * 10)),
        battery: Math.max(0, node.battery - Math.random() * 0.1),
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (status: string) => {
    switch (status) {
      case "active": return "hsl(var(--primary))";
      case "warning": return "hsl(var(--secondary))";
      case "critical": return "hsl(var(--accent))";
      default: return "hsl(var(--muted))";
    }
  };

  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">example NETWORK TOPOLOGY</h2>
        <Badge variant="outline" className="border-primary text-primary">
          <Radio className="mr-1 h-3 w-3" />
          {nodes.filter(n => n.status === "active").length}/{nodes.length} ACTIVE
        </Badge>
      </div>

      <div className="relative h-[400px] overflow-hidden rounded border border-border bg-background/50 tactical-grid">
        {/* Connections */}
        <svg className="absolute inset-0 h-full w-full">
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            const opacity = conn.strength / 100;
            const strokeColor = conn.encrypted ? "hsl(var(--primary))" : "hsl(var(--accent))";
            
            return (
              <g key={idx}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={strokeColor}
                  strokeWidth="2"
                  strokeOpacity={opacity}
                  strokeDasharray={conn.encrypted ? "0" : "5,5"}
                />
                {/* Signal strength indicator */}
                <circle
                  cx={(fromNode.x + toNode.x) / 2}
                  cy={(fromNode.y + toNode.y) / 2}
                  r="3"
                  fill={strokeColor}
                  opacity={opacity}
                  className="tactical-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={() => setSelectedNode(node)}
          >
            {/* Pulse rings for active nodes */}
            {node.status === "active" && (
              <>
                <div
                  className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{
                    border: `2px solid ${getNodeColor(node.status)}`,
                    width: "40px",
                    height: "40px",
                    left: "-12px",
                    top: "-12px",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-pulse-ring"
                  style={{
                    border: `2px solid ${getNodeColor(node.status)}`,
                    width: "40px",
                    height: "40px",
                    left: "-12px",
                    top: "-12px",
                    animationDelay: "1s",
                  }}
                />
              </>
            )}
            
            <div
              className="relative flex h-4 w-4 items-center justify-center rounded-full border-2"
              style={{
                backgroundColor: getNodeColor(node.status),
                borderColor: getNodeColor(node.status),
                boxShadow: `0 0 10px ${getNodeColor(node.status)}`,
              }}
            >
              {!node.encrypted && (
                <AlertTriangle className="h-3 w-3 text-background" />
              )}
            </div>
            
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground">
              {node.id}
            </div>
          </div>
        ))}
      </div>

      {/* Node Details */}
      {selectedNode && (
        <div className="mt-4 rounded border border-primary/30 bg-background p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-primary">{selectedNode.id}</h3>
            <Badge
              variant="outline"
              className={
                selectedNode.status === "active"
                  ? "border-primary text-primary"
                  : selectedNode.status === "warning"
                  ? "border-secondary text-secondary"
                  : "border-accent text-accent"
              }
            >
              {selectedNode.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Signal:</span>
              <span className="font-bold text-foreground">{selectedNode.signalStrength.toFixed(0)}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="text-muted-foreground">Battery:</span>
              <span className="font-bold text-foreground">{selectedNode.battery.toFixed(0)}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${selectedNode.encrypted ? "text-primary" : "text-accent"}`} />
              <span className="text-muted-foreground">Encryption:</span>
              <span className="font-bold text-foreground">{selectedNode.encrypted ? "TLS 1.3" : "NONE"}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Hops:</span>
              <span className="font-bold text-foreground">{selectedNode.hops}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
