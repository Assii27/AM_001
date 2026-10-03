import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Server,
  Zap,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export const SecurityGuardrails: React.FC = () => {
  const [testCardNumber, setTestCardNumber] = useState<string>('4532-8923-1289-4421');
  const [testCvv, setTestCvv] = useState<string>('892');
  const [testCustomerName, setTestCustomerName] = useState<string>('Alex Johnson');
  const [testAmount, setTestAmount] = useState<string>('5000.00');

  // Compute masked card: keep first 4 and last 4
  const cleanCard = testCardNumber.replace(/\D/g, '');
  const maskedCard =
    cleanCard.length >= 8
      ? cleanCard.slice(0, 4) + '-XXXX-XXXX-' + cleanCard.slice(-4)
      : 'XXXX-XXXX-XXXX-XXXX';

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <span className="text-xs font-bold tracking-widest text-rose-400 uppercase bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
          PCI-DSS & Compliance
        </span>
        <h2 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
          Payment Switch Security Guardrails for MCP
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Financial systems demand uncompromising security. Learn how to protect payment gateways, mask sensitive cardholder data, and secure Spring AI MCP endpoints.
        </p>
      </div>

      {/* 4 Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Pillar 1: Zero Direct DB Access */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">1. Zero Direct DB / JDBC Access</h3>
              <p className="text-xs text-rose-300 font-mono">No raw SQL generation by LLMs</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The AI model NEVER receives database connection strings, credentials, or arbitrary SQL execution tools. All queries are channeled through compiled Spring Data JPA repositories with parameterized queries.
          </p>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Eliminates prompt-injection SQL injection and unauthorized data exfiltration.</span>
          </div>
        </div>

        {/* Pillar 2: Read-Only Scoped Tools */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">2. Strictly Read-Only Tools</h3>
              <p className="text-xs text-amber-300 font-mono">@Transactional(readOnly = true)</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Expose only investigative methods (<code className="text-amber-300">getTransaction</code>, <code className="text-amber-300">getStatus</code>). Never expose mutating functions like <code className="text-rose-400">refund()</code> or <code className="text-rose-400">debitAccount()</code> to autonomous AI loops without human approval.
          </p>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Guarantees financial ledger integrity cannot be altered by rogue prompts.</span>
          </div>
        </div>

        {/* Pillar 3: Data Masking & Tokenization */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3. PII & Cardholder Data Masking</h3>
              <p className="text-xs text-purple-300 font-mono">PCI-DSS Section 3.4 Compliance</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Payment card PANs, CVV codes, and customer authentication secrets are stripped or masked before the tool returns text to the MCP transport. The LLM only sees masked tokens.
          </p>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Protects cardholder data from being sent to external LLM tokenizers or context logs.</span>
          </div>
        </div>

        {/* Pillar 4: Transport Auth & Spring Security */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">4. Transport Authentication</h3>
              <p className="text-xs text-indigo-300 font-mono">Spring Security + mTLS / Bearer</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Spring AI HTTP endpoints are not authenticated by default. In production payment clusters, you must secure the Streamable HTTP endpoint (<code className="text-indigo-300">/mcp/message</code>) with OAuth2 Bearer tokens or mTLS before exposing beyond localhost.
          </p>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Prevents unauthenticated agents from querying internal payment switch tools.</span>
          </div>
        </div>

      </div>

      {/* Interactive Data Sanitizer / Tokenizer Demo */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Interactive PCI-DSS Data Sanitizer Simulator
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Type values below to see how <code>PaymentMcpTools</code> sanitizes payment records before returning them to the AI Assistant.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
            Live Preview
          </span>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Card Number (PAN)</label>
            <input
              type="text"
              value={testCardNumber}
              onChange={(e) => setTestCardNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">CVV / CVC (3-digit)</label>
            <input
              type="text"
              value={testCvv}
              onChange={(e) => setTestCvv(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Cardholder Name</label>
            <input
              type="text"
              value={testCustomerName}
              onChange={(e) => setTestCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Amount (USD)</label>
            <input
              type="text"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Comparison: Raw Database vs MCP Tool Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Raw DB Record */}
          <div className="p-4 bg-slate-950 rounded-xl border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5" />
                Raw Database Entity (High PCI Risk)
              </span>
              <span className="text-[10px] text-rose-300 font-mono">Internal Ledger</span>
            </div>
            <pre className="text-[11px] font-mono text-rose-300/80 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30 overflow-x-auto leading-relaxed">
{`{
  "transactionId": "TXN1001",
  "cardNumber": "${testCardNumber}",
  "cvv": "${testCvv}",
  "cardholder": "${testCustomerName}",
  "amount": "${testAmount}",
  "status": "FAILED",
  "declineReason": "504_IDEMPOTENCY_KEY_COLLISION"
}`}
            </pre>
            <p className="text-[10.5px] text-rose-400 italic">
              ❌ Never send this raw payload to an external AI model or LLM context window!
            </p>
          </div>

          {/* Sanitized MCP Tool Output */}
          <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sanitized MCP Tool Response (PCI-DSS Safe)
              </span>
              <span className="text-[10px] text-emerald-300 font-mono">Streamable HTTP Frame</span>
            </div>
            <pre className="text-[11px] font-mono text-emerald-300 bg-emerald-950/20 p-3 rounded-lg border border-emerald-900/30 overflow-x-auto leading-relaxed">
{`Transaction ID: TXN1001
Card: ${maskedCard}
CVV: [STRIPPED BY SECURITY FILTER]
Cardholder: ${testCustomerName.split(' ')[0]} ***
Amount: $${testAmount} USD
Status: FAILED
Decline Reason: IDEMPOTENCY_KEY_COLLISION
Actionable Note: Safe for incident triage investigation.`}
            </pre>
            <p className="text-[10.5px] text-emerald-400 italic">
              ✓ Fully masked. Sufficient for AI diagnosis with zero credential exposure.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
