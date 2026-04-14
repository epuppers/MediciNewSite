// ========== CHAT DEMOS ==========
const chatDemos = [
  {
    context: 'Alpine Capital III · 847 documents · 2.4GB indexed',
    messages: [
      { role: 'user', text: 'What are our co-invest obligations to LPs?' },
      {
        role: 'cosimo',
        text: 'Co-investment rights are offered pro-rata to LPs committing ≥$25M, with a 10 business day notice period per Section 4.2(b) of the LPA. Meridian has an additional first-look provision in their side letter.',
        citations: [
          { file: 'LPA_AlpineIII_Final.pdf', ref: 'p.34, §4.2(b)' },
          { file: 'SideLetter_Meridian_2024.pdf', ref: 'p.7' },
          { file: 'IC_Memo_CoInvest_Policy.docx', ref: 'p.2' }
        ]
      },
      { role: 'user', text: 'Draft the co-invest notice for Meridian' },
      {
        role: 'cosimo',
        text: 'Done. I\'ve drafted the notice using the terms from their side letter and the LPA requirements. The 10-day notice window and pro-rata allocation are referenced with source citations.',
        citations: [
          { file: 'SideLetter_Meridian_2024.pdf', ref: 'p.7' },
          { file: 'LPA_AlpineIII_Final.pdf', ref: 'p.34' }
        ],
        artifact: { name: 'meridian_coinvest_notice.pdf', meta: 'Co-invest notice · 2 pages · source-cited' }
      }
    ]
  },
  {
    context: 'Alpine Capital III · Q3 2025 reporting cycle',
    messages: [
      { role: 'user', text: 'Generate the quarterly performance summary for all LPs' },
      {
        role: 'cosimo',
        text: 'Aggregated across 12 portfolio companies. Net IRR: 18.3% | TVPI: 1.42x | DPI: 0.31x. All figures cross-referenced against capital account statements and NAV reports.',
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

function getMeridianCoInvestHTML() {
  return '<div class="doc-page">' +
    '<div class="doc-letterhead">' +
      '<div class="doc-letterhead-name">Alpine Capital Management</div>' +
      '<div class="doc-letterhead-sub">320 Park Avenue, 22nd Floor &middot; New York, NY 10022</div>' +
    '</div>' +
    '<div class="doc-date">January 15, 2026</div>' +
    '<div class="doc-addressee">' +
      'Meridian Partners, LP<br>' +
      'Attn: Sarah Chen, Director of Investments<br>' +
      '1 Financial Center, Suite 4200<br>' +
      'Boston, MA 02111' +
    '</div>' +
    '<div class="doc-re-line">Re: Alpine Capital Fund III \u2014 Co-Investment Opportunity (NovaTech Solutions, Inc.)</div>' +
    '<div class="doc-body-text">Dear Ms. Chen,</div>' +
    '<div class="doc-body-text">' +
      'Pursuant to <span class="doc-section-ref">Section 4.2(b) of the LPA</span> and the co-investment provisions of your side letter dated March 12, 2024 ' +
      '(<span class="doc-section-ref">Side Letter \u00A77</span>), we are pleased to notify Meridian Partners of a co-investment opportunity in ' +
      'NovaTech Solutions, Inc. (\u201CTarget\u201D), a leading enterprise workflow automation platform.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'The Investment Committee has approved a total co-investment allocation of <strong>$12,500,000</strong> alongside the Fund\u2019s primary commitment. ' +
      'Pursuant to the first-look provision in your side letter, Meridian is entitled to participate on a priority basis prior to allocation to other eligible LPs.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'Based on Meridian\u2019s 24.8% pro-rata share of Fund III commitments, your indicative allocation is <strong>$3,100,000</strong>. ' +
      'This allocation is subject to the terms outlined below.' +
    '</div>' +
    '<div class="doc-section-title">Key Terms</div>' +
    '<table class="doc-table">' +
      '<tr><td>Target Company</td><td>NovaTech Solutions, Inc.</td></tr>' +
      '<tr><td>Transaction Type</td><td>Series C Preferred Equity</td></tr>' +
      '<tr><td>Pre-Money Valuation</td><td>$480M</td></tr>' +
      '<tr><td>Total Co-Invest Pool</td><td>$12,500,000</td></tr>' +
      '<tr><td>Meridian Pro-Rata</td><td class="num">$3,100,000 (24.8%)</td></tr>' +
      '<tr><td>Notice Period</td><td>10 business days from date of this notice</td></tr>' +
      '<tr><td>Response Deadline</td><td>January 29, 2026</td></tr>' +
      '<tr><td>Anticipated Closing</td><td>February 14, 2026</td></tr>' +
    '</table>' +
  '</div>' +
  '<div class="doc-page">' +
    '<div class="doc-body-text">' +
      'To elect participation, please deliver written notice to the undersigned on or before the Response Deadline. ' +
      'Your election must specify the desired commitment amount (up to your pro-rata allocation). ' +
      'Failure to respond by the deadline will be deemed a waiver of this opportunity per <span class="doc-section-ref">Section 4.2(b)(iii)</span>.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'Participating co-investors will receive the same terms, pricing, and protections as the Fund\u2019s primary investment. ' +
      'A detailed term sheet and data room access credentials will be provided upon election.' +
    '</div>' +
    '<div class="doc-body-text">' +
      'This notice and its contents are confidential and intended solely for the addressee. ' +
      'Distribution or disclosure to any third party without the prior written consent of Alpine Capital Management is strictly prohibited.' +
    '</div>' +
    '<div class="doc-signature-block">' +
      '<div class="doc-signature-line"></div>' +
      '<div class="doc-signature-name">James R. Whitfield</div>' +
      '<div class="doc-signature-title">Managing Partner, Alpine Capital Management</div>' +
    '</div>' +
    '<div class="doc-footer">' +
      'CONFIDENTIAL \u2014 This communication is privileged and confidential, intended solely for the use of the addressee. ' +
      'Any unauthorized review, use, disclosure, or distribution is prohibited. Alpine Capital Management LLC is a registered investment adviser.' +
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
        '<tr><td>Beginning Balance (Q2 2025)</td><td class="num">$451,200,000</td></tr>' +
        '<tr><td>Capital Contributions</td><td class="num">$18,700,000</td></tr>' +
        '<tr><td>Distributions</td><td class="num">($12,400,000)</td></tr>' +
        '<tr><td>Net Investment Income</td><td class="num">$3,100,000</td></tr>' +
        '<tr><td>Unrealized Gains / (Losses)</td><td class="num">$25,300,000</td></tr>' +
        '<tr><td style="font-weight:500;">Ending Balance (Q3 2025)</td><td class="num" style="font-weight:500;">$485,900,000</td></tr>' +
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
      '<div class="sheet-tab">Flags (6)</div>' +
    '</div>' +
  '</div>';
}

const artifactDocuments = {
  'meridian_coinvest_notice.pdf': {
    pageCount: 2,
    content: getMeridianCoInvestHTML
  },
  'Q3_2025_LP_Letter.pdf': {
    pageCount: 8,
    content: getLPLetterHTML
  },
  'portfolio_master_rentrolls.xlsx': {
    pageCount: null,
    content: getRentRollHTML
  }
};
