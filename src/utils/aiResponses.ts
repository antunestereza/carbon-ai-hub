import type { UserRole, ChatMessage } from '@/contexts/RoleContext';

type AIResponse = Omit<ChatMessage, 'id' | 'timestamp'>;

const developerResponses: Record<string, AIResponse> = {
  datatable: {
    role: 'assistant',
    content: `The DataTable component is a core Carbon component for displaying tabular data.

**Key Props:**
\`\`\`typescript
interface DataTableProps {
  rows: Array<Record<string, any>>;
  headers: Array<{ key: string; header: string }>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isSortable?: boolean;
  useZebraStyles?: boolean;
}
\`\`\`

**Basic Usage:**
\`\`\`jsx
import { DataTable } from '@carbon/react';

<DataTable
  rows={rows}
  headers={headers}
  size="md"
/>
\`\`\`

**Accessibility:**
- Built-in keyboard navigation
- ARIA labels for sortable columns
- Screen reader support for row selection`,
    trustBadge: 'official',
    componentPreview: 'datatable',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://react.carbondesignsystem.com/?path=/story/components-datatable' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/DataTable' },
      { title: 'Chromatic Diff', type: 'chromatic', url: 'https://www.chromatic.com/library?appId=carbon' },
    ],
  },
  button: {
    role: 'assistant',
    content: `The Button component is one of the most frequently used Carbon components.

**Available Props:**
\`\`\`typescript
interface ButtonProps {
  kind?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  disabled?: boolean;
  onClick?: () => void;
  renderIcon?: React.ComponentType;
  iconDescription?: string;
}
\`\`\`

**React Implementation:**
\`\`\`jsx
import { Button } from '@carbon/react';
import { Add } from '@carbon/icons-react';

<Button
  kind="primary"
  size="md"
  renderIcon={Add}
  onClick={handleClick}
>
  Add item
</Button>
\`\`\``,
    trustBadge: 'official',
    componentPreview: 'button',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://react.carbondesignsystem.com/?path=/story/components-button' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/Button' },
      { title: 'Chromatic Diff', type: 'chromatic', url: 'https://www.chromatic.com/library?appId=carbon' },
    ],
  },
};

const designerResponses: Record<string, AIResponse> = {
  datatable: {
    role: 'assistant',
    content: `DataTable specifications for designers:

**Spacing Tokens:**
- Cell padding: $spacing-05 (16px) vertical, $spacing-05 (16px) horizontal
- Row height: varies by size (xs: 24px, sm: 32px, md: 40px, lg: 48px, xl: 64px)
- Header padding: $spacing-05 (16px)
- Column gap: $spacing-05 (16px)

**Colors (Light Theme):**
- Header background: $layer-01 (#f4f4f4)
- Row background (zebra): alternating $layer-01 and $layer-02
- Border: $border-subtle-01 (#e0e0e0)
- Hover state: $layer-hover-01 (#e8e8e8)

**Typography:**
- Header: IBM Plex Sans, 14px, Semi-Bold
- Body: IBM Plex Sans, 14px, Regular
- Line height: 18px

**Accessibility:**
- Minimum contrast ratio: 4.5:1 for text
- Interactive elements: 3:1 contrast
- Focus indicator: 2px solid $focus (#0f62fe)`,
    trustBadge: 'official',
    componentPreview: 'datatable',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://react.carbondesignsystem.com/?path=/story/components-datatable' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
      { title: 'Chromatic Diff', type: 'chromatic', url: 'https://www.chromatic.com/library?appId=carbon' },
    ],
  },
  button: {
    role: 'assistant',
    content: `Button specifications for designers:

**Carbon Button Kinds:**
- Primary: High emphasis, one per section
- Secondary: Medium emphasis, supporting actions
- Tertiary: Low emphasis, less prominent
- Ghost: Minimal emphasis, inline or overlay
- Danger: Destructive or irreversible actions

**Spacing & Sizing:**
- Height: sm 32px, md 40px, lg 48px, xl 48px, 2xl 64px
- Padding: $spacing-05 (16px) horizontal for md
- Icon + text gap: $spacing-03 (8px)
- Min width: 48px for touch targets

**Colors (Light Theme):**
- Primary bg: $interactive-01 (#0f62fe)
- Secondary border: $interactive-01
- Ghost/danger: $interactive-01 text only
- Hover: $hover-primary, $hover-secondary, etc.

**Accessibility:**
- Minimum 44×44px touch target
- Focus: 2px solid $focus
- Contrast: 4.5:1 for text`,
    trustBadge: 'official',
    componentPreview: 'button',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://react.carbondesignsystem.com/?path=/story/components-button' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
    ],
  },
  spacing: {
    role: 'assistant',
    content: `Carbon spacing tokens follow an 8px base grid system (mini-unit):

**Available Spacing Tokens:**
- $spacing-01: 2px (0.125rem)
- $spacing-02: 4px (0.25rem)
- $spacing-03: 8px (0.5rem) - Mini unit
- $spacing-04: 12px (0.75rem)
- $spacing-05: 16px (1rem) - Recommended for medium gaps
- $spacing-06: 24px (1.5rem)
- $spacing-07: 32px (2rem)
- $spacing-08: 40px (2.5rem)
- $spacing-09: 48px (3rem)
- $spacing-10: 64px (4rem)
- $spacing-11: 80px (5rem)
- $spacing-12: 96px (6rem)

**Usage Guidelines:**
- Use $spacing-05 for general component padding
- Use $spacing-06 for section spacing
- Use $spacing-07+ for page-level margins
- Maintain 8px grid alignment

**In Figma:**
Use Auto Layout with multiples of 8px for spacing between elements.`,
    trustBadge: 'official',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://carbondesignsystem.com/guidelines/spacing' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
    ],
  },
  contained: {
    role: 'assistant',
    content: `**Short answer:** Use a **Contained List** for simple, single-column content inside smaller containers. Use a **Data Table** when you need multi-column data with sorting, filtering, or batch actions.

**Here's how to decide:**

| Criteria | Contained List | Data Table |
|----------|----------------|------------|
| Columns | Single column only | Multiple columns |
| Best context | Cards, sidebars, popovers | Full-width page areas |
| Interactivity | Inline actions (toggles, links) | Sorting, filtering, batch actions, expandable rows |
| Data volume | Short lists (5–25 items) | Large datasets with pagination |
| Content type | Homogeneous items | Heterogeneous data (text, numbers, statuses) |

**Use a Contained List when:**
- Displaying grouped items inside a card or sidebar
- Items have a single header and uniform row structure
- You need optional inline actions but not sorting

**Use a Data Table when:**
- You need multiple column headers
- Users need to sort, filter, or search the data
- You need row selection or batch actions
- Data requires pagination or expandable rows

💡 **Tip:** If you're tempted to add a second column to a Contained List, that's your signal to switch to a Data Table.`,
    trustBadge: 'best-practice',
    sources: [
      { title: 'Carbon Contained List', type: 'storybook', url: 'https://carbondesignsystem.com/components/contained-list/usage' },
      { title: 'Carbon Data Table', type: 'storybook', url: 'https://carbondesignsystem.com/components/data-table/usage' },
    ],
  },
};

