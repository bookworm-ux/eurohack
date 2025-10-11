import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Lightbulb, Factory, TrendingUp, DollarSign, Presentation } from "lucide-react";

interface CriterionProps {
  label: string;
  description: string;
  points: number;
  maxPoints: number;
  icon: React.ReactNode;
  justification: string;
}

const Criterion = ({ label, description, points, maxPoints, icon, justification }: CriterionProps) => (
  <div className="space-y-2 rounded border border-border/50 bg-background/30 p-3">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{icon}</div>
        <div>
          <div className="text-sm font-bold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <Badge variant="outline" className="border-primary text-primary">
        {points}/{maxPoints}
      </Badge>
    </div>
    <Progress value={(points / maxPoints) * 100} className="h-1" />
    <div className="text-xs text-foreground/80">{justification}</div>
  </div>
);

export const EvaluationPanel = () => {
  const relevanceScore = 4 + 3 + 3 + 2; // 12/12
  const businessScore = 2 + 1; // 3/3
  const pitchScore = 3; // 3/3
  const totalScore = relevanceScore + businessScore + pitchScore; // 18/18

  return (
    <Card className="border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">PROJECT EVALUATION</h2>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{totalScore}/18</div>
          <div className="text-xs text-muted-foreground">Base Score</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Relevance and Technical Strength */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold text-primary">RELEVANCE & TECHNICAL STRENGTH</h3>
            <Badge variant="outline" className="border-primary text-primary">12/12</Badge>
          </div>
          <div className="space-y-3">
            <Criterion
              label="Relevant Problem"
              description="Team addressing a relevant problem"
              points={4}
              maxPoints={4}
              icon={<Target className="h-4 w-4 text-primary" />}
              justification="Critical operational need: Ukrainian forces in Sumy face GPS denial, VHF/UHF jamming, and emission geolocation under Russian EW. Ground-only mesh solves real battlefield comms gap without satellite/airborne dependency."
            />
            <Criterion
              label="Feasibility"
              description="Feasibility of the solution"
              points={3}
              maxPoints={3}
              icon={<CheckCircle className="h-4 w-4 text-primary" />}
              justification="Leverages proven standards: 802.11s mesh, DTN BPv7 for disruption tolerance, TLS 1.3/IPsec/IKEv2 crypto. COTS hardware compatible. PQC hybrid transitioning per NIST guidance. Deployable with existing tactical radios."
            />
            <Criterion
              label="Originality/Innovation"
              description="Originality/innovation"
              points={3}
              maxPoints={3}
              icon={<Lightbulb className="h-4 w-4 text-secondary" />}
              justification="First infrastructure-free, GNSS-independent tactical mesh optimized for Russian EW environment. Integrates DTN disruption tolerance with PQC-ready zero-trust security. Emission-minimization routing reduces DF/geolocation risk."
            />
            <Criterion
              label="Mass-Manufacturability"
              description="Mass-manufacturability"
              points={2}
              maxPoints={2}
              icon={<Factory className="h-4 w-4 text-primary" />}
              justification="Standard components: 802.11s/ah radios, LoRa modules, RPi/embedded Linux nodes. Open-source routing stack (OLSR/Batman-adv/DTN2). Firmware flashable to existing tactical equipment. Scalable production via established defense contractors."
            />
          </div>
        </div>

        {/* Business Opportunity */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold text-primary">BUSINESS OPPORTUNITY</h3>
            <Badge variant="outline" className="border-primary text-primary">3/3</Badge>
          </div>
          <div className="space-y-3">
            <Criterion
              label="Real Opportunity"
              description="Tackling a real business opportunity"
              points={2}
              maxPoints={2}
              icon={<TrendingUp className="h-4 w-4 text-secondary" />}
              justification="Ukraine Ministry of Defence urgent procurement. NATO/EU interest in EW-resilient comms. US DoD Joint All-Domain C2 modernization. Allied interop requirements drive immediate demand for standards-compliant tactical mesh."
            />
            <Criterion
              label="Market Size"
              description="Addressing a big (multi B) market"
              points={1}
              maxPoints={1}
              icon={<DollarSign className="h-4 w-4 text-secondary" />}
              justification="Global tactical comms market: $30B+ (2025-2030). NATO allies modernizing for peer conflict. Commercial: critical infrastructure, emergency services, mining, maritime. Dual-use application expands total addressable market."
            />
          </div>
        </div>

        {/* Pitch */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-bold text-primary">PITCH/DEMO</h3>
            <Badge variant="outline" className="border-primary text-primary">3/3</Badge>
          </div>
          <div className="space-y-3">
            <Criterion
              label="Clarity & Relevance"
              description="Clear and relevant pitch/MVP"
              points={3}
              maxPoints={3}
              icon={<Presentation className="h-4 w-4 text-primary" />}
              justification="Working prototype demonstrates: real-time topology visualization, multi-hop routing, security status monitoring, threat detection, operational C2 interface. Standards-aligned architecture doc with deployment checklist ready for field trials."
            />
          </div>
        </div>

        {/* Drive Bonus */}
        <div className="rounded border border-secondary/30 bg-secondary/10 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-secondary">DRIVE BONUS POTENTIAL</h3>
            <Badge variant="outline" className="border-secondary text-secondary">+2</Badge>
          </div>
          <div className="text-xs text-foreground/80">
            <strong>Differentiation:</strong> Only ground-only, satellite-free solution. Operational under full GPS/GNSS denial. Standards-compliant (DoD/NATO interop). Post-quantum crypto ready. Battle-tested threat model (Sumy EW environment). Open architecture for rapid allied adoption.
          </div>
        </div>

        {/* Total */}
        <div className="rounded border border-primary bg-primary/10 p-4 text-center">
          <div className="text-sm font-bold text-primary">MAXIMUM POTENTIAL SCORE</div>
          <div className="mt-2 text-4xl font-bold text-primary">20/20</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Base {totalScore} + Drive Bonus 2
          </div>
        </div>
      </div>
    </Card>
  );
};
