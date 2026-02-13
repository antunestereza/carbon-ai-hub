'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, ThumbsUp, ThumbsDown, Calendar, Github, Figma, FileCode, Video, CheckCircle } from '@/components/icons';
import { ArrowRight, ColorPalette, Code, Copy } from '@carbon/icons-react';
import { useRole, type OfficeHoursGuardian } from '@/contexts/RoleContext';
import { generateAIResponse } from '@/utils/aiResponses';
import { GuardianRecordModal } from '@/components/GuardianRecordModal';

/* ── Helpers ────────────────────────────────────────────── */

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 30) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Map a guardian specialty to contextual follow-up questions */
function getContextualQuestions(specialty: string): string[] {
  const lower = specialty.toLowerCase();
  if (lower.includes('layout') || lower.includes('pattern'))
    return ['What are the grid breakpoints?', 'How do I use the Shell layout?', 'Show me card component patterns', 'What spacing tokens should I use for layouts?'];
  if (lower.includes('color') || lower.includes('typography') || lower.includes('theming') || lower.includes('token'))
    return ['What are the color token values?', 'Show me the type scale', 'How do I create a custom theme?', 'What font weights are available?'];
  if (lower.includes('accessibility') || lower.includes('inclusive'))
    return ['How do I make modals accessible?', 'What are the keyboard navigation patterns?', 'Show me ARIA label guidelines', 'How do I test for accessibility?'];
  if (lower.includes('react') || lower.includes('hook') || lower.includes('component'))
    return ['Show me the Button component props', 'How do I use the DataTable component?', 'What hooks are available?', 'How do I handle component events?'];
  if (lower.includes('scss') || lower.includes('css'))
    return ['What\'s the spacing token for medium gaps?', 'How do I override theme variables?', 'Show me the SCSS mixin list', 'How do I use motion tokens?'];
  if (lower.includes('testing') || lower.includes('api'))
    return ['How do I test Carbon components?', 'What testing utilities are available?', 'Show me accessible component patterns', 'How do I mock Carbon components?'];
  return ['What are the specs for a DataTable?', 'Show me the Button component props', 'What\'s the spacing token for medium gaps?', 'How do I implement accessible modals?'];
}

const guidedQuestions = [
  'What are the specs for a DataTable?',
  'Show me the Button component props',
  "What's the spacing token for medium gaps?",
  'How do I implement accessible modals?',
  "What's the component maturity status?",
];

const PLACEHOLDER_PREFIX = 'Ask about ';
const placeholderSuggestions = [
  'carbon components, patterns, or guidelines...',
  'button component props',
  'accessible modals',
  'dataTable specs',
  'spacing tokens',
  'component maturity',
];

