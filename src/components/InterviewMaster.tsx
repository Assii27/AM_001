import React, { useState } from 'react';
import {
  BookOpen,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Volume2,
  Zap,
} from 'lucide-react';
import { INTERVIEW_CARDS } from '../data/architectureData';
import { InterviewCard } from '../types';

export const InterviewMaster: React.FC = () => {
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [expandedCardId, setExpandedCardId] = useState<string>('core-distinction');
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'architecture' | 'security' | 'comparison'>('all');

  const fullInterviewPitch = `In my Java payment project, I use GitHub Copilot mainly during development for developer productivity—such as generating Spring Boot boilerplate code, JUnit 5 and Mockito tests, SQL queries, documentation, and assisting with debugging.

For MCP, I expose selected business capabilities as controlled tools. In a payment application, for example, I can create an MCP tool like getTransaction() or getTransactionStatus(). An AI assistant can call these tools through MCP instead of directly accessing the database.

The normal payment processing, idempotency validation, and duplicate detection remain deterministic Java business logic in Spring Boot. MCP is only the controlled integration layer between the AI assistant and external tools or application capabilities.`;

  const copyPitch = () => {
    navigator.clipboard.writeText(fullInterviewPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const filteredCards =
    activeFilter === 'all'
      ? INTERVIEW_CARDS
      : INTERVIEW_CARDS.filter((c) => c.category === activeFilter);

  const safeVsRisky = [
    {
      risky: 'We let the AI query the database to find failed transactions.',
      safe: 'We expose only read-only Spring Boot tools through MCP. The AI never has direct JDBC or network access to the database credentials.',
      why: 'PCI-DSS and security audits strictly forbid unconstrained AI access to database connections.',
    },
    {
      risky: 'We use the MCP model to understand logs.',
      safe: 'MCP is not a model—it is a standardized protocol. We use our enterprise-approved LLM which communicates over MCP to invoke our Spring tools.',
      why: 'Calling MCP a "model" immediately signals to interviewers that you lack fundamental protocol understanding.',
    },
    {
      risky: 'AI makes decisions on duplicate payments.',
      safe: 'Payment authorization, fraud rules, and duplicate detection remain 100% deterministic Java code. AI is strictly used as an investigative assistance layer.',
      why: 'Financial ledgers cannot tolerate non-deterministic, probabilistic AI decision-making for transaction clearance.',
    },
    {
      risky: 'We use Server-Sent Events (SSE) for all MCP endpoints.',
      safe: 'Modern Spring AI documentation recommends Streamable HTTP for HTTP-based MCP transport; SSE is deprecated in favor of Streamable HTTP.',
      why: 'Shows deep, up-to-date knowledge of the latest Spring AI 1.0 specifications.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            Senior Java 21 / Payment Switch
          </span>
          <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
            Senior Interview Master & Talk Track
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Curated by <strong className="text-white">Asif Maner</strong> (<a href="mailto:dev.asifmaner@gmail.com" className="text-indigo-400 hover:underline">dev.asifmaner@gmail.com</a>) for high-stakes system design and architecture interviews.
          </p>
        </div>
        <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs shrink-0 self-start md:self-center">
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Developer</span>
          <span className="font-semibold text-white">Asif Maner</span>
          <span className="text-indigo-400 text-[11px] block font-mono">dev.asifmaner@gmail.com</span>
        </div>
      </div>

      {/* The Gold-Standard Interview Pitch Card */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-slate-900 to-purple-950/40 border border-indigo-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-indigo-500/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                The Memorized 30-Second Interview Answer
              </h3>
              <p className="text-xs text-indigo-300">
                Recommended by principal engineers for Java 21 / Payment Switch roles
              </p>
            </div>
          </div>

          <button
            onClick={copyPitch}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-lg shadow-indigo-600/30 cursor-pointer shrink-0"
          >
            {copiedPitch ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Word-for-Word Pitch</span>
              </>
            )}
          </button>
        </div>

        {/* The Pitch Speech Block */}
        <div className="mt-4 p-5 bg-slate-950/80 rounded-xl border border-slate-800 text-sm sm:text-base text-slate-200 leading-relaxed font-sans italic relative">
          <div className="text-indigo-400/40 text-4xl font-serif absolute top-2 left-2 pointer-events-none select-none">
            “
          </div>
          <p className="relative z-10 pl-4">
            In my Java payment project, I use <strong>GitHub Copilot</strong> mainly during development for developer productivity—such as generating Spring Boot boilerplate code, JUnit 5 and Mockito tests, SQL queries, and assisting with debugging.
          </p>
          <p className="relative z-10 pl-4 mt-3">
            For <strong>MCP</strong>, I expose selected business capabilities as controlled tools. In a payment application, for example, I can create an MCP tool like <code>getTransaction()</code> or <code>getTransactionStatus()</code>. An AI assistant can call these tools through MCP instead of directly accessing the database.
          </p>
          <p className="relative z-10 pl-4 mt-3">
            The normal payment processing, idempotency validation, and duplicate detection remain <strong>deterministic Java business logic</strong> in Spring Boot. MCP is only the controlled integration layer between the AI assistant and external tools.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-indigo-300">
            <Zap className="w-3.5 h-3.5" />
            <span>Pacing Tip: Speak steadily, emphasize "developer productivity" for Copilot and "controlled tools" for MCP.</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
            ✓ 100% Safe Financial Architecture
          </span>
        </div>
      </div>

      {/* Safe vs Risky Phrasing (The Senior Engineer Filter) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Safe vs. Red-Flag Phrases in Payment & Banking Interviews
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          In banking and payment switch interviews, saying the wrong buzzword can fail the round. Here is how to speak safely:
        </p>

        <div className="space-y-3 mt-4">
          {safeVsRisky.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Risky */}
              <div className="space-y-1.5 p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider text-[11px]">
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>Red Flag (Never Say This):</span>
                </div>
                <p className="text-rose-200/90 font-mono text-[11.5px] leading-relaxed">
                  "{item.risky}"
                </p>
                <p className="text-slate-400 text-[10.5px] pt-1 border-t border-rose-900/20">
                  ⚠️ {item.why}
                </p>
              </div>

              {/* Safe */}
              <div className="space-y-1.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Senior & Safe (Say This):</span>
                </div>
                <p className="text-emerald-200/90 font-medium leading-relaxed">
                  "{item.safe}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion / Flashcards for Key Questions */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Essential Senior Q&A Flashcards
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click to expand model answers, senior traps, and golden quotes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {(['all', 'core', 'architecture', 'security', 'comparison'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-950 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredCards.map((card) => {
            const isExpanded = expandedCardId === card.id;

            return (
              <div
                key={card.id}
                className={`border rounded-xl transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-950/90 border-indigo-500/50 shadow-md'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setExpandedCardId(isExpanded ? '' : card.id)}
                  className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-indigo-300 border border-slate-700">
                      {card.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {card.question}
                    </h4>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-slate-800/80 space-y-3.5 text-xs">
                    {/* Short Answer */}
                    <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/40">
                      <span className="font-bold text-indigo-300 block mb-1">Quick Answer (30s):</span>
                      <p className="text-slate-200 leading-relaxed font-sans">{card.shortAnswer}</p>
                    </div>

                    {/* Deep Explanation */}
                    <div>
                      <span className="font-bold text-slate-300 block mb-1">In-Depth Architecture Details:</span>
                      <p className="text-slate-400 leading-relaxed">{card.deepExplanation}</p>
                    </div>

                    {/* Golden Quote & Trap */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                          ⭐ Golden Quote to Memorize
                        </span>
                        <p className="text-emerald-200/90 font-medium italic">{card.goldenQuote}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">
                          ⚠️ Watch Out For This Trap
                        </span>
                        <p className="text-rose-200/90">{card.interviewTrap}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
