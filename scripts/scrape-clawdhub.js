#!/usr/bin/env node
/**
 * Skill Directory - ClawdHub Scraper
 * 
 * Scrapes clawdhub.com/skills for Clawdbot-specific skills.
 * Uses Puppeteer for JS-rendered content.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(DATA_DIR, 'clawdhub.json');

async function scrapeClawdhub() {
  console.log(`[clawdhub] Starting scrape`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const skills = [];
  
  try {
    await page.goto('https://clawdhub.com/skills', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000)); // Wait for JS to render
    
    // Scroll to load all skills
    let lastHeight = 0;
    let scrollAttempts = 0;
    
    while (scrollAttempts < 20) {
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      if (currentHeight === lastHeight) {
        scrollAttempts++;
      } else {
        scrollAttempts = 0;
      }
      lastHeight = currentHeight;
      
      await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Extract all skills
    const extractedSkills = await page.evaluate(() => {
      const items = [];
      
      // Find all skill cards (links with /unknown/ or similar pattern)
      document.querySelectorAll('a[href*="/"]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href === '/' || href === '/skills' || href === '/upload' || href === '/import') return;
        if (href.startsWith('http') && !href.includes('clawdhub.com')) return;
        
        const text = link.innerText || '';
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        
        // Parse ClawdHub skill format
        // Title, slug, description, stats (downloads, installs, stars, versions)
        let name = '';
        let slug = '';
        let description = '';
        let downloads = 0;
        let installs = 0;
        let stars = 0;
        let versions = 0;
        
        for (const line of lines) {
          if (line.startsWith('/') && !slug) {
            slug = line;
          } else if (line.startsWith('⤓')) {
            downloads = parseInt(line.replace('⤓', '').trim()) || 0;
          } else if (line.startsWith('⤒')) {
            installs = parseInt(line.replace('⤒', '').trim()) || 0;
          } else if (line.startsWith('★')) {
            stars = parseInt(line.replace('★', '').trim()) || 0;
          } else if (line.match(/^\d+ v$/)) {
            versions = parseInt(line) || 0;
          } else if (!name && line.length > 0 && !line.startsWith('Highlighted')) {
            name = line;
          } else if (name && !slug && !description && line.length > 20) {
            description = line;
          }
        }
        
        // If we still don't have description, try to find it
        if (!description) {
          for (const line of lines) {
            if (line.length > 30 && line !== name && !line.startsWith('/') && !line.match(/^[⤓⤒★\d]/)) {
              description = line;
              break;
            }
          }
        }
        
        if (name && slug) {
          items.push({
            id: slug.replace(/^\//, ''),
            name,
            slug,
            description: description || 'No description',
            downloads,
            installs,
            stars,
            versions,
            url: `https://clawdhub.com${href}`
          });
        }
      });
      
      return items;
    });
    
    // Dedupe by slug
    const seen = new Set();
    for (const skill of extractedSkills) {
      if (!seen.has(skill.id)) {
        seen.add(skill.id);
        skills.push(skill);
      }
    }
    
    console.log(`[clawdhub] Found ${skills.length} unique skills`);
    
  } catch (error) {
    console.error(`[clawdhub] Error during scrape: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Sort by downloads
  skills.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  
  // Add metadata
  const output = {
    source: 'clawdhub.com',
    scrapedAt: new Date().toISOString(),
    count: skills.length,
    skills
  };
  
  // Save to file
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  
  console.log(`[clawdhub] Saved ${skills.length} skills to ${OUTPUT_FILE}`);
  return output;
}

// Run if called directly
if (require.main === module) {
  scrapeClawdhub()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { scrapeClawdhub };
