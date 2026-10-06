import { ArchitectureNode, CodeFile, InterviewCard, Scenario } from '../types';

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'developer',
    title: 'Software Engineer',
    subtitle: 'Payment Switch / CMS Dev',
    category: 'developer',
    x: 12,
    y: 20,
    icon: 'User',
    badge: 'Human Dev',
    description: 'Writes business logic, prompts Copilot, and requests incident diagnostics.',
  },
  {
    id: 'copilot',
    title: 'GitHub Copilot',
    subtitle: 'Coding LLM in IDE',
    category: 'developer',
    x: 35,
    y: 20,
    icon: 'Bot',
    badge: 'Code Assistant',
    description: 'Generates Java 21 services, JUnit 5/Mockito tests, and SQL queries inside IntelliJ/VS Code.',
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant / Agent',
    subtitle: 'Claude / GPT / Gemini',
    category: 'ai-orchestration',
    x: 12,
    y: 65,
    icon: 'Sparkles',
    badge: 'Orchestrator',
    description: 'Receives user natural-language queries (e.g. "Why did TXN1001 fail?") and plans MCP tool invocations.',
  },
  {
    id: 'mcp-client',
    title: 'MCP Host / Client',
    subtitle: 'Streamable HTTP Client',
    category: 'ai-orchestration',
    x: 35,
    y: 65,
    icon: 'Cpu',
    badge: 'MCP Protocol',
    description: 'Discovers available tools via tools/list, formulates JSON-RPC requests, and enforces timeout/schemas.',
  },
  {
    id: 'mcp-server',
    title: 'Payment MCP Server',
    subtitle: 'Spring AI (@McpTool)',
    category: 'spring-boot',
    x: 62,
    y: 65,
    icon: 'Terminal',
    badge: 'Spring AI Starter',
    description: 'Exposes controlled tools (getTransaction, getStatus) over Streamable HTTP transport without exposing raw DB.',
  },
  {
    id: 'spring-service',
    title: 'TransactionService',
    subtitle: 'Core Payment Logic',
    category: 'spring-boot',
    x: 62,
    y: 20,
    icon: 'Layers',
    badge: 'Spring Service',
    description: 'Deterministic Java payment processing, idempotency checks, duplicate detection, and business rules.',
  },
  {
    id: 'spring-repo',
    title: 'TransactionRepository',
    subtitle: 'Spring Data JPA',
    category: 'spring-boot',
    x: 85,
    y: 35,
    icon: 'DatabaseZap',
    badge: 'JPA Repository',
    description: 'Typed Spring Data queries mapped to the Transaction entity with connection pooling.',
  },
  {
    id: 'database',
    title: 'Payment Database',
    subtitle: 'PostgreSQL / H2 Switch DB',
    category: 'data-tier',
    x: 88,
    y: 65,
    icon: 'Database',
    badge: 'PCI Ledger',
    description: 'Stores financial transactions, authorization logs, and settlement state. Zero direct AI connection.',
  },
  {
    id: 'external-tools',
    title: 'External Systems',
    subtitle: 'Jira / Logs / Kafka',
    category: 'data-tier',
    x: 48,
    y: 92,
    icon: 'ExternalLink',
    badge: 'Auxiliary MCP',
    description: 'Application logs (ELK), Jira issue tracker, and Kafka event audit trails accessible via MCP tools.',
  },
];

