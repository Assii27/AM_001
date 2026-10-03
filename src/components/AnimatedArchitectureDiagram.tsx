import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  User,
  Cpu,
  Terminal,
  Layers,
  Database,
  DatabaseZap,
  ExternalLink,
  Code2,
  Copy,
  Check,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { ARCHITECTURE_NODES, FLOW_SCENARIOS } from '../data/architectureData';
import { ArchitectureNode, FlowStep, ScenarioId } from '../types';

export const AnimatedArchitectureDiagram: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<ScenarioId>('mcp-incident');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 to 1 for smooth particle animation

  const scenario = FLOW_SCENARIOS.find((s) => s.id === selectedScenarioId) || FLOW_SCENARIOS[0];
  const currentStep: FlowStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  // Animation loop for particle position and auto-advancement
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const stepDurationMs = 3800 / playbackSpeed;

  useEffect(() => {
    // Reset step when scenario changes
    setCurrentStepIndex(0);
    setProgress(0);
    setIsPlaying(true);
  }, [selectedScenarioId]);

  useEffect(() => {
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      if (!startTime) startTime = time;

      if (isPlaying) {
        const elapsed = time - startTime;
        const currentProgress = Math.min(elapsed / stepDurationMs, 1);
        setProgress(currentProgress);

        if (elapsed >= stepDurationMs) {
          // Advance to next step
          setCurrentStepIndex((prev) => {
            if (prev >= scenario.steps.length - 1) {
              return 0; // loop
            }
            return prev + 1;
          });
          startTime = time;
          setProgress(0);
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, stepDurationMs, scenario.steps.length, currentStepIndex]);

  const handleNextStep = () => {
    setProgress(0);
    setCurrentStepIndex((prev) => (prev < scenario.steps.length - 1 ? prev + 1 : 0));
  };

  const handlePrevStep = () => {
    setProgress(0);
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : scenario.steps.length - 1));
  };

  const handleReset = () => {
    setProgress(0);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const copyPayload = () => {
    if (!currentStep.payload) return;
    const text =
      typeof currentStep.payload.content === 'object'
        ? JSON.stringify(currentStep.payload.content, null, 2)
        : currentStep.payload.content;
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Node icon helper
  const renderNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'User':
        return <User className="w-5 h-5 text-sky-400" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-pink-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-400" />;
      case 'DatabaseZap':
        return <DatabaseZap className="w-5 h-5 text-teal-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-rose-400" />;
      default:
        return <ExternalLink className="w-5 h-5 text-slate-400" />;
    }
  };

  // Coordinates resolution
  const getNode = (id: string) => ARCHITECTURE_NODES.find((n) => n.id === id);
  const senderNode = getNode(currentStep.senderNodeId);
  const receiverNode = getNode(currentStep.receiverNodeId);

  // Compute curved path between sender and receiver in SVG viewBox 0 0 1000 600
  const getPathCoords = (sNode?: ArchitectureNode, rNode?: ArchitectureNode) => {
    if (!sNode || !rNode) return { pathD: '', packetX: 0, packetY: 0 };
    const sx = (sNode.x / 100) * 1000;
    const sy = (sNode.y / 100) * 600;
    const rx = (rNode.x / 100) * 1000;
    const ry = (rNode.y / 100) * 600;

    const dx = rx - sx;
    const dy = ry - sy;
    // Cubic bezier control points with curved arc
    const cx1 = sx + dx * 0.5;
    const cy1 = sy - (Math.abs(dx) > 100 ? 50 : 20);
    const cx2 = sx + dx * 0.5;
    const cy2 = ry + (Math.abs(dx) > 100 ? 20 : -20);

    const pathD = `M ${sx} ${sy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${rx} ${ry}`;

    // Approximate point along cubic bezier at parameter t = progress
    const t = progress;
    const px =
      Math.pow(1 - t, 3) * sx +
      3 * Math.pow(1 - t, 2) * t * cx1 +
      3 * (1 - t) * Math.pow(t, 2) * cx2 +
      Math.pow(t, 3) * rx;
    const py =
      Math.pow(1 - t, 3) * sy +
      3 * Math.pow(1 - t, 2) * t * cy1 +
      3 * (1 - t) * Math.pow(t, 2) * cy2 +
      Math.pow(t, 3) * ry;

    return { pathD, packetX: px, packetY: py };
  };

  const activePath = getPathCoords(senderNode, receiverNode);

  return (
    <div className="space-y-6">
      {/* Scenario Switcher & Global Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                Interactive Architecture Simulation
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Step {currentStepIndex + 1} of {scenario.steps.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
              {scenario.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 max-w-3xl">
              {scenario.description}
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start lg:self-center">
            {FLOW_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenarioId(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedScenarioId === s.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {s.name.split(' ')[0]} {s.name.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Diagram Area with Animated Canvas & SVG */}
      <div className="relative bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Background Grid & Architectural Zones */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Zone Labels */}
        <div className="absolute top-3 left-4 text-[10px] uppercase font-bold tracking-wider text-sky-400/70 border-b border-sky-500/20 pb-0.5 pointer-events-none">
          Zone 1: Developer & Copilot (Build-Time)
        </div>
        <div className="absolute bottom-3 left-4 text-[10px] uppercase font-bold tracking-wider text-purple-400/70 border-b border-purple-500/20 pb-0.5 pointer-events-none">
          Zone 2: AI Orchestrator & MCP Client (Query-Time)
        </div>
        <div className="absolute top-3 right-48 text-[10px] uppercase font-bold tracking-wider text-emerald-400/70 border-b border-emerald-500/20 pb-0.5 pointer-events-none">
          Zone 3: Spring Boot 3 Payment Microservice (Deterministic)
        </div>
        <div className="absolute bottom-3 right-4 text-[10px] uppercase font-bold tracking-wider text-rose-400/70 border-b border-rose-500/20 pb-0.5 pointer-events-none">
          Zone 4: Payment DB & External Tools
        </div>

        {/* SVG Overlay for Connections & Traveling Particle */}
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-[460px] sm:h-[540px] block select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="heavyGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Static Background Connection Architecture Wireframe */}
          <g stroke="#334155" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.4" fill="none">
            {/* Developer -> Copilot */}
            <path d="M 120 120 L 350 120" />
            {/* Developer -> AI Assistant */}
            <path d="M 120 120 C 100 240, 100 320, 120 390" />
            {/* AI Assistant -> MCP Client */}
            <path d="M 120 390 L 350 390" />
            {/* MCP Client -> MCP Server */}
            <path d="M 350 390 L 620 390" />
            {/* MCP Server -> Spring Service */}
            <path d="M 620 390 L 620 120" />
            {/* Copilot -> Spring Service */}
            <path d="M 350 120 L 620 120" />
            {/* Spring Service -> JPA Repository */}
            <path d="M 620 120 L 850 210" />
            {/* JPA Repository -> Database */}
            <path d="M 850 210 L 880 390" />
            {/* MCP Server -> Database */}
            <path d="M 620 390 L 880 390" />
            {/* MCP Server -> External Tools */}
            <path d="M 620 390 C 560 480, 520 520, 480 550" />
          </g>

          {/* Active Flow Path */}
          {activePath.pathD && (
            <g>
              {/* Outer Glow */}
              <path
                d={activePath.pathD}
                fill="none"
                stroke={currentStep.packetColor}
                strokeWidth="8"
                opacity="0.25"
                filter="url(#glow)"
              />
              {/* Core Flow Line */}
              <path
                d={activePath.pathD}
                fill="none"
                stroke={currentStep.packetColor}
                strokeWidth="3"
                strokeDasharray="6 6"
                className="animate-[dash_1s_linear_infinite]"
              />

              {/* Traveling Packet Orb */}
              <g
                transform={`translate(${activePath.packetX}, ${activePath.packetY})`}
                filter="url(#heavyGlow)"
              >
                <circle r="14" fill={currentStep.packetColor} opacity="0.2" />
                <circle r="9" fill={currentStep.packetColor} opacity="0.6" />
                <circle r="5" fill="#ffffff" />
                <text
                  y="-18"
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="11"
                  fontWeight="bold"
                  className="tracking-wide"
                  style={{
                    paintOrder: 'stroke',
                    stroke: '#020617',
                    strokeWidth: 3,
                    strokeLinejoin: 'round',
                  }}
                >
                  {currentStep.packetLabel}
                </text>
              </g>
            </g>
          )}

          {/* Render Nodes as SVG Groups so they align with coordinates */}
          {ARCHITECTURE_NODES.map((node) => {
            const isSender = node.id === currentStep.senderNodeId;
            const isReceiver = node.id === currentStep.receiverNodeId;
            const isHighlighted = isSender || isReceiver;

            const nx = (node.x / 100) * 1000;
            const ny = (node.y / 100) * 600;

            return (
              <g
                key={node.id}
                transform={`translate(${nx}, ${ny})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-105"
                onClick={() => setSelectedNode(node)}
              >
                {/* Node Glow if Active */}
                {isHighlighted && (
                  <circle
                    r="44"
                    fill={isSender ? '#38bdf8' : '#a855f7'}
                    opacity="0.25"
                    filter="url(#glow)"
                    className="animate-pulse"
                  />
                )}

                {/* Base Node Card Background */}
                <rect
                  x="-90"
                  y="-42"
                  width="180"
                  height="84"
                  rx="14"
                  fill="#0f172a"
                  stroke={
                    isSender
                      ? '#38bdf8'
                      : isReceiver
                      ? '#a855f7'
                      : '#334155'
                  }
                  strokeWidth={isHighlighted ? '2.5' : '1.2'}
                  filter="drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6))"
                />

                {/* Badge Tag */}
                {node.badge && (
                  <g transform="translate(-80, -32)">
                    <rect
                      width="80"
                      height="14"
                      rx="4"
                      fill={
                        node.category === 'developer'
                          ? '#0284c7'
                          : node.category === 'ai-orchestration'
                          ? '#7c3aed'
                          : node.category === 'spring-boot'
                          ? '#059669'
                          : '#e11d48'
                      }
                      opacity="0.3"
                    />
                    <text
                      x="40"
                      y="10.5"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="8.5"
                      fontWeight="bold"
                    >
                      {node.badge}
                    </text>
                  </g>
                )}

                {/* Role Status Tag */}
                {isSender && (
                  <g transform="translate(18, -32)">
                    <rect width="62" height="14" rx="4" fill="#0284c7" opacity="0.9" />
                    <text x="31" y="10" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      SENDER
                    </text>
                  </g>
                )}
                {isReceiver && (
                  <g transform="translate(14, -32)">
                    <rect width="66" height="14" rx="4" fill="#9333ea" opacity="0.9" />
                    <text x="33" y="10" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                      RECEIVER
                    </text>
                  </g>
                )}

                {/* Node Title & Subtitle */}
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12.5"
                  fontWeight="bold"
                  letterSpacing="-0.2"
                >
                  {node.title}
                </text>
                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                >
                  {node.subtitle}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Player Control Bar at Bottom of Canvas */}
        <div className="border-t border-slate-800 bg-slate-900/95 backdrop-blur-md p-3 sm:p-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Controls: Prev, Play/Pause, Next, Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Previous Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Flow</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextStep}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Next Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Playback speed */}
            <div className="flex items-center gap-1 ml-2 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Speed:</span>
              {[0.5, 1, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-semibold cursor-pointer ${
                    playbackSpeed === spd ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Step Breadcrumb Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {scenario.steps.map((st, idx) => (
              <button
                key={st.id}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  setProgress(0);
                }}
                className={`flex items-center justify-center h-7 px-2.5 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentStepIndex === idx
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                    : idx < currentStepIndex
                    ? 'bg-slate-800/90 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                <span>{idx + 1}</span>
                {idx < currentStepIndex && <Check className="w-3 h-3 ml-1 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Step Detail Explanation & Payload Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Step Explanation Card (2 cols on lg) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs border border-indigo-500/30">
                {currentStepIndex + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {currentStep.title}
                </h3>
                <p className="text-xs text-slate-400">
                  From <strong className="text-sky-400">{currentStep.sender}</strong> → to <strong className="text-purple-400">{currentStep.receiver}</strong>
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-800 text-indigo-300 border border-indigo-500/20">
              {currentStep.protocol}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {currentStep.description}
            </p>

            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800/80 flex items-start gap-3">
              <div className="p-1 rounded bg-indigo-500/10 text-indigo-400 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white block mb-0.5">Architectural Insight:</span>
                {currentStep.explanation}
              </div>
            </div>
          </div>
        </div>

        {/* Live Payload Inspector (1 col on lg) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {currentStep.payload?.type || 'Wire Frame Payload'}
              </h4>
            </div>

            {currentStep.payload && (
              <button
                onClick={copyPayload}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                title="Copy Payload"
              >
                {copiedPayload ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="mt-3 flex-1">
            {currentStep.payload ? (
              <pre className="text-[11px] font-mono text-emerald-300/90 bg-slate-950 p-3 rounded-xl border border-slate-800/90 overflow-x-auto max-h-56 leading-relaxed">
                {typeof currentStep.payload.content === 'object'
                  ? JSON.stringify(currentStep.payload.content, null, 2)
                  : currentStep.payload.content}
              </pre>
            ) : (
              <div className="text-xs text-slate-500 italic p-4 text-center">
                Standard in-memory Java execution or IDE local prompt.
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Transport: <strong className="text-slate-200">{currentStep.protocol}</strong></span>
            <span className="text-emerald-400 font-medium">✓ PCI Compliant</span>
          </div>
        </div>

      </div>

      {/* Node Inspector Modal/Drawer (When clicking on any architecture node) */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                  {renderNodeIcon(selectedNode.icon)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedNode.title}</h3>
                  <p className="text-xs font-mono text-indigo-400">{selectedNode.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Architecture Tier:</span>
                <span className="text-white font-semibold uppercase">{selectedNode.category}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Direct DB Connection:</span>
                <span className={selectedNode.id === 'database' || selectedNode.id === 'spring-repo' ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                  {selectedNode.id === 'database' || selectedNode.id === 'spring-repo' ? 'Permitted (JPA Only)' : 'BLOCKED (Strict PCI Isolation)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>AI Execution Role:</span>
                <span className="text-indigo-300 font-semibold">
                  {selectedNode.id === 'copilot'
                    ? 'Code Synthesis in IDE'
                    : selectedNode.id === 'mcp-server'
                    ? 'Spring AI @McpTool Provider'
                    : selectedNode.id === 'spring-service'
                    ? 'Deterministic Java Business Rules'
                    : 'System Component'}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
