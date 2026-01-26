# Skill Directory - Project Overview

**Project Lead:** Jarvis (AI)
**Owner:** Harshith
**Status:** 🟢 Active
**Started:** 2026-01-26

---

## Mission

Build and maintain the most comprehensive, auto-updating directory of AI agent skills across the ecosystem. This directory runs autonomously with minimal human intervention.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SKILL DIRECTORY SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │  skills.sh   │    │  clawdhub    │    │  Future      │       │
│  │  (25K+)      │    │  (50+)       │    │  Sources     │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │                │
│         └───────────────────┼───────────────────┘                │
│                             ▼                                    │
│                    ┌────────────────┐                            │
│                    │   SCRAPER      │                            │
│                    │   (Daily 6AM)  │                            │
│                    └────────┬───────┘                            │
│                             ▼                                    │
│                    ┌────────────────┐                            │
│                    │  TRANSFORMER   │                            │
│                    │  - Normalize   │                            │
│                    │  - Categorize  │                            │
│                    │  - Dedupe      │                            │
│                    └────────┬───────┘                            │
│                             ▼                                    │
│         ┌───────────────────┼───────────────────┐                │
│         ▼                   ▼                   ▼                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │  DIFF ENGINE │   │  data.js     │   │  ANALYTICS   │         │
│  │  (New items) │   │  (Static)    │   │  (Trends)    │         │
│  └──────┬───────┘   └──────┬───────┘   └──────────────┘         │
│         │                  │                                     │
│         ▼                  ▼                                     │
│  ┌──────────────┐   ┌──────────────┐                            │
│  │  NOTIFY      │   │  GIT PUSH    │                            │
│  │  (Telegram)  │   │  (Auto-dep)  │                            │
│  └──────────────┘   └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Sources

| Source | URL | Type | Update Frequency | Skills Count |
|--------|-----|------|------------------|--------------|
| skills.sh | https://skills.sh | Claude Code / Agent Skills | Daily | 25,669+ |
| ClawdHub | https://clawdhub.com/skills | Clawdbot Skills | Daily | 50+ |
| GitHub Topics | TBD | Community Skills | Weekly | TBD |
| Awesome Lists | TBD | Curated Lists | Weekly | TBD |

## Directory Structure

```
skill-directory/
├── PROJECT.md              # This file - project overview
├── CHANGELOG.md            # What changed and when
├── STATUS.md               # Current system status
├── index.html              # Frontend
├── app.js                  # Frontend logic
├── data.js                 # Generated skill data
├── scripts/
│   ├── scrape-skills-sh.js # Scraper for skills.sh
│   ├── scrape-clawdhub.js  # Scraper for clawdhub.com
│   ├── transform.js        # Data normalization
│   ├── diff.js             # Change detection
│   ├── update.js           # Main orchestrator
│   └── notify.js           # Telegram notifications
├── data/
│   ├── skills-sh.json      # Raw scraped data
│   ├── clawdhub.json       # Raw scraped data
│   ├── combined.json       # Merged & normalized
│   └── history/            # Historical snapshots
│       └── YYYY-MM-DD.json
└── logs/
    └── YYYY-MM-DD.log      # Execution logs
```

## Automation Schedule

| Time (UTC) | Job | Description |
|------------|-----|-------------|
| 06:00 | `scrape-all` | Scrape all sources |
| 06:15 | `transform` | Process and normalize |
| 06:20 | `diff` | Detect changes |
| 06:25 | `update` | Update data.js, commit, push |
| 06:30 | `notify` | Alert Harshith of changes |

## Notification Rules

**Always notify:**
- New skills from major providers (Vercel, Anthropic, Supabase, etc.)
- Skills with >1000 installs appearing
- Clawdbot-specific skills (always relevant)

**Weekly digest:**
- Total new skills added
- Trending skills (fastest growing)
- Category breakdown

**Never notify:**
- Minor updates to existing skills
- Skills with <10 installs (noise)

## Quality Standards

1. **Data Accuracy:** Cross-reference multiple sources when possible
2. **Categorization:** AI-assisted but human-reviewable
3. **Freshness:** Data never more than 24h old
4. **Uptime:** Site always accessible via Vercel

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Skills indexed | 1000+ | 25 |
| Sources integrated | 4+ | 2 |
| Update frequency | Daily | Manual |
| Uptime | 99.9% | 100% |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-26 | Use browser scraping over API | skills.sh has no public API |
| 2026-01-26 | Static site over dynamic | Simpler, faster, free hosting |
| 2026-01-26 | Vercel for hosting | Auto-deploy on git push |

## Roadmap

### Phase 1: Foundation (Current)
- [x] Basic frontend built
- [x] Deployed to Vercel
- [ ] Scraper scripts
- [ ] Real data population
- [ ] Cron automation

### Phase 2: Growth
- [ ] Add GitHub Topics source
- [ ] Add Awesome Lists source
- [ ] Implement search indexing
- [ ] Add skill detail pages

### Phase 3: Intelligence
- [ ] Trend detection
- [ ] Recommendation engine
- [ ] Skill compatibility checker
- [ ] Community ratings

---

*This project is managed autonomously by Jarvis. For questions, contact Harshith.*
