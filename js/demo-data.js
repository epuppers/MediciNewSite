// ========== CHAT DEMOS ==========
const chatDemos = [
  {
    context: 'Ridgeline Acquisition · 1,247 data room documents · diligence in progress',
    messages: [
      { role: 'user', text: 'Summarize revenue quality — what\'s recurring vs. one-time?' },
      {
        role: 'cosimo',
        text: 'FY24 revenue was $47.2M. 71% recurring (SaaS subscriptions + maintenance contracts), 18% implementation services, 11% one-time license fees. Note: $3.1M of the recurring base comes from a single contract (Apex Corp) expiring Q2 2025 with no auto-renewal clause.',
        citations: [
          { file: 'Mgmt_Financials_FY24.xlsx', ref: 'revenue tab' },
          { file: 'Apex_MSA_2022.pdf', ref: 'p.14, §7 — termination' },
          { file: 'Customer_Revenue_Breakdown.pdf', ref: 'p.3' }
        ]
      },
      { role: 'user', text: 'Flag that. Generate the financial diligence section for our IC memo.' },
      {
        role: 'cosimo',
        text: 'Done. Apex concentration risk is flagged as a Key Finding. Revenue quality, margin trends, and customer concentration are included with source citations throughout.',
        citations: [
          { file: 'Mgmt_Financials_FY24.xlsx', ref: 'revenue + margins' },
          { file: 'Apex_MSA_2022.pdf', ref: 'p.14, §7' },
          { file: 'AR_Aging_Q4_2024.pdf', ref: 'p.2' }
        ],
        artifact: { name: 'IC_Memo_Financial_DD.pdf', meta: 'Financial diligence · 6 pages · 23 source citations' }
      }
    ]
  },
  {
    context: 'Alpine Capital III · Q3 2025 reporting cycle',
    messages: [
      { role: 'user', text: 'Generate the quarterly performance summary for all LPs' },
      {
        role: 'cosimo',
        text: 'Aggregated across 12 portfolio companies. Net IRR: 18.3% | TVPI: 1.42x | DPI: 0.31x. Note: Greenfield Energy reported Q3 figures 12 days late — I used their most recent available data and flagged the lag.',
        citations: [
          { file: 'NAV_Q3_2025_Final.xlsx', ref: 'all tabs' },
          { file: 'CapitalAccounts_Master.xlsx', ref: 'Sheet "Fund III"' },
          { file: 'PortCo_Valuations_Q3.pdf', ref: 'p.1-12' }
        ]
      },
      { role: 'user', text: 'Format as LP letter using our standard template' },
      {
        role: 'cosimo',
        text: 'Formatted using your Q2 letter as a template. Performance metrics, portfolio company updates, and capital account summaries are included with full source citations.',
        citations: [
          { file: 'Q2_LP_Letter_Template.docx', ref: 'formatting reference' },
          { file: 'NAV_Q3_2025_Final.xlsx', ref: 'performance data' }
        ],
        artifact: { name: 'Q3_2025_LP_Letter.pdf', meta: 'Quarterly LP letter · 8 pages · 47 data points validated' }
      }
    ]
  },
  {
    context: 'Ironbridge Credit Fund II · 14 portfolio companies · Q3 covenant review',
    messages: [
      { role: 'user', text: 'Run covenant compliance across the entire portfolio' },
      {
        role: 'cosimo',
        text: 'Tested 14 borrowers against financial covenants. 11 in full compliance. Three issues flagged: Meridian Logistics breached leverage ratio (4.8x actual vs. 4.5x max). Atlas Manufacturing DSCR trending toward threshold (1.12x actual vs. 1.10x minimum). Lakeshore Hospitality has not submitted Q3 financials — 47 days past due.',
        citations: [
          { file: 'Meridian_CreditAgreement_2023.pdf', ref: '§6.1 — leverage covenant' },
          { file: 'Atlas_Financials_Q3.xlsx', ref: 'DSCR calculation tab' },
          { file: 'Lakeshore_Reporting_Log.xlsx', ref: 'submission tracker' }
        ]
      },
      { role: 'user', text: 'Generate the quarterly covenant compliance report for our credit committee' },
      {
        role: 'cosimo',
        text: 'Formatted into your credit committee template. Breach detail, cure period status, and recommended watch list actions are included for all three flagged borrowers.',
        citations: [
          { file: 'CC_Report_Template_v2.docx', ref: 'formatting reference' },
          { file: 'Meridian_CreditAgreement_2023.pdf', ref: '§6.1, §8.2 — cure provisions' },
          { file: 'Atlas_Financials_Q3.xlsx', ref: 'trailing 4-quarter DSCR' }
        ],
        artifact: { name: 'Q3_Covenant_Compliance.pdf', meta: 'Covenant compliance · 14 borrowers · 3 flags' }
      }
    ]
  },
  {
    context: 'Summit RE Holdings · 8 properties · 23 rent roll PDFs uploaded',
    messages: [
      { role: 'user', text: 'Extract and standardize all rent rolls into one view' },
      {
        role: 'cosimo',
        text: 'Extracted 1,847 unit records across 8 properties. Standardized fields: unit #, tenant, lease dates, base rent, recoveries. Flagged 12 discrepancies vs. prior quarter — 3 expired leases with active tenants, 9 rent amounts inconsistent with amendments.',
        citations: [
          { file: 'RentRoll_Parkview_Q3.pdf', ref: '312 units' },
          { file: 'RentRoll_Summit_Tower.pdf', ref: '204 units' },
          { file: 'LeaseAmendments_2024/', ref: '9 files' }
        ]
      },
      { role: 'user', text: 'Export to our underwriting model format' },
      {
        role: 'cosimo',
        text: 'Exported to your underwriting template. Discrepancy flags are included as a separate tab with source references for each issue.',
        citations: [
          { file: 'UW_Template_v3.xlsx', ref: 'format reference' },
          { file: 'Prior_Quarter_RentRolls/', ref: 'comparison baseline' }
        ],
        artifact: { name: 'portfolio_master_rentrolls.xlsx', meta: 'Rent roll extract · 1,847 units · 12 flags' }
      }
    ]
  }
];

