export interface DesignerQuestion {
  id: string;
  question: string;
  component: string[];
  context: string;
  platform: 'desktop' | 'mobile' | 'both';
  timestamp: Date;
  designer: string;
  team: string;
}

export const mockQuestions: DesignerQuestion[] = [
  {
    id: 'q1',
    question: 'Should I use a Drawer or Modal for a multi-step onboarding flow?',
    component: ['Drawer', 'Modal'],
    context: 'onboarding',
    platform: 'desktop',
    timestamp: new Date('2026-02-07T09:15:00'),
    designer: 'Sarah Chen',
    team: 'Growth',
  },
  {
    id: 'q2',
    question: "What's the recommended width for a Drawer in a settings panel?",
    component: ['Drawer'],
    context: 'settings',
    platform: 'desktop',
    timestamp: new Date('2026-02-07T10:30:00'),
    designer: 'Michael Torres',
    team: 'Platform',
  },
  {
    id: 'q3',
    question: 'Can Drawer components be used for mobile experiences?',
    component: ['Drawer'],
    context: 'general',
    platform: 'mobile',
    timestamp: new Date('2026-02-06T14:20:00'),
    designer: 'Lisa Park',
    team: 'Mobile',
  },
  {
    id: 'q4',
    question: 'When should I use a Drawer vs a side panel for filtering?',
    component: ['Drawer'],
    context: 'data-visualization',
    platform: 'desktop',
    timestamp: new Date('2026-02-06T11:45:00'),
    designer: 'David Kim',
    team: 'Analytics',
  },
  {
    id: 'q5',
    question: 'How do I handle nested navigation in a Drawer?',
    component: ['Drawer'],
    context: 'navigation',
    platform: 'both',
    timestamp: new Date('2026-02-05T16:00:00'),
    designer: 'Emma Rodriguez',
    team: 'Core',
  },
  {
    id: 'q6',
    question: "What's the correct spacing between buttons in a form?",
    component: ['Button'],
    context: 'forms',
    platform: 'both',
    timestamp: new Date('2026-02-07T08:00:00'),
    designer: 'Alex Johnson',
    team: 'Platform',
  },
  {
    id: 'q7',
    question: 'Should primary buttons be used for destructive actions?',
    component: ['Button'],
    context: 'forms',
    platform: 'both',
    timestamp: new Date('2026-02-06T13:30:00'),
    designer: 'Maria Garcia',
    team: 'Core',
  },
  {
    id: 'q8',
    question: 'Can I use a Modal inside another Modal?',
    component: ['Modal'],
    context: 'complex-flows',
    platform: 'desktop',
    timestamp: new Date('2026-02-05T10:15:00'),
    designer: 'James Wilson',
    team: 'Enterprise',
  },
  {
    id: 'q9',
    question: "What's the maximum width for a centered Modal?",
    component: ['Modal'],
    context: 'general',
    platform: 'desktop',
    timestamp: new Date('2026-02-04T15:45:00'),
    designer: 'Sarah Chen',
    team: 'Growth',
  },
  {
    id: 'q10',
    question: 'How do I show validation errors in a DataTable?',
    component: ['DataTable'],
    context: 'forms',
    platform: 'desktop',
    timestamp: new Date('2026-02-07T11:20:00'),
    designer: 'Michael Torres',
    team: 'Platform',
  },
  {
    id: 'q11',
    question: 'Can DataTable rows be draggable for reordering?',
    component: ['DataTable'],
    context: 'data-manipulation',
    platform: 'desktop',
    timestamp: new Date('2026-02-06T09:00:00'),
    designer: 'Lisa Park',
    team: 'Analytics',
  },
  {
    id: 'q12',
    question: "What's the recommended pagination size for DataTables?",
    component: ['DataTable'],
    context: 'data-visualization',
    platform: 'desktop',
    timestamp: new Date('2026-02-05T14:30:00'),
    designer: 'David Kim',
    team: 'Analytics',
  },
  {
    id: 'q13',
    question: 'When should I use a Toggle vs a Checkbox?',
    component: ['Toggle', 'Checkbox'],
    context: 'forms',
    platform: 'both',
    timestamp: new Date('2026-02-07T12:00:00'),
    designer: 'Emma Rodriguez',
    team: 'Core',
  },
  {
    id: 'q14',
    question: 'How do I implement accessible focus states for custom components?',
    component: ['Accessibility'],
    context: 'accessibility',
    platform: 'both',
    timestamp: new Date('2026-02-06T16:15:00'),
    designer: 'Alex Johnson',
    team: 'Platform',
  },
  {
    id: 'q15',
    question: "What's the correct color token for disabled text?",
    component: ['Tokens'],
    context: 'design-tokens',
    platform: 'both',
    timestamp: new Date('2026-02-05T11:00:00'),
    designer: 'Maria Garcia',
    team: 'Core',
  },
  {
    id: 'q16',
    question: 'Should I use a Drawer for a multi-step form wizard?',
    component: ['Drawer'],
    context: 'onboarding',
    platform: 'desktop',
    timestamp: new Date('2026-02-04T13:20:00'),
    designer: 'James Wilson',
    team: 'Enterprise',
  },
  {
    id: 'q17',
    question: 'Can I customize the close button position in a Drawer?',
    component: ['Drawer'],
    context: 'general',
    platform: 'desktop',
    timestamp: new Date('2026-02-03T10:30:00'),
    designer: 'Sarah Chen',
    team: 'Growth',
  },
  {
    id: 'q18',
    question: "What's the recommended height for a Drawer with scrollable content?",
    component: ['Drawer'],
    context: 'general',
    platform: 'desktop',
    timestamp: new Date('2026-02-02T14:00:00'),
    designer: 'Michael Torres',
    team: 'Platform',
  },
];

