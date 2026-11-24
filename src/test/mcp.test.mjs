import { describe, it, expect, afterAll } from 'vitest';
import { discoverMcpTools, executeMcpTool, getMcpStatus, closeMcp } from '../../server/mcpClient.mjs';
import { generateAIResponse, handleApiRequest } from '../../server/aiBackend.mjs';

describe('SignBridge MCP Protocol Integration (Track: Make MCP Matter)', () => {
  afterAll(async () => {
    await closeMcp();
  });

  it('connects to genuine MCP server and discovers registered tools via MCP SDK', async () => {
    const status = await getMcpStatus();
    expect(status.connected).toBe(true);
    expect(status.serverName).toBe('signbridge-accessibility-mcp-server');
    expect(status.toolCount).toBe(3);

    const tools = await discoverMcpTools();
    const toolNames = tools.map(t => t.name);
    expect(toolNames).toContain('search_isl_signs');
    expect(toolNames).toContain('get_sign_details');
    expect(toolNames).toContain('prepare_accessible_message');
  });

  it('Tool 1: invokes search_isl_signs for "Thank You" and returns verified ISL data', async () => {
    const result = await executeMcpTool('search_isl_signs', { query: 'Thank You' });
    expect(result.success).toBe(true);
    expect(result.tool).toBe('search_isl_signs');
    expect(result.transport).toBe('in-memory-jsonrpc');
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
    expect(result.result.found).toBe(true);
    expect(result.result.matches.length).toBeGreaterThan(0);

    const match = result.result.matches[0];
    expect(match.name).toBe('Thank You');
    expect(match.category).toBe('Common Phrases');
    expect(match.isVerified).toBe(true);
    expect(match.hasVisualMedia).toBe(true);
    expect(match.instructions).toContain('lips');
  });

  it('Tool 2: invokes get_sign_details for "namaste" and returns complete posture instructions', async () => {
    const result = await executeMcpTool('get_sign_details', { sign_id: 'namaste' });
    expect(result.success).toBe(true);
    expect(result.result.found).toBe(true);
    expect(result.result.sign.name).toContain('Namaste');
    expect(result.result.sign.handshapeType).toBe('two-handed');
    expect(result.result.sign.sourceName).toContain('ISLRTC');
    expect(result.result.sign.mediaReference.url).toContain('islrtc.nic.in');
  });

  it('Tool 3: invokes prepare_accessible_message for receptionist medical assistance', async () => {
    const result = await executeMcpTool('prepare_accessible_message', {
      requirement: 'I need medical assistance for acute pain',
      context: 'medical',
      urgency: 'urgent',
    });
    expect(result.success).toBe(true);
    expect(result.result.isUrgent).toBe(true);
    expect(result.result.recipientType).toBe('Medical / Clinic Staff');
    expect(result.result.accessibleMessage).toContain('URGENT ASSISTANCE NEEDED');
    expect(result.result.suggestedActions.length).toBeGreaterThan(0);
    expect(result.result.cardDisplay.header).toContain('URGENT');
  });

  it('integrates AI response with MCP tool execution transparently', async () => {
    const aiRes = await generateAIResponse({
      message: 'How do I say Thank You in ISL?',
      history: [],
    });

    expect(aiRes.reply).toBeDefined();
    expect(aiRes.reply.length).toBeGreaterThan(20);
    expect(aiRes.mcp).toBeDefined();
    expect(aiRes.mcp.toolsDiscovered).toContain('search_isl_signs');
    expect(aiRes.mcp.toolCalls.length).toBeGreaterThan(0);

    const firstToolCall = aiRes.mcp.toolCalls[0];
    expect(firstToolCall.tool).toBe('search_isl_signs');
    expect(firstToolCall.success).toBe(true);
  });

  it('handles HTTP endpoint GET /api/mcp/tools', async () => {
    const req = { method: 'GET', url: '/api/mcp/tools' };
    let responseBody = '';
    let responseCode = 0;
    const res = {
      setHeader: () => {},
      set statusCode(val) { responseCode = val; },
      end: (data) => { responseBody = data; },
    };

    await handleApiRequest(req, res);
    expect(responseCode).toBe(200);
    const parsed = JSON.parse(responseBody);
    expect(parsed.success).toBe(true);
    expect(parsed.tools.length).toBe(3);
  });

  it('handles HTTP endpoint POST /api/mcp/call', async () => {
    const req = {
      method: 'POST',
      url: '/api/mcp/call',
      on: (event, callback) => {
        if (event === 'data') callback(JSON.stringify({ tool: 'get_sign_details', arguments: { sign_id: 'help' } }));
        if (event === 'end') callback();
      },
    };
    let responseBody = '';
    let responseCode = 0;
    const res = {
      setHeader: () => {},
      set statusCode(val) { responseCode = val; },
      end: (data) => { responseBody = data; },
    };

    await handleApiRequest(req, res);
    expect(responseCode).toBe(200);
    const parsed = JSON.parse(responseBody);
    expect(parsed.success).toBe(true);
    expect(parsed.result.found).toBe(true);
    expect(parsed.result.sign.name).toContain('Help');
  });
});
