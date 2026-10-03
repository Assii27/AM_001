import React from 'react';
import { Cpu, Bot, Layers, Sparkles, BookOpen, ShieldCheck, Terminal } from 'lucide-react';

interface HeaderProps {
  activeTab: 'diagram' | 'comparison' | 'code' | 'interview' | 'security';
  setActiveTab: (tab: 'diagram' | 'comparison' | 'code' | 'interview' | 'security') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  Spring Boot <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">Copilot & MCP</span> Architecture
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Java 21 + Spring AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive data-flow diagrams, Spring Boot 3 code integration & senior interview answers
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'diagram'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Animated Data Flow</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Copilot vs MCP</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Code & MCP Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'interview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interview Master</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Security Guardrails</span>
            </button>
          </nav>

        </div>

        {/* Quick Memory Banner */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <span className="text-indigo-400">💡 Quick Memory Trick:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <strong>Copilot</strong> → Helps ME write code
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              <strong>Spring Boot</strong> → Runs MY app
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              <strong>MCP</strong> → Gives AI controlled TOOLS
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <strong>LLM</strong> → Understands user requests
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
              <strong>Database</strong> → Stores payment data
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
