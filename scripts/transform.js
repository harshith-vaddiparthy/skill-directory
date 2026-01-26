#!/usr/bin/env node
/**
 * Skill Directory - Data Transformer
 * 
 * Combines data from multiple sources, normalizes format,
 * adds categories, and outputs combined.json + data.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ROOT_DIR = path.join(__dirname, '..');

// Category mapping based on keywords
const CATEGORY_RULES = [
  { keywords: ['react', 'vue', 'frontend', 'css', 'tailwind', 'ui', 'design', 'component'], category: 'Frontend' },
  { keywords: ['node', 'express', 'fastapi', 'backend', 'api', 'server', 'database', 'postgres', 'sql'], category: 'Backend' },
  { keywords: ['ai', 'llm', 'gpt', 'claude', 'openai', 'anthropic', 'agent', 'ml'], category: 'AI & ML' },
  { keywords: ['browser', 'scrape', 'crawl', 'puppeteer', 'playwright', 'automation'], category: 'Browser Automation' },
  { keywords: ['slack', 'discord', 'telegram', 'twitter', 'social', 'whatsapp', 'email'], category: 'Communication' },
  { keywords: ['github', 'git', 'deploy', 'ci', 'cd', 'vercel', 'docker'], category: 'DevOps' },
  { keywords: ['test', 'debug', 'lint', 'format', 'quality'], category: 'Testing & Quality' },
  { keywords: ['expo', 'react-native', 'mobile', 'ios', 'android'], category: 'Mobile' },
  { keywords: ['marketing', 'seo', 'analytics', 'conversion'], category: 'Marketing' },
  { keywords: ['pdf', 'doc', 'excel', 'file', 'convert', 'markdown'], category: 'Documents' },
  { keywords: ['home', 'iot', 'smart', 'sonos', 'music'], category: 'Smart Home' },
  { keywords: ['clawdbot', 'clawd', 'skill'], category: 'Clawdbot' },
];

function categorize(skill) {
  const text = `${skill.name} ${skill.description || ''} ${skill.repo || ''}`.toLowerCase();
  
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(kw => text.includes(kw))) {
      return rule.category;
    }
  }
  
  return 'Other';
}

function extractTags(skill) {
  const text = `${skill.name} ${skill.description || ''}`.toLowerCase();
  const tags = new Set();
  
  const TAG_KEYWORDS = [
    'react', 'vue', 'next', 'nuxt', 'node', 'python', 'typescript',
    'api', 'cli', 'mcp', 'browser', 'ai', 'automation', 'scraping',
    'slack', 'discord', 'telegram', 'github', 'vercel', 'supabase',
    'database', 'testing', 'marketing', 'seo', 'pdf', 'email'
  ];
  
  for (const tag of TAG_KEYWORDS) {
    if (text.includes(tag)) {
      tags.add(tag);
    }
  }
  
  return Array.from(tags).slice(0, 5); // Max 5 tags
}

function normalizeSkill(skill, source) {
  return {
    id: skill.id,
    name: skill.name,
    author: skill.repo?.split('/')[0] || 'unknown',
    repo: skill.repo || null,
    description: skill.description || '',
    installs: skill.installs || 0,
    downloads: skill.downloads || 0,
    stars: skill.stars || 0,
    category: categorize(skill),
    tags: extractTags(skill),
    source: source,
    url: skill.url,
    installCommand: source === 'skills.sh' 
      ? `npx skills add ${skill.id}`
      : `clawdhub install ${skill.id}`,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
}

function transform() {
  console.log('[transform] Starting transformation');
  
  const combined = [];
  const seenIds = new Set();
  
  // Load skills.sh data
  const skillsShFile = path.join(DATA_DIR, 'skills-sh.json');
  if (fs.existsSync(skillsShFile)) {
    const data = JSON.parse(fs.readFileSync(skillsShFile, 'utf8'));
    console.log(`[transform] Loaded ${data.skills.length} skills from skills.sh`);
    
    for (const skill of data.skills) {
      const normalized = normalizeSkill(skill, 'skills.sh');
      if (!seenIds.has(normalized.id)) {
        seenIds.add(normalized.id);
        combined.push(normalized);
      }
    }
  }
  
  // Load ClawdHub data
  const clawdhubFile = path.join(DATA_DIR, 'clawdhub.json');
  if (fs.existsSync(clawdhubFile)) {
    const data = JSON.parse(fs.readFileSync(clawdhubFile, 'utf8'));
    console.log(`[transform] Loaded ${data.skills.length} skills from ClawdHub`);
    
    for (const skill of data.skills) {
      const normalized = normalizeSkill(skill, 'clawdhub');
      if (!seenIds.has(normalized.id)) {
        seenIds.add(normalized.id);
        combined.push(normalized);
      }
    }
  }
  
  // Sort by installs + downloads
  combined.sort((a, b) => (b.installs + b.downloads) - (a.installs + a.downloads));
  
  // Save combined.json
  const combinedOutput = {
    generatedAt: new Date().toISOString(),
    totalSkills: combined.length,
    bySource: {
      'skills.sh': combined.filter(s => s.source === 'skills.sh').length,
      'clawdhub': combined.filter(s => s.source === 'clawdhub').length
    },
    byCategory: {},
    skills: combined
  };
  
  // Count by category
  for (const skill of combined) {
    combinedOutput.byCategory[skill.category] = (combinedOutput.byCategory[skill.category] || 0) + 1;
  }
  
  fs.writeFileSync(
    path.join(DATA_DIR, 'combined.json'),
    JSON.stringify(combinedOutput, null, 2)
  );
  
  // Generate data.js for frontend
  const dataJs = `// Auto-generated by transform.js
// Last updated: ${new Date().toISOString()}
// Total skills: ${combined.length}

const skills = ${JSON.stringify(combined, null, 2)};

// Export for use in app.js
if (typeof window !== 'undefined') {
  window.skillsData = skills;
}
if (typeof module !== 'undefined') {
  module.exports = { skills };
}
`;
  
  fs.writeFileSync(path.join(ROOT_DIR, 'data.js'), dataJs);
  
  console.log(`[transform] Generated data.js with ${combined.length} skills`);
  console.log(`[transform] Categories: ${JSON.stringify(combinedOutput.byCategory)}`);
  
  // Save to history
  const historyDir = path.join(DATA_DIR, 'history');
  fs.mkdirSync(historyDir, { recursive: true });
  const today = new Date().toISOString().split('T')[0];
  fs.writeFileSync(
    path.join(historyDir, `${today}.json`),
    JSON.stringify(combinedOutput, null, 2)
  );
  
  return combinedOutput;
}

if (require.main === module) {
  transform();
}

module.exports = { transform };
