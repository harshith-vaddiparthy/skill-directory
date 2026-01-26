# Claude Directory

A curated collection of skills, extensions, and tools for Claude Code and Clawdbot.

![Claude Directory](https://img.shields.io/badge/Claude-Directory-6366f1?style=for-the-badge)

## Features

- 🌙 **Dark/Light Mode** - System preference detection with manual toggle
- 🔍 **Search** - Full-text search across names, descriptions, authors, and tags
- 🏷️ **Filtering** - Filter by category and tags
- 📋 **Copy Commands** - One-click copy install commands
- 📱 **Responsive** - Works on all screen sizes
- ⚡ **Fast** - Minimal JavaScript with Alpine.js

## Categories

1. **Claude Code** - Official Claude Code tools and features
2. **CC Skills** - Community MCP servers and skills for Claude Code
3. **Clawdbot** - The Clawdbot framework and core features
4. **Clawdbot Skills** - Plugins and extensions for Clawdbot

## Development

### Quick Start

```bash
# Navigate to the directory
cd skill-directory

# Start a local server (using Python)
python3 -m http.server 8080

# Or use Node.js
npx serve .

# Or use PHP
php -S localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080)

### File Structure

```
skill-directory/
├── index.html    # Main HTML structure
├── app.js        # Alpine.js app logic
├── data.js       # Directory data (items, categories)
└── README.md     # This file
```

### Adding New Items

Edit `data.js` and add a new item to the `items` array:

```javascript
{
  id: 'unique-id',
  name: 'Tool Name',
  description: 'A brief description of what this tool does.',
  author: 'Author Name',
  category: 'claude-code-skills', // or: claude-code, clawdbot, clawdbot-skills
  icon: '🔧',
  tags: ['tag1', 'tag2'],
  install: 'npm install my-tool',
  github: 'https://github.com/user/repo'
}
```

### Categories

| ID | Name |
|----|------|
| `claude-code` | Claude Code (Official) |
| `claude-code-skills` | CC Skills (Community MCP servers) |
| `clawdbot` | Clawdbot (Framework) |
| `clawdbot-skills` | Clawdbot Skills (Plugins) |

## Deployment

This is a static site. Deploy to any static hosting:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the folder
- **GitHub Pages**: Push to a `gh-pages` branch
- **Cloudflare Pages**: Connect your repository

## Tech Stack

- **Tailwind CSS** (via CDN) - Utility-first styling
- **Alpine.js** (via CDN) - Lightweight reactivity
- **Inter & JetBrains Mono** - Typography
- **No build step required** - Just HTML, CSS, and JS

## License

MIT
