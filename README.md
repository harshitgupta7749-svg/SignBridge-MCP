# SignBridge – MCP-Powered AI Accessibility Assistant
## Hackathon Track: Make MCP Matter

**Every gesture deserves to be understood.**

SignBridge is an Indian Sign Language (ISL) accessibility and two-way communication assistant powered by genuine **Model Context Protocol (MCP)** integration. It enables Deaf, Hard-of-Hearing, and non-signing individuals to communicate naturally through verified ISL sign recognition, dynamic tool discovery, and structured accessibility assistance.

---

## Key Achievements: "Make MCP Matter"

- **Genuine MCP Integration:** Implemented using the official `@modelcontextprotocol/sdk` (v1.6.0).
- **MCP Server & Client Architecture:** Server and Client connect over standard JSON-RPC 2.0 linked in-memory transport compatible with local and cloud deployments.
- **3 Core MCP Tools:**
  1. `search_isl_signs`: Search verified ISLRTC (Indian Sign Language Research and Training Centre) vocabulary.
  2. `get_sign_details`: Retrieve exact handshape types, pose instructions, distinction tips, and official media references.
  3. `prepare_accessible_message`: Format clear, high-contrast accessible communication cards for non-signing recipients (receptionists, doctors, counter operators).
- **AI-Driven Tool Orchestration:** Existing AI backend (Google Gemini, OpenAI, Groq, Anthropic, or built-in dialog engine) dynamically discovers MCP tools, invokes them over MCP transport, and synthesizes answers using verified data.
- **Transparent UI & Visual Tracking:** Every MCP tool execution displays an accessible verification badge, duration in milliseconds, retrieved linguistic data, and expandable raw JSON-RPC inspection for judges.
- **Preserved Core Features:** MediaPipe 21-point hand tracking, camera recognition, ISL fingerspelling, word builder with hold-to-confirm, Web Speech TTS, and 100% warm accessible theme (0% blue).

---

## Quick Start (Windows PowerShell)

```powershell
# Navigate to project directory
cd C:\Users\harshitgupta\.gemini\antigravity\scratch\signbridge-main

# Install dependencies
npm install

# Run the complete verification suite (audits, tests, build)
npm run verify

# Start development server
npm run dev

# Or start standalone backend server
npm run server
```

Then open `http://localhost:5173` in Chrome or Edge.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server with integrated MCP API middleware |
| `npm run server` | Start standalone Node.js HTTP backend server on port 3001 |
| `npm run build` | Compile TypeScript (`tsc -b`) and build production bundle |
| `npm run test` | Run all 73 Vitest unit and integration tests (including MCP suite) |
| `npm run audit:colors` | Run strict source and runtime CSSOM no-blue warm color audit |
| `npm run verify` | Complete pipeline: model checks, color audits, test suite, and build |
| `npm run check:models` | Validate local MediaPipe WASM and hand landmarker task files |

---

## MCP Architecture

```
+-------------------------------------------------------------+
|                 SignBridge Frontend (React + TS)            |
|  - LiveWorkspace (Camera preview, HUD, Hold-to-Confirm)    |
|  - MessageList (Conversation, MCP Tool Activity Cards)      |
|  - ReplyComposer (Voice Transcriber, Quick Replies)         |
+------------------------------+------------------------------+
                               |  /api/chat, /api/mcp/*
                               v
+-------------------------------------------------------------+
|             SignBridge Backend (server/aiBackend.mjs)       |
|  - Tool Orchestration Layer (Gemini / OpenAI / Built-in)     |
|  - Discovers tools dynamically via MCP Client               |
+------------------------------+------------------------------+
                               |  MCP Client (server/mcpClient.mjs)
                               v
                    [ Official MCP SDK Transport ]
                     Linked InMemoryTransport (JSON-RPC 2.0)
                               ^
                               |  MCP Server (server/mcpServer.mjs)
+------------------------------+------------------------------+
|                     SignBridge MCP Server                   |
|  - Tools:                                                   |
|    * search_isl_signs                                       |
|    * get_sign_details                                       |
|    * prepare_accessible_message                             |
|  - Linguistic Authority: ISLRTC Official Standards Vol 1 & 2|
+-------------------------------------------------------------+
```

---

## Live Demonstration Walkthrough

See `docs/DEMO.md` for the complete 4-minute hackathon presentation script.

**Example 1: ISL Sign Discovery**
1. User asks: *"How do I say Thank You in ISL?"*
2. AI identifies sign inquiry intent.
3. AI discovers available MCP tools and invokes `search_isl_signs`.
4. MCP Server returns verified ISLRTC entry (`handshapeType: one-handed`, instructions, official URL).
5. AI invokes `get_sign_details` for posture instructions.
6. AI responds with verified guidance and displays the MCP Execution Tray.

**Example 2: Accessible Communication Card**
1. User enters: *"Help me tell the receptionist that I need medical assistance."*
2. AI invokes `prepare_accessible_message` via MCP.
3. MCP Server formats a dignified statement addressed to the Receptionist.
4. User can copy the message or speak it aloud via TTS for the counter staff.

---

## Security and Privacy

- **Local Camera Processing:** MediaPipe hand tracking operates 100% in-browser via WebAssembly. Zero video frames are recorded, uploaded, or transmitted.
- **Secure Credentials:** API keys remain strictly on the backend or in local `.env` files. Never exposed to the client.
- **No External CDN Dependencies:** All model tasks and WASM binaries are served locally from `public/`.
- **Zero Authentication Complexity:** No OTP, SMS, or third-party auth dependencies.

---

## License

MIT License — SignBridge Team.
Linguistic Reference: Indian Sign Language Research and Training Centre (ISLRTC).
MediaPipe Tasks Vision: Apache 2.0 (Google LLC).
Lucide React Icons: ISC License.
