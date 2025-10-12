/*
 * Mesh simulation adapted from src/mesh/examples/mesh-example.cc
 * with NetAnim output and a sequential forwarding demo.
 */

#include "ns3/applications-module.h"
#include "ns3/core-module.h"
#include "ns3/internet-module.h"
#include "ns3/mesh-helper.h"
#include "ns3/mesh-module.h"
#include "ns3/mobility-module.h"
#include "ns3/netanim-module.h"
#include "ns3/network-module.h"
#include "ns3/udp-socket-factory.h"
#include "ns3/yans-wifi-helper.h"

#include <cstdint>
#include <fstream>
#include <iostream>
#include <memory>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("MeshSimpleSimulation");

// Declaring these variables outside of main() for use in trace sinks
uint32_t g_udpTxCount = 0; //!< Rx packet counter.
uint32_t g_udpRxCount = 0; //!< Tx packet counter.

/**
 * Transmission trace sink.
 *
 * \param p The sent packet.
 */
void
TxTrace(Ptr<const Packet> p)
{
  NS_LOG_DEBUG("Sent " << p->GetSize() << " bytes");
  g_udpTxCount++;
}

/**
 * Reception trace sink,
 *
 * \param p The received packet.
 */
void
RxTrace(Ptr<const Packet> p)
{
  NS_LOG_DEBUG("Received " << p->GetSize() << " bytes");
  g_udpRxCount++;
}

/**
 * \brief MeshTest class (adapted from mesh-example.cc)
 */
class MeshTest
{
public:
  MeshTest();
  void Configure(int argc, char** argv);
  int Run();

private:
  void CreateNodes();
  void InstallInternetStack();
  void InstallApplication();
  void SetupSequentialChain();
  void StartSequentialChain(Ptr<Packet> packet);
  void SequentialForwardReceive(Ptr<Socket> socket);
  void Report();

private:
  int m_xSize;
  int m_ySize;
  double m_step;
  double m_randomStart;
  double m_totalTime;
  double m_packetInterval;
  uint16_t m_packetSize;
  uint32_t m_nIfaces;
  bool m_chan;
  bool m_pcap;
  bool m_ascii;
  std::string m_stack;
  std::string m_root;
  bool m_enableAnimation;
  std::string m_animFile;
  double m_seqGap;
  std::string m_seqPayload;
  uint16_t m_seqPort;

  NodeContainer m_nodes;
  NetDeviceContainer m_meshDevices;
  Ipv4InterfaceContainer m_interfaces;
  MeshHelper m_mesh;
  std::unique_ptr<AnimationInterface> m_animation;

  std::vector<Ptr<Socket>> m_seqSockets;
  std::vector<Ipv4Address> m_forwardTargets;
  std::unordered_map<uint32_t, uint32_t> m_nodeIdToIndex;
};

MeshTest::MeshTest()
  : m_xSize(3),
    m_ySize(3),
    m_step(35.0),
    m_randomStart(0.1),
    m_totalTime(30.0),
    m_packetInterval(0.5),
    m_packetSize(256),
    m_nIfaces(1),
    m_chan(true),
    m_pcap(false),
    m_ascii(false),
    m_stack("ns3::Dot11sStack"),
    m_root("ff:ff:ff:ff:ff:ff"),
    m_enableAnimation(true),
    m_animFile("mesh-simple-animation.xml"),
    m_seqGap(0.5),
    m_seqPayload("Mesh sequential payload"),
    m_seqPort(5000)
{
}

void
MeshTest::Configure(int argc, char* argv[])
{
  CommandLine cmd(__FILE__);
  cmd.AddValue("x-size", "Number of nodes in a row grid", m_xSize);
  cmd.AddValue("y-size", "Number of rows in a grid", m_ySize);
  cmd.AddValue("step", "Size of edge in our grid (meters)", m_step);
  cmd.AddValue("start", "Maximum random start delay for beacon jitter (sec)", m_randomStart);
  cmd.AddValue("time", "Simulation time (sec)", m_totalTime);
  cmd.AddValue("packet-interval", "Interval between packets in UDP ping (sec)", m_packetInterval);
  cmd.AddValue("packet-size", "Size of packets in UDP ping (bytes)", m_packetSize);
  cmd.AddValue("interfaces", "Number of radio interfaces used by each mesh point", m_nIfaces);
  cmd.AddValue("channels", "Use different frequency channels for different interfaces", m_chan);
  cmd.AddValue("pcap", "Enable PCAP traces on interfaces", m_pcap);
  cmd.AddValue("ascii", "Enable Ascii traces on interfaces", m_ascii);
  cmd.AddValue("stack", "Type of protocol stack. ns3::Dot11sStack by default", m_stack);
  cmd.AddValue("root", "Mac address of root mesh point in HWMP", m_root);
  cmd.AddValue("anim", "Enable NetAnim XML output.", m_enableAnimation);
  cmd.AddValue("animFile", "NetAnim animation output filename (empty to disable).", m_animFile);
  cmd.AddValue("seqGap", "Delay (s) between sequential forwarding hops.", m_seqGap);
  cmd.AddValue("seqPayload", "Payload string carried by sequential packet.", m_seqPayload);

  cmd.Parse(argc, argv);
  NS_LOG_DEBUG("Grid:" << m_xSize << "*" << m_ySize);
  NS_LOG_DEBUG("Simulation time: " << m_totalTime << " s");
  if (m_animFile.empty())
  {
    m_enableAnimation = false;
  }
}

