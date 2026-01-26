/**
 * Transform full skills.sh data (16K+ skills) to data.js format
 * Outputs DIRECTORY_DATA object for the frontend
 */
const fs = require('fs');

const INPUT_FILE = '/home/harshith/clawd/skill-directory/data/skills-sh.json';
const OUTPUT_FILE = '/home/harshith/clawd/skill-directory/data.js';

// Category detection from skill name/id
function detectCategory(name, source) {
    const lowerName = name.toLowerCase();
    const lowerSource = (source || '').toLowerCase();
    
    // Frontend
    if (/react|vue|angular|svelte|next|nuxt|frontend|css|tailwind|ui-ux|design|shadcn/.test(lowerName)) {
        return 'frontend';
    }
    // Backend
    if (/backend|server|api|express|fastapi|django|flask|rails|spring|nest|prisma|postgres|mysql|database|supabase|mongodb/.test(lowerName)) {
        return 'backend';
    }
    // DevOps
    if (/devops|docker|kubernetes|k8s|terraform|ansible|cicd|deploy|aws|azure|gcp|cloud|infrastructure/.test(lowerName)) {
        return 'devops';
    }
    // AI/ML
    if (/ai|ml|llm|gpt|claude|openai|langchain|embedding|vector|transformer|model/.test(lowerName)) {
        return 'ai-ml';
    }
    // Mobile
    if (/mobile|ios|android|swift|kotlin|react-native|expo|flutter/.test(lowerName)) {
        return 'mobile';
    }
    // Testing
    if (/test|testing|jest|vitest|playwright|cypress|unittest|spec/.test(lowerName)) {
        return 'testing';
    }
    // Security
    if (/security|auth|oauth|jwt|encryption|vulnerability|audit|secure/.test(lowerName)) {
        return 'security';
    }
    // Documentation
    if (/doc|readme|writing|content|markdown/.test(lowerName)) {
        return 'documentation';
    }
    // Marketing
    if (/marketing|seo|ads|social|content|copywriting|email-sequence|analytics/.test(lowerName)) {
        return 'marketing';
    }
    // Development Tools
    if (/git|debug|lint|format|build|compile|cli|terminal|editor/.test(lowerName)) {
        return 'dev-tools';
    }
    // Clawdbot specific
    if (/clawdbot|clawdhub/.test(lowerSource)) {
        return 'clawdbot';
    }
    // Agent/Automation
    if (/agent|automat|workflow|task|bot/.test(lowerName)) {
        return 'automation';
    }
    
    return 'other';
}

// Extract tags from skill name
function extractTags(name, source) {
    const tags = [];
    const lowerName = name.toLowerCase();
    
    // Framework/library tags
    const frameworks = ['react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'expo', 'django', 'flask', 
                        'express', 'fastapi', 'nest', 'spring', 'rails', 'laravel', 'swift', 'kotlin'];
    frameworks.forEach(fw => {
        if (lowerName.includes(fw)) tags.push(fw);
    });
    
    // Technology tags
    const techs = ['typescript', 'javascript', 'python', 'rust', 'go', 'java', 'ruby', 'php', 
                   'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'graphql',
                   'postgres', 'mysql', 'mongodb', 'redis', 'supabase', 'firebase',
                   'tailwind', 'css', 'sass', 'webpack', 'vite', 'esbuild'];
    techs.forEach(tech => {
        if (lowerName.includes(tech)) tags.push(tech);
    });
    
    // Topic tags
    const topics = ['testing', 'security', 'auth', 'api', 'seo', 'marketing', 'devops', 'cicd',
                    'performance', 'accessibility', 'design', 'ui', 'ux', 'mobile', 'web'];
    topics.forEach(topic => {
        if (lowerName.includes(topic)) tags.push(topic);
    });
    
    return [...new Set(tags)].slice(0, 5); // Max 5 unique tags
}

async function main() {
    console.log('Loading skills.sh data...');
    
    const rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
    const skills = rawData.skills;
    
    console.log(`Processing ${skills.length} skills...`);
    
    // Category definitions
    const categoryDefs = [
        { id: 'all', name: 'All', icon: '📦' },
        { id: 'frontend', name: 'Frontend', icon: '🎨' },
        { id: 'backend', name: 'Backend', icon: '⚙️' },
        { id: 'ai-ml', name: 'AI/ML', icon: '🤖' },
        { id: 'devops', name: 'DevOps', icon: '🚀' },
        { id: 'mobile', name: 'Mobile', icon: '📱' },
        { id: 'testing', name: 'Testing', icon: '🧪' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'automation', name: 'Automation', icon: '⚡' },
        { id: 'dev-tools', name: 'Dev Tools', icon: '🔧' },
        { id: 'documentation', name: 'Docs', icon: '📝' },
        { id: 'marketing', name: 'Marketing', icon: '📈' },
        { id: 'clawdbot', name: 'Clawdbot', icon: '🤖' },
        { id: 'other', name: 'Other', icon: '📁' }
    ];
    
    const transformedSkills = skills.map(skill => {
        const source = skill.topSource || '';
        const [author] = source.split('/');
        
        return {
            id: `${source}/${skill.id}`,
            name: skill.name || skill.id,
            author: author || 'unknown',
            repo: source,
            description: '', // API doesn't provide descriptions
            installs: skill.installs || 0,
            downloads: 0,
            stars: 0,
            category: detectCategory(skill.name || skill.id, source),
            tags: extractTags(skill.name || skill.id, source),
            source: 'skills.sh',
            url: `https://skills.sh/${source}/${skill.id}`,
            installCommand: `npx skills add ${source}/${skill.id}`,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
    });
    
    // Generate the DIRECTORY_DATA object for frontend
    const jsContent = `// Auto-generated by transform-full.js
// Last updated: ${new Date().toISOString()}
// Total skills: ${transformedSkills.length}

const DIRECTORY_DATA = {
  categories: ${JSON.stringify(categoryDefs, null, 2)},
  items: ${JSON.stringify(transformedSkills, null, 2)}
};
`;

    fs.writeFileSync(OUTPUT_FILE, jsContent);
    
    console.log(`Done! Saved ${transformedSkills.length} skills to ${OUTPUT_FILE}`);
    console.log(`File size: ${(fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Category distribution
    const categories = {};
    transformedSkills.forEach(s => {
        categories[s.category] = (categories[s.category] || 0) + 1;
    });
    console.log('\\nCategory distribution:');
    Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
}

main();
