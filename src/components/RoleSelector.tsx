'use client';

import { Security, Code, ColorPalette, ArrowRight } from '@carbon/icons-react';
import { CarbonLogo, CortexLogo } from '@/components/Logo';
import { useRole, type UserRole } from '@/contexts/RoleContext';
import { useRouter } from 'next/navigation';

interface RoleOption {
  id: UserRole;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number | string; fill?: string; className?: string }>;
  focus: string;
}

const roles: RoleOption[] = [
  {
    id: 'guardian',
    title: 'Design System Guardian',
    description:
      'Monitor designer uncertainty, detect patterns, and guide system evolution',
    icon: Security,
    focus: 'System governance',
  },
  {
    id: 'developer',
    title: 'Developer',
    description:
      'Access code snippets, prop tables, and React implementation details',
    icon: Code,
    focus: 'Technical implementation',
  },
  {
    id: 'designer',
    title: 'Designer',
    description:
      'Explore spacing tokens, color values, and Figma-ready specs',
    icon: ColorPalette,
    focus: 'Visual specifications',
  },
];

export function RoleSelector() {
  const { setUserRole } = useRole();
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    router.push('/hub');
  };

  return (
    <div className="role-selector">
      {/* ── Dark hero banner ─────────────────────────────── */}
      <div className="role-hero">
        <div className="role-hero-inner">
          <div className="role-hero-brand">
            <CarbonLogo size={24} color="#ffffff" />
            <span className="role-hero-brand-text">Carbon Design System</span>
          </div>

          <h1 className="role-hero-title">AI Hub</h1>

          <p className="role-hero-subtitle">
            AI-powered documentation assistant for IBM Carbon Design System.
            Get contextual answers drawn from live documentation, Figma assets,
            and the <code>@carbon/react</code> source.
          </p>
        </div>

        {/* Decorative grid lines — subtle IBM motif */}
        <div className="role-hero-grid-lines" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* ── Role cards section ───────────────────────────── */}
      <div className="role-content">
        <div className="role-content-inner">
          <p className="role-section-label">Select your role to get started</p>

          <div className="role-selector-grid">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  className="role-card"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="role-card-accent" />

                  <div className="role-card-body">
                    <div className="role-card-icon-wrap">
                      <Icon size={24} fill="var(--carbon-interactive)" />
                    </div>

                    <h3 className="role-card-title">{role.title}</h3>

                    <p className="role-card-desc">{role.description}</p>

                    <div className="role-card-footer">
                      <span className="role-card-tag">{role.focus}</span>
                      <ArrowRight size={20} className="role-card-arrow" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="role-selector-footer">
        <div className="role-footer-powered">
          <span className="role-footer-powered-label">Powered by</span>
          <CortexLogo height={18} />
        </div>
        <p className="role-selector-footer-text">
          Indexes carbondesignsystem.com, Figma APIs, and @carbon/react
        </p>
      </footer>
    </div>
  );
}
