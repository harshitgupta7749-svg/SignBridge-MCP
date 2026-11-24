import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  discoverMcpTools,
  executeMcpTool,
  getMcpStatus,
} from './mcpClient.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Lightweight built-in .env parser to avoid external dependencies
export function loadEnvFile() {
  const envFiles = ['.env.local', '.env'];
  for (const envFile of envFiles) {
    const fullPath = path.join(projectRoot, envFile);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split(/\r?\n/);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (val && !val.includes('your_') && !val.includes('_here')) {
              process.env[key] = val;
            } else if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (err) {
        console.warn(`[SignBridge AI] Could not read ${envFile}:`, err.message);
      }
    }
  }
}

// Initial load
loadEnvFile();

const SYSTEM_PROMPT = `You are SignBridge AI, a helpful, polite, and empathetic conversational assistant on the SignBridge platform.
SignBridge empowers Deaf, Hard-of-Hearing, and non-signing individuals to communicate naturally using Indian Sign Language (ISL) hand signs, fingerspelling, and text.
You have access to Model Context Protocol (MCP) tools connected to the official ISLRTC (Indian Sign Language Research and Training Centre) verified dataset:
1. "search_isl_signs": Search for ISL vocabulary, signs, phrases, numerals, and fingerspelling.
2. "get_sign_details": Retrieve detailed handshape, pose tips, and media references for an ISL sign.
3. "prepare_accessible_message": Help Deaf/Hard-of-Hearing users communicate requests clearly to non-signing recipients.

Guidelines:
1. The user may be communicating via recognized ISL hand gestures (fingerspelled letters or recognized words) or typed input.
2. Because gestures are tracked via computer vision, user messages might sometimes be brief or in uppercase. Interpret intent with kindness.
3. Always utilize the verified results from MCP tools when answering ISL sign inquiries or formatting accessible messages.
4. Do not falsely claim you are translating continuous fluent ISL grammar when fingerspelling/static gestures are used.
5. Provide accurate, helpful answers to queries, campus directions, or general questions.
6. Keep language clear, accessible, and friendly.`;

/**
 * Inspect available AI credentials without exposing secret values.
 */
export function getAIStatus() {
  loadEnvFile();

  if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini_api_key_here')) {
    return {
      configured: true,
      provider: 'gemini',
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      isBuiltin: false,
      message: 'Google Gemini is active and connected with MCP tool calling',
    };
  }

  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your_openai_api_key_here')) {
    return {
      configured: true,
      provider: 'openai',
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      isBuiltin: false,
      message: 'OpenAI is active and connected with MCP tool calling',
    };
  }

  if (process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes('your_groq_api_key_here')) {
    return {
      configured: true,
      provider: 'groq',
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      isBuiltin: false,
      message: 'Groq is active and connected with MCP tool calling',
    };
  }

  if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes('your_anthropic_api_key_here')) {
    return {
      configured: true,
      provider: 'anthropic',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      isBuiltin: false,
      message: 'Anthropic Claude is active and connected with MCP tool calling',
    };
  }

  if (process.env.OLLAMA_BASE_URL) {
    return {
      configured: true,
      provider: 'ollama',
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      isBuiltin: false,
      message: 'Local Ollama is configured and ready with MCP tool calling',
    };
  }

  // Built-in intelligent conversational assistant mode
  return {
    configured: true,
    provider: 'signbridge-ai',
    model: 'isl-mcp-orchestrator-v1',
    isBuiltin: true,
    message: 'SignBridge Conversational AI is active (built-in) with native MCP tool execution.',
  };
}

/**
 * Analyze user message and determine if an MCP tool should be invoked.
 */
