# Test Strategy — 21-Section Template Contract
**Source of truth for section order, names, and format rules.**
If this file changes, update tools/testStrategy.js system prompt AND src/components/TestStrategyView.jsx together (Golden Rule).

## Required Sections (in order)
| # | Section Heading | Format |
|---|---|---|
| 1 | Document Control | Table |
| 2 | Introduction / Background | Paragraphs |
| 3 | Objective | Paragraph |
| 4 | Scope | ### In Scope (bullets) + ### Out of Scope (bullets) |
| 5 | Test Levels & Types | Bullets |
| 6 | Focus Areas / Quality Attributes | Bullets |
| 7 | Test Approach | Bullets |
| 8 | Test Environment(s) | Table |
| 9 | Test Data Management | Bullets/paragraphs |
| 10 | Tools & Technology | Table |
| 11 | Roles & Responsibilities | Paragraph + Table |
| 12 | Schedule & Milestones | Bullets/paragraphs |
| 13 | Deliverables | Bullets |
| 14 | Entry, Exit, Suspension & Resumption Criteria | ### sub-sections |
| 15 | Defect Management | Paragraphs + severity/priority list |
| 16 | Test Metrics & KPIs | Bullets |
| 17 | Risks & Mitigation | Table |
| 18 | Assumptions & Dependencies | ### sub-sections |
| 19 | Communication & Reporting | Bullets |
| 20 | Domain-Specific Considerations | Bullets |
| 21 | Approval & Sign-off | Table |

## Section Headings Format
- `## 1. Document Control` (use `##` + number + dot + name)
- Sub-sections: `### In Scope`, `### Out of Scope`, etc.

## Non-Negotiable Rules
1. All 21 sections must appear — no skipping, no adding a 22nd.
2. Missing data → `[INSERT VALUE]` or `TBD` — never invented.
3. Raw Markdown only — no outer code fences, no table of contents.
4. Formal, declarative, third-person. No "I", no hedging words.
