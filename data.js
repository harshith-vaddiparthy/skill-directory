// Directory Data
const DIRECTORY_DATA = {
  categories: [
    { id: 'all', name: 'All' },
    { id: 'claude-code', name: 'Claude Code' },
    { id: 'claude-code-skills', name: 'CC Skills' },
    { id: 'clawdbot', name: 'Clawdbot' },
    { id: 'clawdbot-skills', name: 'Clawdbot Skills' }
  ],
  
  items: [
    // ==========================================
    // CLAUDE CODE - Official Features/Tools
    // ==========================================
    {
      id: 'cc-1',
      name: 'Claude Code',
      description: 'An agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster through natural language commands.',
      author: 'Anthropic',
      category: 'claude-code',
      icon: '🤖',
      tags: ['official', 'cli', 'terminal'],
      install: 'npm install -g @anthropic-ai/claude-code',
      github: 'https://github.com/anthropics/claude-code'
    },
    {
      id: 'cc-2',
      name: 'MCP Protocol',
      description: 'Model Context Protocol - A standard for connecting AI assistants to external data sources, tools, and services.',
      author: 'Anthropic',
      category: 'claude-code',
      icon: '🔌',
      tags: ['official', 'protocol', 'integration'],
      install: 'npm install @modelcontextprotocol/sdk',
      github: 'https://github.com/modelcontextprotocol/specification'
    },
    {
      id: 'cc-3',
      name: 'Claude Code Action',
      description: 'GitHub Action for running Claude Code in your CI/CD workflows. Automate code reviews, generate documentation, and more.',
      author: 'Anthropic',
      category: 'claude-code',
      icon: '⚡',
      tags: ['official', 'ci/cd', 'github'],
      install: 'uses: anthropics/claude-code-action@v1',
      github: 'https://github.com/anthropics/claude-code-action'
    },
    {
      id: 'cc-4',
      name: 'Extended Thinking',
      description: 'Enable Claude to show its reasoning process with extended thinking mode for complex problem-solving and debugging tasks.',
      author: 'Anthropic',
      category: 'claude-code',
      icon: '🧠',
      tags: ['official', 'reasoning', 'feature'],
      install: 'claude --thinking',
      github: 'https://github.com/anthropics/claude-code'
    },
    {
      id: 'cc-5',
      name: 'SDK Mode',
      description: 'Use Claude Code programmatically as a TypeScript SDK. Build custom integrations and automated workflows.',
      author: 'Anthropic',
      category: 'claude-code',
      icon: '📦',
      tags: ['official', 'sdk', 'api'],
      install: 'import { claude } from "@anthropic-ai/claude-code"',
      github: 'https://github.com/anthropics/claude-code'
    },
    
    // ==========================================
    // CLAUDE CODE SKILLS - Community
    // ==========================================
    {
      id: 'ccs-1',
      name: 'Sequential Thinking',
      description: 'MCP server for dynamic, reflective problem-solving through structured thought sequences with branching and revision.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🔄',
      tags: ['mcp', 'reasoning', 'problem-solving'],
      install: 'npx @anthropic-ai/claude-code mcp add sequential-thinking',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-2',
      name: 'Git MCP Server',
      description: 'Read, search, and manipulate Git repositories. Access commit history, diffs, branches, and file contents.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '📚',
      tags: ['mcp', 'git', 'version-control'],
      install: 'npx @anthropic-ai/claude-code mcp add git',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-3',
      name: 'Filesystem Server',
      description: 'Secure file operations with configurable access controls. Read, write, move, and search files safely.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '📁',
      tags: ['mcp', 'filesystem', 'security'],
      install: 'npx @anthropic-ai/claude-code mcp add filesystem',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-4',
      name: 'Puppeteer MCP',
      description: 'Browser automation through Puppeteer. Navigate pages, take screenshots, click elements, and fill forms.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🌐',
      tags: ['mcp', 'browser', 'automation'],
      install: 'npx @anthropic-ai/claude-code mcp add puppeteer',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-5',
      name: 'Memory Server',
      description: 'Give Claude persistent memory across sessions using a knowledge graph. Store entities, relationships, and observations.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🧠',
      tags: ['mcp', 'memory', 'knowledge-graph'],
      install: 'npx @anthropic-ai/claude-code mcp add memory',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-6',
      name: 'PostgreSQL MCP',
      description: 'Connect Claude to PostgreSQL databases. Query tables, explore schemas, and analyze data safely.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🐘',
      tags: ['mcp', 'database', 'postgresql'],
      install: 'npx @anthropic-ai/claude-code mcp add postgres',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-7',
      name: 'Slack MCP Server',
      description: 'Interact with Slack workspaces. Read channels, post messages, and search conversation history.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '💬',
      tags: ['mcp', 'slack', 'communication'],
      install: 'npx @anthropic-ai/claude-code mcp add slack',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-8',
      name: 'GitHub MCP Server',
      description: 'Full GitHub integration. Create issues, PRs, manage repositories, and search code across your organization.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🐙',
      tags: ['mcp', 'github', 'development'],
      install: 'npx @anthropic-ai/claude-code mcp add github',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-9',
      name: 'Brave Search MCP',
      description: 'Web and local search using Brave Search API. Get real-time information from the web.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '🔍',
      tags: ['mcp', 'search', 'web'],
      install: 'npx @anthropic-ai/claude-code mcp add brave-search',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    {
      id: 'ccs-10',
      name: 'Fetch MCP Server',
      description: 'Fetch and convert web content to markdown. Perfect for reading documentation and web pages.',
      author: 'modelcontextprotocol',
      category: 'claude-code-skills',
      icon: '📥',
      tags: ['mcp', 'web', 'fetch'],
      install: 'npx @anthropic-ai/claude-code mcp add fetch',
      github: 'https://github.com/modelcontextprotocol/servers'
    },
    
    // ==========================================
    // CLAWDBOT - Framework
    // ==========================================
    {
      id: 'cb-1',
      name: 'Clawdbot',
      description: 'A powerful AI agent framework that extends Claude with persistent memory, tool use, and multi-channel communication.',
      author: 'Harshith',
      category: 'clawdbot',
      icon: '🤖',
      tags: ['framework', 'agent', 'core'],
      install: 'npm install -g clawdbot',
      github: 'https://github.com/harshith/clawdbot'
    },
    {
      id: 'cb-2',
      name: 'Clawdbot Gateway',
      description: 'The central daemon that manages agent sessions, message routing, and skill orchestration.',
      author: 'Harshith',
      category: 'clawdbot',
      icon: '🚪',
      tags: ['framework', 'daemon', 'core'],
      install: 'clawdbot gateway start',
      github: 'https://github.com/harshith/clawdbot'
    },
    {
      id: 'cb-3',
      name: 'Browser Control',
      description: 'Built-in browser automation with snapshot, screenshot, and interaction capabilities. Control Chrome programmatically.',
      author: 'Harshith',
      category: 'clawdbot',
      icon: '🌐',
      tags: ['framework', 'browser', 'automation'],
      install: 'clawdbot browser start',
      github: 'https://github.com/harshith/clawdbot'
    },
    {
      id: 'cb-4',
      name: 'Node System',
      description: 'Pair remote devices as "nodes" that Claude can control - take photos, run commands, capture screens.',
      author: 'Harshith',
      category: 'clawdbot',
      icon: '📱',
      tags: ['framework', 'nodes', 'remote'],
      install: 'clawdbot nodes status',
      github: 'https://github.com/harshith/clawdbot'
    },
    {
      id: 'cb-5',
      name: 'Canvas Renderer',
      description: 'Present interactive UIs to users. Render HTML, charts, and visualizations in connected clients.',
      author: 'Harshith',
      category: 'clawdbot',
      icon: '🎨',
      tags: ['framework', 'ui', 'visualization'],
      install: 'canvas present --url https://...',
      github: 'https://github.com/harshith/clawdbot'
    },
    
    // ==========================================
    // CLAWDBOT SKILLS - Plugins
    // ==========================================
    {
      id: 'cbs-1',
      name: 'Discord Plugin',
      description: 'Full Discord integration. Send messages, manage servers, react to events, and participate in conversations.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '🎮',
      tags: ['plugin', 'discord', 'chat'],
      install: 'clawdbot skill install discord',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-2',
      name: 'Telegram Plugin',
      description: 'Telegram bot integration. Send messages, media, stickers, and handle commands in groups and DMs.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '✈️',
      tags: ['plugin', 'telegram', 'chat'],
      install: 'clawdbot skill install telegram',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-3',
      name: 'WhatsApp Plugin',
      description: 'WhatsApp Business API integration for automated messaging, customer support, and notifications.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '📱',
      tags: ['plugin', 'whatsapp', 'chat'],
      install: 'clawdbot skill install whatsapp',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-4',
      name: 'Email Skill',
      description: 'Send and receive emails via IMAP/SMTP. Draft responses, search inbox, and manage email workflows.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '📧',
      tags: ['plugin', 'email', 'communication'],
      install: 'clawdbot skill install email',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-5',
      name: 'Calendar Skill',
      description: 'Google Calendar integration. Create events, check availability, send invites, and manage schedules.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '📅',
      tags: ['plugin', 'calendar', 'productivity'],
      install: 'clawdbot skill install calendar',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-6',
      name: 'Twitter/X Skill',
      description: 'Post tweets, reply to mentions, search hashtags, and monitor your Twitter timeline.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '🐦',
      tags: ['plugin', 'twitter', 'social'],
      install: 'clawdbot skill install twitter',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-7',
      name: 'Linear Skill',
      description: 'Linear project management integration. Create issues, update status, and track sprints.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '📊',
      tags: ['plugin', 'linear', 'project-management'],
      install: 'clawdbot skill install linear',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-8',
      name: 'Voice (ElevenLabs)',
      description: 'Text-to-speech with ElevenLabs. Generate natural voice responses for storytelling and audio content.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '🎙️',
      tags: ['plugin', 'voice', 'tts'],
      install: 'clawdbot skill install elevenlabs',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-9',
      name: 'Image Generation',
      description: 'Generate images using DALL-E, Midjourney, or Stable Diffusion APIs. Create visuals from descriptions.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '🖼️',
      tags: ['plugin', 'images', 'ai'],
      install: 'clawdbot skill install image-gen',
      github: 'https://github.com/harshith/clawdbot-skills'
    },
    {
      id: 'cbs-10',
      name: 'Cron Scheduler',
      description: 'Schedule recurring tasks and reminders. Run automated workflows at specified intervals.',
      author: 'Harshith',
      category: 'clawdbot-skills',
      icon: '⏰',
      tags: ['plugin', 'scheduler', 'automation'],
      install: 'clawdbot skill install cron',
      github: 'https://github.com/harshith/clawdbot-skills'
    }
  ]
};