export function identifyMcpToolRequirement(message) {
  const raw = (message || '').trim();
  const clean = raw.toLowerCase();

  // 1. Accessible message / communication assistance intent
  if (
    /tell\s+(the\s+)?(receptionist|reception|doctor|nurse|clinic|staff|counter|person|librarian)/i.test(clean) ||
    /help\s+me\s+(to\s+)?(tell|ask|say|explain|communicate|request|inform)/i.test(clean) ||
    /(need|require|want)\s+(medical|urgent|emergency|doctor|hospital|first\s*aid|assistance)/i.test(clean) ||
    /communicate\s+(my\s+)?(need|requirement|issue|problem)/i.test(clean) ||
    /prepare\s+(an?\s+)?(accessible\s+)?message/i.test(clean)
  ) {
    let context = 'general';
    let urgency = 'normal';
    if (/medical|doctor|clinic|pain|sick|hospital|first\s*aid/i.test(clean)) {
      context = 'medical';
      if (/urgent|emergency|pain|immediate/i.test(clean)) urgency = 'urgent';
    } else if (/reception|receptionist|front\s*desk/i.test(clean)) {
      context = 'reception';
    } else if (/fee|payment|accounts|counter/i.test(clean)) {
      context = 'counter';
    } else if (/library|book/i.test(clean)) {
      context = 'library';
    }

    let requirement = raw;
    const match = raw.match(/(?:tell\s+(?:the\s+|a\s+|an\s+)?(?:receptionist|reception|doctor|staff|counter|librarian)\s+(?:that\s+)?|help\s+me\s+(?:to\s+)?(?:tell\s+(?:the\s+|a\s+|an\s+)?(?:receptionist|reception|doctor|staff|counter|librarian)\s+(?:that\s+)?|tell|ask|say|explain)\s+(?:that\s+)?)(.*)/i);
    if (match && match[1] && match[1].trim()) {
      requirement = match[1].trim();
    }

    return {
      tool: 'prepare_accessible_message',
      arguments: {
        requirement,
        context,
        urgency,
      },
    };
  }

  // 2. ISL sign details intent
  if (
    /(?:details\s+(?:of|for)|how\s+to\s+sign|how\s+do\s+i\s+sign|show\s+me\s+(?:the\s+)?sign\s+for|what\s+is\s+the\s+sign\s+for)\s+([a-z0-9\s-]+)/i.test(clean)
  ) {
    const match = clean.match(/(?:details\s+(?:of|for)|how\s+to\s+sign|how\s+do\s+i\s+sign|show\s+me\s+(?:the\s+)?sign\s+for|what\s+is\s+the\s+sign\s+for)\s+([a-z0-9\s-]+)/i);
    const extracted = match?.[1]?.replace(/[^\w\s-]/g, '').trim();
    if (extracted) {
      return {
        tool: 'search_isl_signs',
        arguments: {
          query: extracted,
        },
      };
    }
  }

  // 3. General ISL vocabulary search intent
  if (
    /(?:how\s+(?:do\s+i\s+)?say|sign\s+language|in\s+isl|sign\s+for|gesture\s+for|fingerspell|vocabulary)\b/i.test(clean) ||
    /^(thank\s+you|namaste|help|please\s+wait|where\s+room|fee\s+counter|library|yes|no)\b/i.test(clean)
  ) {
    let query = clean
      .replace(/how\s+(?:do\s+i\s+)?(?:say|sign|make)\s+/i, '')
      .replace(/\s+in\s+isl\??/i, '')
      .replace(/(?:what\s+is\s+the\s+)?sign\s+(?:for\s+)?/i, '')
      .replace(/[?!.]/g, '')
      .trim();

    if (!query) query = clean;

    return {
      tool: 'search_isl_signs',
      arguments: {
        query,
      },
    };
  }

  return null;
}

/**
 * Intelligent built-in conversational responder for Indian Sign Language communication,
 * powered by real MCP tool results.
 */
