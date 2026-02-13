'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Upload, CheckCircle2, XCircle, AlertCircle, FileImage } from '@/components/icons';
import { DocumentExport, Share } from '@carbon/icons-react';
import { useRole } from '@/contexts/RoleContext';

interface AuditResult {
  score: number;
  issues: {
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }[];
}

const STEPS = ['Upload', 'Analyze', 'Results'] as const;

function getScoreColor(score: number): string {
  if (score >= 90) return '#24a148';
  if (score >= 70) return '#f1c21b';
  return '#da1e28';
}

function getSeverityLabel(type: string): string {
  if (type === 'error') return 'Error';
  if (type === 'warning') return 'Warning';
  return 'Info';
}

function getSeverityColor(type: string): string {
  if (type === 'error') return '#da1e28';
  if (type === 'warning') return '#f1c21b';
  return '#0f62fe';
}

function getSeverityBg(type: string): string {
  if (type === 'error') return 'rgba(218,30,40,0.1)';
  if (type === 'warning') return 'rgba(241,194,27,0.1)';
  return 'rgba(15,98,254,0.1)';
}

export function UIAuditUpload() {
  const { userRole } = useRole();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStep = !uploadedImage ? 0 : isAnalyzing ? 1 : auditResult ? 2 : 1;

  /* Animate the progress bar during analysis */
  useEffect(() => {
    if (!isAnalyzing) { setAnalyzeProgress(0); return; }
    setAnalyzeProgress(0);
    const start = Date.now();
    const duration = 1900;
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setAnalyzeProgress(pct);
      if (elapsed < duration) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isAnalyzing]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => { setUploadedImage(e.target?.result as string); analyzeUI(); };
    reader.readAsDataURL(file);
  };

  const analyzeUI = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAuditResult(generateMockAudit(userRole));
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateMockAudit = (role: string | null): AuditResult => {
    const baseIssues = [
      { type: 'error' as const, message: 'Border radius detected: 8px', suggestion: 'Carbon uses square corners (0px border-radius). Update to match design system standards.' },
      { type: 'warning' as const, message: 'Non-standard spacing: 18px', suggestion: 'Use Carbon spacing tokens ($spacing-05 = 16px or $spacing-06 = 24px) for consistency.' },
      { type: 'info' as const, message: 'Color contrast: 4.8:1', suggestion: 'Meets WCAG AA standards. Consider increasing to 7:1 for AAA compliance.' },
    ];
    const roleSpecificIssues: Record<string, typeof baseIssues> = {
      developer: [{ type: 'warning', message: 'Custom button styling detected', suggestion: 'Use @carbon/react Button component for consistency and built-in accessibility.' }],
      designer: [{ type: 'warning', message: 'Font weight 600 detected', suggestion: 'Carbon uses specific weights: 400 (Regular), 600 (Semi-Bold). Ensure Figma styles match.' }],
      'product-manager': [{ type: 'info', message: 'Component compliance: 75%', suggestion: 'Consider migrating custom components to Carbon equivalents for better maintainability.' }],
      'project-owner': [{ type: 'info', message: 'Brand alignment: Good', suggestion: 'UI follows most IBM brand guidelines. Address critical issues to reach 95% compliance.' }],
    };
    const specificIssues = role ? roleSpecificIssues[role] || [] : [];
    const allIssues = [...baseIssues, ...specificIssues];
    const score = Math.max(0, 100 - allIssues.filter((i) => i.type === 'error').length * 15 - allIssues.filter((i) => i.type === 'warning').length * 5);
    return { score, issues: allIssues };
  };

  const handleReset = () => {
    setUploadedImage(null);
    setAuditResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /* Computed stats */
  const stats = useMemo(() => {
    if (!auditResult) return { errors: 0, warnings: 0, passed: 0 };
    const errors = auditResult.issues.filter((i) => i.type === 'error').length;
    const warnings = auditResult.issues.filter((i) => i.type === 'warning').length;
    const passed = auditResult.issues.filter((i) => i.type === 'info').length;
    return { errors, warnings, passed };
  }, [auditResult]);

  return (
    <div className="hub-view">
      <header className="hub-view-header hub-dark-header" style={{ backgroundColor: '#161616', borderColor: '#262626' }}>
        <h1>UI audit</h1>
        <p>Upload a screenshot to check Carbon Design System compliance</p>
      </header>

      <div className="hub-view-scroll" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
        <div className="audit-container">

          {/* Step indicator */}
          <div className="audit-steps">
            {STEPS.map((label, i) => (
              <div key={label} className={`audit-step${i <= currentStep ? ' audit-step-active' : ''}${i < currentStep ? ' audit-step-done' : ''}`}>
                <span className="audit-step-num">{i < currentStep ? '✓' : i + 1}</span>
                <span className="audit-step-label">{label}</span>
                {i < STEPS.length - 1 && <span className="audit-step-line" />}
              </div>
            ))}
          </div>

          {/* ── Upload state ─────────────────────────── */}
          {!uploadedImage ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`audit-dropzone${isDragging ? ' audit-dropzone-active' : ''}`}
            >
              <Upload width={32} height={32} className="audit-dropzone-icon" />
              <h2 className="audit-dropzone-title">Check your UI for Carbon compliance</h2>
              <p className="audit-dropzone-desc">
                Upload a screenshot and we&rsquo;ll analyze it against design system standards
              </p>
              <p className="audit-dropzone-hint">PNG, JPG, or GIF up to 10 MB</p>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} className="audit-button-primary">
                <Upload width={16} height={16} />
                Select file
              </button>
            </div>

          /* ── Analyzing state ───────────────────────── */
          ) : isAnalyzing ? (
            <div className="audit-analyzing-card audit-enter">
              <div className="audit-analyzing-spinner" />
              <p className="audit-analyzing-text">Analyzing UI against Carbon Design System standards...</p>
              <div className="audit-progress-track">
                <div className="audit-progress-fill" style={{ width: `${analyzeProgress}%` }} />
              </div>
            </div>

          /* ── Results state ─────────────────────────── */
          ) : auditResult ? (
            <div className="audit-results-wrap audit-enter">

              {/* Two-column: image + score */}
              <div className="audit-results-grid">
                {/* Left: image */}
                <div className="audit-image-card">
                  <div className="audit-image-header">
                    <FileImage width={16} height={16} style={{ color: 'var(--carbon-interactive)' }} />
                    <span className="audit-image-label">Analyzed screenshot</span>
                  </div>
                  <Image
                    src={uploadedImage}
                    alt="Uploaded UI"
                    width={600}
                    height={400}
                    className="audit-image"
                    unoptimized
                  />
                </div>

                {/* Right: score + stats */}
                <div className="audit-score-panel">
                  <p className="audit-score-heading">Carbon compliance score</p>
                  <div className="audit-score-hero" style={{ color: getScoreColor(auditResult.score) }}>
                    {auditResult.score}%
                  </div>
                  <div className="audit-progress-track audit-progress-track-lg">
                    <div className="audit-progress-fill" style={{ width: `${auditResult.score}%`, backgroundColor: getScoreColor(auditResult.score) }} />
                  </div>
                  <p className="audit-score-sub">Based on design system standards</p>

                  {/* Summary stats */}
                  <div className="audit-stats-row">
                    <div className="audit-stat-tile audit-stat-error">
                      <span className="audit-stat-num">{stats.errors}</span>
                      <span className="audit-stat-label">Errors</span>
                    </div>
                    <div className="audit-stat-tile audit-stat-warning">
                      <span className="audit-stat-num">{stats.warnings}</span>
                      <span className="audit-stat-label">Warnings</span>
                    </div>
                    <div className="audit-stat-tile audit-stat-info">
                      <span className="audit-stat-num">{stats.passed}</span>
                      <span className="audit-stat-label">Info</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues list */}
              <div className="audit-issues-section">
                <h3 className="audit-issues-heading">Issues found ({auditResult.issues.length})</h3>
                <div className="audit-issues">
                  {auditResult.issues.map((issue, index) => {
                    const Icon = issue.type === 'error' ? XCircle : issue.type === 'warning' ? AlertCircle : CheckCircle2;
                    const color = getSeverityColor(issue.type);
                    return (
                      <div
                        key={index}
                        className="audit-issue audit-enter"
                        style={{ animationDelay: `${index * 60}ms`, borderLeftColor: color }}
                      >
                        <div className="audit-issue-top">
                          <span className="audit-issue-tag" style={{ backgroundColor: getSeverityBg(issue.type), color }}>
                            {getSeverityLabel(issue.type)}
                          </span>
                        </div>
                        <div className="audit-issue-body">
                          <Icon width={18} height={18} style={{ color, flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <p className="audit-issue-msg">{issue.message}</p>
                            <p className="audit-issue-fix">{issue.suggestion}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action bar */}
              <div className="audit-action-bar">
                <button onClick={handleReset} className="audit-button-primary">
                  <Upload width={16} height={16} />
                  Upload new screenshot
                </button>
                <button type="button" className="audit-button-ghost" onClick={() => alert('Export report functionality coming soon')}>
                  <DocumentExport size={16} />
                  Export report
                </button>
                <button type="button" className="audit-button-ghost" onClick={() => alert('Share with guardian functionality coming soon')}>
                  <Share size={16} />
                  Share with guardian
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
