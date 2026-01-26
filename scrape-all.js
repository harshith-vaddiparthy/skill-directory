const fs = require('fs');
const https = require('https');

const OUTPUT_FILE = '/home/harshith/clawd/skill-directory/data/skills-sh.json';

async function fetchPage(offset) {
    return new Promise((resolve, reject) => {
        const url = `https://skills.sh/api/skills?offset=${offset}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('Starting skills.sh scrape...');
    
    let allSkills = [];
    let offset = 0;
    let hasMore = true;
    
    while (hasMore) {
        console.log(`Fetching offset ${offset}...`);
        
        try {
            const response = await fetchPage(offset);
            const skills = response.skills || [];
            
            if (skills.length === 0) {
                console.log('No more skills, stopping.');
                break;
            }
            
            allSkills = allSkills.concat(skills);
            hasMore = response.hasMore === true;
            offset += 50;
            
            console.log(`Total so far: ${allSkills.length}, hasMore: ${hasMore}`);
            
            // Small delay
            await new Promise(r => setTimeout(r, 50));
        } catch (e) {
            console.error(`Error at offset ${offset}:`, e.message);
            break;
        }
    }
    
    // Save results
    const result = {
        skills: allSkills,
        totalSkills: allSkills.length,
        scrapedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
    console.log(`Done! Saved ${allSkills.length} skills to ${OUTPUT_FILE}`);
}

main();
