# Assurance Corp Website Changelog

Track website updates and keep rollback details for each change set.

## 2026-02-26 - Layout polish, homepage rework, leader profile pages, and Add-Leader skill

### Summary
- Removed template "Navigate by Priority" card grid from homepage; replaced with a real **About** preview section (image + vision/mission cards + CTA) and an **Industries** preview grid (12 industry items + CTA).
- Created three individual leader profile pages: Abdulla Saeed Al-Jneibi, Imran Zamir Sheikh, and Irfan Tanwir.
- Updated `leadership.html` cards and homepage carousel to link to the new profile pages.
- Added CSS layout tokens (`--page-gutter`, `--container-wide`, `--container-narrow`, `--container-text`, `--nav-height`) for consistent widths and spacing.
- Fixed anchor-scroll offset under the sticky navbar via `scroll-padding-top` and a JS-synced `--nav-height` custom property.
- Added responsive rules at 1024 px, 768 px, and 480 px for all new sections and leader profile pages.
- Created the **website-dev-leader-profile** Codex skill for repeatable leader page creation.

### Files Changed
- `assurance-corp/index.html`: Removed `.home-pathways` section; added `.home-about` and `.home-industries` sections; updated carousel slide links to individual leader pages.
- `assurance-corp/styles.css`: Added layout tokens to `:root`; added `scroll-padding-top` / `scroll-margin-top` for anchor offset; replaced `.home-pathways*` CSS with `.home-about*` and `.home-industries*` styles; added `.leader-profile-page` block; updated responsive breakpoints with new section rules and `--page-gutter` variable.
- `assurance-corp/script.js`: Added `syncNavHeight()` for dynamic `--nav-height`; updated `setActivePageNavLink()` to detect `leader-*.html`; updated `initScrollReveal()` selectors for new sections.
- `assurance-corp/leadership.html`: Added "View full profile" links in each `.profile-card`.
- `assurance-corp/leader-abdulla-saeed-al-jneibi.html`: New leader profile page (Chairman).
- `assurance-corp/leader-imran-zamir-sheikh.html`: New leader profile page (Managing Partner).
- `assurance-corp/leader-irfan-tanwir.html`: New leader profile page (Director Consulting & Advisory).
- `.codex/skills/website-dev-leader-profile/SKILL.md`: New skill instructions.
- `.codex/skills/website-dev-leader-profile/agents/openai.yaml`: New skill metadata.
- `assurance-corp/CHANGELOG.md`: This entry.

### Assets Added
- None (existing portraits reused: `profile-000.jpg`, `profile-001.png`, `profile-002.jpg`).

### Validation
- Manual review of section structure and class naming across all modified HTML and CSS.
- Verified legacy classes (`services-grid`, `leaders-grid`, `industries-grid`, `service-card`, `leader-card`, `industry-item`) are no longer referenced in any HTML file.
- Browser validation: Not run in this environment.

### Rollback
- Baseline commit: `uncommitted`
- Restore modified files from previous commit:
  - `assurance-corp/index.html`
  - `assurance-corp/styles.css`
  - `assurance-corp/script.js`
  - `assurance-corp/leadership.html`
  - `assurance-corp/CHANGELOG.md`
- Remove newly created files:
  - `assurance-corp/leader-abdulla-saeed-al-jneibi.html`
  - `assurance-corp/leader-imran-zamir-sheikh.html`
  - `assurance-corp/leader-irfan-tanwir.html`
  - `.codex/skills/website-dev-leader-profile/SKILL.md`
  - `.codex/skills/website-dev-leader-profile/agents/openai.yaml`

## 2026-02-24 - Hero image rollout for all hero sections and changelog skill bootstrap

### Summary
- Added dedicated generated hero background images for About, Services, Industries, and Leadership pages.
- Updated inner-page hero styling to match the homepage hero image/overlay treatment on desktop, tablet, and mobile.
- Added a reusable local Codex skill to keep future changelog updates rollback-focused and consistent.

### Files Changed
- `assurance-corp/styles.css`: Added per-page hero image variables, image layers, and responsive overlay behavior for `.services-hero`.
- `.codex/skills/website-dev-changelog/SKILL.md`: Added instructions for maintaining rollback-ready changelog entries.
- `.codex/skills/website-dev-changelog/agents/openai.yaml`: Added skill metadata for skill discovery chips/prompts.
- `assurance-corp/CHANGELOG.md`: Initialized changelog tracking for the website project.

### Assets Added
- `assurance-corp/images/heroes/about-hero.jpg`: Generated 1600x900 hero image for About page.
- `assurance-corp/images/heroes/services-hero.jpg`: Generated 1600x900 hero image for Services page.
- `assurance-corp/images/heroes/industries-hero.jpg`: Generated 1600x900 hero image for Industries page.
- `assurance-corp/images/heroes/leadership-hero.jpg`: Generated 1600x900 hero image for Leadership page.

### Validation
- `file assurance-corp/images/heroes/*.jpg`: Confirmed all new hero images exist and are 1600x900 JPEG files.
- Browser validation: Not run in this environment.

### Rollback
- Baseline commit: `uncommitted` (baseline hash was not captured before this change set).
- Restore modified files from your preferred previous commit:
  - `assurance-corp/styles.css`
  - `.codex/skills/website-dev-changelog/SKILL.md`
  - `.codex/skills/website-dev-changelog/agents/openai.yaml`
  - `assurance-corp/CHANGELOG.md`
- Remove the added generated assets if reverting this change set:
  - `assurance-corp/images/heroes/about-hero.jpg`
  - `assurance-corp/images/heroes/services-hero.jpg`
  - `assurance-corp/images/heroes/industries-hero.jpg`
  - `assurance-corp/images/heroes/leadership-hero.jpg`
