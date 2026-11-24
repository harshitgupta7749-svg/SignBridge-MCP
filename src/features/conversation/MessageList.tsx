import React, { useRef, useEffect, useState } from 'react';
import type { Message } from './types';
import { 
  Volume2, 
  User, 
  Sparkles, 
  Pencil, 
  Trash2, 
  Copy, 
  Check, 
  X, 
  RotateCcw, 
  AlertCircle,
  Wrench,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { formatTime } from '../../lib/time';
import { copyToClipboard } from '../../lib/clipboard';
import { normalizeMessageText } from './signBridgeBot';

interface MessageListProps {
  messages: Message[];
  onSpeakMessage: (text: string) => void;
  isSpeaking: boolean;
  isAiGenerating?: boolean;
  aiError?: string | null;
  onRetryMessage?: (text: string) => void;
  onEditMessage?: (id: string, newText: string) => void;
  onDeleteMessage?: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onSpeakMessage,
  isAiGenerating = false,
  aiError = null,
  onRetryMessage,
  onEditMessage,
  onDeleteMessage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedMcpId, setCopiedMcpId] = useState<string | null>(null);

  // Auto-scroll to newest message or typing indicator
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAiGenerating, aiError]);

  const handleStartEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditText(normalizeMessageText(msg.text));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleSaveEdit = (id: string) => {
    const clean = normalizeMessageText(editText);
    if (!clean) return;
    onEditMessage?.(id, clean);
    setEditingId(null);
    setEditText('');
  };

  const handleCopy = (msg: Message) => {
    const textToCopy = normalizeMessageText(msg.text);
    copyToClipboard(textToCopy);
    setCopiedId(msg.id);
    setTimeout(() => {
      setCopiedId(prev => (prev === msg.id ? null : prev));
    }, 1800);
  };

  const handleCopyAccessible = (id: string, text: string) => {
    copyToClipboard(text);
    setCopiedMcpId(id);
    setTimeout(() => {
      setCopiedMcpId(prev => (prev === id ? null : prev));
    }, 1800);
  };

  if (messages.length === 0 && !isAiGenerating) {
    return (
      <div
        className="message-stream"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--muted-text)',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div 
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--sand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <Sparkles size={32} color="var(--terracotta)" />
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--chocolate)', fontSize: '1.15rem' }}>
          Conversation is ready
        </h3>
        <p style={{ maxWidth: '360px', fontSize: '0.88rem', marginTop: '0.4rem', lineHeight: 1.5 }}>
          Sign in front of the camera on the left to compose ISL letters and words, or type a message below.
          The assistant is integrated with official Model Context Protocol (MCP) tools for ISLRTC sign verification.
        </p>
      </div>
    );
  }

  // Get the last user message to support retry if needed
  const lastUserMessage = [...messages].reverse().find(m => m.sender === 'signer')?.text;

  return (
    <div className="message-stream" ref={scrollRef} role="log" aria-label="Conversation messages">
      {messages.map(msg => {
        const isSigner = msg.sender === 'signer';
        const isAssistant = msg.sender === 'assistant';
        const isEditing = editingId === msg.id;

        // Visual distinction: Signer/User on the right, Assistant/Desk on the left
        const bubbleClass = isSigner ? 'signer' : 'reply';
        const safeText = normalizeMessageText(msg.text);
        const hasMcpCalls = !!(msg.mcp?.toolCalls && msg.mcp.toolCalls.length > 0);

        return (
          <div
            key={msg.id}
            className={`message-bubble ${bubbleClass}`}
            data-sender={msg.sender}
          >
            <div className="message-header">
              <span className="message-sender-tag">
                {isSigner ? (
                  <>
                    <User size={13} color="var(--terracotta)" />
                    <span>Signer (Student / Visitor)</span>
                  </>
                ) : isAssistant ? (
                  <>
                    <Sparkles size={13} color="var(--terracotta)" />
                    <span style={{ fontWeight: 700, color: 'var(--chocolate)' }}>SignBridge Assistant</span>
                    {hasMcpCalls && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.4rem',
                          backgroundColor: 'var(--sand)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--terracotta)',
                          fontWeight: 700,
                          marginLeft: '0.35rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem',
                        }}
                      >
                        <Wrench size={10} />
                        MCP Verified
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <User size={13} color="var(--brown)" />
                    <span>Desk Operator (Reply)</span>
                  </>
                )}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {msg.editedAt && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted-text)', fontStyle: 'italic' }}>
                    (edited)
                  </span>
                )}
                <span>{formatTime(msg.timestamp)}</span>
              </div>
            </div>

            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                <textarea
                  className="reply-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={2}
                  style={{ width: '100%', fontSize: '0.9rem' }}
                  autoFocus
                  aria-label="Edit message content"
                />
                <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    onClick={handleCancelEdit}
                  >
                    <X size={12} />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                    onClick={() => handleSaveEdit(msg.id)}
                    disabled={!editText.trim()}
                  >
                    <Check size={12} />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="message-text">{safeText}</div>
            )}

            {/* MCP Structured Tool Activity & Verified Results Card */}
            {hasMcpCalls && msg.mcp?.toolCalls && (
              <div
                className="mcp-tool-tray"
                style={{
                  marginTop: '0.65rem',
                  padding: '0.75rem',
                  backgroundColor: 'var(--cream)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Wrench size={14} color="var(--terracotta)" />
                    <span style={{ fontWeight: 700, fontSize: '0.78rem', color: 'var(--chocolate)' }}>
                      Model Context Protocol (MCP) Tool Execution
                    </span>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.68rem',
                      color: 'var(--olive)',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    ISLRTC Verified
                  </span>
                </div>

                {msg.mcp.toolCalls.map((tc, idx) => {
                  const isAccessible = tc.tool === 'prepare_accessible_message';
                  const isSearch = tc.tool === 'search_isl_signs';
                  const isDetails = tc.tool === 'get_sign_details';

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '0.55rem 0.75rem',
                        backgroundColor: 'var(--sand)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.75rem', color: 'var(--chocolate)' }}>
                          🛠️ {tc.tool}
                        </span>
                        {typeof tc.durationMs === 'number' && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--brown)' }}>
                            {tc.durationMs}ms via MCP
                          </span>
                        )}
                      </div>

                      {/* Display for prepare_accessible_message */}
                      {isAccessible && tc.result?.success && (
                        <div style={{ marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--chocolate)' }}>
                            <strong>Presented to:</strong> {tc.result.recipientType}
                          </div>
                          <div
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'var(--cream)',
                              border: '1px solid var(--border)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.78rem',
                              color: 'var(--chocolate)',
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {tc.result.accessibleMessage}
                          </div>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            style={{
                              alignSelf: 'flex-start',
                              fontSize: '0.7rem',
                              padding: '0.2rem 0.5rem',
                              gap: '0.3rem',
                            }}
                            onClick={() => handleCopyAccessible(`${msg.id}-${idx}`, tc.result.accessibleMessage)}
                          >
                            {copiedMcpId === `${msg.id}-${idx}` ? <Check size={12} color="var(--olive)" /> : <Copy size={12} />}
                            <span>{copiedMcpId === `${msg.id}-${idx}` ? 'Copied' : 'Copy Accessible Text'}</span>
                          </button>
                        </div>
                      )}

                      {/* Display for search_isl_signs */}
                      {isSearch && tc.result?.found && tc.result.matches?.[0] && (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--chocolate)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div>
                            <strong>Matched Sign:</strong> {tc.result.matches[0].name} ({tc.result.matches[0].category})
                          </div>
                          <div>
                            <strong>Instructions:</strong> {tc.result.matches[0].instructions}
                          </div>
                          {tc.result.matches[0].hasVisualMedia && tc.result.matches[0].sourceUrl && (
                            <a
                              href={tc.result.matches[0].sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: 'var(--terracotta)',
                                fontWeight: 600,
                                fontSize: '0.72rem',
                                textDecoration: 'none',
                                marginTop: '0.2rem',
                              }}
                            >
                              <BookOpen size={12} />
                              <span>View ISLRTC Official Dictionary Reference</span>
                              <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      )}

                      {/* Display for get_sign_details */}
                      {isDetails && tc.result?.found && tc.result.sign && (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--chocolate)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <div>
                            <strong>Sign:</strong> {tc.result.sign.name} • <em>{tc.result.sign.handshapeType}</em>
                          </div>
                          <div>
                            <strong>Linguistic Standard:</strong> {tc.result.sign.sourceName}
                          </div>
                        </div>
                      )}

                      {/* Expandable MCP Protocol JSON for verification */}
                      <details style={{ marginTop: '0.4rem', fontSize: '0.68rem', color: 'var(--brown)' }}>
                        <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                          View Raw MCP JSON-RPC Payload
                        </summary>
                        <pre
                          style={{
                            marginTop: '0.25rem',
                            padding: '0.4rem',
                            backgroundColor: 'var(--cream)',
                            borderRadius: 'var(--radius-sm)',
                            overflowX: 'auto',
                            fontSize: '0.65rem',
                            maxHeight: '120px',
                            color: 'var(--chocolate)',
                          }}
                        >
                          {JSON.stringify({ tool: tc.tool, arguments: tc.arguments, result: tc.result }, null, 2)}
                        </pre>
                      </details>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="message-footer">
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                style={{ padding: '0.2rem', color: 'var(--brown)' }}
                onClick={() => handleCopy(msg)}
                title="Copy message"
                aria-label={`Copy message: ${safeText.substring(0, 20)}`}
              >
                {copiedId === msg.id ? <Check size={13} color="var(--olive)" /> : <Copy size={13} />}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-icon"
                style={{ padding: '0.2rem', color: 'var(--brown)' }}
                onClick={() => onSpeakMessage(safeText)}
                title="Speak message aloud"
                aria-label={`Speak message: ${safeText.substring(0, 20)}`}
              >
                <Volume2 size={14} />
              </button>

              {onEditMessage && !isEditing && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{ padding: '0.2rem', color: 'var(--brown)' }}
                  onClick={() => handleStartEdit(msg)}
                  title="Edit message"
                  aria-label={`Edit message: ${safeText.substring(0, 20)}`}
                >
                  <Pencil size={13} />
                </button>
              )}

              {onDeleteMessage && (
                <button
                  type="button"
                  className="btn btn-ghost btn-icon"
                  style={{ padding: '0.2rem', color: 'var(--brown)' }}
                  onClick={() => onDeleteMessage(msg.id)}
                  title="Delete message"
                  aria-label={`Delete message: ${safeText.substring(0, 20)}`}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Assistant Typing / MCP Execution Indicator */}
      {isAiGenerating && (
        <div className="message-bubble reply ai-typing-bubble" aria-live="polite">
          <div className="message-header">
            <span className="message-sender-tag">
              <Sparkles size={13} color="var(--terracotta)" />
              <span style={{ fontWeight: 700, color: 'var(--chocolate)' }}>SignBridge Assistant</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.4rem',
                  backgroundColor: 'var(--sand)',
                  borderRadius: 'var(--radius-full)',
                  color: 'var(--terracotta)',
                  fontWeight: 600,
                  marginLeft: '0.35rem',
                }}
              >
                Querying MCP Tools...
              </span>
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted-text)' }}>Responding...</span>
          </div>
          <div className="typing-indicator" aria-label="Assistant is responding">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}

      {/* Fallback Notice */}
      {aiError && (
        <div
          className="ai-error-box"
          style={{
            backgroundColor: 'rgba(238, 220, 197, 0.4)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            alignSelf: 'stretch',
            marginTop: '0.5rem',
          }}
          role="alert"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <AlertCircle size={18} color="var(--terracotta)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, fontSize: '0.85rem', color: 'var(--chocolate)' }}>
              <strong>Notice:</strong> {normalizeMessageText(aiError)}
            </div>
          </div>
          {onRetryMessage && lastUserMessage && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{
                alignSelf: 'flex-start',
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                gap: '0.35rem',
              }}
              onClick={() => onRetryMessage(normalizeMessageText(lastUserMessage))}
            >
              <RotateCcw size={13} />
              <span>Retry Question</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
