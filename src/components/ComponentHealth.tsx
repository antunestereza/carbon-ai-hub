'use client';

import { useMemo } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from '@/components/icons';
import { mockQuestions } from '@/utils/mockQuestions';

interface ComponentStats {
  name: string;
  questionCount: number;
  uniqueDesigners: number;
  contexts: string[];
  trend: 'stable' | 'increasing' | 'decreasing';
  status: 'healthy' | 'warning' | 'needs-attention';
}

export function ComponentHealth() {
  const componentStats = useMemo(() => {
    const stats: { [key: string]: ComponentStats } = {};

    mockQuestions.forEach((q) => {
      q.component.forEach((comp) => {
        if (!stats[comp]) {
          stats[comp] = {
            name: comp,
            questionCount: 0,
            uniqueDesigners: 0,
            contexts: [],
            trend: 'stable',
            status: 'healthy',
          };
        }
        stats[comp].questionCount++;
        if (!stats[comp].contexts.includes(q.context)) {
          stats[comp].contexts.push(q.context);
        }
      });
    });

    Object.keys(stats).forEach((comp) => {
      const designers = new Set(
        mockQuestions.filter((q) => q.component.includes(comp)).map((q) => q.designer)
      );
      stats[comp].uniqueDesigners = designers.size;

      if (stats[comp].questionCount > 5 && stats[comp].uniqueDesigners > 3) {
        stats[comp].status = 'needs-attention';
        stats[comp].trend = 'increasing';
      } else if (stats[comp].questionCount > 3) {
        stats[comp].status = 'warning';
      } else {
        stats[comp].status = 'healthy';
      }
    });

    return Object.values(stats).sort((a, b) => b.questionCount - a.questionCount);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs-attention':
        return 'var(--carbon-support-error)';
      case 'warning':
        return 'var(--carbon-support-warning)';
      default:
        return 'var(--carbon-support-success)';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'needs-attention':
        return AlertTriangle;
      case 'warning':
        return AlertTriangle;
      default:
        return CheckCircle;
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
        <h1>Component health</h1>
        <p>Identify components with high designer uncertainty</p>
      </header>

      <div className="hub-view-scroll" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
        <div className="health-container">
          <div
            className="health-summary"
            style={{
              backgroundColor: 'var(--carbon-layer-01)',
              borderColor: 'var(--carbon-border-subtle)',
              borderRadius: 'var(--carbon-radius)',
            }}
          >
            <h2 className="text-sm mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
              Health overview
            </h2>
            <div className="health-summary-grid">
              <div>
                <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
                  Components tracked
                </p>
                <p style={{ color: 'var(--carbon-text-primary)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
                  {componentStats.length}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
                  Needs attention
                </p>
                <p style={{ color: 'var(--carbon-support-error)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
                  {componentStats.filter((c) => c.status === 'needs-attention').length}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
                  Warning
                </p>
                <p style={{ color: 'var(--carbon-support-warning)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
                  {componentStats.filter((c) => c.status === 'warning').length}
                </p>
              </div>
            </div>
          </div>

          <div className="health-list">
            {componentStats.map((comp) => {
              const StatusIcon = getStatusIcon(comp.status);
              return (
                <div
                  key={comp.name}
                  className="health-card"
                  style={{
                    backgroundColor: 'var(--carbon-layer-01)',
                    border: '1px solid var(--carbon-border-subtle)',
                    borderLeft: `4px solid ${getStatusColor(comp.status)}`,
                    borderRadius: 0,
                  }}
                >
                  <div className="health-card-header">
                    <div className="health-card-title">
                      <h3 className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                        {comp.name}
                      </h3>
                      <div className="health-status">
                        <span
                          className="health-status-tag"
                          style={{
                            backgroundColor: 'transparent',
                            border: `1px solid ${getStatusColor(comp.status)}`,
                            color: getStatusColor(comp.status),
                            borderRadius: 'var(--carbon-radius-pill)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                        >
                          <StatusIcon width={12} height={12} />
                          {comp.status.replace('-', ' ')}
                        </span>
                        {comp.trend === 'increasing' && (
                          <span
                            className="health-status-tag"
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid var(--carbon-support-error)',
                              color: 'var(--carbon-support-error)',
                              borderRadius: 'var(--carbon-radius-pill)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <TrendingUp width={12} height={12} />
                            increasing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="health-metrics">
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                        Questions
                      </p>
                      <p className="text-xl" style={{ color: 'var(--carbon-text-primary)' }}>
                        {comp.questionCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                        Unique designers
                      </p>
                      <p className="text-xl" style={{ color: 'var(--carbon-text-primary)' }}>
                        {comp.uniqueDesigners}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                        Contexts
                      </p>
                      <p className="text-xl" style={{ color: 'var(--carbon-text-primary)' }}>
                        {comp.contexts.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs mb-2" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Common usage contexts
                    </p>
                    <div className="health-contexts">
                      {comp.contexts.map((context) => (
                        <span
                          key={context}
                          className="health-context"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          {context}
                        </span>
                      ))}
                    </div>
                  </div>

                  {comp.status === 'needs-attention' && (
                    <div
                      className="health-insight"
                      style={{
                        backgroundColor: 'var(--carbon-bg-secondary)',
                        border: '1px solid var(--carbon-border-subtle)',
                        borderLeft: '4px solid var(--carbon-support-error)',
                        borderRadius: 0,
                        padding: '0.75rem 1rem',
                      }}
                    >
                      <p className="text-xs" style={{ color: 'var(--carbon-text-primary)' }}>
                        <strong>Guardian insight:</strong> Multiple designers across teams are seeking clarity on this component.
                        Consider reviewing documentation, usage patterns, or creating specific guidance.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
