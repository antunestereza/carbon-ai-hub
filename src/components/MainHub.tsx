'use client';

import { useEffect, useState } from 'react';
import {
  MessageSquare,
  Upload,
  BookOpen,
  BarChart3,
  Activity,
  TrendingUp,
  Github,
  Figma,
  FileCode,
  LogOut,
} from '@/components/icons';
import { Security, Code, ColorPalette, AiAgentInvocation } from '@carbon/icons-react';
import { CarbonLogo, CortexLogo } from '@/components/Logo';
import { useRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';
import { ChatInterface } from '@/components/ChatInterface';
import { UIAuditUpload } from '@/components/UIAuditUpload';
import { GuardianDashboard } from '@/components/GuardianDashboard';
import { ComponentHealth } from '@/components/ComponentHealth';
import { TrendInsights } from '@/components/TrendInsights';
import { Documentation } from '@/components/Documentation';

type StandardView = 'chat' | 'audit' | 'docs';
type GuardianView = 'dashboard' | 'health' | 'insights';

export function MainHub() {
  const { userRole, setUserRole, clearHistory } = useRole();
  const router = useRouter();
  const [standardView, setStandardView] = useState<StandardView>('chat');
  const [guardianView, setGuardianView] = useState<GuardianView>('dashboard');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamImageError, setTeamImageError] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    if (!userRole) {
      router.push('/');
    }
  }, [userRole, router]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowTeamModal(false);
    };
    if (showTeamModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showTeamModal]);

  useEffect(() => {
    if (showTeamModal) setTeamImageError(false);
  }, [showTeamModal]);

  const handleChangeRoles = () => {
    setUserRole(null);
    clearHistory();
    router.push('/');
  };

  const handleRoleChange = (role: 'guardian' | 'developer' | 'designer') => {
    setUserRole(role);
    clearHistory();
    setRoleMenuOpen(false);
  };

  const handleLogout = () => {
    setRoleMenuOpen(false);
    handleChangeRoles();
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'guardian':
        return 'Guardian';
      case 'developer':
        return 'Developer';
      case 'designer':
        return 'Designer';
      default:
        return 'User';
    }
  };

  const isGuardian = userRole === 'guardian';

  const carbonIconProps = { size: 16, fill: 'var(--carbon-interactive)' };
  const fallbackIconProps = { width: 16, height: 16, style: { color: 'var(--carbon-interactive)' } as React.CSSProperties };
  const renderRoleIcon = () => {
    switch (userRole) {
      case 'guardian':
        return <Security {...carbonIconProps} />;
      case 'developer':
        return <Code {...carbonIconProps} />;
      case 'designer':
        return <ColorPalette {...carbonIconProps} />;
      default:
        return <MessageSquare {...fallbackIconProps} />;
    }
  };

  return (
    <div className="hub-root" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
      <aside className="hub-sidebar">
        <div className="hub-sidebar-header" style={{ borderBottom: '1px solid #262626' }}>
          <button
            type="button"
            className="hub-sidebar-title-row"
            onClick={handleChangeRoles}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            aria-label="Back to role selection"
          >
            <CarbonLogo size={24} color="var(--carbon-interactive)" />
            <span className="hub-sidebar-title" style={{ color: '#f4f4f4' }}>
              Carbon AI Hub
            </span>
          </button>
          <div
            className="hub-sidebar-role"
            style={{
              backgroundColor: '#262626',
              borderColor: '#393939',
              borderRadius: 'var(--carbon-radius)',
              position: 'relative',
              padding: 0,
            }}
          >
            <button
              type="button"
              className="hub-sidebar-role-main"
              onClick={() => setRoleMenuOpen((open) => !open)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '0.5rem 0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Toggle role menu"
            >
              {renderRoleIcon()}
              <span className="hub-sidebar-role-label" style={{ color: '#c6c6c6' }}>
                {getRoleLabel()}
              </span>
              <span
                className="hub-sidebar-role-toggle"
                style={{
                  marginLeft: 'auto',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#c6c6c6',
                  borderRadius: 'var(--carbon-radius)',
                  width: '1.5rem',
                  height: '1.5rem',
                  lineHeight: 1,
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ▾
              </span>
            </button>
            {roleMenuOpen && (
              <div
                className="hub-sidebar-role-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  left: 0,
                  right: 0,
                  width: '100%',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  padding: '0.5rem',
                  backgroundColor: '#262626',
                  border: '1px solid #393939',
                  borderRadius: 'var(--carbon-radius)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                }}
              >
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('guardian')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: '#f4f4f4',
                  }}
                >
                  Guardian
                </button>
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('developer')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: '#f4f4f4',
                  }}
                >
                  Developer
                </button>
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={() => handleRoleChange('designer')}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: '#f4f4f4',
                  }}
                >
                  Designer
                </button>
                <div style={{ height: 1, backgroundColor: '#393939', margin: '0.25rem 0' }} />
                <button
                  className="hub-sidebar-role-menu-item"
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    padding: '0.4rem 0.5rem',
                    color: '#c6c6c6',
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        {isGuardian && (
          <nav className="hub-sidebar-nav">
            <div className="hub-sidebar-nav-group">
              <button
                onClick={() => setGuardianView('dashboard')}
                className={`hub-nav-button${guardianView === 'dashboard' ? ' hub-nav-active' : ''}`}
              >
                <BarChart3 width={20} height={20} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setGuardianView('health')}
                className={`hub-nav-button${guardianView === 'health' ? ' hub-nav-active' : ''}`}
              >
                <Activity width={20} height={20} />
                <span>Component Health</span>
              </button>
              <button
                onClick={() => setGuardianView('insights')}
                className={`hub-nav-button${guardianView === 'insights' ? ' hub-nav-active' : ''}`}
              >
                <TrendingUp width={20} height={20} />
                <span>Insights</span>
              </button>
            </div>

            <div className="hub-sidebar-links">
              <div className="hub-sidebar-links-label">Quick links</div>
              <a href="https://github.com/carbon-design-system/carbon" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <Github width={16} height={16} />
                <span>GitHub</span>
              </a>
              <a href="https://www.figma.com/@carbon" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <Figma width={16} height={16} />
                <span>Figma</span>
              </a>
              <a href="https://carbondesignsystem.com/" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <FileCode width={16} height={16} />
                <span>Storybook</span>
              </a>
            </div>
          </nav>
        )}

        {!isGuardian && (
          <nav className="hub-sidebar-nav">
            <div className="hub-sidebar-nav-group">
              <button
                onClick={() => setStandardView('chat')}
                className={`hub-nav-button${standardView === 'chat' ? ' hub-nav-active' : ''}`}
              >
                <AiAgentInvocation size={20} />
                <span>AI Chat</span>
              </button>
              <button
                onClick={() => setStandardView('audit')}
                className={`hub-nav-button${standardView === 'audit' ? ' hub-nav-active' : ''}`}
              >
                <Upload width={20} height={20} />
                <span>UI Audit</span>
              </button>
              <button
                onClick={() => setStandardView('docs')}
                className={`hub-nav-button${standardView === 'docs' ? ' hub-nav-active' : ''}`}
              >
                <BookOpen width={20} height={20} />
                <span>Documentation</span>
              </button>
            </div>

            <div className="hub-sidebar-links">
              <div className="hub-sidebar-links-label">Quick links</div>
              <a href="https://github.com/carbon-design-system/carbon" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <Github width={16} height={16} />
                <span>GitHub</span>
              </a>
              <a href="https://www.figma.com/@carbon" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <Figma width={16} height={16} />
                <span>Figma</span>
              </a>
              <a href="https://carbondesignsystem.com/" target="_blank" rel="noopener noreferrer" className="hub-sidebar-link">
                <FileCode width={16} height={16} />
                <span>Storybook</span>
              </a>
            </div>
          </nav>
        )}

        <div className="hub-sidebar-footer">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: 10, lineHeight: 1, color: '#6f6f6f', fontFamily: 'var(--carbon-font-family, inherit)' }}>
              Powered by
            </span>
            <CortexLogo height={20} color="#525252" />
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="hub-nav-button"
          >
            <LogOut width={20} height={20} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      <main className="hub-main">
        {isGuardian && (
          <>
            {guardianView === 'dashboard' && <GuardianDashboard />}
            {guardianView === 'health' && <ComponentHealth />}
            {guardianView === 'insights' && <TrendInsights />}
          </>
        )}

        {!isGuardian && (
          <>
            {standardView === 'chat' && <ChatInterface />}
            {standardView === 'audit' && <UIAuditUpload />}
            {standardView === 'docs' && <Documentation />}
          </>
        )}
      </main>

      {showTeamModal && (
        <div
          className="hub-team-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="TEAM-X illustration"
          onClick={() => setShowTeamModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '2rem',
          }}
        >
          <div
            className="hub-team-modal-content"
            style={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {teamImageError ? (
              <div
                style={{
                  padding: '2rem',
                  maxWidth: '24rem',
                  backgroundColor: 'var(--carbon-layer-01)',
                  border: '1px solid var(--carbon-border-subtle)',
                  borderRadius: 'var(--carbon-radius)',
                  color: 'var(--carbon-text-secondary)',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                }}
              >
                <p style={{ marginBottom: '0.5rem', color: 'var(--carbon-text-primary)' }}>
                  Image not found
                </p>
                <p>
                  Add your TEAM-X illustration as <strong>team-x.png</strong> in the{' '}
                  <strong>public</strong> folder, then refresh.
                </p>
              </div>
            ) : (
              <img
                src="/team-x.png"
                alt="TEAM-X - Team illustration"
                onError={() => setTeamImageError(true)}
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: 'var(--carbon-radius)',
                }}
              />
            )}
            <button
              type="button"
              onClick={() => setShowTeamModal(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '-2.5rem',
                right: 0,
                background: 'var(--carbon-layer-01)',
                border: '1px solid var(--carbon-border-subtle)',
                color: 'var(--carbon-text-primary)',
                borderRadius: 'var(--carbon-radius)',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
