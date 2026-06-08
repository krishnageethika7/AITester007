# SOP: React UI Architecture
**Layer 1 — Architecture**

## Goal
Single-page React app: user enters JIRA ID → clicks Generate → sees ticket metadata + rendered Markdown test plan.

## Stack
| Concern | Technology |
|---|---|
| Frontend | Vite + React (JSX, no TypeScript) |
| Proxy/Backend | Express.js on port 8787 |
| JIRA calls | tools/jiraClient.js (Express-side only) |
| GROQ calls | tools/groqClient.js (Express-side only) |
| Markdown render | react-markdown + remark-gfm |
| Styling | Custom CSS, dark mode, CSS variables |

## Component Tree
```
App
├── SettingsPanel     ← collapsible, stores creds in localStorage
├── SearchBar         ← JIRA ID input + Generate button
├── TicketCard        ← shows summary, type, status, priority
└── TestPlanView      ← renders Markdown + Download button
```

## Data Flow
1. User fills SettingsPanel (JIRA URL, email, token, GROQ key) → saved to localStorage.
2. User types JIRA ID in SearchBar → clicks Generate.
3. App POSTs `{ issue_key, jiraUrl, email, token, groqKey }` to `/api/generate`.
4. Express calls jiraClient.js → groqClient.js → returns JSON response.
5. React renders TicketCard (metadata) + TestPlanView (Markdown).
6. User clicks Download → saves `.md` file via browser blob.

## Edge Cases
- Empty JIRA ID: disable Generate button, show inline validation.
- API error: display error banner, keep previous result visible.
- Missing settings: show settings panel highlighted in red before allowing generation.
