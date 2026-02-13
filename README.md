# IDS Hackathon: AI Hub (based on Carbon Design System)

AI-powered documentation assistant for IBM's Carbon Design System.

## Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/jes-a/ids-hackathon-ai-hub.git
   cd ids-hackathon-ai-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000

## Project Structure

- `src/app/page.tsx` — Home page (role selector)
- `src/app/hub/page.tsx` — Main app hub (chat, audit, guardian views)
- `src/app/chat/page.tsx` — Redirects to `/hub`
- `src/components/` — UI components (hub, chat, audit, guardian dashboards)
- `src/contexts/` — Role + theme context providers
- `src/utils/` — Mock data and AI responses

## For Designers on the Team

Most of your edits will be in:

- `src/components/` — Edit JSX (it's like HTML with `className` instead of `class`)
- `src/styles/` — Edit SCSS (it's CSS with nesting and variables)

### Common edits

- **Change text:** Find the string in the component file and edit it
- **Change colors:** Update CSS variables in `src/app/globals.scss`
- **Change spacing:** Update padding/margins in `src/app/globals.scss` or component styles
- **Add a component:** Create a new component in `src/components/` and wire it into `MainHub.tsx`

## Switching to Real AI (Future)

1. Get an Anthropic API key from https://console.anthropic.com
2. Create `.env.local` and add: `ANTHROPIC_API_KEY=your-key-here`
3. Create `src/app/api/chat/route.ts` with the API integration
4. Update `src/components/ChatInterface.tsx` to call `/api/chat` instead of mock responses

## Tech Stack

- Next.js (App Router)
- Custom SVG icon set in `src/components/icons.tsx`
- Sass for styling (CSS variables in `src/app/globals.scss`)
- Mock AI responses (no API keys required)

---
*Small update to test branch push.*
