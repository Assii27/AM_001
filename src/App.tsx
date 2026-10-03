import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AnimatedArchitectureDiagram } from './components/AnimatedArchitectureDiagram';
import { CopilotVsMcpDeepDive } from './components/CopilotVsMcpDeepDive';
import { SpringBootCodeSandbox } from './components/SpringBootCodeSandbox';
import { InterviewMaster } from './components/InterviewMaster';
import { SecurityGuardrails } from './components/SecurityGuardrails';
import { Cpu, Github, ExternalLink, ArrowRight, BookOpen, Terminal, ShieldCheck, Sparkles, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'comparison' | 'code' | 'interview' | 'security'>('diagram');

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Switch tabs with Alt + 1..5
      if (e.altKey && e.key === '1') setActiveTab('diagram');
      if (e.altKey && e.key === '2') setActiveTab('comparison');
      if (e.altKey && e.key === '3') setActiveTab('code');
      if (e.altKey && e.key === '4') setActiveTab('interview');
      if (e.altKey && e.key === '5') setActiveTab('security');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'diagram' && <AnimatedArchitectureDiagram />}
        {activeTab === 'comparison' && <CopilotVsMcpDeepDive />}
        {activeTab === 'code' && <SpringBootCodeSandbox />}
        {activeTab === 'interview' && <InterviewMaster />}
        {activeTab === 'security' && <SecurityGuardrails />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">
              Spring Boot + Spring AI + MCP + GitHub Copilot
            </span>
            <span className="text-slate-600">|</span>
            <span>Senior Architectural Guide</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('diagram')}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              Interactive Diagrams
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              Interview Talk Track
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className="hover:text-indigo-400 transition cursor-pointer"
            >
              PCI-DSS Guardrails
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