export function ChatInterface() {
  const { userRole, chatHistory, addMessage } = useRole();
  const isGuardian = userRole === 'guardian';
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [feedbackGivenForMessageIds, setFeedbackGivenForMessageIds] = useState<Map<string, 'helpful' | 'unhelpful'>>(new Map());
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [typingContext, setTypingContext] = useState<string>('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLButtonElement>(null);

  const handleCopyCode = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    });
  }, []);

  const handleFeedback = (messageId: string, type: 'helpful' | 'unhelpful') => {
    setFeedbackGivenForMessageIds((prev) => new Map(prev).set(messageId, type));
  };

  const hasMessages = chatHistory.length > 0;

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.setSelectionRange(0, 0);
  }, []);

  /* Stop placeholder cycling when user has already asked (chat mode) */
  useEffect(() => {
    if (hasMessages) return;
    const interval = setInterval(() => {
      setSuggestionIndex((i) => (i + 1) % placeholderSuggestions.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hasMessages]);

  /* Keep input focused after AI reply and when entering chat mode */
  useEffect(() => {
    if (!hasMessages) return;
    if (isTyping) return;
    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => clearTimeout(t);
  }, [hasMessages, isTyping]);

  /* When an assistant reply appears, scroll so the user's question is at the top of the viewport */
  useEffect(() => {
    if (!hasMessages || isTyping) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last?.role === 'assistant') {
      const t = setTimeout(() => {
        lastQuestionRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [chatHistory, isTyping, hasMessages]);

  /* Focus the first interactive card when a new office hours step appears */
  useEffect(() => {
    if (!hasMessages || isTyping) return;
    const last = chatHistory[chatHistory.length - 1];
    if (last?.role === 'assistant' && last.officeHours && last.officeHours.step !== 'confirmed') {
      const t = setTimeout(() => firstCardRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [chatHistory, isTyping, hasMessages]);

  /* Refresh relative timestamps every 30s */
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!hasMessages) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, [hasMessages]);

  const handleSend = () => {
    if (!input.trim() || !userRole) return;

    const userMessage = input.trim();
    setInput('');

    addMessage({
      role: 'user',
      content: userMessage,
    });

    setIsTyping(true);
    setTypingContext('Looking up component specs...');
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage, userRole);
      addMessage(aiResponse);
      setIsTyping(false);
      setTypingContext('');
    }, 1500);
  };

  const handleQuestionClick = (question: string) => {
    if (!userRole) return;

    addMessage({
      role: 'user',
      content: question,
    });

    setIsTyping(true);
    setTypingContext('Searching Carbon guidelines...');
    setTimeout(() => {
      const aiResponse = generateAIResponse(question, userRole);
      addMessage(aiResponse);
      setIsTyping(false);
      setTypingContext('');
    }, 1500);
  };

  const handleUnhelpful = () => {
    addMessage({
      role: 'assistant',
      content: 'Sorry to hear that wasn\'t helpful. Here are some ways I can assist you further:',
      suggestedQuestions: [
        'Book office hours with a guardian',
        'Rephrase my question',
        'Show me the Carbon documentation',
        'What components are available?',
      ],
    });
  };

  /* ── Office hours booking flow ─────────────────────────── */

  const designerGuardians: OfficeHoursGuardian[] = [
    { name: 'Sarah Chen', specialty: 'Component patterns & layout', nextSlot: 'Tomorrow at 10:00 AM', avatar: 'SC' },
    { name: 'Marcus Rivera', specialty: 'Color, typography & theming', nextSlot: 'Tomorrow at 2:00 PM', avatar: 'MR' },
    { name: 'Aisha Patel', specialty: 'Accessibility & inclusive design', nextSlot: 'Wed at 11:00 AM', avatar: 'AP' },
  ];

  const developerGuardians: OfficeHoursGuardian[] = [
    { name: 'James O\'Brien', specialty: 'React components & hooks', nextSlot: 'Tomorrow at 11:30 AM', avatar: 'JO' },
    { name: 'Lin Wei', specialty: 'Theming, tokens & SCSS', nextSlot: 'Tomorrow at 3:00 PM', avatar: 'LW' },
    { name: 'Priya Sharma', specialty: 'Testing & accessibility APIs', nextSlot: 'Thu at 9:00 AM', avatar: 'PS' },
  ];

  const handleBookOfficeHours = () => {
    addMessage({
      role: 'assistant',
      content: 'I can help you book a session with a design system guardian. What type of guardian would you like to speak with?',
      officeHours: { step: 'select-role' },
    });
  };

  const handleSelectGuardianRole = (role: 'designer' | 'developer') => {
    const label = role === 'designer' ? 'Designer' : 'Developer';
    addMessage({
      role: 'user',
      content: `I'd like to speak with a ${label} guardian`,
    });

    setIsTyping(true);
    setTypingContext('Finding available guardians...');
    setTimeout(() => {
      const guardians = role === 'designer' ? designerGuardians : developerGuardians;
      addMessage({
        role: 'assistant',
        content: `Here are the available ${label} guardians and their next open slots:`,
        officeHours: { step: 'select-guardian', role, guardians },
      });
      setIsTyping(false);
      setTypingContext('');
    }, 800);
  };

  const handleBookGuardian = (guardian: OfficeHoursGuardian) => {
    addMessage({
      role: 'user',
      content: `Book with ${guardian.name} — ${guardian.nextSlot}`,
    });

    setIsTyping(true);
    setTypingContext('Booking your session...');
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: `Your office hours session has been booked.`,
        officeHours: {
          step: 'confirmed',
          booking: {
            guardian: guardian.name,
            time: guardian.nextSlot,
            specialty: guardian.specialty,
          },
        },
      });

      /* Follow-up message asking if the user needs more help */
      setTimeout(() => {
        addMessage({
          role: 'assistant',
          content: 'Is there anything else I can help you with?',
          suggestedQuestions: getContextualQuestions(guardian.specialty),
        });
        setIsTyping(false);
        setTypingContext('');
      }, 600);
    }, 1000);
  };

  const handleCancelBooking = () => {
    addMessage({
      role: 'user',
      content: 'Cancel the booking',
    });

    setIsTyping(true);
    setTypingContext('Cancelling your booking...');
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: 'Your booking has been cancelled. Would you like to reschedule or is there anything else I can help with?',
        suggestedQuestions: [
          'Book office hours with a guardian',
          'What are the specs for a DataTable?',
          'Show me the Button component props',
          'How do I implement accessible modals?',
        ],
      });
      setIsTyping(false);
      setTypingContext('');
    }, 800);
  };

  const renderOfficeHours = (officeHours: NonNullable<(typeof chatHistory)[number]['officeHours']>, messageIndex: number) => {
    /* If there are messages after this one, the user already interacted — disable cards */
    const isInteracted = messageIndex < chatHistory.length - 1;

    if (officeHours.step === 'select-role') {
      return (
        <div className={`chat-oh-grid${isInteracted ? ' chat-oh-disabled' : ''}`}>
          <button
            ref={!isInteracted ? firstCardRef : undefined}
            type="button"
            className="chat-oh-card"
            onClick={() => !isInteracted && handleSelectGuardianRole('designer')}
            disabled={isInteracted}
            aria-disabled={isInteracted}
            tabIndex={isInteracted ? -1 : 0}
          >
            <div className="chat-oh-card-accent" />
            <div className="chat-oh-card-body">
              <div className="chat-oh-card-icon">
                <ColorPalette size={24} fill="var(--carbon-interactive)" />
              </div>
              <div>
                <h4 className="chat-oh-card-title">Designer guardian</h4>
                <p className="chat-oh-card-desc">Visual specs, tokens, patterns & Figma guidance</p>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </div>
          </button>
          <button
            type="button"
            className="chat-oh-card"
            onClick={() => !isInteracted && handleSelectGuardianRole('developer')}
            disabled={isInteracted}
            aria-disabled={isInteracted}
            tabIndex={isInteracted ? -1 : 0}
          >
            <div className="chat-oh-card-accent" />
            <div className="chat-oh-card-body">
              <div className="chat-oh-card-icon">
                <Code size={24} fill="var(--carbon-interactive)" />
              </div>
              <div>
                <h4 className="chat-oh-card-title">Developer guardian</h4>
                <p className="chat-oh-card-desc">React components, props, theming & code</p>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </div>
          </button>
        </div>
      );
    }

    if (officeHours.step === 'select-guardian' && officeHours.guardians) {
      return (
        <div className={`chat-oh-guardian-grid${isInteracted ? ' chat-oh-disabled' : ''}`}>
          {officeHours.guardians.map((g, i) => (
            <button
              key={g.name}
              ref={i === 0 && !isInteracted ? firstCardRef : undefined}
              type="button"
              className="chat-oh-guardian-card"
              onClick={() => !isInteracted && handleBookGuardian(g)}
              disabled={isInteracted}
              aria-disabled={isInteracted}
              tabIndex={isInteracted ? -1 : 0}
            >
              <div className="chat-oh-avatar">{g.avatar}</div>
              <div className="chat-oh-guardian-info">
                <span className="chat-oh-guardian-name">{g.name}</span>
                <span className="chat-oh-guardian-specialty">{g.specialty}</span>
                <span className="chat-oh-guardian-slot">
                  <Calendar width={12} height={12} />
                  {g.nextSlot}
                </span>
              </div>
              <ArrowRight size={16} className="chat-oh-card-arrow" />
            </button>
          ))}
        </div>
      );
    }

    if (officeHours.step === 'confirmed' && officeHours.booking) {
      return (
        <div className="chat-oh-confirmed">
          <div className="chat-oh-confirmed-header">
            <CheckCircle width={24} height={24} style={{ color: 'var(--carbon-support-success)' }} />
            <span className="chat-oh-confirmed-title">Meeting booked</span>
          </div>
          <div className="chat-oh-confirmed-details">
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">Guardian</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.guardian}</span>
            </div>
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">Specialty</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.specialty}</span>
            </div>
            <div className="chat-oh-confirmed-row">
              <span className="chat-oh-confirmed-label">When</span>
              <span className="chat-oh-confirmed-value">{officeHours.booking.time}</span>
            </div>
          </div>
          <div className="chat-oh-confirmed-footer">
            <p className="chat-oh-confirmed-note">
              <Calendar width={14} height={14} />
              Added to your calendar
            </p>
            <button type="button" className="chat-oh-cancel-btn" onClick={handleCancelBooking}>
              Cancel booking
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderComponentPreview = (preview: (typeof chatHistory)[number]['componentPreview']) => {
    if (!preview) return null;

    if (preview === 'datatable') {
      return (
        <div
          className="chat-component-preview"
          style={{
            backgroundColor: 'var(--carbon-layer-01)',
            borderColor: 'var(--carbon-border-subtle)',
            borderRadius: 'var(--carbon-radius)',
          }}
        >
          <p className="chat-component-preview-title" style={{ color: 'var(--carbon-text-secondary)' }}>
            Interactive example:
          </p>
          <div className="chat-component-table-wrap" style={{ borderColor: 'var(--carbon-border-subtle)' }}>
            <table className="chat-component-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Alex Chen', status: 'Active', role: 'Developer', location: 'San Francisco' },
                  { name: 'Jordan Smith', status: 'Active', role: 'Designer', location: 'New York' },
                  { name: 'Morgan Lee', status: 'Inactive', role: 'PM', location: 'Austin' },
                  { name: 'Casey Rivera', status: 'Active', role: 'Developer', location: 'Seattle' },
                ].map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.status}</td>
                    <td>{row.role}</td>
                    <td>{row.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (preview === 'button') {
      return (
        <div
          className="chat-component-preview"
          style={{
            backgroundColor: 'var(--carbon-layer-01)',
            borderColor: 'var(--carbon-border-subtle)',
            borderRadius: 'var(--carbon-radius)',
          }}
        >
          <p className="chat-component-preview-title" style={{ color: 'var(--carbon-text-secondary)' }}>
            Interactive example:
          </p>
          <div className="chat-component-button-row">
            <button
              type="button"
              className="chat-component-button"
              style={{
                backgroundColor: 'var(--carbon-interactive)',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-text-on-color)',
              }}
            >
              Primary Button
            </button>
            <button
              type="button"
              className="chat-component-button"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-interactive)',
              }}
            >
              Secondary
            </button>
            <button
              type="button"
              className="chat-component-button ghost"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                color: 'var(--carbon-interactive)',
              }}
            >
              Ghost
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  const chatInputBlock = (
    <div className="chat-input-wrap">
      <div className="chat-input-inner">
        <div className="chat-input-row">
          <div className="chat-input-prefix-wrap">
            {!input && (
              <div className="chat-input-placeholder-overlay" aria-hidden>
                <span className="chat-input-placeholder-prefix">{PLACEHOLDER_PREFIX}</span>
                <span
                  key={suggestionIndex}
                  className="chat-input-placeholder-suggestion"
                  style={{ color: 'var(--carbon-text-placeholder)' }}
                >
                  {placeholderSuggestions[suggestionIndex]}
                </span>
              </div>
            )}
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder=""
              className="chat-input chat-input-with-prefix"
              style={{
                backgroundColor: 'var(--carbon-field)',
                color: 'var(--carbon-text-primary)',
                borderColor: 'var(--carbon-border-subtle)',
                borderRadius: 'var(--carbon-radius)',
                fontFamily: 'var(--carbon-font-family)',
                fontSize: '16px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--carbon-interactive)';
                e.currentTarget.style.boxShadow = '0 0 0 2px var(--carbon-interactive-transparent)';
                e.currentTarget.setSelectionRange(0, 0);
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--carbon-border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {input.trim() && (
            <button
              type="button"
              onClick={handleSend}
              className="chat-send"
              style={{
                backgroundColor: 'var(--carbon-interactive)',
                borderColor: 'var(--carbon-interactive)',
                color: 'var(--carbon-text-on-color)',
                borderRadius: 'var(--carbon-radius)',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              <Send width={20} height={20} />
              <span>Send</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`hub-view${hasMessages ? ' hub-view--chat-mode' : ''}`}>
      <header
        className="hub-view-header hub-dark-header"
        style={{
          backgroundColor: '#161616',
          borderColor: '#262626',
        }}
      >
        <h1>AI-powered design system assistant</h1>
        <p>Ask questions about Carbon components, patterns, and guidelines</p>
      </header>

      {!hasMessages && chatInputBlock}

      <div
        ref={chatContainerRef}
        className="hub-view-scroll"
        style={{ backgroundColor: 'var(--carbon-bg-primary)' }}
      >
        {chatHistory.length === 0 ? (
          <div className="chat-empty">
            <p className="chat-empty-label">Suggested questions</p>
            <div className="chat-empty-grid">
              {guidedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="chat-empty-card"
                >
                  <span>{question}</span>
                  <ArrowRight size={16} className="chat-empty-card-arrow" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-thread">
            {(() => {
              let lastUserIndex = -1;
              for (let i = chatHistory.length - 1; i >= 0; i--) {
                if (chatHistory[i].role === 'user') { lastUserIndex = i; break; }
              }
              return chatHistory.map((message, index) => {
                const isLastUser = message.role === 'user' && index === lastUserIndex;
                return (
              <div
                key={message.id}
                className={`chat-thread-item chat-thread-item-enter ${message.role === 'user' ? 'chat-thread-item-user' : ''}`}
                ref={isLastUser ? lastQuestionRef : undefined}
              >
                <div
                  className={`chat-bubble ${message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-assistant'}`}
                  style={message.role === 'assistant' ? {
                    backgroundColor: 'var(--carbon-layer-01)',
                    borderColor: 'var(--carbon-border-subtle)',
                  } : undefined}
                >
                  {message.role === 'assistant' && message.trustBadge && (
                    <div className="chat-bubble-badge">
                      <span
                        className="chat-bubble-badge-pill"
                        style={{
                          backgroundColor:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-interactive)'
                              : 'var(--carbon-bg-secondary)',
                          color:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-text-on-color)'
                              : 'var(--carbon-text-secondary)',
                          borderColor:
                            message.trustBadge === 'official'
                              ? 'var(--carbon-interactive)'
                              : 'var(--carbon-border-subtle)',
                          borderRadius: 'var(--carbon-radius)',
                        }}
                      >
                        {message.trustBadge === 'official' ? '✓ Official Rule' : 'Best Practice'}
                      </span>
                    </div>
                  )}
                  {message.role === 'assistant' ? (
                    <div className="chat-markdown">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ className, children, ...props }) {
                            const isBlock = className?.startsWith('language-');
                            if (!isBlock) return <code className={className} {...props}>{children}</code>;
                            const codeStr = String(children).replace(/\n$/, '');
                            const codeId = `${message.id}-${codeStr.slice(0, 20)}`;
                            return (
                              <div className="chat-code-block">
                                <button
                                  type="button"
                                  className="chat-code-copy"
                                  onClick={() => handleCopyCode(codeStr, codeId)}
                                  aria-label="Copy code"
                                >
                                  {copiedCodeId === codeId ? (
                                    <><CheckCircle width={14} height={14} /> Copied</>
                                  ) : (
                                    <><Copy size={14} /> Copy</>
                                  )}
                                </button>
                                <code className={className} {...props}>{children}</code>
                              </div>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                  <span className="chat-timestamp">{formatRelativeTime(message.timestamp)}</span>
                </div>

                {message.role === 'assistant' && message.componentPreview && renderComponentPreview(message.componentPreview)}

                {message.role === 'assistant' && message.officeHours && renderOfficeHours(message.officeHours, index)}

                {message.role === 'assistant' && message.suggestedQuestions && message.suggestedQuestions.length > 0 && (
                  <div className="chat-suggestions">
                    {message.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="chat-suggestion-btn"
                        onClick={() => {
                          if (q === 'Book office hours with a guardian') {
                            handleBookOfficeHours();
                          } else {
                            handleQuestionClick(q);
                          }
                        }}
                      >
                        <span>{q}</span>
                        <ArrowRight size={16} className="chat-suggestion-arrow" />
                      </button>
                    ))}
                  </div>
                )}

                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="chat-sources">
                    <p className="text-xs px-2" style={{ color: 'var(--carbon-text-placeholder)' }}>
                      Sources & Actions
                    </p>
                    <div className="chat-sources-grid">
                      {message.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="chat-source-card"
                          style={{
                            backgroundColor: 'var(--carbon-layer-01)',
                            borderColor: 'var(--carbon-border-subtle)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--carbon-interactive)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--carbon-border-subtle)';
                          }}
                        >
                          <div
                            className="chat-source-card-icon"
                            style={{
                              borderColor: 'var(--carbon-border-subtle)',
                              color: 'var(--carbon-text-secondary)',
                              borderRadius: 'var(--carbon-radius)',
                            }}
                          >
                            {source.type === 'figma' && <Figma width={20} height={20} />}
                            {source.type === 'storybook' && <FileCode width={20} height={20} />}
                            {source.type === 'github' && <Github width={20} height={20} />}
                            {source.type === 'chromatic' && 'C'}
                          </div>
                          <span className="text-sm" style={{ color: 'var(--carbon-text-primary)' }}>
                            {source.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && isGuardian && message.suggestVideoAnswer && (
                  <div
                    className="chat-record-answer"
                    style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: 'var(--carbon-layer-01)',
                      border: '1px solid var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <p className="text-sm mb-2" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Optional: A recorded answer can be shared with the requester and added to the knowledge base.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowRecordModal(true)}
                      className="chat-action-button"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--carbon-interactive)',
                        borderColor: 'var(--carbon-interactive)',
                        color: 'var(--carbon-text-on-color)',
                        borderRadius: 'var(--carbon-radius)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                      }}
                    >
                      <Video width={18} height={18} />
                      <span>Record an answer</span>
                    </button>
                  </div>
                )}

                {message.role === 'assistant' && !message.officeHours && (
                  <div className="chat-actions">
                    <button
                      onClick={handleBookOfficeHours}
                      className="chat-action-button"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--carbon-border-subtle)',
                        color: 'var(--carbon-text-secondary)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      <Calendar width={16} height={16} />
                      <span>Book office hours</span>
                    </button>
                    {!feedbackGivenForMessageIds.has(message.id) ? (
                      <div className="chat-actions-row">
                        <button
                          onClick={() => handleFeedback(message.id, 'helpful')}
                          className="chat-action-button chat-action-button-small"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          <ThumbsUp width={14} height={14} />
                          <span>Helpful</span>
                        </button>
                        <button
                          onClick={() => {
                            handleFeedback(message.id, 'unhelpful');
                            handleUnhelpful();
                          }}
                          className="chat-action-button chat-action-button-small"
                          style={{
                            backgroundColor: 'transparent',
                            borderColor: 'var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          <ThumbsDown width={14} height={14} />
                          <span>Unhelpful?</span>
                        </button>
                      </div>
                    ) : (
                      <span className="chat-feedback-confirmation">
                        {feedbackGivenForMessageIds.get(message.id) === 'helpful' ? (
                          <>
                            <CheckCircle width={14} height={14} style={{ color: 'var(--carbon-support-success)' }} />
                            Thanks for the feedback!
                          </>
                        ) : (
                          <>
                            <ThumbsDown width={14} height={14} />
                            Feedback recorded
                          </>
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
                );
              });
            })()}

            {isTyping && (
              <div className="chat-thread-item chat-thread-item-enter">
                <div
                  className="chat-bubble chat-bubble-assistant"
                  style={{
                    backgroundColor: 'var(--carbon-layer-01)',
                    borderColor: 'var(--carbon-border-subtle)',
                    borderRadius: 'var(--carbon-radius)',
                  }}
                >
                  {typingContext && (
                    <span className="chat-typing-context">{typingContext}</span>
                  )}
                  <div className="chat-typing">
                    <div className="chat-typing-dot" style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '0ms' }} />
                    <div className="chat-typing-dot" style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '150ms' }} />
                    <div className="chat-typing-dot" style={{ backgroundColor: 'var(--carbon-text-placeholder)', animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasMessages && chatInputBlock}

      <GuardianRecordModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
      />
    </div>
  );
}
