const https = require('https');
const fs = require('fs');

const OUTPUT_FILE = '/home/harshith/clawd/skill-directory/data/clawdhub.json';

// Focus on specific topic terms only (no single letters)
const searchTerms = [
  'skill', 'api', 'web', 'tool', 'code', 'git', 'deploy', 'test', 
  'auth', 'database', 'ai', 'chat', 'email', 'search', 'media',
  'browser', 'frontend', 'backend', 'dev', 'mac', 'linux', 'docker',
  'kubernetes', 'cloud', 'aws', 'python', 'node', 'typescript',
  'javascript', 'react', 'swift', 'ios', 'android', 'mobile', 'cli',
  'terminal', 'shell', 'audio', 'video', 'image', 'file', 'document',
  'slack', 'discord', 'telegram', 'notion', 'obsidian', 'openai',
  'claude', 'gemini', 'llm', 'scrape', 'crawl', 'monitor', 'security',
  'audit', 'calendar', 'task', 'workflow', 'finance', 'music', 'spotify',
  'youtube', 'twitter', 'social', 'seo', 'marketing', 'content', 'generate',
  'automation', 'agent', 'bot', 'assistant', 'helper', 'manager', 'builder',
  'writer', 'editor', 'analyzer', 'tracker', 'sync', 'backup', 'restore',
  'translate', 'summarize', 'extract', 'convert', 'format', 'validate',
  'schedule', 'remind', 'notify', 'alert', 'report', 'dashboard', 'metrics'
];

async function searchClawdHub(query) {
    return new Promise((resolve) => {
        const url = `https://clawdhub.com/api/search?q=${encodeURIComponent(query)}`;
        const req = https.get(url, { timeout: 5000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result.results || []);
                } catch (e) {
                    resolve([]);
                }
            });
        });
        req.on('error', () => resolve([]));
        req.on('timeout', () => { req.destroy(); resolve([]); });
    });
}

async function main() {
    console.log('Starting ClawdHub scrape...');
    
    const skillsMap = new Map();
    
    for (const term of searchTerms) {
        process.stdout.write(`Searching: ${term}... `);
        try {
            const results = await searchClawdHub(term);
            for (const skill of results) {
                if (skill.slug && !skillsMap.has(skill.slug)) {
                    skillsMap.set(skill.slug, {
                        id: skill.slug,
                        name: skill.displayName || skill.slug,
                        summary: skill.summary,
                        version: skill.version,
                        updatedAt: skill.updatedAt
                    });
                }
            }
            console.log(`+${results.length} (total: ${skillsMap.size})`);
            
            // Small delay
            await new Promise(r => setTimeout(r, 50));
        } catch (e) {
            console.log(`error: ${e.message}`);
        }
    }
    
    const skills = Array.from(skillsMap.values());
    
    const result = {
        skills,
        totalSkills: skills.length,
        scrapedAt: new Date().toISOString(),
        source: 'clawdhub.com'
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`\nDone! Saved ${skills.length} unique skills to ${OUTPUT_FILE}`);
}

main();