// ========== ARTIFACT DOCUMENTS ==========

function getDiligenceMemoHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Investment Committee Memorandum</div>' +
      '<div class="doc-letterhead-sub">Ridgeline Acquisition &middot; Financial Due Diligence</div>' +
    '</div>' +
    '<div class="doc-date">CONFIDENTIAL &middot; Prepared January 2026</div>' +
    '<div class="doc-section-title">1. Revenue Quality Analysis</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Revenue Stream</th><th>FY24</th><th>% of Total</th><th>YoY Growth</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>SaaS Subscriptions</td><td class="num">$24.8M</td><td class="num">52.5%</td><td class="num">+18.1%</td></tr>' +
        '<tr><td>Maintenance Contracts</td><td class="num">$8.7M</td><td class="num">18.5%</td><td class="num">+6.3%</td></tr>' +
        '<tr><td>Implementation Services</td><td class="num">$8.5M</td><td class="num">18.0%</td><td class="num">+22.4%</td></tr>' +
        '<tr><td>One-Time License</td><td class="num">$5.2M</td><td class="num">11.0%</td><td class="num">\u22127.8%</td></tr>' +
        '<tr style="font-weight:500;"><td>Total Revenue</td><td class="num">$47.2M</td><td class="num">100%</td><td class="num">+14.2%</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-body-text">' +
      'Recurring revenue (SaaS + maintenance) represents 71% of total, up from 64% in FY23. The shift toward recurring is positive, ' +
      'though one-time license decline (\u22127.8%) suggests the legacy on-prem product is sunsetting faster than implementation revenue can compensate.' +
    '</div>' +
    '<div class="doc-section-title" style="color:#c0392b;">Key Finding: Customer Concentration Risk</div>' +
    '<div class="doc-body-text">' +
      '<strong>Apex Corp accounts for $3.1M of recurring revenue (9.3% of recurring base).</strong> ' +
      'The master services agreement (<span class="doc-section-ref">Apex_MSA_2022.pdf, \u00A77</span>) expires Q2 2025 with no auto-renewal clause. ' +
      'Management has not provided evidence of renewal discussions. Loss of this contract would reduce recurring revenue to 64% of total \u2014 ' +
      'below the 70% threshold in our underwriting case.' +
    '</div>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-section-title">2. Margin Analysis</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Metric</th><th>FY22</th><th>FY23</th><th>FY24</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Gross Margin</td><td class="num">68.2%</td><td class="num">71.4%</td><td class="num">73.1%</td></tr>' +
        '<tr><td>EBITDA Margin</td><td class="num">12.1%</td><td class="num">15.8%</td><td class="num">18.3%</td></tr>' +
        '<tr><td>FCF Margin</td><td class="num">4.2%</td><td class="num">8.7%</td><td class="num">11.5%</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-body-text">' +
      'Margin trajectory is favorable across all measures. Gross margin expansion (+490bps over two years) is driven by the mix shift toward SaaS. ' +
      'EBITDA margins benefit from operating leverage as implementation costs are partially fixed.' +
    '</div>' +
    '<div class="doc-section-title">3. Customer Concentration</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Customer</th><th>FY24 Revenue</th><th>% of Total</th><th>Contract Expiry</th><th>Risk</th></tr></thead>' +
      '<tbody>' +
        '<tr class="flagged"><td>Apex Corp</td><td class="num">$3.1M</td><td class="num">6.6%</td><td>Q2 2025</td><td><span class="flag-icon">\u25CF</span> NO AUTO-RENEW</td></tr>' +
        '<tr><td>Meridian Health</td><td class="num">$2.8M</td><td class="num">5.9%</td><td>Q4 2026</td><td>Low</td></tr>' +
        '<tr><td>Coastal Systems</td><td class="num">$2.4M</td><td class="num">5.1%</td><td>Q1 2027</td><td>Low</td></tr>' +
        '<tr><td>Summit Group</td><td class="num">$1.9M</td><td class="num">4.0%</td><td>Q3 2026</td><td>Low</td></tr>' +
        '<tr><td>All Others (84)</td><td class="num">$37.0M</td><td class="num">78.4%</td><td>Various</td><td>Low</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-body-text">' +
      'Top-four concentration is 21.6% \u2014 within acceptable range for a mid-market SaaS business. ' +
      'However, the Apex non-renewal risk is material and should be addressed in management discussions before IC vote.' +
    '</div>' +
    '<div class="doc-footer">' +
      'Sources: Mgmt_Financials_FY24.xlsx, Apex_MSA_2022.pdf, Customer_Revenue_Breakdown.pdf, AR_Aging_Q4_2024.pdf. ' +
      'All figures cross-referenced against audited financial statements where available.' +
    '</div>' +
  '</div>';
}

function getLPLetterHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Alpine Capital Fund III</div>' +
      '<div class="doc-letterhead-sub">Quarterly Report &middot; Q3 2025</div>' +
    '</div>' +
    '<div class="doc-body-text">Dear Limited Partners,</div>' +
    '<div class="doc-body-text">' +
      'We are pleased to present the quarterly performance update for Alpine Capital Fund III for the period ending September 30, 2025. ' +
      'The portfolio continues to perform in line with our underwriting expectations, with several positions showing meaningful appreciation.' +
    '</div>' +
    '<div class="doc-section-title">Fund Performance Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Metric</th><th>Q3 2025</th><th>YTD</th><th>Since Inception</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Net IRR</td><td class="num">18.3%</td><td class="num">16.7%</td><td class="num">22.1%</td></tr>' +
        '<tr><td>TVPI</td><td class="num">1.42x</td><td class="num">1.42x</td><td class="num">1.42x</td></tr>' +
        '<tr><td>DPI</td><td class="num">0.31x</td><td class="num">0.31x</td><td class="num">0.31x</td></tr>' +
        '<tr><td>RVPI</td><td class="num">1.11x</td><td class="num">1.11x</td><td class="num">1.11x</td></tr>' +
        '<tr><td>Committed Capital</td><td class="num" colspan="3">$485,000,000</td></tr>' +
        '<tr><td>Drawn Capital</td><td class="num" colspan="3">$342,400,000</td></tr>' +
        '<tr><td>Distributions to Date</td><td class="num" colspan="3">$106,100,000</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-section-title">Portfolio Company Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Company</th><th>Sector</th><th>Entry</th><th>Cost Basis</th><th>Fair Value</th><th>MOIC</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>NovaTech Solutions</td><td>Enterprise SaaS</td><td>Q2 2023</td><td class="num">$42.0M</td><td class="num">$117.6M</td><td class="num">2.80x</td></tr>' +
        '<tr><td>Meridian Health</td><td>Healthcare IT</td><td>Q4 2023</td><td class="num">$38.5M</td><td class="num">$65.5M</td><td class="num">1.70x</td></tr>' +
        '<tr><td>Summit Logistics</td><td>Supply Chain</td><td>Q1 2024</td><td class="num">$51.0M</td><td class="num">$71.4M</td><td class="num">1.40x</td></tr>' +
        '<tr><td>Apex Manufacturing</td><td>Industrial</td><td>Q3 2024</td><td class="num">$35.0M</td><td class="num">$36.8M</td><td class="num">1.05x</td></tr>' +
        '<tr><td>Greenfield Energy</td><td>Renewables</td><td>Q1 2025</td><td class="num">$44.0M</td><td class="num">$39.6M</td><td class="num">0.90x</td></tr>' +
        '<tr><td>Coastal Properties</td><td>Real Estate</td><td>Q2 2024</td><td class="num">$28.5M</td><td class="num">$44.5M</td><td class="num">1.56x</td></tr>' +
      '</tbody>' +
    '</table>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-section-title">Capital Account Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Item</th><th>Amount</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Beginning Balance (Q2 2025)</td><td class="num">$345,400,000</td></tr>' +
        '<tr><td>Capital Contributions</td><td class="num">$18,700,000</td></tr>' +
        '<tr><td>Distributions</td><td class="num">($12,400,000)</td></tr>' +
        '<tr><td>Net Investment Income</td><td class="num">$3,100,000</td></tr>' +
        '<tr><td>Unrealized Gains / (Losses)</td><td class="num">$25,300,000</td></tr>' +
        '<tr><td style="font-weight:500;">Ending Balance (Q3 2025)</td><td class="num" style="font-weight:500;">$380,100,000</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="doc-body-text">' +
      'The macro environment remains constructive for our core thesis in operationally-intensive middle market businesses. ' +
      'We continue to see attractive entry points in industrial technology and healthcare services, where our operating playbook ' +
      'generates differentiated value. The team is actively evaluating two new platform opportunities for Q4 deployment.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'We appreciate your continued partnership and welcome any questions at your convenience.' +
    '</div>' +
    '<div class="doc-signature-block">' +
      '<div class="doc-signature-name">Alpine Capital Management</div>' +
      '<div class="doc-signature-title">General Partner</div>' +
    '</div>' +
    '<div class="doc-footer">' +
      'This report is confidential and intended solely for the limited partners of Alpine Capital Fund III. ' +
      'Past performance is not indicative of future results. All valuations reflect fair market value estimates as of the reporting date.' +
    '</div>' +
  '</div>';
}

function getCovenantReportHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Ironbridge Credit Fund II</div>' +
      '<div class="doc-letterhead-sub">Covenant Compliance Report &middot; Q3 2025</div>' +
    '</div>' +
    '<div class="doc-date">CONFIDENTIAL &middot; Prepared October 2025</div>' +
    '<div class="doc-section-title">Portfolio Covenant Summary</div>' +
    '<table class="doc-table">' +
      '<thead><tr><th>Borrower</th><th>Sector</th><th>Leverage (Max)</th><th>DSCR (Min)</th><th>Status</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>Pinnacle Industrial</td><td>Manufacturing</td><td class="num">3.1x (5.0x)</td><td class="num">1.85x (1.10x)</td><td>Pass</td></tr>' +
        '<tr><td>Northstar Freight</td><td>Logistics</td><td class="num">3.8x (4.5x)</td><td class="num">1.44x (1.15x)</td><td>Pass</td></tr>' +
        '<tr class="flagged"><td>Meridian Logistics</td><td>Transport</td><td class="num">4.8x (4.5x)</td><td class="num">1.21x (1.10x)</td><td><span class="flag-icon">\u25CF</span> BREACH</td></tr>' +
        '<tr><td>Cascade Health</td><td>Healthcare</td><td class="num">2.9x (4.0x)</td><td class="num">1.67x (1.20x)</td><td>Pass</td></tr>' +
        '<tr class="flagged"><td>Atlas Manufacturing</td><td>Industrial</td><td class="num">3.6x (4.5x)</td><td class="num">1.12x (1.10x)</td><td><span class="flag-icon">\u25CF</span> WATCH</td></tr>' +
        '<tr><td>Redwood Capital</td><td>Financial Svcs</td><td class="num">2.4x (3.5x)</td><td class="num">2.01x (1.25x)</td><td>Pass</td></tr>' +
        '<tr><td>Sterling Packaging</td><td>Consumer</td><td class="num">3.2x (4.0x)</td><td class="num">1.53x (1.15x)</td><td>Pass</td></tr>' +
        '<tr class="flagged"><td>Lakeshore Hospitality</td><td>Hospitality</td><td class="num">\u2014</td><td class="num">\u2014</td><td><span class="flag-icon">\u25CF</span> LATE</td></tr>' +
        '<tr><td>Beacon Software</td><td>Technology</td><td class="num">2.1x (4.0x)</td><td class="num">2.34x (1.20x)</td><td>Pass</td></tr>' +
        '<tr><td>Crestline Foods</td><td>Food &amp; Bev</td><td class="num">3.4x (4.5x)</td><td class="num">1.38x (1.10x)</td><td>Pass</td></tr>' +
        '<tr><td>Harbor Marine</td><td>Maritime</td><td class="num">2.7x (3.5x)</td><td class="num">1.71x (1.15x)</td><td>Pass</td></tr>' +
        '<tr><td>Keystone Electric</td><td>Utilities</td><td class="num">3.0x (4.0x)</td><td class="num">1.92x (1.25x)</td><td>Pass</td></tr>' +
        '<tr><td>Summit Distribution</td><td>Logistics</td><td class="num">3.5x (4.5x)</td><td class="num">1.29x (1.10x)</td><td>Pass</td></tr>' +
        '<tr><td>Copper Ridge Mining</td><td>Resources</td><td class="num">2.8x (4.0x)</td><td class="num">1.56x (1.20x)</td><td>Pass</td></tr>' +
      '</tbody>' +
    '</table>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-section-title" style="color:#c0392b;">Breach Detail: Meridian Logistics</div>' +
    '<div class="doc-body-text">' +
      '<strong>Senior Secured Leverage Ratio: 4.8x vs. 4.5x maximum.</strong> ' +
      'Breach driven by $2.3M unbudgeted fleet maintenance in Q3 and softening freight rates. ' +
      'Per the credit agreement (<span class="doc-section-ref">Meridian_CreditAgreement_2023.pdf, \u00A78.2</span>), ' +
      'the borrower has a 30-day cure period expiring November 14, 2025. Management has proposed an equity cure via sponsor injection. ' +
      'Recommended action: require updated financial projections and sponsor commitment letter before waiver consideration.' +
    '</div>' +
    '<div class="doc-section-title">Watch List: Atlas Manufacturing</div>' +
    '<div class="doc-body-text">' +
      'DSCR at 1.12x against a 1.10x minimum \u2014 2 basis points of cushion. Trailing four-quarter trend: 1.31x \u2192 1.24x \u2192 1.18x \u2192 1.12x. ' +
      'Deterioration is consistent and driven by rising input costs not yet passed through to customers. ' +
      'No breach, but trajectory suggests a Q4 violation absent margin recovery. Recommended action: request management call and updated budget.' +
    '</div>' +
    '<div class="doc-section-title">Reporting Default: Lakeshore Hospitality</div>' +
    '<div class="doc-body-text">' +
      'Q3 financial statements are 47 days past the 30-day reporting deadline. This constitutes a technical default under ' +
      '<span class="doc-section-ref">Lakeshore_CreditAgreement_2024.pdf, \u00A75.4</span>. ' +
      'Prior quarters were submitted on time. CFO transition cited as cause. Recommended action: issue formal notice and require submission within 10 business days.' +
    '</div>' +
    '<div class="doc-footer">' +
      'Sources: Individual credit agreements, Q3 borrower financial packages, Lakeshore_Reporting_Log.xlsx. ' +
      'All covenant calculations verified against source documents per fund methodology.' +
    '</div>' +
  '</div>';
}

