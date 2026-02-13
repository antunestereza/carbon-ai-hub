'use client';

import { useState, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle,
  MessageCircle,
  Calendar,
  Video,
  ArrowUp,
  ArrowDown,
  Repeat,
  StarFilled,
} from '@/components/icons';
import { mockQuestions, clusterQuestions, type QuestionCluster, type DesignerQuestion } from '@/utils/mockQuestions';
import { GuardianRecordModal } from '@/components/GuardianRecordModal';

export function GuardianDashboard() {
  const [selectedCluster, setSelectedCluster] = useState<QuestionCluster | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<DesignerQuestion | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const clusters = useMemo(() => clusterQuestions(mockQuestions), []);

  const handleSelectCluster = (cluster: QuestionCluster) => {
    setSelectedCluster(cluster);
    setSelectedQuestion(null);
  };

  const stats = {
    totalQuestions: mockQuestions.length,
    activeClusters: clusters.length,
    increasingTopics: clusters.filter((c) => c.trend === 'increasing' || c.trend === 'new').length,
    escalations: 11,
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'new':
        return 'var(--carbon-support-info)';
      case 'decreasing':
        return 'var(--carbon-support-success)';
      case 'recurring':
        return 'var(--carbon-support-warning)';
      case 'increasing':
        return 'var(--carbon-support-error)';
      default:
        return 'var(--carbon-text-secondary)';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return ArrowUp;
      case 'decreasing':
        return ArrowDown;
      case 'recurring':
        return Repeat;
      case 'new':
        return StarFilled;
      default:
        return null;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return 'Today';
    }
    if (diffInHours < 48) {
      return 'Yesterday';
    }
    if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <h1>Design System Guardian Hub</h1>
        <p>Monitor designer uncertainty and guide design system evolution</p>
      </header>

      <div
        className="hub-view-strip"
        style={{
          backgroundColor: 'var(--carbon-layer-01)',
          borderColor: 'var(--carbon-border-subtle)',
        }}
      >
        <div className="guardian-stats">
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
              Total questions (7 days)
            </p>
            <p style={{ color: 'var(--carbon-text-primary)', fontSize: '2.00rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
              {stats.totalQuestions}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
              Question clusters
            </p>
            <p style={{ color: 'var(--carbon-text-primary)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
              {stats.activeClusters}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
              Increasing topics
            </p>
            <p style={{ color: 'var(--carbon-support-success)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
              {stats.increasingTopics}
            </p>
          </div>
          <div
            className="guardian-stat"
            style={{ borderColor: 'var(--carbon-border-subtle)', borderRadius: 'var(--carbon-radius)' }}
          >
            <p style={{ color: 'var(--carbon-text-secondary)', fontSize: '0.75rem', margin: '0 0 0.25rem 0' }}>
              Escalations to guardians
            </p>
            <p style={{ color: 'var(--carbon-support-error)', fontSize: '2rem', fontWeight: 600, margin: 0, lineHeight: 1 }}>
              {stats.escalations}
            </p>
          </div>
        </div>
      </div>

      <div className="guardian-main">
        <div
          className="guardian-list"
          style={{
            backgroundColor: 'var(--carbon-bg-primary)',
            borderColor: 'var(--carbon-border-subtle)',
          }}
        >
          <div className="guardian-list-inner">
            <h2 className="text-lg mb-4" style={{ color: 'var(--carbon-text-primary)' }}>
              Question clusters
            </h2>
            <div className="guardian-list-items">
              {clusters.map((cluster) => {
                return (
                  <button
                    key={cluster.id}
                    onClick={() => handleSelectCluster(cluster)}
                    className="guardian-cluster"
                    style={{
                      backgroundColor:
                        selectedCluster?.id === cluster.id ? 'var(--carbon-bg-hover)' : 'var(--carbon-layer-01)',
                      borderColor:
                        selectedCluster?.id === cluster.id
                          ? 'var(--carbon-interactive)'
                          : 'var(--carbon-border-subtle)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <div className="guardian-cluster-header">
                      <h3
                        style={{
                          color: 'var(--carbon-text-primary)',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          lineHeight: 1.4,
                          margin: 0,
                          flex: 1,
                        }}
                      >
                        {cluster.topic}
                      </h3>
                      {(() => {
                        const TrendIcon = getTrendIcon(cluster.trend);
                        return (
                          <span
                            className="guardian-trend-tag"
                            style={{
                              backgroundColor: 'transparent',
                              border: `1px solid ${getTrendColor(cluster.trend)}`,
                              color: getTrendColor(cluster.trend),
                              borderRadius: 'var(--carbon-radius-pill)',
                              padding: '0.2rem 0.625rem',
                              fontSize: '0.75rem',
                              fontWeight: 400,
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                              alignSelf: 'flex-start',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            {TrendIcon && <TrendIcon width={12} height={12} />}
                            {cluster.trend}
                          </span>
                        );
                      })()}
                    </div>
                    <div className="guardian-cluster-tags" style={{ marginTop: '0.5rem' }}>
                      {cluster.component.map((comp) => (
                        <span
                          key={comp}
                          className="guardian-tag"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid var(--carbon-border-subtle)',
                            color: 'var(--carbon-text-secondary)',
                            borderRadius: 'var(--carbon-radius)',
                          }}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                    <div
                      className="guardian-cluster-meta"
                      style={{
                        color: 'var(--carbon-text-secondary)',
                        fontSize: '0.8125rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      <span>{cluster.frequency} questions</span>
                      <span>·</span>
                      <span>Last asked {formatDate(cluster.lastAsked)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="guardian-detail" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
          {selectedCluster ? (
            <div className="guardian-detail-inner">
              <div className="guardian-detail-header">
                <h2 className="text-xl mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                  {selectedCluster.topic}
                </h2>
                <div className="guardian-detail-tags">
                  {selectedCluster.component.map((comp) => (
                    <span
                      key={comp}
                      className="guardian-detail-tag"
                      style={{
                        backgroundColor: 'var(--carbon-interactive)',
                        borderColor: 'var(--carbon-interactive)',
                        color: 'var(--carbon-text-on-color)',
                        borderRadius: 'var(--carbon-radius)',
                      }}
                    >
                      {comp}
                    </span>
                  ))}
                </div>
                <div className="guardian-detail-grid">
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Frequency
                    </p>
                    <p className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                      {selectedCluster.frequency} questions
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Trend
                    </p>
                    <p className="text-lg" style={{ color: getTrendColor(selectedCluster.trend) }}>
                      {selectedCluster.trend}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: 'var(--carbon-text-secondary)' }}>
                      Contexts
                    </p>
                    <p className="text-lg" style={{ color: 'var(--carbon-text-primary)' }}>
                      {selectedCluster.contexts.join(', ')}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                  Designer questions ({selectedCluster.questions.length})
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--carbon-text-secondary)' }}>
                  Click a question to see guardian actions
                </p>
                <div className="guardian-questions">
                  {selectedCluster.questions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => setSelectedQuestion(selectedQuestion?.id === question.id ? null : question)}
                      className="guardian-question"
                      style={{
                        backgroundColor:
                          selectedQuestion?.id === question.id
                            ? 'var(--carbon-bg-hover)'
                            : 'var(--carbon-layer-01)',
                        borderColor:
                          selectedQuestion?.id === question.id
                            ? 'var(--carbon-interactive)'
                            : 'var(--carbon-border-subtle)',
                        borderRadius: 'var(--carbon-radius)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <p className="text-sm mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                        &quot;{question.question}&quot;
                      </p>
                      <div className="guardian-question-meta" style={{ color: 'var(--carbon-text-secondary)' }}>
                        <span>{question.designer}</span>
                        <span>•</span>
                        <span>{question.team} team</span>
                        <span>•</span>
                        <span>{question.platform}</span>
                        <span>•</span>
                        <span>{formatDate(question.timestamp)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedQuestion && (
              <div
                className="guardian-actions"
                style={{
                  backgroundColor: 'var(--carbon-layer-01)',
                  borderColor: 'var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                }}
              >
                <h3 className="text-sm mb-3" style={{ color: 'var(--carbon-text-primary)' }}>
                  Guardian actions for this question
                </h3>
                <div className="guardian-actions-grid">
                  <button
                    onClick={() => alert('Document clarification workflow would open here')}
                    className="guardian-action"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <CheckCircle width={16} height={16} />
                    <span className="text-sm">Add documentation</span>
                  </button>
                  <button
                    onClick={() => alert('Usage rule creation workflow would open here')}
                    className="guardian-action"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <AlertCircle width={16} height={16} />
                    <span className="text-sm">Define usage rule</span>
                  </button>
                  <button
                    onClick={() => alert('Discussion thread would be created for the design system team')}
                    className="guardian-action"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <MessageCircle width={16} height={16} />
                    <span className="text-sm">Flag for discussion</span>
                  </button>
                  <button
                    onClick={() => alert('This topic would be acknowledged and tracked for future consideration')}
                    className="guardian-action"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <Calendar width={16} height={16} />
                    <span className="text-sm">Acknowledge gap</span>
                  </button>
                  <button
                    onClick={() => setShowRecordModal(true)}
                    className="guardian-action"
                    style={{
                      backgroundColor: 'transparent',
                      borderColor: 'var(--carbon-border-subtle)',
                      color: 'var(--carbon-text-primary)',
                      borderRadius: 'var(--carbon-radius)',
                    }}
                  >
                    <Video width={16} height={16} />
                    <span className="text-sm">Add video</span>
                  </button>
                </div>
              </div>
              )}
            </div>
          ) : (
            <div className="guardian-empty">
              <div className="guardian-empty-inner">
                <MessageCircle width={64} height={64} className="mx-auto mb-4" style={{ color: 'var(--carbon-text-placeholder)' }} />
                <h3 className="text-lg mb-2" style={{ color: 'var(--carbon-text-primary)' }}>
                  Select a question cluster
                </h3>
                <p className="text-sm" style={{ color: 'var(--carbon-text-secondary)' }}>
                  Choose a cluster to view details and take action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <GuardianRecordModal
        open={showRecordModal}
        onClose={() => setShowRecordModal(false)}
      />
    </div>
  );
}
