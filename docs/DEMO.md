# SignBridge: MCP-Powered AI Accessibility Assistant
## Hackathon Track: "Make MCP Matter" – Live Demonstration Script

This step-by-step presentation script demonstrates SignBridge and genuine Model Context Protocol (MCP) tool orchestration.

---

## Pre-Flight Verification Checklist (30 seconds)

1. Run the full verification pipeline in terminal:
   ```bash
   npm run verify
   ```
   **Points to highlight:**
   - ✅ 73 Unit & Integration Tests Passed (including dedicated MCP test suite `src/test/mcp.test.mjs`).
   - ✅ Color Audit Passed: 0 blue/cool-hue violations across 71 files, strictly adhering to accessible warm tokens.
   - ✅ Local MediaPipe assets verified (runs 100% offline).
   - ✅ Production TypeScript compilation and Vite build succeeded.

2. Start the application:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in Chrome or Edge.

---

## 4-Minute Live Hackathon Demonstration Flow

### Act 1: The Vision & Architecture (45s)
- **Goal:** Introduce SignBridge as an accessible, two-way communication assistant powered by genuine Model Context Protocol (MCP) integration.
- **The Problem:** Non-signers do not understand Indian Sign Language (ISL), and LLMs frequently hallucinate sign descriptions without verified linguistic grounding.
- **The MCP Solution:** SignBridge connects the conversational AI to a genuine MCP Server via official `@modelcontextprotocol/sdk`. The AI discovers tools dynamically and retrieves verified ISLRTC (Indian Sign Language Research and Training Centre) vocabulary.

---

### Act 2: Genuine MCP Tool 1 & 2 Execution — "How do I say Thank You in ISL?" (60s)
1. In the SignBridge Workspace, locate the assistant chat composer on the right.
2. Type or select: **"How do I say Thank You in ISL?"**
3. Click **Send** (or press Enter).
4. **Observe the MCP orchestration:**
   - Typing indicator displays: **"Querying MCP Tools... Responding..."**
   - AI discovers tools and invokes `search_isl_signs` with `{ query: "Thank You" }` over the official MCP transport.
   - MCP Server queries verified ISLRTC dataset and returns structured results.
   - AI invokes `get_sign_details` for comprehensive posture information.
   - AI synthesizes a clear, polite answer using the verified tool output.
5. **Inspect the UI:**
   - Notice the **"MCP Verified"** badge on the assistant header.
   - Expand the **Model Context Protocol (MCP) Tool Execution Tray**.
   - Show the execution latency (e.g. `1ms via MCP`).
   - Show the matched sign details: `Thank You (Common Phrases)`, `one-handed`, verified ISLRTC reference link.
   - Click **"View Raw MCP JSON-RPC Payload"** to show judges the genuine MCP JSON-RPC response!

---

### Act 3: Genuine MCP Tool 3 Execution — "Help me tell the receptionist that I need medical assistance" (60s)
1. In the composer, enter:
   **"Help me tell the receptionist that I need medical assistance."**
2. Click **Send**.
3. **Observe the MCP orchestration:**
   - AI identifies user communication intent and invokes `prepare_accessible_message` via MCP.
   - Arguments passed: `{ requirement: "I need medical assistance", context: "reception", urgency: "urgent" }`.
   - MCP Server constructs an accessible, dignified statement formatted for the Receptionist.
4. **Inspect the Accessible Presentation Card:**
   - Displayed inside the conversation thread:
     - **Presented to:** Receptionist
     - **Message:** `"URGENT ASSISTANCE NEEDED: Hello, I am Deaf / Hard-of-Hearing. I require immediate assistance regarding: I need medical assistance..."`
   - Click **"Copy Accessible Text"** to copy the formatted message to clipboard.
   - Click the **Volume (TTS)** icon to speak the request aloud for counter staff.

---

### Act 4: Preserved Core Accessibility & ISL Camera Recognition (60s)
1. On the left panel, click **Start Camera**.
2. Allow webcam access — point out MediaPipe 21-point hand tracking with high-contrast warm landmarks (0% blue).
3. Fingerspell letters or show numerals (1, 2, 3) in front of the camera.
4. Point out the **Hold-to-Confirm** radial indicator (280ms) and **WordBuilder** typing into the composer.
5. Click **Confirm & Send** — the recognized sign sends into the shared thread.
6. Open **Gesture Guide** (or **Learn Signs** tab) to show verified ISLRTC alphabet (A-Z) and numbers (0-9).
7. Toggle **Large Display Mode** for wide-desk counter readability.

---

## Summary of MCP Endpoints for Verification

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/mcp/tools` | `GET` | Tool discovery: returns registered MCP tools & schemas |
| `/api/mcp/status` | `GET` | Health check: server name, transport, tool count |
| `/api/mcp/call` | `POST` | Direct invocation of MCP tools with structured response |
| `/api/chat` | `POST` | AI chat endpoint with automated MCP tool orchestration |