export interface QuestionCluster {
  id: string;
  topic: string;
  component: string[];
  questions: DesignerQuestion[];
  frequency: number;
  trend: 'new' | 'recurring' | 'increasing' | 'decreasing';
  contexts: string[];
  lastAsked: Date;
  firstAsked: Date;
}

export function clusterQuestions(questions: DesignerQuestion[]): QuestionCluster[] {
  const clusters: { [key: string]: DesignerQuestion[] } = {};

  questions.forEach((q) => {
    const key = `${q.component.join('-')}-${q.context}`;
    if (!clusters[key]) {
      clusters[key] = [];
    }
    clusters[key].push(q);
  });

  return Object.entries(clusters)
    .map(([_, clusterQuestions], index) => {
      const sortedByDate = [...clusterQuestions].sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
      const component = clusterQuestions[0].component;
      const contexts = Array.from(new Set(clusterQuestions.map((q) => q.context)));

      let trend: 'new' | 'recurring' | 'increasing' | 'decreasing' = 'recurring';
      const daysSinceFirst =
        (new Date().getTime() -
          sortedByDate[sortedByDate.length - 1].timestamp.getTime()) /
        (1000 * 60 * 60 * 24);
      const daysSinceLast =
        (new Date().getTime() - sortedByDate[0].timestamp.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysSinceFirst < 3) {
        trend = 'new';
      } else if (daysSinceLast < 1 && clusterQuestions.length > 2) {
        trend = 'increasing';
      } else if (daysSinceLast > 7) {
        trend = 'decreasing';
      }

      const topic = generateTopicSummary(clusterQuestions);

      return {
        id: `cluster-${index}`,
        topic,
        component,
        questions: sortedByDate,
        frequency: clusterQuestions.length,
        trend,
        contexts,
        lastAsked: sortedByDate[0].timestamp,
        firstAsked: sortedByDate[sortedByDate.length - 1].timestamp,
      };
    })
    .sort((a, b) => b.frequency - a.frequency);
}

function generateTopicSummary(questions: DesignerQuestion[]): string {
  const component = questions[0].component[0];
  const context = questions[0].context;

  if (component === 'Drawer' && context === 'onboarding') {
    return 'Drawer usage for multi-step flows';
  }
  if (component === 'Drawer' && context === 'general') {
    return 'Drawer sizing and configuration';
  }
  if (component === 'Drawer' && context === 'navigation') {
    return 'Drawer navigation patterns';
  }
  if (component === 'Button' && context === 'forms') {
    return 'Button usage in forms';
  }
  if (component === 'DataTable') {
    return 'DataTable customization and behavior';
  }
  if (component.includes('Modal')) {
    return 'Modal sizing and nesting';
  }
  return `${component} - ${context}`;
}