export const FLOW_SCENARIOS: Scenario[] = [
  {
    id: 'mcp-incident',
    name: 'MCP Production Incident Triage',
    tagline: 'Controlled AI tool execution to diagnose a failed payment transaction',
    badge: 'Runtime Protocol',
    description:
      'A QA or SRE notices TXN1001 failed after authorization. The AI assistant uses MCP to query the Spring Boot application safely—without direct database credentials.',
    steps: [
      {
        id: 1,
        title: 'Incident Inquiry',
        sender: 'Engineer / QA',
        senderNodeId: 'developer',
        receiver: 'AI Assistant',
        receiverNodeId: 'ai-assistant',
        packetLabel: '"Check TXN1001: Why did it fail?"',
        packetColor: '#38bdf8', // sky-400
        description: 'Developer prompts the AI Assistant to diagnose transaction TXN1001.',
        explanation:
          'The prompt enters the LLM orchestrator. The LLM has no built-in knowledge of runtime payment data, so it consults its registered tool definitions.',
        protocol: 'PROMPT',
        payload: {
          type: 'User Prompt',
          content: 'Check transaction TXN1001 and explain why it failed after authorization.',
        },
      },
      {
        id: 2,
        title: 'Tool Selection & JSON-RPC Invocation',
        sender: 'AI Assistant',
        senderNodeId: 'ai-assistant',
        receiver: 'MCP Host / Client',
        receiverNodeId: 'mcp-client',
        packetLabel: 'tools/call getTransaction("TXN1001")',
        packetColor: '#818cf8', // indigo-400
        description: 'AI model selects the getTransaction tool from its MCP schema catalog.',
        explanation:
          'MCP provides structured JSON schema descriptors. The LLM produces a standard tool call request matching getTransaction(transactionId="TXN1001").',
        protocol: 'MCP_JSONRPC',
        payload: {
          type: 'JSON-RPC 2.0 Request',
          content: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: 'getTransaction',
              arguments: { transactionId: 'TXN1001' },
            },
            id: 'mcp-req-42',
          },
        },
      },
      {
        id: 3,
        title: 'Streamable HTTP Dispatch to Spring Boot',
        sender: 'MCP Host / Client',
        senderNodeId: 'mcp-client',
        receiver: 'Spring Boot MCP Server',
        receiverNodeId: 'mcp-server',
        packetLabel: 'POST /mcp (Streamable HTTP)',
        packetColor: '#a855f7', // purple-500
        description: 'MCP Client sends the tool call payload over Streamable HTTP transport to Spring AI.',
        explanation:
          'Spring AI starter (spring-ai-starter-mcp-server-webmvc) receives the Streamable HTTP request. It authenticates the client and resolves the target bean.',
        protocol: 'STREAMABLE_HTTP',
        payload: {
          type: 'HTTP Transport Frame',
          content: {
            transport: 'STREAMABLE_HTTP',
            endpoint: 'http://payment-switch.internal:8080/mcp/message',
            targetBean: 'paymentMcpTools',
            method: 'getTransaction(String)',
          },
        },
      },
      {
        id: 4,
        title: 'Spring AI Dispatches to @McpTool',
        sender: 'Payment MCP Server',
        senderNodeId: 'mcp-server',
        receiver: 'TransactionService',
        receiverNodeId: 'spring-service',
        packetLabel: 'Java Call: transactionService.getTransaction("TXN1001")',
        packetColor: '#ec4899', // pink-500
        description: 'PaymentMcpTools invokes the standard Spring business service.',
        explanation:
          'The MCP server delegates to your existing business logic. No database query is constructed dynamically by the LLM. Normal validation and security rules apply.',
        protocol: 'JAVA_CALL',
        payload: {
          type: 'Java In-Memory Invocation',
          content: 'PaymentMcpTools.getTransaction("TXN1001") -> transactionService.getTransaction("TXN1001")',
        },
      },
      {
        id: 5,
        title: 'Repository Query to Database',
        sender: 'TransactionService',
        senderNodeId: 'spring-service',
        receiver: 'Payment Database',
        receiverNodeId: 'database',
        packetLabel: 'SQL: SELECT * FROM transactions WHERE id = ?',
        packetColor: '#f59e0b', // amber-500
        description: 'TransactionRepository executes a parameterized JPA query against the database.',
        explanation:
          'The payment database is shielded behind Spring Data JPA. The AI NEVER has direct JDBC or network access to the database credentials or tables.',
        protocol: 'SQL_JDBC',
        payload: {
          type: 'Parameterized SQL',
          content: 'SELECT * FROM transactions t WHERE t.transaction_id = ? [params: TXN1001]',
        },
      },
      {
        id: 6,
        title: 'Controlled & Masked Payload Returned',
        sender: 'Payment Database',
        senderNodeId: 'database',
        receiver: 'Payment MCP Server',
        receiverNodeId: 'mcp-server',
        packetLabel: 'DTO: Status=FAILED, Reason=IDEMPOTENCY_KEY_COLLISION',
        packetColor: '#10b981', // emerald-500
        description: 'Transaction entity is loaded and formatted into a sanitized, masked summary string.',
        explanation:
          'PaymentMcpTools returns formatted text or structured JSON. Sensitive card numbers/CVVs are masked or excluded before crossing back to the AI assistant.',
        protocol: 'JAVA_CALL',
        payload: {
          type: 'Sanitized Output String',
          content:
            'Transaction ID: TXN1001\nCustomer ID: C101\nMerchant ID: M200\nAmount: $5,000.00\nStatus: FAILED\nDeclineCode: 504_IDEMPOTENCY_DUPLICATE',
        },
      },
      {
        id: 7,
        title: 'Streamable HTTP JSON-RPC Response',
        sender: 'Payment MCP Server',
        senderNodeId: 'mcp-server',
        receiver: 'AI Assistant',
        receiverNodeId: 'ai-assistant',
        packetLabel: 'JSON-RPC Result: Content Block',
        packetColor: '#06b6d4', // cyan-500
        description: 'Spring AI responds with the tool execution result back to the LLM agent.',
        explanation:
          'The LLM receives the deterministic tool output into its conversational context window as a tool result message.',
        protocol: 'MCP_JSONRPC',
        payload: {
          type: 'JSON-RPC 2.0 Response',
          content: {
            jsonrpc: '2.0',
            id: 'mcp-req-42',
            result: {
              content: [
                {
                  type: 'text',
                  text: 'Transaction ID: TXN1001\nStatus: FAILED\nReason: Idempotency conflict detected in switch gateway.',
                },
              ],
            },
          },
        },
      },
      {
        id: 8,
        title: 'Synthesized Root Cause Analysis',
        sender: 'AI Assistant',
        senderNodeId: 'ai-assistant',
        receiver: 'Software Engineer',
        receiverNodeId: 'developer',
        packetLabel: 'Root Cause Explanation & Next Steps',
        packetColor: '#22c55e', // green-500
        description: 'AI model synthesizes the tool result into a clear, actionable incident report.',
        explanation:
          'The developer receives an accurate explanation based on real data fetched safely via MCP, avoiding hallucinations and zero security leaks.',
        protocol: 'SYNTHESIS',
        payload: {
          type: 'Synthesized Explanation',
          content:
            'Transaction TXN1001 failed because the upstream client submitted a duplicate idempotency key within 120ms. The Payment Switch rejected the second attempt to prevent double-charging.',
        },
      },
    ],
  },
  {
    id: 'copilot-coding',
    name: 'GitHub Copilot Development Flow',
    tagline: 'Developer productivity inside IDE: writing services, tests, and refactoring',
    badge: 'Build-Time Assistant',
    description:
      'Developer is coding TransactionService in IntelliJ. Copilot generates boilerplate, creates JUnit 5 + Mockito tests, and suggests duplicate transaction handling.',
    steps: [
      {
        id: 1,
        title: 'Developer Prompts Copilot in IDE',
        sender: 'Software Engineer',
        senderNodeId: 'developer',
        receiver: 'GitHub Copilot',
        receiverNodeId: 'copilot',
        packetLabel: '"Generate JUnit 5 + Mockito tests for duplicate detection"',
        packetColor: '#38bdf8',
        description: 'Developer highlights TransactionService and requests comprehensive unit tests.',
        explanation:
          'Copilot acts as an in-IDE pairing partner. It reads the local file context, imported libraries (Spring Boot, JUnit 5, Mockito), and open tabs.',
        protocol: 'PROMPT',
        payload: {
          type: 'IDE Inline Prompt',
          content:
            'Generate JUnit 5 and Mockito test cases covering: 1. Successful transaction, 2. Duplicate idempotency key, 3. TransactionNotFoundException.',
        },
      },
      {
        id: 2,
        title: 'Copilot Code Generation',
        sender: 'GitHub Copilot',
        senderNodeId: 'copilot',
        receiver: 'Software Engineer',
        receiverNodeId: 'developer',
        packetLabel: 'Generated: TransactionServiceTest.java',
        packetColor: '#818cf8',
        description: 'Copilot suggests mock repository setups, assertThrows, and when/thenReturn blocks.',
        explanation:
          'The developer reviews, edits, and verifies the generated code. Copilot operates on code syntax, not live production data.',
        protocol: 'SYNTHESIS',
        payload: {
          type: 'Generated Java Code',
          content:
            '@Test\nvoid shouldThrowWhenDuplicate() {\n    when(repository.findById("TXN1001")).thenReturn(Optional.of(existingTx));\n    assertThrows(DuplicateTransactionException.class, () -> service.process(req));\n}',
        },
      },
      {
        id: 3,
        title: 'Commit to Spring Boot Codebase',
        sender: 'Software Engineer',
        senderNodeId: 'developer',
        receiver: 'TransactionService',
        receiverNodeId: 'spring-service',
        packetLabel: 'Verified Code: Business Rules & Tests',
        packetColor: '#22c55e',
        description: 'Developer verifies tests pass in Maven and commits robust payment logic.',
        explanation:
          'Notice the contrast: Copilot helped the human WRITE the code. The runtime execution is 100% deterministic Java bytecode.',
        protocol: 'JAVA_CALL',
        payload: {
          type: 'Compiled Java Class',
          content: 'mvn test -> Tests run: 8, Failures: 0, Errors: 0, Skipped: 0 [BUILD SUCCESS]',
        },
      },
    ],
  },
  {
    id: 'e2e-incident-fix',
    name: 'End-to-End: Incident Triage to Hotfix',
    tagline: 'How Copilot and MCP work together in a realistic payment engineering lifecycle',
    badge: 'Combined Workflow',
    description:
      'QA reports an authorization issue. MCP discovers the failing transaction state; Copilot then helps write the regression test and fix.',
    steps: [
      {
        id: 1,
        title: 'Incident Alert from QA',
        sender: 'Software Engineer',
        senderNodeId: 'developer',
        receiver: 'AI Assistant',
        receiverNodeId: 'ai-assistant',
        packetLabel: '"Check TXN1001 failed after auth"',
        packetColor: '#38bdf8',
        description: 'QA notes payment TXN1001 stalled after 3DS authorization.',
        explanation: 'AI Assistant initiates diagnostic protocol.',
        protocol: 'PROMPT',
      },
      {
        id: 2,
        title: 'MCP Multi-Tool Inspection',
        sender: 'AI Assistant',
        senderNodeId: 'ai-assistant',
        receiver: 'Payment MCP Server',
        receiverNodeId: 'mcp-server',
        packetLabel: 'tools/call getTransaction("TXN1001")',
        packetColor: '#818cf8',
        description: 'AI fetches transaction status and recent Kafka events.',
        explanation: 'Spring AI executes getTransaction() and returns transaction metadata.',
        protocol: 'MCP_JSONRPC',
      },
      {
        id: 3,
        title: 'Database State Retrieved',
        sender: 'Payment MCP Server',
        senderNodeId: 'mcp-server',
        receiver: 'TransactionService',
        receiverNodeId: 'spring-service',
        packetLabel: 'Safe Read-Only Lookup',
        packetColor: '#10b981',
        description: 'Transaction fetched: Status=AUTHORIZED, Settlement=FAILED due to null merchant currency.',
        explanation: 'Root cause identified: missing currency conversion fallback in switch router.',
        protocol: 'JAVA_CALL',
      },
      {
        id: 4,
        title: 'Diagnosis Delivered to Developer',
        sender: 'AI Assistant',
        senderNodeId: 'ai-assistant',
        receiver: 'Software Engineer',
        receiverNodeId: 'developer',
        packetLabel: 'RCA: Missing Currency Fallback',
        packetColor: '#06b6d4',
        description: 'AI tells developer: "Merchant M200 currency was null during settlement dispatch."',
        explanation: 'Developer now knows the exact bug without digging through raw logs for hours.',
        protocol: 'SYNTHESIS',
      },
      {
        id: 5,
        title: 'Copilot Generates Fix & Mockito Tests',
        sender: 'Software Engineer',
        senderNodeId: 'developer',
        receiver: 'GitHub Copilot',
        receiverNodeId: 'copilot',
        packetLabel: '"Fix null currency & add fallback test"',
        packetColor: '#ec4899',
        description: 'Developer asks Copilot to generate defensive currency fallback and unit test.',
        explanation: 'Copilot generates `Optional.ofNullable(currency).orElse(DEFAULT_CURRENCY)` and Mockito tests.',
        protocol: 'PROMPT',
      },
      {
        id: 6,
        title: 'Hotfix Deployed & Verified',
        sender: 'GitHub Copilot',
        senderNodeId: 'copilot',
        receiver: 'TransactionService',
        receiverNodeId: 'spring-service',
        packetLabel: 'Green CI/CD Pipeline',
        packetColor: '#22c55e',
        description: 'Unit tests pass; regression prevented; hotfix merged.',
        explanation: 'Seamless division of labor: MCP provided context/diagnostics; Copilot accelerated development.',
        protocol: 'JAVA_CALL',
      },
    ],
  },
];

