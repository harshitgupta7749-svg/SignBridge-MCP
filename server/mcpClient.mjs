/**
 * SignBridge MCP Client
 * Official MCP client implementation using @modelcontextprotocol/sdk.
 * Manages tool discovery, lifecycle, and invocation over MCP transport.
 * Track: Make MCP Matter
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import {
  createSignBridgeMcpServer,
  SIGNBRIDGE_MCP_SERVER_NAME,
  SIGNBRIDGE_MCP_SERVER_VERSION,
} from './mcpServer.mjs';

let mcpServerInstance = null;
let mcpClientInstance = null;
let clientTransportInstance = null;
let serverTransportInstance = null;
let isConnected = false;
let initPromise = null;

/**
 * Initialize the MCP Client and MCP Server over linked transport.
 */
export async function initializeMcp() {
  if (isConnected && mcpClientInstance) {
    return { client: mcpClientInstance, server: mcpServerInstance };
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      // 1. Create linked transport pair
      const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
      clientTransportInstance = clientTransport;
      serverTransportInstance = serverTransport;

      // 2. Instantiate MCP Server
      mcpServerInstance = createSignBridgeMcpServer();

      // 3. Instantiate MCP Client
      mcpClientInstance = new Client(
        {
          name: 'signbridge-ai-backend-client',
          version: '1.0.0',
        },
        {
          capabilities: {},
        }
      );

      // 4. Connect server to transport
      await mcpServerInstance.connect(serverTransportInstance);

      // 5. Connect client to transport (performs MCP Initialize handshake)
      await mcpClientInstance.connect(clientTransportInstance);

      isConnected = true;
      console.log(`[SignBridge MCP] Connected successfully to ${SIGNBRIDGE_MCP_SERVER_NAME} v${SIGNBRIDGE_MCP_SERVER_VERSION}`);

      return { client: mcpClientInstance, server: mcpServerInstance };
    } catch (err) {
      console.error('[SignBridge MCP] Connection initialization failed:', err);
      isConnected = false;
      throw err;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Discover available MCP tools dynamically from the connected MCP Server.
 */
export async function discoverMcpTools() {
  const { client } = await initializeMcp();
  const result = await client.listTools();
  return result.tools || [];
}

/**
 * Invoke a specific MCP tool via the MCP client with structured result tracking.
 */
export async function executeMcpTool(name, toolArgs = {}) {
  const { client } = await initializeMcp();
  const startTime = Date.now();

  try {
    const response = await client.callTool({
      name,
      arguments: toolArgs,
    });

    const durationMs = Date.now() - startTime;
    const textContent = response.content?.find(c => c.type === 'text')?.text;

    let parsedResult = null;
    if (textContent) {
      try {
        parsedResult = JSON.parse(textContent);
      } catch {
        parsedResult = textContent;
      }
    }

    return {
      success: true,
      tool: name,
      arguments: toolArgs,
      result: parsedResult,
      rawContent: response.content,
      durationMs,
      transport: 'in-memory-jsonrpc',
      protocolVersion: '2024-11-05',
    };
  } catch (err) {
    const durationMs = Date.now() - startTime;
    console.error(`[SignBridge MCP] Tool execution error (${name}):`, err.message);
    return {
      success: false,
      tool: name,
      arguments: toolArgs,
      error: err.message || 'MCP tool execution failed',
      durationMs,
      transport: 'in-memory-jsonrpc',
    };
  }
}

/**
 * Get real-time health and tool availability status of the MCP connection.
 */
export async function getMcpStatus() {
  try {
    const tools = await discoverMcpTools();
    return {
      connected: isConnected,
      serverName: SIGNBRIDGE_MCP_SERVER_NAME,
      serverVersion: SIGNBRIDGE_MCP_SERVER_VERSION,
      toolCount: tools.length,
      tools: tools.map(t => ({
        name: t.name,
        description: t.description,
        parameters: t.inputSchema?.properties ? Object.keys(t.inputSchema.properties) : [],
      })),
      transport: 'official-mcp-in-memory-linked-transport',
    };
  } catch (err) {
    return {
      connected: false,
      serverName: SIGNBRIDGE_MCP_SERVER_NAME,
      error: err.message,
      toolCount: 0,
      tools: [],
    };
  }
}

/**
 * Graceful shutdown of MCP client and server.
 */
export async function closeMcp() {
  try {
    if (mcpClientInstance) await mcpClientInstance.close();
    if (mcpServerInstance) await mcpServerInstance.close();
  } catch (err) {
    console.warn('[SignBridge MCP] Shutdown warning:', err.message);
  } finally {
    isConnected = false;
    mcpClientInstance = null;
    mcpServerInstance = null;
  }
}