function generateBuiltinResponse(message, history = [], mcpToolCalls = []) {
  const raw = message.trim();
  const clean = raw.replace(/\s+/g, ' ');
  const upper = clean.toUpperCase();

  // If we executed prepare_accessible_message via MCP, format the verified result
  const accessibleCall = mcpToolCalls.find(tc => tc.tool === 'prepare_accessible_message');
  if (accessibleCall && accessibleCall.result?.success) {
    const r = accessibleCall.result;
    return `I have prepared an accessible communication card for you via the Model Context Protocol (MCP) to present to the ${r.recipientType}:\n\n"${r.accessibleMessage}"\n\n📌 Recommended Action: You can show this message in High-Contrast Display mode or copy it to clipboard. Counter staff can read and type their response directly here.`;
  }

  // If we executed search_isl_signs or get_sign_details via MCP, format verified sign information
  const searchCall = mcpToolCalls.find(tc => tc.tool === 'search_isl_signs' || tc.tool === 'get_sign_details');
  if (searchCall && searchCall.result) {
    const r = searchCall.result;
    if (r.found && Array.isArray(r.matches) && r.matches.length > 0) {
      const sign = r.matches[0];
      return `According to verified Indian Sign Language (ISL) standards from the ISLRTC:\n\n` +
        `• Sign: ${sign.name} (${sign.category})\n` +
        `• Meaning: ${sign.meaning}\n` +
        `• Instructions: ${sign.instructions}\n` +
        `• Handshape: ${sign.handshapeType}\n` +
        (sign.poseTip ? `• Pose Tip: ${sign.poseTip}\n` : '') +
        `• Verified Source: ${sign.sourceName} (ISLRTC Official Standard)`;
    } else if (r.sign) {
      const s = r.sign;
      return `Verified ISL Sign Details for "${s.name}":\n\n` +
        `• Meaning: ${s.meaning}\n` +
        `• Instructions: ${s.instructions}\n` +
        `• Handshape: ${s.handshapeType} (${s.category})\n` +
        (s.poseTip ? `• Tip: ${s.poseTip}\n` : '') +
        `• Verified Linguistic Authority: ${s.sourceName}`;
    } else if (r.canBeFingerspelled && Array.isArray(r.fingerspellingLetters)) {
      return `The word "${r.query}" is not currently a standalone sign in the verified ISLRTC lexicon, but you can fingerspell it letter-by-letter using the ISL camera recognition:\n\n` +
        `👉 ${r.fingerspellingLetters.join(' - ')}\n\nHold each letter sign in front of the camera for ~0.3s to type it into the composer!`;
    }
  }

  // Extract recent context from history
  const recentTopics = history
    .slice(-4)
    .map(h => (typeof h.text === 'string' ? h.text.toLowerCase() : ''))
    .join(' ');

  // 1. Greetings
  if (/^(HELLO|HI|HEY|NAMASTE|GOOD MORNING|GOOD AFTERNOON|GOOD EVENING|VANAKKAM|AADAAB)\b/i.test(upper) || upper === 'H E L L O' || upper === 'H I') {
    if (history.length > 2) {
      return `Hello again! I am right here with you. What would you like to ask or sign next?`;
    }
    return `Namaste and hello! I am SignBridge AI. I can understand your ISL fingerspelled words and typed messages in real time. How can I help you today?`;
  }

  // 2. Identity & capabilities
  if (/(WHO ARE YOU|WHAT ARE YOU|WHAT CAN YOU DO|HOW DO YOU WORK|ABOUT)/i.test(upper)) {
    return `I am your SignBridge conversational assistant powered by the Model Context Protocol (MCP)! I bridge communication between signers and non-signers. You can fingerspell words using the camera on the left (e.g. spelling H-E-L-L-O or numbers 1-5), search verified ISL signs from the ISLRTC repository, prepare accessible messages for receptionists or doctors, and ask campus counter directions.`;
  }

  // 3. Indian Sign Language / Fingerspelling questions
  if (/(ISL|FINGERSPELLING|SIGN LANGUAGE|GESTURE|HOW TO SIGN|ALPHABET|LETTERS)/i.test(upper)) {
    return `In Indian Sign Language (ISL), fingerspelling represents individual letters of the alphabet. In SignBridge, hold any letter sign steadily for about 0.3 seconds in front of the camera, and it will automatically type into the composer. To sign repeated letters like 'LL' in 'HELLO', briefly pause or relax your hand between signs!`;
  }

  // 4. Admissions, Fees, Registration, Room queries
  if (/(FEE|FEES|PAYMENT|COUNTER|ADMISSION|REGISTER|REGISTRATION)/i.test(upper)) {
    return `The Admissions and Fee Payment counter is located in Room 104 on the ground floor, just down the main corridor to your right. If you have your student registration slip ready, the staff there will process it immediately.`;
  }

  if (/(LIBRARY|BOOK|BOOKS|CARD|READING)/i.test(upper)) {
    return `The Central Library is on the second floor of Block B. To issue reference books or apply for a student library card, visit Counter 2 at the library entrance with your college ID.`;
  }

  if (/(ROOM|WHERE IS|LOCATION|DIRECTION|DIRECTIONS|OFFICE|DEAN|COUNSELOR)/i.test(upper)) {
    return `Main administrative offices, student counseling, and information counters are located on the ground floor of the Academic Block. If you are looking for a specific room number or department, let me know and I will guide you!`;
  }

  // 5. Gratitude & parting
  if (/(THANK YOU|THANKS|DHANYAVAAD|SHUKRIYA|BYE|GOODBYE|SEE YOU)/i.test(upper)) {
    return `You are very welcome! It is a pleasure communicating with you through SignBridge. Feel free to sign again whenever you need assistance!`;
  }

  // 6. Help / Assistance request
  if (/^(HELP|HELP ME|ASSIST|ASSISTANCE|PLEASE HELP)\b/i.test(upper) || upper === 'H E L P') {
    return `I am here to assist you! You can fingerspell words or questions with your hands, ask for counter locations, or request general information. What do you need help with?`;
  }

  // 7. Status / Health checks
  if (/(HOW ARE YOU|HOW IS IT GOING|STATUS)/i.test(upper)) {
    return `I am doing great and ready to communicate! Your camera tracking, fingerspelling connection, and MCP tools are working smoothly. What's on your mind?`;
  }

  // 8. Yes / No / Confirmation responses
  if (/^(YES|NO|OK|OKAY|SURE|FINE|ALRIGHT)\b/i.test(upper)) {
    if (recentTopics.includes('counter') || recentTopics.includes('fee') || recentTopics.includes('room')) {
      return `Understood! Let me know if you would like me to clarify the directions or help you with anything else.`;
    }
    return `Got it! Please feel free to continue signing or ask any question you have.`;
  }

  // 9. Contextual fallback acknowledging user message
  const words = clean.split(' ').filter(Boolean);
  if (words.length === 1 && words[0].length <= 5) {
    return `I received your sign for "${clean}". Could you sign the next word or let me know what you would like to know about "${clean}"?`;
  }

  return `I understood your message: "${clean}". I am here to help you communicate via ISL signs and answer any questions about campus counters, facilities, or sign language assistance. What would you like to explore next?`;
}

