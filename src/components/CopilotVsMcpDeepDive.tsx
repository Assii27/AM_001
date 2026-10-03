import React, { useState } from 'react';
import {
  Bot,
  Cpu,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileCode,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const CopilotVsMcpDeepDive: React.FC = () => {
  const [activeView, setActiveView] = useState<'matrix' | 'rest-vs-mcp' | 'memory-trick'>('matrix');

  const matrixData = [
    {
      feature: 'Core Definition',
      copilot: 'Developer coding partner & generative AI assistant in the IDE.',
      mcp: 'Open standard protocol (JSON-RPC) allowing AI agents to call controlled tools & inspect resources.',
      badge: 'Definition',
    },
    {
      feature: 'Primary User',
      copilot: 'The Human Developer writing Java / Spring Boot code in IntelliJ or VS Code.',
      mcp: 'The AI Assistant / Autonomous Agent or SRE performing runtime investigations.',
      badge: 'Audience',
    },
    {
      feature: 'When it Operates',
      copilot: 'Build-time & Development-time (while typing or refactoring).',
      mcp: 'Runtime (while diagnosing production incidents or auditing systems).',
      badge: 'Lifecycle',
    },
    {
      feature: 'Access to Data',
      copilot: 'Reads local open files, project repository, and developer prompts.',
      mcp: 'Accesses only explicitly exposed, authenticated tools (@McpTool) over Streamable HTTP/stdio.',
      badge: 'Access',
    },
    {
      feature: 'Payment Domain Role',
      copilot: 'Generates TransactionService boilerplate, JUnit 5/Mockito tests, and SQL queries.',
      mcp: 'Exposes getTransaction(), getStatus(), and Kafka logs to let an AI triage failed transactions.',
      badge: 'Payment Switch',
    },
    {
      feature: 'Decision Authority',
      copilot: 'None (developer reviews, edits, and commits the code).',
      mcp: 'None (payment processing and duplicate detection remain deterministic Java business logic).',
      badge: 'Safety',
    },
  ];

  const copilotUseCases = [
    { task: 'Java Code', how: 'Generate / rewrite code', example: 'Create TransactionService & constructor injection' },
    { task: 'Unit Tests', how: 'Generate JUnit 5 + Mockito tests', example: 'Test duplicate transaction idempotency & exceptions' },
    { task: 'Debugging', how: 'Explain complex error logs', example: 'Diagnose Kafka consumer group rebalance exception' },
    { task: 'SQL & JPA', how: 'Generate optimized queries', example: 'Find transactions failing within 3DS authorization window' },
    { task: 'Documentation', how: 'Generate JavaDoc / README', example: 'Document Payment Switch ISO-8583 message parsing flow' },
    { task: 'Refactoring', how: 'Suggest cleaner patterns', example: 'Extract validation strategy from large payment orchestrator' },
  ];

  const mcpUseCases = [
    { tool: 'getTransaction(id)', purpose: 'Safely fetch status, amount, and decline reason without raw DB credentials.' },
    { tool: 'getApplicationLogs(time)', purpose: 'Fetch sanitized error logs for a specific payment trace ID.' },
    { tool: 'getJiraIssue(issueId)', purpose: 'Correlate production errors with active bug tickets or switch maintenance windows.' },
    { tool: 'getDeploymentInfo()', purpose: 'Verify if the payment switch cluster had a recent release or config change.' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & View Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
              Architecture Distinction
            </span>
            <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
              GitHub Copilot vs Model Context Protocol (MCP)
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Understand the clear separation of concerns between developer code generation and runtime tool execution in a Java 21 Spring Boot payment switch.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-center">
            <button
              onClick={() => setActiveView('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Comparison Matrix
            </button>
            <button
              onClick={() => setActiveView('rest-vs-mcp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'rest-vs-mcp'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Why MCP vs REST?
            </button>
            <button
              onClick={() => setActiveView('memory-trick')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeView === 'memory-trick'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              The Memory Trick
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: Matrix View */}
      {activeView === 'matrix' && (
        <div className="space-y-6">
          {/* Quick Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Copilot Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">GitHub Copilot</h3>
                  <p className="text-xs text-indigo-300 font-mono">Coding Assistant (Build-Time)</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                "In my Java payment project, I use Copilot mainly for developer productivity: generating boilerplate code, JUnit/Mockito tests, and SQL queries."
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Generates TransactionService & Exception handler boilerplate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Writes JUnit 5 & Mockito tests for duplicate transaction detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Explains cryptic Kafka consumer and circuit breaker stack traces</span>
                </li>
              </ul>
            </div>

            {/* MCP Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Model Context Protocol (MCP)</h3>
                  <p className="text-xs text-purple-300 font-mono">Tool Integration Layer (Runtime)</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                "MCP is useful when an AI assistant needs controlled access to external tools or systems (Jira, logs, DB lookup) without direct unrestricted credentials."
              </div>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Exposes Spring Boot methods via @McpTool annotations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>AI queries getTransaction("TXN1001") instead of raw database queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Enforces data masking (PAN/CVV) before returning data to LLM</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Deep Feature Comparison Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Full Technical Comparison Matrix
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                Java 21 / Spring Boot 3 / Payment Switch
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 w-1/4">Aspect</th>
                    <th className="py-3 px-4 sm:px-6 w-3/8 text-indigo-300">GitHub Copilot</th>
                    <th className="py-3 px-4 sm:px-6 w-3/8 text-purple-300">Model Context Protocol (MCP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 text-slate-300">
                  {matrixData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-white flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                          {item.badge}
                        </span>
                        <span>{item.feature}</span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 leading-relaxed text-slate-200">
                        {item.copilot}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 leading-relaxed text-slate-200">
                        {item.mcp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Practical Use Case Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Copilot Payment Tasks */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">
                  Copilot in Payment Switch Development
                </h4>
              </div>
              <div className="space-y-2.5">
                {copilotUseCases.map((uc, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <span className="font-semibold text-indigo-300 block">{uc.task}</span>
                      <span className="text-slate-400">{uc.how}</span>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-900/40 text-right">
                      {uc.example}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* MCP Controlled Tools */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white">
                  MCP Controlled Tools in Incident Triage
                </h4>
              </div>
              <div className="space-y-2.5">
                {mcpUseCases.map((mc, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-semibold text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/40">
                        {mc.tool}
                      </span>
                      <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                        Read-Only Tool
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {mc.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Why MCP vs REST */}
      {activeView === 'rest-vs-mcp' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white">
              Why MCP When We Already Have Standard REST APIs?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              This is one of the most frequent senior architecture interview questions. Interviewers want to know if you understand protocol boundaries vs application APIs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              
              {/* REST API Box */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">Traditional REST API</h4>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                    App-to-App
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Designed for software applications and developers. Clients are statically coded with hardcoded URLs (e.g. <code className="text-amber-300">GET /api/v1/transactions/TXN1001</code>).
                </p>
                <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800/80">
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>No dynamic schema discovery protocol built into HTTP transport.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>AI agents require custom glue code to know what query parameters or payloads to format.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-slate-500 font-bold">•</span>
                    <span>No standardized conversational resource subscription or prompt templating.</span>
                  </li>
                </ul>
              </div>

              {/* MCP Protocol Box */}
              <div className="p-5 bg-slate-950 rounded-xl border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-300 text-sm">Model Context Protocol (MCP)</h4>
                  <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
                    AI-to-Tool Standard
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Standardized client-server protocol specifically designed for LLMs to safely discover, inspect, and invoke tools without prior hardcoding.
                </p>
                <ul className="text-xs space-y-2 text-slate-400 pt-2 border-t border-slate-800/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Dynamic Tool Discovery:</strong> <code className="text-purple-300">tools/list</code> returns full JSON schema specifications so any LLM knows how to call it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">JSON-RPC 2.0 Standard:</strong> Structured request & error frames with request IDs and typed responses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-200">Coexistence:</strong> REST services remain for payment switch clients; MCP acts as the dedicated AI tool adapter.</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Recommended Interview Pitch Box */}
            <div className="mt-6 p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start gap-3">
              <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                  How to Answer in the Interview:
                </span>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "REST is mainly an API interface for client applications. MCP provides a standardized way for AI applications to discover and invoke tools and resources dynamically. Our existing Spring Boot REST services can remain intact, while Spring AI's MCP starter exposes selected capabilities to an AI assistant with zero raw DB exposure."
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 3: Memory Trick */}
      {activeView === 'memory-trick' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-center max-w-4xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              The 5-Sentence Architectural Formula
            </span>
            <h3 className="text-2xl font-bold text-white mt-2">
              The Easy Memory Trick for Senior Panels
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
              Never get tongue-tied or confuse components. Memorize this 5-item breakdown:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6 text-left">
              
              <div className="p-4 bg-slate-950 rounded-xl border border-blue-500/30">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase block mb-1">1. Copilot</span>
                <p className="text-sm font-bold text-white">Helps ME write code</p>
                <p className="text-[11px] text-slate-400 mt-1">Generates tests, boilerplate & assists refactoring.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase block mb-1">2. Spring Boot</span>
                <p className="text-sm font-bold text-white">Runs MY application</p>
                <p className="text-[11px] text-slate-400 mt-1">Executes payment logic & deterministic business rules.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30">
                <span className="text-xs font-mono font-bold text-purple-400 uppercase block mb-1">3. MCP</span>
                <p className="text-sm font-bold text-white">Gives AI controlled TOOLS</p>
                <p className="text-[11px] text-slate-400 mt-1">Standard interface to query getTransaction() safely.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase block mb-1">4. LLM</span>
                <p className="text-sm font-bold text-white">Understands the REQUEST</p>
                <p className="text-[11px] text-slate-400 mt-1">Reasons about the problem & synthesizes the RCA.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/30 sm:col-span-2 lg:col-span-1">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase block mb-1">5. Database</span>
                <p className="text-sm font-bold text-white">Stores payment DATA</p>
                <p className="text-[11px] text-slate-400 mt-1">Secure financial ledger accessed only via JPA.</p>
              </div>

            </div>

            <div className="mt-8 p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center gap-3">
              <span className="text-xs text-slate-300 font-medium">
                🎯 Key Takeaway: The AI model NEVER touches the payment database directly and NEVER makes payment decisions.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
