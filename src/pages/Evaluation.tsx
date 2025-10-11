import { EvaluationPanel } from "@/components/EvaluationPanel";
import { SpecificationsPanel } from "@/components/SpecificationsPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Radio, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Evaluation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to C2
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex h-10 w-10 items-center justify-center rounded border-2 border-primary bg-primary/10">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">PROJECT DOCUMENTATION</h1>
              <p className="text-xs text-muted-foreground">Evaluation Criteria & Technical Specifications</p>
            </div>
          </div>
          
          <Badge variant="outline" className="border-primary text-primary">
            <Shield className="mr-1 h-3 w-3" />
            STANDARDS COMPLIANT
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid gap-6 lg:grid-cols-2">
          <EvaluationPanel />
          <SpecificationsPanel />
        </div>

        {/* Reference Footer */}
        <div className="mt-6 rounded border border-border/30 bg-card/30 p-4">
          <h3 className="mb-2 text-xs font-bold text-primary">REFERENCE STANDARDS & GUIDANCE</h3>
          <div className="grid gap-2 text-[10px] text-muted-foreground md:grid-cols-4">
            <div>
              <strong className="text-foreground">Crypto:</strong> NIST FIPS 140-3, SP 800-56/57, PQC standards (ML-KEM, ML-DSA)
            </div>
            <div>
              <strong className="text-foreground">Networking:</strong> IEEE 802.11s, 802.15.4e, RFC 9171/9172 (DTN BPv7/BPSec), RFC 6550 (RPL)
            </div>
            <div>
              <strong className="text-foreground">Security:</strong> NIST CSF, ISO 27001, IEC 62443, CISA Secure-by-Design, DoD Zero Trust
            </div>
            <div>
              <strong className="text-foreground">Policy:</strong> DoDD 3100.10, NATO STANAG 4677, ENISA AI hardening, EU cybersecurity directives
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Evaluation;
