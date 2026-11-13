const styles = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #17243b; font-family: Arial, Helvetica, sans-serif; font-size: 11px; }
  .page { min-height: 100vh; padding: 38px 42px; }
  .page.compact { padding: 26px 30px; }
  header { display: flex; align-items: center; gap: 14px; padding-bottom: 15px; border-bottom: 3px solid var(--accent); }
  .compact header { gap: 10px; padding-bottom: 10px; border-bottom-width: 2px; }
  .brand-mark { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: #fff; background: var(--accent); font-size: 15px; font-weight: 700; }
  .compact .brand-mark { width: 36px; height: 36px; border-radius: 10px; font-size: 12px; }
  .school { flex: 1; }
  h1 { margin: 0 0 4px; color: var(--accent); font-size: 19px; }
  .compact h1 { font-size: 16px; }
  .school p, .subtitle { margin: 2px 0; color: #687892; font-size: 9px; }
  .document-title { margin: 21px 0 14px; }
  .compact .document-title { margin: 14px 0 10px; }
  h2 { margin: 0 0 4px; font-size: 17px; }
  .compact h2 { font-size: 15px; }
  .details, table { width: 100%; border-collapse: collapse; }
  .details { margin-bottom: 16px; }
  .details th, .details td { padding: 6px 8px; border: 1px solid #e3eaf3; text-align: left; }
  .details th { width: 34%; color: #687892; font-weight: 600; }
  .compact .details th, .compact .details td { padding: 5px 6px; }
  .section-title { margin: 15px 0 7px; color: var(--accent); font-size: 12px; font-weight: 700; }
  table.items th { padding: 8px 7px; color: #fff; background: var(--accent); text-align: left; }
  table.items td { padding: 7px; border-bottom: 1px solid #e3eaf3; }
  .compact table.items th, .compact table.items td { padding: 5px 6px; }
  .amount, .number { text-align: right !important; white-space: nowrap; }
  .summary { display: flex; gap: 10px; margin-top: 15px; }
  .summary-item { flex: 1; padding: 10px; border: 1px solid #e3eaf3; border-radius: 8px; }
  .compact .summary-item { padding: 7px; }
  .summary-label { display: block; margin-bottom: 5px; color: #687892; font-size: 9px; }
  .summary-value { color: var(--accent); font-size: 14px; font-weight: 700; }
  footer { margin-top: 28px; padding-top: 9px; border-top: 1px solid #e3eaf3; color: #687892; font-size: 8px; text-align: center; }
`;

const template = (pageClass: "classic" | "compact") => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${styles} :root { --accent: {{accentColor}}; }</style>
</head>
<body>
  <main class="page ${pageClass}">
    <header>
      <div class="brand-mark">{{schoolInitials}}</div>
      <div class="school">
        <h1>{{schoolName}}</h1>
        <p>{{schoolAddress}}</p>
        <p>{{schoolContact}}</p>
      </div>
    </header>
    <div class="document-title">
      <h2>{{documentTitle}}</h2>
      <p class="subtitle">{{documentSubtitle}}</p>
    </div>
    {{{studentDetails}}}
    {{{content}}}
    {{{summary}}}
    <footer>
      <div>{{footerNote}}</div>
    </footer>
  </main>
</body>
</html>`;

export const documentTemplates = {
  "school-classic": {
    fee: template("classic"),
    exam: template("classic"),
  },
  compact: {
    fee: template("compact"),
    exam: template("compact"),
  },
} as const;
