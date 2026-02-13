'use client';

import { BookOpen, Code2, Palette, Layers } from '@/components/icons';
import { ArrowRight } from '@carbon/icons-react';

interface DocCategory {
  title: string;
  description: string;
  icon: React.ComponentType<{ width?: number | string; height?: number | string; style?: React.CSSProperties }>;
  url: string;
  items: string[];
}

const categories: DocCategory[] = [
  {
    title: 'Components',
    description: 'Browse the full component library with usage guidelines, props, and live examples.',
    icon: Layers,
    url: 'https://carbondesignsystem.com/components/overview/',
    items: ['Button', 'DataTable', 'Modal', 'Dropdown', 'Tabs', 'Notification'],
  },
  {
    title: 'Patterns',
    description: 'Design patterns for common user workflows like forms, navigation, and data display.',
    icon: BookOpen,
    url: 'https://carbondesignsystem.com/patterns/overview/',
    items: ['Forms', 'Dialogs', 'Filtering', 'Loading', 'Empty states', 'Global header'],
  },
  {
    title: 'Guidelines',
    description: 'Foundational guidelines covering accessibility, color, typography, and motion.',
    icon: Palette,
    url: 'https://carbondesignsystem.com/guidelines/accessibility/overview/',
    items: ['Accessibility', 'Color', 'Typography', 'Icons', 'Motion', 'Spacing'],
  },
  {
    title: 'Developer resources',
    description: 'Get started with @carbon/react — installation, theming, and code references.',
    icon: Code2,
    url: 'https://carbondesignsystem.com/developing/get-started/',
    items: ['Get started', 'Frameworks', 'Theming', 'Migration', 'Contributing', 'Packages'],
  },
];

const spacingTokens = [
  { token: '$spacing-01', value: '2px' },
  { token: '$spacing-02', value: '4px' },
  { token: '$spacing-03', value: '8px' },
  { token: '$spacing-04', value: '12px' },
  { token: '$spacing-05', value: '16px' },
  { token: '$spacing-06', value: '24px' },
  { token: '$spacing-07', value: '32px' },
  { token: '$spacing-08', value: '40px' },
  { token: '$spacing-09', value: '48px' },
];

const colorTokens = [
  { token: '$interactive-01', value: '#0f62fe', label: 'Interactive' },
  { token: '$support-error', value: '#da1e28', label: 'Error' },
  { token: '$support-success', value: '#24a148', label: 'Success' },
  { token: '$support-warning', value: '#f1c21b', label: 'Warning' },
  { token: '$support-info', value: '#0043ce', label: 'Info' },
  { token: '$text-01', value: '#161616', label: 'Primary text' },
  { token: '$text-02', value: '#525252', label: 'Secondary text' },
  { token: '$ui-background', value: '#ffffff', label: 'Background' },
];

export function Documentation() {
  return (
    <div className="hub-view">
      <header
        className="hub-view-header hub-dark-header"
        style={{ backgroundColor: '#161616', borderColor: '#262626' }}
      >
        <h1>Documentation</h1>
        <p>Quick access to Carbon Design System resources and token references</p>
      </header>

      <div className="hub-view-scroll" style={{ backgroundColor: 'var(--carbon-bg-primary)' }}>
        <div className="docs-container">
          {/* Category cards */}
          <div className="docs-grid">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.title}
                  href={cat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="docs-card"
                >
                  <div className="docs-card-accent" />
                  <div className="docs-card-body">
                    <div className="docs-card-header">
                      <div className="docs-card-icon-wrap">
                        <Icon width={24} height={24} style={{ color: 'var(--carbon-interactive)' }} />
                      </div>
                      <ArrowRight size={20} className="docs-card-arrow" />
                    </div>
                    <h3 className="docs-card-title">{cat.title}</h3>
                    <p className="docs-card-desc">{cat.description}</p>
                    <div className="docs-card-items">
                      {cat.items.map((item) => (
                        <span key={item} className="docs-card-item">{item}</span>
                      ))}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick reference */}
          <div className="docs-reference">
            <h2 className="docs-reference-title">Quick reference</h2>

            <div className="docs-reference-grid">
              {/* Spacing tokens */}
              <div className="docs-reference-card">
                <h3 className="docs-reference-card-title">Spacing tokens</h3>
                <div className="docs-token-list">
                  {spacingTokens.map((t) => (
                    <div key={t.token} className="docs-token-row">
                      <code className="docs-token-name">{t.token}</code>
                      <div className="docs-token-bar-wrap">
                        <div
                          className="docs-token-bar"
                          style={{ width: t.value }}
                        />
                      </div>
                      <span className="docs-token-value">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color tokens */}
              <div className="docs-reference-card">
                <h3 className="docs-reference-card-title">Color tokens</h3>
                <div className="docs-token-list">
                  {colorTokens.map((t) => (
                    <div key={t.token} className="docs-token-row">
                      <div
                        className="docs-color-swatch"
                        style={{ backgroundColor: t.value }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <code className="docs-token-name">{t.token}</code>
                        <span className="docs-token-label">{t.label}</span>
                      </div>
                      <span className="docs-token-value">{t.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
