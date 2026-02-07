# Skill Directory - System Status

**Last Updated:** 2026-02-06T06:06:00.000Z
**System Status:** 🟡 PARTIAL

---

## Current State

| Component | Status | Last Run | Notes |
|-----------|--------|----------|-------|
| Frontend | 🟢 Live | - | https://skill-directory-teal.vercel.app |
| skills.sh Scraper | 🟢 | 2026-02-06T06:04:12.714Z | OK - 330 skills |
| ClawdHub Scraper | 🟡 | 2026-02-05T06:05:07.853Z | Puppeteer/Chromium snap issue - used yesterday's data |
| Transform Pipeline | 🟢 | 2026-02-06T06:06:09.568Z | OK |
| Cron Automation | 🟢 Active | - | Daily 6 AM UTC |
| Notifications | 🟢 | - | Enabled |

## Data Stats

| Metric | Value |
|--------|-------|
| Total Skills | 3853 |
| From skills.sh | 330 |
| From ClawdHub | 3523 |
| Last Scrape | 2026-02-06T06:06:09.568Z |
| Change | +0 net (32 new on skills.sh, 32 rotated out) |

## Known Issues

- ClawdHub Puppeteer scraper fails due to Chromium snap cgroup sandboxing. Needs `--no-sandbox` flag or non-snap Chromium.

## Recent Activity

| Timestamp | Event |
|-----------|-------|
| 2026-02-06T06:06:00.000Z | Pipeline run (partial - skills.sh fresh, ClawdHub cached) |
| 2026-02-05T06:05:08.098Z | Pipeline run completed (full) |

---

*Auto-updated by Jarvis on each pipeline run*
