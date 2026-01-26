#!/usr/bin/env node
/**
 * Skill Directory - Main Update Orchestrator
 * 
 * Runs the full pipeline:
 * 1. Scrape all sources
 * 2. Transform data
 * 3. Detect changes
 * 4. Update data.js
 * 5. Commit and push
 * 6. Notify of changes
 * 
 * Usage: node update.js [--notify] [--no-push]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const LOG_DIR = path.join(ROOT_DIR, 'logs');

const args = process.argv.slice(2);
const shouldNotify = args.includes('--notify');
const shouldPush = !args.includes('--no-push');

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  
  // Also write to log file
  fs.mkdirSync(LOG_DIR, { recursive: true });
  const today = new Date().toISOString().split('T')[0];
  fs.appendFileSync(path.join(LOG_DIR, `${today}.log`), line + '\n');
}

function run(cmd, options = {}) {
  log(`Running: ${cmd}`);
  try {
    const output = execSync(cmd, { 
      cwd: ROOT_DIR, 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options 
    });
    return { success: true, output };
  } catch (error) {
    log(`Error: ${error.message}`);
    return { success: false, error };
  }
}

function getPreviousSkillCount() {
  const combinedFile = path.join(DATA_DIR, 'combined.json');
  if (fs.existsSync(combinedFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(combinedFile, 'utf8'));
      return data.totalSkills || 0;
    } catch {
      return 0;
    }
  }
  return 0;
}

async function main() {
  log('=== Skill Directory Update Started ===');
  
  const previousCount = getPreviousSkillCount();
  log(`Previous skill count: ${previousCount}`);
  
  // Step 1: Scrape skills.sh
  log('Step 1: Scraping skills.sh...');
  const skillsShResult = run('node scripts/scrape-skills-sh.js --limit=300', { silent: true });
  
  // Step 2: Scrape ClawdHub
  log('Step 2: Scraping clawdhub.com...');
  const clawdhubResult = run('node scripts/scrape-clawdhub.js', { silent: true });
  
  // Step 3: Transform
  log('Step 3: Transforming data...');
  const transformResult = run('node scripts/transform.js', { silent: true });
  
  // Get new count
  let newCount = 0;
  let changes = { added: 0, removed: 0 };
  const combinedFile = path.join(DATA_DIR, 'combined.json');
  if (fs.existsSync(combinedFile)) {
    const data = JSON.parse(fs.readFileSync(combinedFile, 'utf8'));
    newCount = data.totalSkills || 0;
    changes.added = Math.max(0, newCount - previousCount);
    changes.removed = Math.max(0, previousCount - newCount);
  }
  
  log(`New skill count: ${newCount} (${changes.added > 0 ? '+' : ''}${changes.added - changes.removed})`);
  
  // Step 4: Update STATUS.md
  log('Step 4: Updating STATUS.md...');
  const statusContent = `# Skill Directory - System Status

**Last Updated:** ${new Date().toISOString()}
**System Status:** 🟢 OPERATIONAL

---

## Current State

| Component | Status | Last Run | Notes |
|-----------|--------|----------|-------|
| Frontend | 🟢 Live | - | https://skill-directory-teal.vercel.app |
| skills.sh Scraper | ${skillsShResult.success ? '🟢' : '🔴'} | ${new Date().toISOString()} | ${skillsShResult.success ? 'OK' : 'Failed'} |
| ClawdHub Scraper | ${clawdhubResult.success ? '🟢' : '🔴'} | ${new Date().toISOString()} | ${clawdhubResult.success ? 'OK' : 'Failed'} |
| Transform Pipeline | ${transformResult.success ? '🟢' : '🔴'} | ${new Date().toISOString()} | ${transformResult.success ? 'OK' : 'Failed'} |
| Cron Automation | 🟢 Active | - | Daily 6 AM UTC |
| Notifications | ${shouldNotify ? '🟢' : '🟡'} | - | ${shouldNotify ? 'Enabled' : 'Manual'} |

## Data Stats

| Metric | Value |
|--------|-------|
| Total Skills | ${newCount} |
| From skills.sh | TBD |
| From ClawdHub | TBD |
| Last Scrape | ${new Date().toISOString()} |
| Change | ${changes.added > 0 ? '+' : ''}${changes.added - changes.removed} skills |

## Recent Activity

| Timestamp | Event |
|-----------|-------|
| ${new Date().toISOString()} | Pipeline run completed |

---

*Auto-updated by Jarvis on each pipeline run*
`;
  
  fs.writeFileSync(path.join(ROOT_DIR, 'STATUS.md'), statusContent);
  
  // Step 5: Git commit and push
  if (shouldPush) {
    log('Step 5: Committing and pushing...');
    run('git add .');
    run(`git commit -m "chore: auto-update skills data (${newCount} total, ${changes.added > 0 ? '+' : ''}${changes.added - changes.removed})" || true`);
    run('git push origin main');
    log('Pushed to GitHub - Vercel will auto-deploy');
  }
  
  // Step 6: Notify (if requested)
  if (shouldNotify && (changes.added > 0 || changes.removed > 0)) {
    log('Step 6: Sending notification...');
    // This will be handled by the calling script (Jarvis)
    console.log(JSON.stringify({
      type: 'skill_directory_update',
      previousCount,
      newCount,
      added: changes.added,
      removed: changes.removed,
      timestamp: new Date().toISOString()
    }));
  }
  
  log('=== Skill Directory Update Completed ===');
  
  return {
    success: skillsShResult.success && clawdhubResult.success && transformResult.success,
    previousCount,
    newCount,
    changes
  };
}

main().catch(err => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});
