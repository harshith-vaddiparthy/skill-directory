const https = require('https');
const fs = require('fs');

const OUTPUT_FILE = '/home/harshith/clawd/skill-directory/data/clawdhub.json';

// Search terms to find as many skills as possible
const searchTerms = [
  // Single letters
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  // Common topics
  'skill', 'api', 'web', 'tool', 'code', 'git', 'deploy', 'test', 
  'auth', 'database', 'ai', 'chat', 'email', 'search', 'media',
  'browser', 'frontend', 'backend', 'dev', 'mac', 'linux', 'windows',
  'docker', 'kubernetes', 'cloud', 'aws', 'azure', 'gcp',
  'python', 'node', 'typescript', 'javascript', 'react', 'vue', 'swift',
  'ios', 'android', 'mobile', 'cli', 'terminal', 'shell',
  'audio', 'video', 'image', 'file', 'document', 'pdf',
  'slack', 'discord', 'telegram', 'notion', 'obsidian',
  'openai', 'claude', 'gemini', 'llm', 'gpt',
  'scrape', 'crawl', 'extract', 'parse', 'convert',
  'monitor', 'alert', 'log', 'debug', 'trace',
  'security', 'audit', 'scan', 'vulnerability',
  'calendar', 'reminder', 'task', 'todo', 'workflow',
  'market', 'finance', 'stock', 'crypto', 'trade',
  'music', 'spotify', 'youtube', 'twitter', 'social',
  'seo', 'marketing', 'content', 'write', 'generate'
];

async function searchClawdHub(query) {
    return new Promise((resolve, reject) => {
        const url = `https://clawdhub.com/api/search?q=${encodeURIComponent(query)}`;
        https.get(url, (res) => {
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
        }).on('error', () => resolve([]));
    });
}

async function main() {
    console.log('Starting ClawdHub scrape...');
    
    const skillsMap = new Map();
    
    for (const term of searchTerms) {
        console.log(`Searching: ${term}`);
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
            console.log(`Found ${results.length} results, unique total: ${skillsMap.size}`);
            
            // Small delay
            await new Promise(r => setTimeout(r, 100));
        } catch (e) {
            console.error(`Error searching ${term}:`, e.message);
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
    console.log(`Done! Saved ${skills.length} unique skills to ${OUTPUT_FILE}`);
}

main();
