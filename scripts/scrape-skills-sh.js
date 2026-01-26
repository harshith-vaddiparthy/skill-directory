#!/usr/bin/env node
/**
 * Skill Directory - skills.sh Scraper
 * 
 * Scrapes the skills.sh leaderboard to get real skill data.
 * Uses Puppeteer for JS-rendered content.
 * 
 * Usage: node scrape-skills-sh.js [--limit N]
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'skills-sh.json');

async function scrapeSkillsSh(limit = 500) {
  console.log(`[skills.sh] Starting scrape (limit: ${limit})`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const skills = [];
  
  try {
    await page.goto('https://skills.sh/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the leaderboard to load
    await new Promise(r => setTimeout(r, 2000));
    
    // Scroll to load more skills
    let previousSkillCount = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 50;
    
    while (skills.length < limit && scrollAttempts < maxScrollAttempts) {
      // Extract skills from current view
      const newSkills = await page.evaluate(() => {
        const items = [];
        const text = document.body.innerText;
        
        // The leaderboard shows skills in format:
        // <rank>\n<skill-name>\n<repo>\n<installs>
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        
        let i = 0;
        while (i < lines.length) {
          const line = lines[i];
          
          // Check if this line is a rank number (1, 2, 3, etc.)
          const rankMatch = line.match(/^(\d+)$/);
          if (rankMatch) {
            const rank = parseInt(rankMatch[1]);
            
            // Next line should be skill name
            const skillName = lines[i + 1];
            // Then repo
            const repo = lines[i + 2];
            // Then installs (like "51.0K" or "4.5K")
            const installsStr = lines[i + 3];
            
            if (skillName && repo && installsStr) {
              // Parse installs
              let installs = 0;
              const installMatch = installsStr.match(/^([\d.]+)K?$/i);
              if (installMatch) {
                const num = parseFloat(installMatch[1]);
                installs = installsStr.toUpperCase().includes('K') ? Math.round(num * 1000) : num;
              }
              
              // Validate repo format (owner/repo)
              if (repo.includes('/') && !repo.startsWith('http')) {
                const id = `${repo.split('/')[0]}/${skillName}`;
                items.push({
                  id,
                  name: skillName,
                  repo,
                  installs,
                  rank,
                  url: `https://skills.sh/${repo}/${skillName}`
                });
                i += 4;
                continue;
              }
            }
          }
          i++;
        }
        return items;
      });
      
      // Add new unique skills
      for (const skill of newSkills) {
        if (!skills.find(s => s.id === skill.id)) {
          skills.push(skill);
        }
      }
      
      if (skills.length === previousSkillCount) {
        scrollAttempts++;
      } else {
        scrollAttempts = 0;
        console.log(`[skills.sh] Found ${skills.length} skills so far...`);
      }
      previousSkillCount = skills.length;
      
      // Scroll down
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await new Promise(r => setTimeout(r, 1500));
    }
    
  } catch (error) {
    console.error(`[skills.sh] Error during scrape: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Sort by rank
  skills.sort((a, b) => (a.rank || Infinity) - (b.rank || Infinity));
  
  // Add metadata
  const output = {
    source: 'skills.sh',
    scrapedAt: new Date().toISOString(),
    count: skills.length,
    skills
  };
  
  // Save to file
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`[skills.sh] Saved ${skills.length} skills to ${OUTPUT_FILE}`);
  return output;
}

// Run if called directly
if (require.main === module) {
  const limit = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '500');
  scrapeSkillsSh(limit)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { scrapeSkillsSh };