/**
 * Call the configured AI provider with dynamic MCP tool discovery and execution.
 */
export async function generateAIResponse({ message, history = [] }) {
  const status = getAIStatus();

  // Filter and normalize history
  const cleanHistory = (Array.isArray(history) ? history : [])
    .filter(m => m && typeof m.text === 'string' && m.text.trim().length > 0)
    .slice(-12);

  // 1. Tool discovery from official MCP server
  let mcpTools = [];
  try {
    mcpTools = await discoverMcpTools();
  } catch (err) {
    console.warn('[SignBridge MCP] Could not discover tools:', err.message);
  }

  const toolCalls = [];

  // 2. Identify if user message triggers an MCP tool requirement
  const toolReq = identifyMcpToolRequirement(message);
  if (toolReq) {
    const executed = await executeMcpTool(toolReq.tool, toolReq.arguments);
    toolCalls.push(executed);

    // If search_isl_signs matched a specific sign, retrieve full details
    if (toolReq.tool === 'search_isl_signs' && executed.result?.found && executed.result.matches?.length === 1) {
      const signId = executed.result.matches[0].id;
      const details = await executeMcpTool('get_sign_details', { sign_id: signId });
      toolCalls.push(details);
    }
  }

  const mcpPayload = {
    toolsDiscovered: mcpTools.map(t => t.name),
    toolCalls,
  };

  // 3. Provider-specific generation
  if (status.provider === 'gemini') {
    const res = await callGemini(message, cleanHistory, status.model, mcpTools, toolCalls);
    return {
      ...res,
      mcp: mcpPayload,
    };
  }

  if (status.provider === 'openai' || status.provider === 'groq') {
    const res = await callOpenAICompatible(message, cleanHistory, status, mcpTools, toolCalls);
    return {
      ...res,
      mcp: mcpPayload,
    };
  }

  if (status.provider === 'anthropic') {
    const res = await callAnthropic(message, cleanHistory, status.model, toolCalls);
    return {
      ...res,
      mcp: mcpPayload,
    };
  }

  if (status.provider === 'ollama') {
    const res = await callOllama(message, cleanHistory, status.model, toolCalls);
    return {
      ...res,
      mcp: mcpPayload,
    };
  }

  // Built-in intelligent conversational assistant
  const reply = generateBuiltinResponse(message, cleanHistory, toolCalls);
  return {
    reply,
    provider: 'signbridge-ai',
    model: 'isl-mcp-orchestrator-v1',
    mcp: mcpPayload,
  };
}

