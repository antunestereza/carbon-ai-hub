'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

type Step = 'ready' | 'recording' | 'review';
type SuccessType = 'sent' | 'documentation';

interface GuardianRecordModalProps {
  open: boolean;
  onClose: () => void;
  onStartRecording?: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function VeryHappyFaceIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill="#FFE066" stroke="#E6C84A" strokeWidth="1.5" />
      {/* Big happy eyes */}
      <circle cx="10" cy="14" r="2.5" fill="#2D2D2D" />
      <circle cx="22" cy="14" r="2.5" fill="#2D2D2D" />
      {/* Sparkle */}
      <circle cx="11" cy="12.5" r="0.6" fill="#fff" />
      <circle cx="23" cy="12.5" r="0.6" fill="#fff" />
      {/* Very big smile */}
      <path
        d="M8 20 Q16 28 24 20"
        stroke="#2D2D2D"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Cheek blush */}
      <ellipse cx="6" cy="18" rx="2.5" ry="1.5" fill="#F4A6A6" opacity="0.6" />
      <ellipse cx="26" cy="18" rx="2.5" ry="1.5" fill="#F4A6A6" opacity="0.6" />
    </svg>
  );
}

function SuccessToast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={onDismiss}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 1001,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1.25rem',
        backgroundColor: 'var(--carbon-layer-01)',
        border: '1px solid var(--carbon-border-subtle)',
        borderRadius: 'var(--carbon-radius)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        maxWidth: 'min(22rem, calc(100vw - 3rem))',
      }}
    >
      <VeryHappyFaceIcon />
      <span
        style={{
          color: 'var(--carbon-text-primary)',
          fontSize: '0.9375rem',
          fontWeight: 500,
        }}
      >
        {message}
      </span>
    </div>
  );
}

export function GuardianRecordModal({ open, onClose, onStartRecording }: GuardianRecordModalProps) {
  const [step, setStep] = useState<Step>('ready');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [toast, setToast] = useState<{ show: boolean; type: SuccessType | null }>({
    show: false,
    type: null,
  });

  const dismissToast = useCallback(() => setToast((t) => ({ ...t, show: false })), []);

  useEffect(() => {
    if (open) {
      setStep('ready');
      setRecordingSeconds(0);
      setToast((t) => (t.show ? t : { show: false, type: null }));
    }
  }, [open]);

  useEffect(() => {
    if (!open || step !== 'recording') return;
    const interval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [open, step]);

  const handleStartRecording = () => {
    setStep('recording');
    setRecordingSeconds(0);
    onStartRecording?.();
  };

  const handleStopRecording = () => {
    setStep('review');
  };

  const handleSendAnswer = () => {
    setToast({ show: true, type: 'sent' });
    onClose();
  };

  const handleAddToDocumentation = () => {
    setToast({ show: true, type: 'documentation' });
    onClose();
  };

  const toastMessage =
    toast.type === 'sent' ? 'Answer sent!' : toast.type === 'documentation' ? 'Added to documentation!' : '';

  const modalContentStyle: React.CSSProperties = {
    maxWidth: step === 'ready' || step === 'recording' ? '20rem' : '32rem',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    backgroundColor: 'var(--carbon-layer-01)',
    border: '1px solid var(--carbon-border-subtle)',
    borderRadius: 'var(--carbon-radius)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    padding: '1.5rem',
  };

  return (
    <>
      {open && (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guardian-record-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '1.5rem',
      }}
      onClick={step === 'review' ? undefined : onClose}
    >
      <div
        className="guardian-record-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={modalContentStyle}
      >
        {step === 'ready' && (
          <>
            <h2
              id="guardian-record-modal-title"
              className="text-lg mb-2"
              style={{ color: 'var(--carbon-text-primary)' }}
            >
              Record an answer
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--carbon-text-secondary)' }}>
              Record your screen and voice to share with the requester. Click Start when you’re ready.
            </p>
            <button
              type="button"
              onClick={handleStartRecording}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#da1e28',
                border: '1px solid #da1e28',
                color: '#ffffff',
                borderRadius: 'var(--carbon-radius)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Start recording
            </button>
          </>
        )}

        {step === 'recording' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#da1e28',
                  animation: 'guardian-recording-pulse 1.2s ease-in-out infinite',
                }}
              />
              <span
                className="text-sm"
                style={{ color: 'var(--carbon-text-primary)', fontWeight: 500 }}
              >
                Recording
              </span>
              <span
                className="text-sm"
                style={{ color: 'var(--carbon-text-secondary)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatTime(recordingSeconds)}
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--carbon-text-secondary)' }}>
              Screen and voice are being recorded. Click Stop when finished.
            </p>
            <button
              type="button"
              onClick={handleStopRecording}
              style={{
                width: '100%',
                padding: '0.5rem 1rem',
                backgroundColor: '#da1e28',
                border: '1px solid #da1e28',
                color: '#ffffff',
                borderRadius: 'var(--carbon-radius)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Stop recording
            </button>
          </>
        )}

        {step === 'review' && (
          <>
            <h2
              id="guardian-record-modal-title"
              className="text-lg mb-2"
              style={{ color: 'var(--carbon-text-primary)' }}
            >
              Recording complete
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--carbon-text-secondary)' }}>
              Send your answer to the requester or add it to the documentation.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <button
                type="button"
                onClick={handleSendAnswer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1rem',
                  backgroundColor: 'var(--carbon-interactive)',
                  border: '1px solid var(--carbon-interactive)',
                  color: 'var(--carbon-text-on-color)',
                  borderRadius: 'var(--carbon-radius)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Send video answer
              </button>
              <button
                type="button"
                onClick={handleAddToDocumentation}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--carbon-border-subtle)',
                  color: 'var(--carbon-text-primary)',
                  borderRadius: 'var(--carbon-radius)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Add to documentation
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--carbon-text-secondary)',
                  borderRadius: 'var(--carbon-radius)',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </>
        )}

      </div>
    </div>
      )}
      {typeof document !== 'undefined' && toast.show && toastMessage &&
        createPortal(
          <SuccessToast message={toastMessage} onDismiss={dismissToast} />,
          document.body
        )}
    </>
  );
}
