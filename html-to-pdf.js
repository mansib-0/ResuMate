const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const htmlPath = 'file://' + path.join(__dirname, 'ResuMate_Billion_Dollar_Roadmap.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  
  const outputPath = path.join(__dirname, 'ResuMate_Billion_Dollar_Roadmap.pdf');
  
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;text-align:center;font-size:8pt;color:#9ca3af;padding:0 20mm;">ResuMate Inc. — Confidential &amp; Proprietary — September 2026 — Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  });
  
  console.log('PDF saved to:', outputPath);
  await browser.close();
})();
