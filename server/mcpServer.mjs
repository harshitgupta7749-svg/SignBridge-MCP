/**
 * SignBridge MCP Server
 * Genuine Model Context Protocol (MCP) server implementation using official @modelcontextprotocol/sdk.
 * Track: Make MCP Matter
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import {
  searchIslVocabulary,
  getSignDetailsById,
  formatAccessibleCommunicationMessage,
} from './islKnowledgeBase.mjs';

export const SIGNBRIDGE_MCP_SERVER_NAME = 'signbridge-accessibility-mcp-server';
export const SIGNBRIDGE_MCP_SERVER_VERSION = '1.0.0';

/**
 * Tool definitions conforming to MCP standard tool specification.
 */
export const SIGNBRIDGE_MCP_TOOLS = [
  {
    name: 'search_isl_signs',
    description: 'Search available Indian Sign Language (ISL) vocabulary, phrases, numerals, and fingerspelled letters based on verified ISLRTC standards.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The word, concept, or phrase to search (e.g. "Thank You", "Namaste", "Help", "Fee", "Library", "1", "A").',
        },
        category: {
          type: 'string',
          description: 'Optional category filter: "Greetings", "Common Phrases", "Help", "Directions", "Campus", "Numbers", "Alphabet", or "All".',
          enum: ['All', 'Greetings', 'Common Phrases', 'Help', 'Directions', 'Campus', 'Numbers', 'Alphabet'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_sign_details',
    description: 'Retrieve comprehensive linguistic information, hand posture instructions, handshape types, and media references for a specific ISL sign identifier.',
    inputSchema: {
      type: 'object',
      properties: {
        sign_id: {
          type: 'string',
          description: 'The unique sign ID or name (e.g. "thank-you", "namaste", "help", "medical-assistance", "num-1", "letter-a").',
        },
      },
      required: ['sign_id'],
    },
  },
  {
    name: 'prepare_accessible_message',
    description: 'Format a clear, dignified, and accessible message for Deaf and Hard-of-Hearing users to present to non-signing recipients (receptionists, doctors, counter operators).',
    inputSchema: {
      type: 'object',
      properties: {
        requirement: {
          type: 'string',
          description: 'The user message or request to be communicated to the recipient.',
        },
        context: {
          type: 'string',
          description: 'The setting: "reception", "medical", "counter", "library", "emergency", or "general".',
        },
        urgency: {
          type: 'string',
          description: 'Urgency level: "normal" or "urgent".',
          enum: ['normal', 'urgent'],
        },
      },
      required: ['requirement'],
    },
  },
];

/**
 * Create and configure an official SignBridge MCP Server instance.
 */
export function createSignBridgeMcpServer() {
  const server = new Server(
    {
      name: SIGNBRIDGE_MCP_SERVER_NAME,
      version: SIGNBRIDGE_MCP_SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools discovery handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: SIGNBRIDGE_MCP_TOOLS,
    };
  });

  // Register tool execution handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === 'search_isl_signs') {
      const query = typeof args?.query === 'string' ? args.query : '';
      const category = typeof args?.category === 'string' ? args.category : undefined;
      const result = searchIslVocabulary(query, category);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'get_sign_details') {
      const signId = typeof args?.sign_id === 'string' ? args.sign_id : '';
      const result = getSignDetailsById(signId);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    if (name === 'prepare_accessible_message') {
      const requirement = typeof args?.requirement === 'string' ? args.requirement : '';
      const context = typeof args?.context === 'string' ? args.context : 'general';
      const urgency = typeof args?.urgency === 'string' ? args.urgency : 'normal';
      const result = formatAccessibleCommunicationMessage({ requirement, context, urgency });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }

    throw new Error(`MCP Tool Not Found: ${name}`);
  });

  return server;
}
