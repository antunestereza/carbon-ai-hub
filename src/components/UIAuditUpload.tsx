'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle2, XCircle, AlertCircle, FileImage } from '@/components/icons';
import { useRole } from '@/contexts/RoleContext';

interface AuditResult {
  score: number;
  issues: {
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }[];
}

export function UIAuditUpload() {
  const { userRole } = useRole();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      analyzeUI();
    };
    reader.readAsDataURL(file);
  };

  const analyzeUI = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResult: AuditResult = generateMockAudit(userRole);
      setAuditResult(mockResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAudit = (role: string | null): AuditResult => {
    const baseIssues = [
      {
        type: 'error' as const,
        message: 'Border radius detected: 8px',
        suggestion: 'Carbon uses square corners (0px border-radius). Update to match design system standards.',
      },
      {
        type: 'warning' as const,
        message: 'Non-standard spacing: 18px',
        suggestion: 'Use Carbon spacing tokens ($spacing-05 = 16px or $spacing-06 = 24px) for consistency.',
      },
      {
        type: 'info' as const,
        message: 'Color contrast: 4.8:1',
        suggestion: 'Meets WCAG AA standards. Consider increasing to 7:1 for AAA compliance.',
      },
    ];

    const roleSpecificIssues = {
      developer: [
        {
          type: 'warning' as const,
          message: 'Custom button styling detected',
          suggestion: 'Use @carbon/react Button component for consistency and built-in accessibility.',
        },
      ],
      designer: [
        {
          type: 'warning' as const,
          message: 'Font weight 600 detected',
          suggestion: 'Carbon uses specific weights: 400 (Regular), 600 (Semi-Bold). Ensure Figma styles match.',
        },
      ],
      'product-manager': [
        {
          type: 'info' as const,
          message: 'Component compliance: 75%',
          suggestion: 'Consider migrating custom components to Carbon equivalents for better maintainability.',
        },
      ],
      'project-owner': [
        {
          type: 'info' as const,
          message: 'Brand alignment: Good',
          suggestion: 'UI follows most IBM brand guidelines. Address critical issues to reach 95% compliance.',
        },
      ],
    };

    const specificIssues = role
      ? roleSpecificIssues[role as keyof typeof roleSpecificIssues] || []
      : [];
    const allIssues = [...baseIssues, ...specificIssues];

    const score =
      Math.max(
        0,
        100 -
          allIssues.filter((i) => i.type === 'error').length * 15 -
          allIssues.filter((i) => i.type === 'warning').length * 5
      );

    return {
      score,
      issues: allIssues,
    };
  };

  const handleReset = () => {
    setUploadedImage(null);
    setAuditResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="hub-view">
      <header
        className="hub-view-header hub-dark-header"
        style={{
          backgroundColor: '#161616',
          borderColor: '#262626',
        }}
      >
        <h1>UI audit</h1>
        <p>Upload a screenshot to check Carbon Design System compliance</p>
      </header>

      <div className="hub-view-scroll" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
        <div className="audit-container">
          {!uploadedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="audit-dropzone"
              style={{
                border: `2px dashed ${isDragging ? 'var(--carbon-interactive)' : 'var(--carbon-border-subtle)'}`,
                backgroundColor: isDragging ? 'var(--carbon-bg-hover)' : 'var(--carbon-layer-01)',
                borderRadius: 0,
                transition: 'border-color 70ms cubic-bezier(0.2, 0, 0.38, 0.9), background-color 70ms cubic-bezier(0.2, 0, 0.38, 0.9)',
              }}
            >
              <Upload width={64} height={64} className="mx-auto mb-6" style={{ color: 'var(--carbon-text-placeholder)' }} />
              <h2 className="text-xl mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                Drag and drop your UI screenshot
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--carbon-text-secondary)' }}>
                or click to browse files
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="audit-button"
                style={{
                  backgroundColor: 'var(--carbon-interactive)',
                  borderColor: 'var(--carbon-interactive)',
                  color: 'var(--carbon-text-on-color)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                Select file
              </button>
            </div>
          ) : (
            <div className="audit-results">
              <div
                className="audit-card"
                style={{
                  backgroundColor: 'var(--carbon-layer-01)',
                  borderColor: 'var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <div className="audit-card-header">
                  <div className="audit-card-title">
                    <FileImage width={20} height={20} style={{ color: 'var(--carbon-interactive)' }} />
                    <h3 className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                      Uploaded screenshot
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="audit-secondary"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    Upload new
                  </button>
                </div>
                <Image
                  src={uploadedImage}
                  alt="Uploaded UI"
                  width={400}
                  height={300}
                  className="audit-image"
                  style={{
                    borderColor: 'var(--carbon-border-subtle)',
                    borderRadius: 'var(--carbon-radius)',
                  }}
                  unoptimized
                />
              </div>

              {isAnalyzing ? (
                <div
                  className="audit-card audit-analyzing"
                  style={{
                    backgroundColor: 'var(--carbon-layer-01)',
                    borderColor: 'var(--carbon-border-subtle)',
                    borderRadius: 'var(--carbon-radius)',
                  }}
                >
                  <div className="audit-analyzing-dots">
                    <div
                      className="audit-dot"
                      style={{ backgroundColor: 'var(--carbon-interactive)', animationDelay: '0ms' }}
                    />
                    <div
                      className="audit-dot"
                      style={{ backgroundColor: 'var(--carbon-interactive)', animationDelay: '150ms' }}
                    />
                    <div
                      className="audit-dot"
                      style={{ backgroundColor: 'var(--carbon-interactive)', animationDelay: '300ms' }}
                    />
                  </div>
                  <p style={{ color: 'var(--carbon-text-secondary)' }}>
                    Analyzing UI against Carbon Design System standards...
                  </p>
                </div>
              ) : auditResult ? (
                <div className="audit-results-body">
                  <div
                    className="audit-card"
                    style={{
                      backgroundColor: 'var(--carbon-layer-01)',
                      borderColor: 'var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <div className="audit-score">
                      <div style={{ flex: 1 }}>
                        <h3 className="text-lg mb-1" style={{ color: 'var(--carbon-text-primary)' }}>
                          Carbon compliance score
                        </h3>
                        <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)', margin: '0 0 1rem 0' }}>
                          Based on design system standards
                        </p>
                        {/* Progress bar */}
                        <div
                          style={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'var(--carbon-bg-secondary, #e0e0e0)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${auditResult.score}%`,
                              borderRadius: 3,
                              backgroundColor:
                                auditResult.score >= 90
                                  ? '#24a148'
                                  : auditResult.score >= 70
                                  ? '#f1c21b'
                                  : '#da1e28',
                              transition: 'width 0.6s cubic-bezier(0.2, 0, 0.38, 0.9)',
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className="audit-score-value"
                        style={{
                          color:
                            auditResult.score >= 90
                              ? '#24a148'
                              : auditResult.score >= 70
                              ? '#f1c21b'
                              : '#da1e28',
                        }}
                      >
                        {auditResult.score}%
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
                      Issues found ({auditResult.issues.length})
                    </h3>
                    <div className="audit-issues">
                      {auditResult.issues.map((issue, index) => {
                        const Icon =
                          issue.type === 'error'
                            ? XCircle
                            : issue.type === 'warning'
                            ? AlertCircle
                            : CheckCircle2;
                        const color =
                          issue.type === 'error'
                            ? '#da1e28'
                            : issue.type === 'warning'
                            ? '#f1c21b'
                            : '#0f62fe';

                        return (
                          <div
                            key={index}
                            className="audit-issue"
                            style={{
                              backgroundColor: 'var(--carbon-layer-01)',
                              border: '1px solid var(--carbon-border-subtle)',
                              borderLeft: `4px solid ${color}`,
                              borderRadius: 0,
                            }}
                          >
                            <div className="audit-issue-inner">
                              <Icon width={20} height={20} className="flex-shrink-0 mt-1" style={{ color }} />
                              <div className="flex-1">
                                <p className="mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                                  {issue.message}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
                                  {issue.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