void
MeshTest::CreateNodes()
{
  m_nodes.Create(m_ySize * m_xSize);

  YansWifiPhyHelper wifiPhy;
  YansWifiChannelHelper wifiChannel = YansWifiChannelHelper::Default();
  wifiPhy.SetChannel(wifiChannel.Create());

  m_mesh = MeshHelper::Default();
  if (!Mac48Address(m_root.c_str()).IsBroadcast())
  {
    m_mesh.SetStackInstaller(m_stack, "Root", Mac48AddressValue(Mac48Address(m_root.c_str())));
  }
  else
  {
    m_mesh.SetStackInstaller(m_stack);
  }

  if (m_chan)
  {
    m_mesh.SetSpreadInterfaceChannels(MeshHelper::SPREAD_CHANNELS);
  }
  else
  {
    m_mesh.SetSpreadInterfaceChannels(MeshHelper::ZERO_CHANNEL);
  }
  m_mesh.SetMacType("RandomStart", TimeValue(Seconds(m_randomStart)));
  m_mesh.SetNumberOfInterfaces(m_nIfaces);

  m_meshDevices = m_mesh.Install(wifiPhy, m_nodes);
  m_mesh.AssignStreams(m_meshDevices, 0);

  MobilityHelper mobility;
  mobility.SetPositionAllocator("ns3::GridPositionAllocator",
                                "MinX",
                                DoubleValue(0.0),
                                "MinY",
                                DoubleValue(0.0),
                                "DeltaX",
                                DoubleValue(m_step),
                                "DeltaY",
                                DoubleValue(m_step),
                                "GridWidth",
                                UintegerValue(m_xSize),
                                "LayoutType",
                                StringValue("RowFirst"));
  mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
  mobility.Install(m_nodes);

  if (m_pcap)
  {
    wifiPhy.EnablePcapAll(std::string("mp"));
  }
  if (m_ascii)
  {
    AsciiTraceHelper ascii;
    wifiPhy.EnableAsciiAll(ascii.CreateFileStream("mesh.tr"));
  }
  if (m_enableAnimation)
  {
    m_animation = std::make_unique<AnimationInterface>(m_animFile);
    m_animation->SetMobilityPollInterval(Seconds(1.0));
    m_animation->SetStartTime(Seconds(0));
    m_animation->SetStopTime(Seconds(m_totalTime + 2));
    m_animation->EnablePacketMetadata(true);
    for (uint32_t i = 0; i < m_nodes.GetN(); ++i)
    {
      std::ostringstream label;
      label << "Node " << i;
      m_animation->UpdateNodeDescription(m_nodes.Get(i), label.str());
      m_animation->UpdateNodeColor(m_nodes.Get(i), 0, 0, 255);
    }
    if (m_nodes.GetN() > 0)
    {
      m_animation->UpdateNodeDescription(m_nodes.Get(0), "Client");
      m_animation->UpdateNodeColor(m_nodes.Get(0), 0, 255, 0);
    }
    if (m_nodes.GetN() > 1)
    {
      uint32_t last = m_nodes.GetN() - 1;
      m_animation->UpdateNodeDescription(m_nodes.Get(last), "Server");
      m_animation->UpdateNodeColor(m_nodes.Get(last), 255, 0, 0);
    }
    std::cout << "Animation trace written to " << m_animFile << " (open with NetAnim)." << std::endl;
  }
}

void
MeshTest::InstallInternetStack()
{
  InternetStackHelper internetStack;
  internetStack.Install(m_nodes);
  Ipv4AddressHelper address;
  address.SetBase("10.1.1.0", "255.255.255.0");
  m_interfaces = address.Assign(m_meshDevices);
}

