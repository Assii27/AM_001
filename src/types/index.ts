export type ScenarioId = 'mcp-incident' | 'copilot-coding' | 'e2e-incident-fix';

export interface FlowStep {
  id: number;
  title: string;
  sender: string;
  senderNodeId: string;
  receiver: string;
  receiverNodeId: string;
  packetLabel: string;
  packetColor: string;
  description: string;
  explanation: string;
  protocol: 'PROMPT' | 'MCP_JSONRPC' | 'JAVA_CALL' | 'SQL_JDBC' | 'STREAMABLE_HTTP' | 'SYNTHESIS';
  payload?: {
    type: string;
    content: string | object;
  };
}

export interface Scenario {
  id: ScenarioId;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  steps: FlowStep[];
}

export interface ArchitectureNode {
  id: string;
  title: string;
  subtitle: string;
  category: 'developer' | 'ai-orchestration' | 'spring-boot' | 'data-tier';
  x: number; // percentage in diagram
  y: number; // percentage in diagram
  icon: string;
  badge?: string;
  description: string;
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: 'xml' | 'java' | 'yaml';
  tag: string;
  description: string;
  code: string;
  highlights: string[];
}

export interface InterviewCard {
  id: string;
  question: string;
  shortAnswer: string;
  deepExplanation: string;
  interviewTrap: string;
  goldenQuote: string;
  category: 'core' | 'architecture' | 'security' | 'comparison';
}
