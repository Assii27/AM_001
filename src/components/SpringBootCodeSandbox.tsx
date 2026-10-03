import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Play,
  RotateCcw,
  Terminal,
  Server,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { CODE_FILES } from '../data/architectureData';
import { CodeFile } from '../types';

export const SpringBootCodeSandbox: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('mcp-tools');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Live MCP Simulator State
  const [simTool, setSimTool] = useState<'getTransaction' | 'getTransactionStatus' | 'getFailedTransactions'>('getTransaction');
  const [txIdInput, setTxIdInput] = useState<string>('TXN1001');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simResult, setSimResult] = useState<any>(null);

  const selectedFile = CODE_FILES.find((f) => f.id === selectedFileId) || CODE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(1); // JSON-RPC Request Formed
    setSimResult(null);

    setTimeout(() => {
      setSimStep(2); // Spring AI Streamable HTTP Dispatch
    }, 700);

    setTimeout(() => {
      setSimStep(3); // Spring Service & Database Execution
    }, 1500);

    setTimeout(() => {
      setSimStep(4); // Response Delivered & LLM Synthesis
      setIsSimulating(false);

      if (simTool === 'getTransaction') {
        const isTx1001 = txIdInput === 'TXN1001';
        setSimResult({
          jsonRpcRequest: {
            jsonrpc: '2.0',
            id: 'req-' + Math.floor(Math.random() * 9000 + 1000),
            method: 'tools/call',
            params: {
              name: 'getTransaction',
              arguments: { transactionId: txIdInput },
            },
          },
          springLog: `[PaymentMcpTools] @McpTool getTransaction invoked with id: ${txIdInput}\n[TransactionService] JPA findById("${txIdInput}") executed in 4ms\n[PaymentMcpTools] Sanitizing payload (Card PAN masked)`,
          jsonRpcResponse: {
            jsonrpc: '2.0',
            id: 'req-auto',
            result: {
              content: [
                {
                  type: 'text',
                  text: isTx1001
                    ? `Transaction ID: ${txIdInput}\nCustomer ID: C101\nMerchant ID: M200\nAmount: 5000.00 USD\nStatus: FAILED\nDecline Reason: IDEMPOTENCY_KEY_COLLISION\nTimestamp: 2026-10-03T04:15:20Z`
                    : `Transaction ID: ${txIdInput}\nCustomer ID: C340\nMerchant ID: M880\nAmount: 120.50 USD\nStatus: SUCCESS\nDecline Reason: NONE\nTimestamp: 2026-10-03T04:12:00Z`,
                },
              ],
            },
          },
          llmSynthesis: isTx1001
            ? `I examined transaction ${txIdInput}. It failed with decline code 'IDEMPOTENCY_KEY_COLLISION'. The client app submitted two identical charges with the same idempotency key within 120ms. The Payment Switch safely rejected the second attempt to prevent duplicate debiting.`
            : `Transaction ${txIdInput} completed successfully for $120.50 USD. Authorization, fraud scoring, and ledger settlement all succeeded without any errors.`,
        });
      } else if (simTool === 'getTransactionStatus') {
        setSimResult({
          jsonRpcRequest: {
            jsonrpc: '2.0',
            id: 'req-' + Math.floor(Math.random() * 9000 + 1000),
            method: 'tools/call',
            params: {
              name: 'getTransactionStatus',
              arguments: { transactionId: txIdInput },
            },
          },
          springLog: `[PaymentMcpTools] getTransactionStatus invoked for ${txIdInput}`,
          jsonRpcResponse: {
            jsonrpc: '2.0',
            result: { content: [{ type: 'text', text: 'FAILED' }] },
          },
          llmSynthesis: `The current status of transaction ${txIdInput} in the payment switch is FAILED.`,
        });
      } else {
        setSimResult({
          jsonRpcRequest: {
            jsonrpc: '2.0',
            id: 'req-list',
            method: 'tools/call',
            params: { name: 'getFailedTransactions', arguments: {} },
          },
          springLog: `[PaymentMcpTools] findRecentFailedIds query returned 3 records`,
          jsonRpcResponse: {
            jsonrpc: '2.0',
            result: {
              content: [
                {
                  type: 'text',
                  text: '["TXN1001", "TXN1004_TIMEOUT", "TXN1009_INSUFFICIENT_FUNDS"]',
                },
              ],
            },
          },
          llmSynthesis: `Found 3 failed transactions in the recent monitoring window: TXN1001, TXN1004_TIMEOUT, and TXN1009_INSUFFICIENT_FUNDS. TXN1001 requires idempotency review.`,
        });
      }
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          Java 21 + Spring AI Starter
        </span>
        <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
          Spring Boot Code & Interactive MCP Tool Sandbox
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Explore actual production Spring Boot source files with <code>@McpTool</code> annotations, Streamable HTTP configuration in <code>application.yml</code>, Copilot-generated JUnit 5 Mockito tests, and test the live MCP protocol.
        </p>
      </div>

      {/* Code Explorer Section */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* File Tabs Header */}
        <div className="border-b border-slate-800 bg-slate-950 p-2 sm:p-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            {CODE_FILES.map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer whitespace-nowrap ${
                  selectedFileId === file.id
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 ${selectedFileId === file.id ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{file.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {file.language}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer shrink-0"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>
        </div>

        {/* File Meta Description */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400">Path: </span>
            <code className="text-indigo-300 font-mono">{selectedFile.path}</code>
            <p className="text-slate-400 text-xs mt-0.5">{selectedFile.description}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {selectedFile.highlights.map((h, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 text-[11px] font-mono border border-indigo-800/40">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* Code View with Line Numbers */}
        <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto max-h-[460px] scrollbar-thin">
          <pre className="text-xs sm:text-[13px] font-mono leading-relaxed text-slate-200">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>

      {/* Interactive MCP Execution Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Live MCP Protocol Execution Sandbox
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate an AI agent invoking Spring AI's Streamable HTTP MCP server in real-time.
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-center">
            Transport: STREAMABLE_HTTP (Port 8080)
          </span>
        </div>

        {/* Interactive Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Tool Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              1. Select MCP Tool (@McpTool)
            </label>
            <select
              value={simTool}
              onChange={(e) => setSimTool(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="getTransaction">getTransaction(transactionId)</option>
              <option value="getTransactionStatus">getTransactionStatus(transactionId)</option>
              <option value="getFailedTransactions">getFailedTransactions()</option>
            </select>
          </div>

          {/* Argument Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Tool Arguments (JSON-RPC params)
            </label>
            <input
              type="text"
              value={txIdInput}
              disabled={simTool === 'getFailedTransactions'}
              onChange={(e) => setTxIdInput(e.target.value)}
              placeholder="e.g. TXN1001"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 disabled:opacity-40"
            />
          </div>

          {/* Execute Button */}
          <div className="flex items-end">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-60"
            >
              {isSimulating ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Dispatching to Spring Boot...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute MCP Tool Call</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Live Step Execution Pipeline Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className={`p-2.5 rounded-xl border text-center transition ${
            simStep >= 1 ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="block text-[10px] uppercase font-bold">1. JSON-RPC</span>
            <span>tools/call</span>
          </div>

          <div className={`p-2.5 rounded-xl border text-center transition ${
            simStep >= 2 ? 'bg-purple-950/50 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="block text-[10px] uppercase font-bold">2. Transport</span>
            <span>Streamable HTTP</span>
          </div>

          <div className={`p-2.5 rounded-xl border text-center transition ${
            simStep >= 3 ? 'bg-amber-950/50 border-amber-500 text-amber-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="block text-[10px] uppercase font-bold">3. Spring Service</span>
            <span>PaymentMcpTools</span>
          </div>

          <div className={`p-2.5 rounded-xl border text-center transition ${
            simStep >= 4 ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="block text-[10px] uppercase font-bold">4. LLM Synthesis</span>
            <span>Incident Report</span>
          </div>
        </div>

        {/* Simulation Output Result */}
        {simResult && (
          <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              
              {/* Spring Boot Log */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  Spring Boot Application Output
                </span>
                <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed">
                  {simResult.springLog}
                </pre>
              </div>

              {/* JSON-RPC Frame */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  JSON-RPC 2.0 Response Frame
                </span>
                <pre className="text-[11px] font-mono text-purple-300 overflow-x-auto">
                  {JSON.stringify(simResult.jsonRpcResponse, null, 2)}
                </pre>
              </div>

            </div>

            {/* Synthesized LLM Assistant Analysis */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/40 to-slate-950 p-4 rounded-xl border border-indigo-500/40">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Assistant's Diagnostic Summary to Engineer:
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                "{simResult.llmSynthesis}"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