export const CODE_FILES: CodeFile[] = [
  {
    id: 'pom',
    name: 'pom.xml',
    path: '/pom.xml',
    language: 'xml',
    tag: 'Maven Dependencies',
    description: 'Spring Boot 3.x + Spring AI MCP Server starter using Streamable HTTP transport.',
    highlights: ['spring-ai-starter-mcp-server-webmvc', 'spring-boot-starter-data-jpa'],
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>

    <groupId>com.payment.switch</groupId>
    <artifactId>payment-mcp-server</artifactId>
    <version>1.0.0</version>
    <name>Payment MCP Server</name>

    <properties>
        <java.version>21</java.version>
        <spring-ai.version>1.0.0-M2</spring-ai.version>
    </properties>

    <dependencies>
        <!-- Standard Spring MVC for REST and Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- JPA Data Tier for Payment Ledger -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Spring AI MCP Server Starter (Streamable HTTP) -->
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-mcp-server-webmvc</artifactId>
        </dependency>

        <!-- In-memory / Switch Database -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Testing & Mockito -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>\${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
</project>`,
  },
  {
    id: 'mcp-tools',
    name: 'PaymentMcpTools.java',
    path: '/src/main/java/com/payment/mcp/PaymentMcpTools.java',
    language: 'java',
    tag: 'MCP Tool Provider',
    description: 'Spring bean annotated with @McpTool. Discovered automatically by Spring AI MCP server.',
    highlights: ['@McpTool', 'transactionService.getTransaction', 'Masked Output'],
    code: `package com.payment.mcp;

import com.payment.entity.Transaction;
import com.payment.service.TransactionService;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Exposes controlled, read-only payment capabilities to the MCP protocol.
 * The AI Assistant discovers these tools automatically via tools/list.
 * 
 * SECURITY: Never expose mutating payment methods or raw unmasked PANs!
 */
@Component
public class PaymentMcpTools {

    private final TransactionService transactionService;

    public PaymentMcpTools(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @McpTool(
        name = "getTransaction",
        description = "Get payment transaction details using unique transaction ID. Returns sanitized state and amount."
    )
    public String getTransaction(String transactionId) {
        Transaction tx = transactionService.getTransaction(transactionId);

        // Sanitize & format for LLM consumption
        return """
                Transaction ID: %s
                Customer ID: %s
                Merchant ID: %s
                Amount: %s %s
                Status: %s
                Decline Reason: %s
                Timestamp: %s
                """.formatted(
                    tx.getTransactionId(),
                    tx.getCustomerId(),
                    tx.getMerchantId(),
                    tx.getAmount(),
                    tx.getCurrency(),
                    tx.getStatus(),
                    tx.getDeclineReason() != null ? tx.getDeclineReason() : "NONE",
                    tx.getCreatedAt()
                );
    }

    @McpTool(
        name = "getTransactionStatus",
        description = "Check whether a transaction is SUCCESSFUL, FAILED, or PENDING"
    )
    public String getTransactionStatus(String transactionId) {
        Transaction tx = transactionService.getTransaction(transactionId);
        return tx.getStatus();
    }

    @McpTool(
        name = "getFailedTransactions",
        description = "Find recent failed transactions for an investigation window"
    )
    public List<String> getFailedTransactions() {
        return transactionService.findRecentFailedIds();
    }
}`,
  },
  {
    id: 'service',
    name: 'TransactionService.java',
    path: '/src/main/java/com/payment/service/TransactionService.java',
    language: 'java',
    tag: 'Business Service',
    description: 'Core deterministic Spring service. Handles business validation, duplicate detection, and repository calls.',
    highlights: ['TransactionNotFoundException', 'Idempotency Validation', 'Constructor Injection'],
    code: `package com.payment.service;

import com.payment.entity.Transaction;
import com.payment.exception.TransactionNotFoundException;
import com.payment.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Standard Spring Boot business service.
 * MCP DOES NOT replace this layer; MCP merely calls into it!
 */
@Service
public class TransactionService {

    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public Transaction getTransaction(String transactionId) {
        return repository.findById(transactionId)
                .orElseThrow(() -> 
                    new TransactionNotFoundException("Transaction not found: " + transactionId));
    }

    @Transactional(readOnly = true)
    public List<String> findRecentFailedIds() {
        return repository.findByStatus("FAILED")
                .stream()
                .map(Transaction::getTransactionId)
                .toList();
    }

    @Transactional
    public Transaction processPayment(Transaction request) {
        // Deterministic duplicate check via idempotency key
        if (repository.existsByIdempotencyKey(request.getIdempotencyKey())) {
            throw new IllegalStateException("Duplicate transaction detected for idempotency key");
        }
        return repository.save(request);
    }
}`,
  },
  {
    id: 'app-yml',
    name: 'application.yml',
    path: '/src/main/resources/application.yml',
    language: 'yaml',
    tag: 'Spring AI Config',
    description: 'Configures Streamable HTTP MCP server transport (modern replacement for deprecated SSE).',
    highlights: ['protocol: STREAMABLE', 'name: payment-mcp-server'],
    code: `spring:
  application:
    name: payment-mcp-server

  datasource:
    url: jdbc:h2:mem:paymentdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
    driver-class-name: org.h2.Driver
    username: sa
    password:

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  ai:
    mcp:
      server:
        # Streamable HTTP is the current recommended transport in Spring AI
        # (Server-Sent Events / SSE is deprecated in modern docs)
        protocol: STREAMABLE
        name: payment-mcp-server
        version: 1.0.0
        # Exposes MCP endpoint at /mcp/message
        endpoint: /mcp/message

server:
  port: 8080`,
  },
  {
    id: 'test',
    name: 'TransactionServiceTest.java',
    path: '/src/test/java/com/payment/service/TransactionServiceTest.java',
    language: 'java',
    tag: 'Copilot Generated Unit Tests',
    description: 'JUnit 5 + Mockito unit tests generated by prompting GitHub Copilot in IntelliJ.',
    highlights: ['@ExtendWith(MockitoExtension.class)', 'assertThrows', 'when(repository.findById)'],
    code: `package com.payment.service;

import com.payment.entity.Transaction;
import com.payment.exception.TransactionNotFoundException;
import com.payment.repository.TransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Prompt given to GitHub Copilot:
 * "Generate JUnit 5 and Mockito test cases for TransactionService.getTransaction.
 *  Cover: 1. transaction found, 2. transaction not found, 3. repository exception."
 */
@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository repository;

    @InjectMocks
    private TransactionService service;

    @Test
    @DisplayName("Should successfully return transaction when ID exists")
    void shouldReturnTransactionWhenFound() {
        // Arrange
        Transaction tx = new Transaction();
        tx.setTransactionId("TXN1001");
        tx.setAmount(new BigDecimal("5000.00"));
        tx.setStatus("SUCCESS");

        when(repository.findById("TXN1001"))
                .thenReturn(Optional.of(tx));

        // Act
        Transaction result = service.getTransaction("TXN1001");

        // Assert
        assertNotNull(result);
        assertEquals("TXN1001", result.getTransactionId());
        assertEquals("SUCCESS", result.getStatus());
        verify(repository, times(1)).findById("TXN1001");
    }

    @Test
    @DisplayName("Should throw TransactionNotFoundException when ID does not exist")
    void shouldThrowExceptionWhenNotFound() {
        // Arrange
        when(repository.findById("TXN9999"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
            TransactionNotFoundException.class,
            () -> service.getTransaction("TXN9999")
        );
        verify(repository, times(1)).findById("TXN9999");
    }
}`,
  },
  {
    id: 'entity',
    name: 'Transaction.java',
    path: '/src/main/java/com/payment/entity/Transaction.java',
    language: 'java',
    tag: 'JPA Entity',
    description: 'Transaction ledger entity mapped to H2 / PostgreSQL relational database.',
    highlights: ['@Entity', '@Id', 'idempotencyKey'],
    code: `package com.payment.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    private String transactionId;

    private String customerId;
    private String merchantId;
    private BigDecimal amount;
    private String currency = "USD";
    private String status; // SUCCESS, FAILED, PENDING
    private String declineReason;
    private String idempotencyKey;
    private Instant createdAt = Instant.now();

    // Standard Getters & Setters
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getMerchantId() { return merchantId; }
    public void setMerchantId(String merchantId) { this.merchantId = merchantId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDeclineReason() { return declineReason; }
    public void setDeclineReason(String declineReason) { this.declineReason = declineReason; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}`,
  },
  {
    id: 'github-workflow',
    name: 'deploy.yml',
    path: '/.github/workflows/deploy.yml',
    language: 'yaml',
    tag: 'CI/CD Pipeline',
    description: 'GitHub Actions workflow to automate building and deploying to GitHub Pages.',
    highlights: ['actions/checkout@v4', 'actions/configure-pages@v4', 'actions/deploy-pages@v4'],
    code: `name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm install
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`,
  },
];

export const INTERVIEW_CARDS: InterviewCard[] = [
  {
    id: 'core-distinction',
    question: 'How do you explain the difference between GitHub Copilot and MCP in an interview?',
    shortAnswer:
      'Copilot is a developer productivity assistant that helps ME write code (tests, boilerplate, refactoring). MCP is an open protocol that lets an AI assistant interact with external TOOLS (databases, Jira, logs) under strict programmatic control.',
    deepExplanation:
      'Copilot operates at build-time/development-time inside IntelliJ or VS Code. It reads source code context and suggests syntax. MCP (Model Context Protocol) operates at runtime. It standardizes how an LLM agent queries runtime environments through defined tools like getTransaction() or getLogs() without giving the LLM arbitrary system access.',
    interviewTrap:
      'Never say "MCP is an AI model" or "MCP writes code." MCP is a client-server protocol (over Streamable HTTP/stdio), not a model!',
    goldenQuote:
      '"Copilot helps me while writing the Java code; MCP is the protocol used when an AI agent needs controlled access to external systems."',
    category: 'core',
  },
  {
    id: 'why-not-rest',
    question: 'If the interviewer asks: "Why MCP when we already have standard REST APIs?"',
    shortAnswer:
      'REST is designed for application-to-application integration where human engineers code explicit client calls. MCP standardizes AI-to-tool integration with dynamic discovery, JSON Schema parameter validation, and bi-directional prompt/resource context.',
    deepExplanation:
      'Existing REST services do not need to be replaced. Instead, an MCP server wraps selected business capabilities (like getTransaction) with tool annotations (@McpTool). This provides the LLM with automatic schema discovery (tools/list) and structured invocation (tools/call) adhering to JSON-RPC 2.0 without requiring custom orchestration code for every endpoint.',
    interviewTrap:
      'Do not say "REST is obsolete." Say: "Our REST endpoints remain for our payment switch clients; MCP acts as the dedicated AI tool adapter layer."',
    goldenQuote:
      '"REST is an API interface for applications. MCP provides a standardized way for AI applications to discover and invoke tools and resources."',
    category: 'comparison',
  },
  {
    id: 'security-guardrails',
    question: 'How do you ensure PCI-DSS security and avoid data leaks with MCP in a payment switch?',
    shortAnswer:
      'Zero direct database access, strictly read-only scoped tools, automatic PAN/CVV tokenization & masking, and network-level authentication on the Streamable HTTP transport.',
    deepExplanation:
      'In a payment system, the AI must NEVER have raw JDBC credentials or direct SQL execution capabilities. We expose only vetted Java methods (@McpTool). The tool method itself handles sanitization (e.g., masking card numbers to 4000-xxxx-xxxx-1111) before returning data. Furthermore, Spring AI HTTP endpoints must be protected behind Spring Security mTLS or OAuth Bearer tokens before exposing beyond localhost.',
    interviewTrap:
      'Never say: "We let the AI generate SQL queries to find transactions." That introduces prompt injection vulnerabilities and SQL injection risks.',
    goldenQuote:
      '"I expose only required read-only tools through MCP, validate the input, apply authorization, mask sensitive financial data, and keep payment processing deterministic."',
    category: 'security',
  },
  {
    id: 'spring-ai-transport',
    question: 'How does Spring Boot implement an MCP Server?',
    shortAnswer:
      'Using Spring AI\'s spring-ai-starter-mcp-server-webmvc starter, exposing tools via the @McpTool annotation over Streamable HTTP transport.',
    deepExplanation:
      'Spring AI provides first-class support for MCP. Any Spring bean annotated with @Component can declare methods with @McpTool. Spring AI automatically registers these methods as MCP tools, serializes parameter schemas using Jackson/JSON Schema, and serves them over Streamable HTTP (which replaces legacy SSE in current documentation).',
    interviewTrap:
      'Don\'t say "Spring AI runs the LLM model inside Spring Boot." The Spring Boot app acts as the MCP Server (tool provider); the LLM runs externally or in an enterprise cluster.',
    goldenQuote:
      '"In Spring Boot 3 with Spring AI, any service bean can expose @McpTool methods over Streamable HTTP, cleanly separating business logic from AI discovery."',
    category: 'architecture',
  },
  {
    id: 'memory-trick',
    question: 'What is the 5-part memory trick to instantly recall the architecture roles?',
    shortAnswer:
      'Copilot → Helps ME write code | Spring Boot → Runs MY application | MCP → Gives AI controlled access to TOOLS | LLM → Understands user requests | Database → Stores payment data.',
    deepExplanation:
      'Keeping these 5 boundaries crystal clear prevents confusion in high-stakes system design and behavioral interviews. Each component has a single, unambiguous responsibility in the payment ecosystem.',
    interviewTrap:
      'Avoid mixing the roles of LLM and business service. AI never decides financial ledger mutations; deterministic Java code does.',
    goldenQuote:
      '"Copilot helps ME, Spring Boot runs MY app, MCP controls TOOLS, LLM understands, Database persists."',
    category: 'core',
  },
];