void
MeshTest::InstallApplication()
{
  uint16_t portNumber = 9;
  UdpEchoServerHelper echoServer(portNumber);
  uint32_t sinkNodeId = m_xSize * m_ySize - 1;
  ApplicationContainer serverApps = echoServer.Install(m_nodes.Get(sinkNodeId));
  serverApps.Start(Seconds(1.0));
  serverApps.Stop(Seconds(m_totalTime + 1));

  UdpEchoClientHelper echoClient(m_interfaces.GetAddress(sinkNodeId), portNumber);
  echoClient.SetAttribute("MaxPackets",
                          UintegerValue(static_cast<uint32_t>(m_totalTime / m_packetInterval)));
  echoClient.SetAttribute("Interval", TimeValue(Seconds(m_packetInterval)));
  echoClient.SetAttribute("PacketSize", UintegerValue(m_packetSize));

  ApplicationContainer clientApps = echoClient.Install(m_nodes.Get(0));
  Ptr<UdpEchoClient> app = clientApps.Get(0)->GetObject<UdpEchoClient>();
  app->TraceConnectWithoutContext("Tx", MakeCallback(&TxTrace));
  app->TraceConnectWithoutContext("Rx", MakeCallback(&RxTrace));
  clientApps.Start(Seconds(1.0));
  clientApps.Stop(Seconds(m_totalTime + 1.5));
}

void
MeshTest::SetupSequentialChain()
{
  m_forwardTargets.clear();
  m_nodeIdToIndex.clear();
  m_seqSockets.clear();

  for (uint32_t i = 0; i < m_nodes.GetN(); ++i)
  {
    m_forwardTargets.push_back(m_interfaces.GetAddress(i));
    m_nodeIdToIndex.emplace(m_nodes.Get(i)->GetId(), i);

    Ptr<Socket> socket = Socket::CreateSocket(m_nodes.Get(i), UdpSocketFactory::GetTypeId());
    socket->Bind(InetSocketAddress(Ipv4Address::GetAny(), m_seqPort));
    socket->SetRecvCallback(MakeCallback(&MeshTest::SequentialForwardReceive, this));
    m_seqSockets.push_back(socket);
  }
}

void
MeshTest::SequentialForwardReceive(Ptr<Socket> socket)
{
  Address from;
  while (Ptr<Packet> packet = socket->RecvFrom(from))
  {
    uint32_t nodeId = socket->GetNode()->GetId();
    auto it = m_nodeIdToIndex.find(nodeId);
    if (it == m_nodeIdToIndex.end())
    {
      continue;
    }
    uint32_t index = it->second;
    std::vector<uint8_t> buffer(packet->GetSize());
    packet->CopyData(buffer.data(), buffer.size());
    std::string data(buffer.begin(), buffer.end());
    std::cout << "Sequential hop " << index << " (node " << nodeId << ") received "
              << packet->GetSize() << " bytes payload=\"" << data << "\"" << std::endl;

    if (index + 1 < m_forwardTargets.size())
    {
      Ptr<Packet> forwardPacket = packet->Copy();
      InetSocketAddress next(m_forwardTargets[index + 1], m_seqPort);
      Simulator::Schedule(Seconds(m_seqGap),
                          [socket, forwardPacket, next]() { socket->SendTo(forwardPacket, 0, next); });
    }
    else
    {
      std::cout << "Sequential packet reached final node (index " << index << ")." << std::endl;
    }
  }
}

void
MeshTest::StartSequentialChain(Ptr<Packet> packet)
{
  if (m_seqSockets.empty() || m_forwardTargets.size() < 2)
  {
    return;
  }
  std::cout << "Starting sequential packet chain across mesh nodes with payload=\""
            << m_seqPayload << "\"" << std::endl;
  InetSocketAddress firstHop(m_forwardTargets[1], m_seqPort);
  m_seqSockets[0]->SendTo(packet->Copy(), 0, firstHop);
}

void
MeshTest::Report()
{
  unsigned n = 0;
  for (auto i = m_meshDevices.Begin(); i != m_meshDevices.End(); ++i, ++n)
  {
    std::ostringstream os;
    os << "mp-report-" << n << ".xml";
    std::cerr << "Printing mesh point device #" << n << " diagnostics to " << os.str() << "\n";
    std::ofstream of;
    of.open(os.str().c_str());
    if (!of.is_open())
    {
      std::cerr << "Error: Can't open file " << os.str() << "\n";
      return;
    }
    m_mesh.Report(*i, of);
    of.close();
  }
}

int
MeshTest::Run()
{
  PacketMetadata::Enable();
  CreateNodes();
  InstallInternetStack();
  InstallApplication();
  SetupSequentialChain();

  Ptr<Packet> initialPacket = Create<Packet>(
      reinterpret_cast<const uint8_t*>(m_seqPayload.c_str()), m_seqPayload.size());
  Simulator::Schedule(Seconds(3.0), &MeshTest::StartSequentialChain, this, initialPacket);

  Simulator::Schedule(Seconds(m_totalTime), &MeshTest::Report, this);
  Simulator::Stop(Seconds(m_totalTime + 2));
  Simulator::Run();
  Simulator::Destroy();
  std::cout << "UDP echo packets sent: " << g_udpTxCount << " received: " << g_udpRxCount
            << std::endl;
  return 0;
}

int
main(int argc, char* argv[])
{
  MeshTest t;
  t.Configure(argc, argv);
  return t.Run();
}
