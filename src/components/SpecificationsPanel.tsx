import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Radio, Zap, FileText, CheckSquare } from "lucide-react";

export const SpecificationsPanel = () => {
  return (
    <Card className="border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-bold text-primary">TECHNICAL SPECIFICATIONS</h2>

      <Tabs defaultValue="architecture" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="radio">Radio</TabsTrigger>
          <TabsTrigger value="standards">Standards</TabsTrigger>
          <TabsTrigger value="deploy">Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <FileText className="h-4 w-4" />
              Network Architecture
            </h4>
            <div className="space-y-2 text-xs text-foreground/80">
              <div><strong>Topology:</strong> Self-healing multi-hop mesh, no infrastructure/satellite dependency</div>
              <div><strong>Node Types:</strong> Gateway nodes (platoon), relay nodes (squad), sensor nodes (individual)</div>
              <div><strong>Routing:</strong> OLSR/Batman-adv for mesh layer, DTN BPv7 for disruption tolerance</div>
              <div><strong>Range:</strong> 500m-2km per hop (terrain dependent), 5-7 hop practical limit</div>
              <div><strong>Latency:</strong> 50-200ms typical (non-disrupted), DTN store-and-forward for intermittent links</div>
            </div>
          </div>

          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 text-sm font-bold text-primary">Threat Model</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="border-accent text-accent text-[10px]">GPS Jamming</Badge>
              <Badge variant="outline" className="border-accent text-accent text-[10px]">VHF/UHF Denial</Badge>
              <Badge variant="outline" className="border-accent text-accent text-[10px]">DF/Geolocation</Badge>
              <Badge variant="outline" className="border-accent text-accent text-[10px]">Protocol Fingerprinting</Badge>
              <Badge variant="outline" className="border-accent text-accent text-[10px]">Supply Chain Attack</Badge>
              <Badge variant="outline" className="border-accent text-accent text-[10px]">SIGINT Collection</Badge>
            </div>
          </div>

          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 text-sm font-bold text-primary">Countermeasures</h4>
            <div className="space-y-1 text-xs text-foreground/80">
              <div>✓ Emission minimization (low duty-cycle beaconing)</div>
              <div>✓ Frequency hopping across 2.4/5 GHz + LoRa 433/868 MHz</div>
              <div>✓ Encrypted routing headers (IPsec transport mode)</div>
              <div>✓ Zero-trust node authentication (mTLS certificates)</div>
              <div>✓ RF anomaly detection (spectrum monitoring + ML)</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="crypto" className="space-y-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <Shield className="h-4 w-4" />
              Cryptographic Stack
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">TLS 1.3</Badge>
                <div className="text-foreground/80">mTLS for node authentication, AES-256-GCM cipher suites, ECDHE P-384 key exchange</div>
              </div>
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">IPsec/IKEv2</Badge>
                <div className="text-foreground/80">ESP transport mode, AES-256-GCM + SHA-384 HMAC, Perfect Forward Secrecy</div>
              </div>
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">PQC Hybrid</Badge>
                <div className="text-foreground/80">NIST transitional: ML-KEM-768 + ECDH P-384 for KEM, ML-DSA-65 + ECDSA for signatures</div>
              </div>
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">FIPS 140-3</Badge>
                <div className="text-foreground/80">Hardware security module (HSM) for key storage, validated cryptographic modules</div>
              </div>
            </div>
          </div>

          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 text-sm font-bold text-primary">Key Management</h4>
            <div className="space-y-1 text-xs text-foreground/80">
              <div><strong>Bootstrap:</strong> Pre-shared keys (PSK) or out-of-band certificate provisioning</div>
              <div><strong>Rotation:</strong> Automated 24h session keys, 7d certificate renewal</div>
              <div><strong>Revocation:</strong> CRL distribution via DTN for compromised nodes</div>
              <div><strong>Lifecycle:</strong> NIST SP 800-57 key management per DoD requirements</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="radio" className="space-y-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <Radio className="h-4 w-4" />
              Radio Layer Specifications
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">802.11s/ah</Badge>
                <div className="text-foreground/80">Primary mesh: 5 GHz (150 Mbps), 2.4 GHz fallback (54 Mbps), 900 MHz sub-GHz for extended range</div>
              </div>
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">802.15.4e/6LoWPAN</Badge>
                <div className="text-foreground/80">Sensor backhaul: TSCH time-slotting, RPL routing, IPv6 compression for low-power nodes</div>
              </div>
              <div>
                <Badge variant="outline" className="border-primary text-primary mb-1 text-[10px]">LoRa/FSK</Badge>
                <div className="text-foreground/80">Long-range backup: 433/868 MHz ISM, SF7-12 adaptive, 10 km+ LOS for critical command links</div>
              </div>
            </div>
          </div>

          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 text-sm font-bold text-primary">RF Parameters</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
              <div><strong>TX Power:</strong> 100 mW - 1W (adaptive)</div>
              <div><strong>Modulation:</strong> OFDM/QPSK/LoRa</div>
              <div><strong>Bandwidth:</strong> 20 MHz (Wi-Fi), 125 kHz (LoRa)</div>
              <div><strong>Sensitivity:</strong> -95 dBm (802.11), -137 dBm (LoRa)</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="standards" className="space-y-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 text-sm font-bold text-primary">Standards Compliance</h4>
            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-primary">Security Engineering:</strong>
                <div className="mt-1 text-foreground/80">NIST Cybersecurity Framework, ISO 27001, IEC 62443 (ICS security), CISA Secure-by-Design</div>
              </div>
              <div>
                <strong className="text-primary">Cryptography:</strong>
                <div className="mt-1 text-foreground/80">FIPS 140-3, NIST SP 800-56 (key agreement), SP 800-57 (key mgmt), PQC NIST standards (draft)</div>
              </div>
              <div>
                <strong className="text-primary">Networking:</strong>
                <div className="mt-1 text-foreground/80">IEEE 802.11s (mesh), 802.15.4e (TSCH), RFC 9171 (DTN BPv7), RFC 9172 (BPSec), RFC 6550 (RPL)</div>
              </div>
              <div>
                <strong className="text-primary">Policy Alignment:</strong>
                <div className="mt-1 text-foreground/80">DoDD 3100.10 (space/mission assurance), DoD Zero Trust Strategy, NATO STANAG 4677 (tactical data links)</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-primary">
              <CheckSquare className="h-4 w-4" />
              Deployment Checklist
            </h4>
            <div className="space-y-2 text-xs text-foreground/80">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="border-primary text-primary mt-0.5 text-[10px]">PRE</Badge>
                <div>
                  <div className="font-bold text-foreground">Pre-Deployment</div>
                  <div>□ Flash firmware to nodes (validated image)</div>
                  <div>□ Provision certificates (PKI or PSK)</div>
                  <div>□ Configure crypto parameters (TLS/IPsec)</div>
                  <div>□ RF spectrum survey (identify jamming)</div>
                  <div>□ Test node battery/solar power</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Badge variant="outline" className="border-secondary text-secondary mt-0.5 text-[10px]">FIELD</Badge>
                <div>
                  <div className="font-bold text-foreground">Field Setup</div>
                  <div>□ Deploy gateway node (platoon HQ)</div>
                  <div>□ Place relay nodes (50% overlap coverage)</div>
                  <div>□ Mount antennas (elevated, clear LOS)</div>
                  <div>□ Power on and verify mesh formation</div>
                  <div>□ Run topology scan (confirm multi-hop)</div>
                  <div>□ Test encryption status (TLS handshake)</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Badge variant="outline" className="border-primary text-primary mt-0.5 text-[10px]">OPS</Badge>
                <div>
                  <div className="font-bold text-foreground">Operations</div>
                  <div>□ Monitor signal strength (RSSI thresholds)</div>
                  <div>□ Track battery levels (replace &lt;20%)</div>
                  <div>□ Watch for RF anomalies (jamming detection)</div>
                  <div>□ Rotate keys per schedule (24h/7d)</div>
                  <div>□ Backup logs/topology (DTN store)</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