const pmResponses: Record<string, AIResponse> = {
  datatable: {
    role: 'assistant',
    content: `DataTable Component - Maturity & Governance Report:

**Component Status:**
✓ Mature - Production Ready
- Version: 11.x (stable)
- Last updated: Q4 2025
- Breaking changes: None planned

**Carbon Compliance Score: 98/100**
- Accessibility: ✓ WCAG 2.1 AA compliant
- Responsive: ✓ Mobile-first design
- Theme support: ✓ Full theme support
- Documentation: ✓ Complete
- Test coverage: 95%

**Adoption Metrics:**
- Used in 450+ IBM products
- Community adoption: High
- Support tickets: <2% of usage

**Roadmap Alignment:**
- Q1 2026: Enhanced filtering features
- Q2 2026: Advanced virtualization
- Stable for long-term use

**Dependencies:**
- @carbon/react: ^11.x
- No breaking changes expected`,
    trustBadge: 'best-practice',
    componentPreview: 'datatable',
    sources: [
      { title: 'View in Storybook', type: 'storybook', url: 'https://react.carbondesignsystem.com/?path=/story/components-datatable' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
    ],
  },
  status: {
    role: 'assistant',
    content: `Carbon Design System - Overall Maturity Status:

**Component Maturity Breakdown:**
- Stable (Production): 85%
- Beta (Testing): 10%
- Alpha (Experimental): 5%

**Quality Metrics:**
- Average test coverage: 92%
- WCAG 2.1 AA compliance: 100%
- Documentation completeness: 97%
- Chromatic visual regression: Active

**Release Cadence:**
- Major releases: Annually
- Minor releases: Quarterly
- Patch releases: As needed
- LTS support: 2 years

**Risk Assessment:**
- Breaking changes: Low
- Security issues: None active
- Performance: Optimized
- Browser support: Modern browsers + IE11 (deprecated)

**Governance:**
- Core team: 12 full-time engineers
- Community contributors: 200+
- RFC process: Active
- Design reviews: Monthly`,
    trustBadge: 'best-practice',
    sources: [
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://carbondesignsystem.com/' },
    ],
  },
};

const ownerResponses: Record<string, AIResponse> = {
  governance: {
    role: 'assistant',
    content: `Carbon Design System - Brand Governance Summary:

**Brand Alignment: Excellent**
- IBM Design Language: 100% compliant
- Color palette: Approved by brand team
- Typography: IBM Plex Sans (brand standard)
- Logo usage: Aligned with brand guidelines

**Strategic Value:**
- Design consistency: Reduces design debt by 40%
- Development velocity: 30% faster implementation
- Maintenance cost: 50% reduction vs. custom components
- Accessibility compliance: Built-in WCAG 2.1 AA

**Adoption Metrics:**
- Internal products using Carbon: 450+
- External products: 150+
- Designer adoption: 85% of IBM designers
- Developer adoption: 90% of React teams

**Risk Mitigation:**
- No vendor lock-in (open source)
- Long-term IBM commitment
- Active maintenance & updates
- Enterprise support available

**ROI Indicators:**
- Time to market: -25%
- Design-dev handoff: -60% friction
- Accessibility issues: -80%
- Brand consistency: +95%`,
    trustBadge: 'best-practice',
    sources: [
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
    ],
  },
  roadmap: {
    role: 'assistant',
    content: `Carbon Design System - Roadmap & Strategic Alignment:

**2026 Roadmap:**

**Q1 2026:**
- Enhanced data visualization components
- Improved mobile patterns
- Advanced accessibility features
- Performance optimizations

**Q2 2026:**
- AI-powered component variants
- Design token automation
- Enhanced theming capabilities
- New industry-specific patterns

**Q3-Q4 2026:**
- Next-gen component architecture
- Cross-framework support expansion
- Advanced analytics integration
- Enterprise feature set

**Strategic Priorities:**
1. Accessibility-first design
2. Performance optimization
3. Developer experience
4. Design-to-code automation
5. AI integration

**Alignment with IBM Strategy:**
✓ Hybrid cloud focus
✓ AI/ML integration readiness
✓ Sustainability goals
✓ Inclusive design principles
✓ Open source commitment
✓ Long-term IBM commitment

**Long-term Vision:**
- Industry-leading design system
- Seamless design-dev workflow
- AI-assisted component generation
- Global design language`,
    trustBadge: 'best-practice',
    sources: [
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://carbondesignsystem.com/' },
    ],
  },
};

function findBestMatch(query: string, responses: Record<string, AIResponse>): AIResponse | null {
  const lowerQuery = query.toLowerCase();

  for (const [key, response] of Object.entries(responses)) {
    if (lowerQuery.includes(key)) {
      return response;
    }
  }

  return null;
}

export function generateAIResponse(query: string, role: UserRole): AIResponse {
  let response: AIResponse | null = null;

  switch (role) {
    case 'developer':
      response = findBestMatch(query, developerResponses);
      break;
    case 'designer':
      response = findBestMatch(query, designerResponses);
      break;
    case 'guardian':
      /* Guardian uses developer responses so button/datatable examples and componentPreview work */
      response = findBestMatch(query, developerResponses);
      break;
    case 'product-manager':
      response = findBestMatch(query, pmResponses);
      break;
    case 'project-owner':
      response = findBestMatch(query, ownerResponses);
      break;
    default:
      break;
  }

  if (!response) {
    response = generateDefaultResponse(query, role);
  }

  /* For guardians: suggest optional video answer when response would benefit from visual explanation */
  if (role === 'guardian' && response.role === 'assistant' && (response.componentPreview || response.sources?.length)) {
    return { ...response, suggestVideoAnswer: true };
  }

  return response;
}

function generateDefaultResponse(query: string, role: UserRole): AIResponse {
  const roleContext: Record<string, string> = {
    developer: 'code examples, props, and implementation details',
    designer: 'spacing tokens, color values, and visual specifications',
    guardian: 'component examples, props, and implementation details',
    'product-manager': 'component maturity, compliance scores, and planning data',
    'project-owner': 'governance metrics, ROI data, and strategic alignment',
  };

  return {
    role: 'assistant',
    content: `I understand you're asking about: "${query}"

As a ${role?.replace('-', ' ')}, I can help you with ${roleContext[role || 'developer']}.

**Available Resources:**
- Component specifications and guidelines
- Implementation examples
- Best practices and patterns
- Accessibility requirements
- Design tokens and styling

**Common Topics:**
${
  role === 'developer'
    ? `
- Component props and APIs
- React implementation examples
- TypeScript definitions
- Testing strategies
`
    : ''
}${
  role === 'designer'
    ? `
- Spacing and layout tokens
- Color palettes and contrast ratios
- Typography scales
- Component anatomy
`
    : ''
}${
  role === 'product-manager'
    ? `
- Component maturity status
- Compliance and quality metrics
- Adoption statistics
- Roadmap planning
`
    : ''
}${
  role === 'project-owner'
    ? `
- Brand governance alignment
- ROI and business metrics
- Strategic roadmap
- Risk assessment
`
    : ''
}

Could you provide more details about what you'd like to know? Try searching for specific component names (e.g., "Button", "DataTable") or topics (e.g., "spacing", "governance", "roadmap").`,
    trustBadge: 'best-practice',
    sources: [
      { title: 'Open in Figma', type: 'figma', url: 'https://www.figma.com/@carbon' },
      { title: 'View in Storybook', type: 'storybook', url: 'https://carbondesignsystem.com/' },
      { title: 'GitHub Source', type: 'github', url: 'https://github.com/carbon-design-system/carbon' },
    ],
  };
}
