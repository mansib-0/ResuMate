const fs = require('fs');
const path = require('path');

// Read the markdown file
const md = fs.readFileSync(path.join(__dirname, 'ResuMate_Billion_Dollar_Roadmap.md'), 'utf8');

// Simple markdown to HTML converter (handles our specific doc)
function mdToHtml(text) {
  let html = text;
  
  // Escape HTML entities first
  // (skip — we trust our own content)

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr/>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="lang-${lang}">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '<br/>');

  // Tables
  html = html.replace(/^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm, (_, header, sep, body) => {
    const ths = header.split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const rows = body.trim().split('\n').map(row => {
      const tds = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${tds}</tr>`;
    }).join('');
    return `<table><thead><tr>${ths}</tr></thead><tbody>${rows}</tbody></table>`;
  });

  // Checkbox lists
  html = html.replace(/^- \[x\]\s+(.+)$/gm, '<div class="checkbox checked">☑ $1</div>');
  html = html.replace(/^- \[ \]\s+(.+)$/gm, '<div class="checkbox">☐ $1</div>');

  // Unordered lists (handle nested)
  html = html.replace(/^  - (.+)$/gm, '<li class="nested">$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  // Numbered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ol-item">$1</li>');
  html = html.replace(/((?:<li class="ol-item">.*<\/li>\n?)+)/g, '<ol>$1</ol>');

  // Paragraphs — wrap remaining loose lines
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<')) return block;
    return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
  }).join('\n');

  return html;
}

const bodyHtml = mdToHtml(md);

const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>ResuMate — Billion-Dollar Roadmap</title>
<style>
  @page {
    size: A4;
    margin: 20mm 18mm 20mm 18mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.65;
    color: #1a1a2e;
    background: #fff;
    padding: 0;
  }
  
  /* Cover page */
  .cover {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    text-align: center;
    background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
    color: white;
    padding: 60px 40px;
    margin: -20mm -18mm 0 -18mm;
    width: calc(100% + 36mm);
  }
  .cover h1 {
    font-size: 42pt;
    font-weight: 800;
    letter-spacing: -1px;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #a78bfa, #818cf8, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cover .subtitle {
    font-size: 18pt;
    font-weight: 300;
    color: #c4b5fd;
    margin-bottom: 50px;
  }
  .cover .tagline {
    font-size: 13pt;
    color: rgba(255,255,255,0.7);
    max-width: 500px;
    line-height: 1.8;
    margin-bottom: 60px;
  }
  .cover .meta {
    font-size: 10pt;
    color: rgba(255,255,255,0.5);
    line-height: 2;
  }
  .cover .badge {
    display: inline-block;
    background: rgba(99, 102, 241, 0.3);
    border: 1px solid rgba(99, 102, 241, 0.5);
    border-radius: 20px;
    padding: 6px 20px;
    font-size: 10pt;
    color: #a78bfa;
    margin-bottom: 30px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  
  /* Content */
  .content {
    padding: 0;
  }
  
  h1 {
    font-size: 22pt;
    color: #1e1b4b;
    margin: 40px 0 16px 0;
    padding-bottom: 10px;
    border-bottom: 3px solid #6366f1;
    page-break-after: avoid;
  }
  h2 {
    font-size: 16pt;
    color: #312e81;
    margin: 30px 0 12px 0;
    page-break-after: avoid;
  }
  h3 {
    font-size: 13pt;
    color: #4338ca;
    margin: 22px 0 8px 0;
    page-break-after: avoid;
  }
  h4 {
    font-size: 11pt;
    color: #4f46e5;
    margin: 16px 0 6px 0;
    page-break-after: avoid;
  }
  
  p {
    margin: 8px 0;
    text-align: justify;
  }
  
  strong { color: #1e1b4b; }
  em { color: #4338ca; font-style: italic; }
  
  code {
    background: #f1f0fb;
    color: #4338ca;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 9.5pt;
    font-family: 'SF Mono', 'Fira Code', Consolas, monospace;
  }
  
  pre {
    background: #1e1b4b;
    color: #e0e7ff;
    padding: 16px 20px;
    border-radius: 8px;
    font-size: 9pt;
    line-height: 1.6;
    overflow-x: auto;
    margin: 12px 0;
    page-break-inside: avoid;
  }
  pre code {
    background: none;
    color: inherit;
    padding: 0;
    font-size: inherit;
  }
  
  blockquote {
    border-left: 4px solid #6366f1;
    background: #f5f3ff;
    padding: 14px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
    font-style: italic;
    color: #3730a3;
    page-break-inside: avoid;
  }
  
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #a78bfa, transparent);
    margin: 30px 0;
  }
  
  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  thead {
    background: #1e1b4b;
    color: white;
  }
  th {
    padding: 8px 12px;
    text-align: left;
    font-weight: 600;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  td {
    padding: 7px 12px;
    border-bottom: 1px solid #e5e7eb;
  }
  tbody tr:nth-child(even) {
    background: #f9fafb;
  }
  tbody tr:hover {
    background: #f5f3ff;
  }
  
  /* Lists */
  ul, ol {
    margin: 8px 0 8px 24px;
  }
  li {
    margin: 4px 0;
  }
  li.nested {
    margin-left: 20px;
    color: #4b5563;
  }
  
  /* Checkboxes */
  .checkbox {
    padding: 4px 0 4px 4px;
    font-size: 10pt;
    color: #6b7280;
  }
  .checkbox.checked {
    color: #059669;
  }
  
  /* Page breaks at major sections */
  h1 {
    page-break-before: always;
  }
  h1:first-of-type {
    page-break-before: avoid;
  }
  
  /* Footer */
  .footer {
    text-align: center;
    color: #9ca3af;
    font-size: 8pt;
    margin-top: 60px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
  <div class="badge">Confidential Business Plan</div>
  <h1 style="border:none; page-break-before:avoid; margin:0 0 8px 0; padding:0; color:white; -webkit-text-fill-color:transparent;">ResuMate</h1>
  <div class="subtitle">The Billion-Dollar Roadmap</div>
  <div class="tagline">
    A comprehensive strategic plan covering technology, legal structure, accounting, finance, fundraising, team building, marketing, and global expansion — from first commit to IPO.
  </div>
  <div class="meta">
    <strong style="color:#c4b5fd;">Founder:</strong> Mansib Saiful<br/>
    <strong style="color:#c4b5fd;">Location:</strong> Dhaka, Bangladesh<br/>
    <strong style="color:#c4b5fd;">Date:</strong> September 2026<br/>
    <strong style="color:#c4b5fd;">Version:</strong> 1.0
  </div>
</div>

<!-- CONTENT -->
<div class="content">
${bodyHtml}
</div>

<div class="footer">
  ResuMate Inc. — Confidential & Proprietary — September 2026 — Page <span class="pageNumber"></span>
</div>

</body>
</html>`;

const outputPath = path.join(__dirname, 'ResuMate_Billion_Dollar_Roadmap.html');
fs.writeFileSync(outputPath, fullHtml);
console.log('HTML written to:', outputPath);