async function callGemini(message, cleanHistory, model = 'gemini-2.0-flash', mcpTools = [], existingToolCalls = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  const targetModel = model || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${apiKey}`;

  // Build clean alternating history
  const rawItems = [];
  for (const item of cleanHistory) {
    if (!item || typeof item.text !== 'string' || !item.text.trim()) continue;
    const role = (item.sender === 'signer' || item.sender === 'user') ? 'user' : 'model';
    rawItems.push({ role, text: item.text.trim() });
  }

  // Ensure current message is present
  const cleanMsg = message.trim();
  if (rawItems.length === 0 || rawItems[rawItems.length - 1].text !== cleanMsg) {
    rawItems.push({ role: 'user', text: cleanMsg });
  }

  const contents = [];
  for (const item of rawItems) {
    if (contents.length === 0) {
      if (item.role === 'user') {
        contents.push({ role: 'user', parts: [{ text: item.text }] });
      }
      continue;
    }
    const prev = contents[contents.length - 1];
    if (prev.role === item.role) {
      prev.parts.push({ text: item.text });
    } else {
      contents.push({ role: item.role, parts: [{ text: item.text }] });
    }
  }

  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: cleanMsg }] });
  }

  // Append MCP tool execution context if available
  let enhancedSystemPrompt = SYSTEM_PROMPT;
  if (existingToolCalls.length > 0) {
    const toolSummary = existingToolCalls
      .map(tc => `MCP Tool [${tc.tool}] executed with result: ${JSON.stringify(tc.result)}`)
      .join('\n');
    enhancedSystemPrompt += `\n\nVerified MCP Tool Data for this turn:\n${toolSummary}\nIncorporate this verified data clearly in your response.`;
  }

  const payload = {
    systemInstruction: {
      parts: [{ text: enhancedSystemPrompt }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      let parsedMsg = errText;
      try {
        const parsed = JSON.parse(errText);
        parsedMsg = parsed.error?.message || errText;
      } catch {
        // fallback
      }
      console.warn(`[Gemini API Warning] ${parsedMsg}. Falling back to SignBridge built-in assistant.`);
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return {
        reply: fallbackReply,
        provider: 'gemini (active with fallback)',
        model: targetModel,
      };
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return { reply: fallbackReply, provider: 'gemini', model: targetModel };
    }

    return {
      reply: reply.trim(),
      provider: 'gemini',
      model: targetModel,
    };
  } catch (netErr) {
    console.warn('[Gemini Network/Timeout Error]', netErr.message, 'Falling back to built-in dialog engine.');
    const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
    return {
      reply: fallbackReply,
      provider: 'gemini (offline fallback)',
      model: targetModel,
    };
  }
}

async function callOpenAICompatible(message, cleanHistory, status, mcpTools = [], existingToolCalls = []) {
  const isGroq = status.provider === 'groq';
  const apiKey = isGroq ? process.env.GROQ_API_KEY : process.env.OPENAI_API_KEY;
  const baseUrl = isGroq
    ? 'https://api.groq.com/openai/v1'
    : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1');

  let systemContent = SYSTEM_PROMPT;
  if (existingToolCalls.length > 0) {
    const toolSummary = existingToolCalls
      .map(tc => `MCP Tool [${tc.tool}] executed: ${JSON.stringify(tc.result)}`)
      .join('\n');
    systemContent += `\n\nVerified MCP Tool Data:\n${toolSummary}\nIncorporate this verified data in your reply.`;
  }

  const messages = [
    { role: 'system', content: systemContent },
  ];

  for (const item of cleanHistory) {
    const role = (item.sender === 'signer' || item.sender === 'user') ? 'user' : 'assistant';
    messages.push({ role, content: item.text });
  }

  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: status.model,
        messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn(`[OpenAI API Warning] ${errText}. Falling back to built-in conversational assistant.`);
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return {
        reply: fallbackReply,
        provider: `${status.provider} (fallback)`,
        model: status.model,
      };
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return { reply: fallbackReply, provider: status.provider, model: status.model };
    }

    return {
      reply: reply.trim(),
      provider: status.provider,
      model: status.model,
    };
  } catch (err) {
    console.warn(`[${status.provider} Network Error]`, err.message, 'Falling back to built-in dialog engine.');
    const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
    return {
      reply: fallbackReply,
      provider: `${status.provider} (offline fallback)`,
      model: status.model,
    };
  }
}

async function callAnthropic(message, cleanHistory, model, existingToolCalls = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  let systemContent = SYSTEM_PROMPT;
  if (existingToolCalls.length > 0) {
    const toolSummary = existingToolCalls
      .map(tc => `MCP Tool [${tc.tool}] executed: ${JSON.stringify(tc.result)}`)
      .join('\n');
    systemContent += `\n\nVerified MCP Tool Data:\n${toolSummary}`;
  }

  const messages = [];
  for (const item of cleanHistory) {
    const role = (item.sender === 'signer' || item.sender === 'user') ? 'user' : 'assistant';
    messages.push({ role, content: item.text });
  }

  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        system: systemContent,
        messages,
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return { reply: fallbackReply, provider: 'anthropic (fallback)', model };
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text;
    return {
      reply: (reply || generateBuiltinResponse(message, cleanHistory, existingToolCalls)).trim(),
      provider: 'anthropic',
      model,
    };
  } catch {
    const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
    return { reply: fallbackReply, provider: 'anthropic (fallback)', model };
  }
}

async function callOllama(message, cleanHistory, model, existingToolCalls = []) {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  let systemContent = SYSTEM_PROMPT;
  if (existingToolCalls.length > 0) {
    const toolSummary = existingToolCalls
      .map(tc => `MCP Tool [${tc.tool}] executed: ${JSON.stringify(tc.result)}`)
      .join('\n');
    systemContent += `\n\nVerified MCP Tool Data:\n${toolSummary}`;
  }

  const messages = [
    { role: 'system', content: systemContent },
  ];

  for (const item of cleanHistory) {
    const role = (item.sender === 'signer' || item.sender === 'user') ? 'user' : 'assistant';
    messages.push({ role, content: item.text });
  }

  messages.push({ role: 'user', content: message });

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages,
        stream: false,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
      return { reply: fallbackReply, provider: 'ollama (fallback)', model };
    }

    const data = await response.json();
    const reply = data.message?.content;
    return {
      reply: (reply || generateBuiltinResponse(message, cleanHistory, existingToolCalls)).trim(),
      provider: 'ollama',
      model,
    };
  } catch {
    const fallbackReply = generateBuiltinResponse(message, cleanHistory, existingToolCalls);
    return { reply: fallbackReply, provider: 'ollama (fallback)', model };
  }
}

/**
 * Save an API key from the frontend settings dialog directly to .env and memory.
 */
export function saveApiKey({ provider, apiKey, model }) {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    throw new Error('API key cannot be empty');
  }

  const envVar = provider === 'openai' ? 'OPENAI_API_KEY' : 'GEMINI_API_KEY';
  process.env[envVar] = cleanKey;

  if (model) {
    const modelVar = provider === 'openai' ? 'OPENAI_MODEL' : 'GEMINI_MODEL';
    process.env[modelVar] = model.trim();
  } else if (provider === 'gemini') {
    process.env.GEMINI_MODEL = 'gemini-2.0-flash';
  }

  // Update or append to .env file
  const envPath = path.join(projectRoot, '.env');
  let currentContent = '';
  if (fs.existsSync(envPath)) {
    currentContent = fs.readFileSync(envPath, 'utf8');
  } else {
    const examplePath = path.join(projectRoot, '.env.example');
    if (fs.existsSync(examplePath)) {
      currentContent = fs.readFileSync(examplePath, 'utf8');
    }
  }

  const regex = new RegExp(`^${envVar}=.*$`, 'm');
  if (regex.test(currentContent)) {
    currentContent = currentContent.replace(regex, `${envVar}=${cleanKey}`);
  } else {
    currentContent += `\n${envVar}=${cleanKey}\n`;
  }

  fs.writeFileSync(envPath, currentContent, 'utf8');
  return getAIStatus();
}

/**
 * Robust JSON body reader for Node HTTP / Connect / Vite dev server middleware.
 */
async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 500000) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!raw || !raw.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error('Invalid JSON format: ' + err.message));
      }
    });
    req.on('error', reject);
    if (typeof req.resume === 'function') {
      req.resume();
    }
  });
}

/**
 * Handle incoming HTTP requests in Connect / Vite / Node http server.
 */
export async function handleApiRequest(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = req.url || '';
  const pathname = url.split('?')[0];

  // AI Status endpoint
  if (req.method === 'GET' && (pathname === '/api/ai-status' || pathname === '/api/health')) {
    const status = getAIStatus();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(status));
    return;
  }

  // MCP Status endpoint
  if (req.method === 'GET' && pathname === '/api/mcp/status') {
    const status = await getMcpStatus();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(status));
    return;
  }

  // MCP Tools discovery endpoint
  if (req.method === 'GET' && pathname === '/api/mcp/tools') {
    try {
      const tools = await discoverMcpTools();
      const status = await getMcpStatus();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, status, tools }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // MCP Direct tool call endpoint (for testing, demo, or external client)
  if (req.method === 'POST' && pathname === '/api/mcp/call') {
    try {
      const body = await readJsonBody(req);
      const { tool, arguments: args } = body;
      if (!tool) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Tool name is required', code: 'INVALID_REQUEST' }));
        return;
      }
      const result = await executeMcpTool(tool, args || {});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message, code: 'MCP_CALL_FAILED' }));
    }
    return;
  }

  // Save API key
  if (req.method === 'POST' && pathname === '/api/save-key') {
    try {
      const body = await readJsonBody(req);
      const status = saveApiKey(body);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, status }));
    } catch (err) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: err.message || 'Failed to save key', code: 'SAVE_KEY_FAILED' }));
    }
    return;
  }

  // Chat endpoint
  if (req.method === 'POST' && pathname === '/api/chat') {
    try {
      const body = await readJsonBody(req);
      const { message, history } = body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Message text is required', code: 'INVALID_REQUEST' }));
        return;
      }

      const result = await generateAIResponse({
        message: message.trim(),
        history: Array.isArray(history) ? history : [],
      });

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error('[SignBridge AI Error]', err.message);
      const statusCode = err.status || 500;
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        error: typeof err.message === 'string' ? err.message : 'An error occurred while generating AI response.',
        code: err.code || 'AI_ERROR',
      }));
    }
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Not found', code: 'NOT_FOUND' }));
}