function getRentRollHTML() {
  return '<div class="doc-spreadsheet">' +
    '<table>' +
      '<thead><tr>' +
        '<th>Property</th><th>Unit</th><th>Tenant</th><th>Lease Start</th><th>Lease End</th>' +
        '<th>Sq Ft</th><th>Base Rent</th><th>CAM/NNN</th><th>Total</th><th>Status</th>' +
      '</tr></thead>' +
      '<tbody>' +
        '<tr><td>Parkview Apts</td><td>101</td><td>Martinez, Elena</td><td>03/01/2024</td><td>02/28/2026</td><td>850</td><td>$1,425</td><td>$185</td><td>$1,610</td><td>Active</td></tr>' +
        '<tr><td>Parkview Apts</td><td>102</td><td>Johnson, Michael</td><td>07/15/2023</td><td>07/14/2025</td><td>850</td><td>$1,380</td><td>$185</td><td>$1,565</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Parkview Apts</td><td>215</td><td>Okafor, David</td><td>01/15/2024</td><td>01/14/2026</td><td>975</td><td>$1,650</td><td>$185</td><td>$1,835</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Parkview Apts</td><td>310</td><td>Liu, Jennifer</td><td>09/01/2024</td><td>08/31/2026</td><td>1,100</td><td>$1,875</td><td>$210</td><td>$2,085</td><td>Active</td></tr>' +
        '<tr><td>Parkview Apts</td><td>412</td><td>Thompson, Robert</td><td>11/01/2023</td><td>10/31/2025</td><td>650</td><td>$1,200</td><td>$165</td><td>$1,365</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>201</td><td>Patel, Anita</td><td>04/01/2023</td><td>03/31/2025</td><td>1,200</td><td>$2,400</td><td>$310</td><td>$2,710</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Summit Tower</td><td>205</td><td>Garcia, Carlos</td><td>06/01/2024</td><td>05/31/2026</td><td>1,050</td><td>$2,100</td><td>$290</td><td>$2,390</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>304</td><td>Reeves, Thomas</td><td>06/01/2023</td><td>05/31/2025</td><td>1,100</td><td>$2,200</td><td>$310</td><td>$2,510</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Summit Tower</td><td>410</td><td>Williams, Dana</td><td>02/01/2025</td><td>01/31/2027</td><td>1,400</td><td>$2,950</td><td>$340</td><td>$3,290</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Summit Tower</td><td>510</td><td>Nguyen, Kim</td><td>08/01/2024</td><td>07/31/2026</td><td>900</td><td>$1,800</td><td>$275</td><td>$2,075</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Harborview</td><td>103</td><td>Brown, Jessica</td><td>05/15/2024</td><td>05/14/2026</td><td>780</td><td>$1,560</td><td>$195</td><td>$1,755</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Harborview</td><td>207</td><td>Schmidt, Paul</td><td>12/01/2022</td><td>11/30/2024</td><td>1,050</td><td>$1,890</td><td>$220</td><td>$2,110</td><td><span class="flag-icon">\u25CF</span> EXPIRED</td></tr>' +
        '<tr><td>Harborview</td><td>315</td><td>Adebayo, Tolu</td><td>10/01/2024</td><td>09/30/2026</td><td>920</td><td>$1,750</td><td>$205</td><td>$1,955</td><td>Active</td></tr>' +
        '<tr class="flagged"><td>Lakeside</td><td>108</td><td>Cooper, Amanda</td><td>03/01/2024</td><td>02/28/2026</td><td>875</td><td>$1,490</td><td>$190</td><td>$1,680</td><td><span class="flag-icon">\u25CF</span> AMT MISMATCH</td></tr>' +
        '<tr><td>Lakeside</td><td>204</td><td>Fernandez, Maria</td><td>01/01/2025</td><td>12/31/2026</td><td>1,150</td><td>$2,070</td><td>$245</td><td>$2,315</td><td>Active</td></tr>' +
      '</tbody>' +
    '</table>' +
    '<div class="sheet-tabs">' +
      '<div class="sheet-tab active">All Properties</div>' +
      '<div class="sheet-tab">Parkview Apts</div>' +
      '<div class="sheet-tab">Summit Tower</div>' +
      '<div class="sheet-tab">Harborview</div>' +
      '<div class="sheet-tab">Lakeside</div>' +
      '<div class="sheet-tab">Flags (12)</div>' +
    '</div>' +
  '</div>';
}

const artifactDocuments = {
  'IC_Memo_Financial_DD.pdf': {
    pageCount: 6,
    content: getDiligenceMemoHTML
  },
  'Q3_2025_LP_Letter.pdf': {
    pageCount: 8,
    content: getLPLetterHTML
  },
  'Q3_Covenant_Compliance.pdf': {
    pageCount: 5,
    content: getCovenantReportHTML
  },
  'portfolio_master_rentrolls.xlsx': {
    pageCount: null,
    content: getRentRollHTML
  }
};
