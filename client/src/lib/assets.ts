/**
 * ERI Brand Asset CDN URLs
 * All assets hosted on CloudFront CDN via manus-upload-file --webdev
 *
 * Naming convention: lowercase kebab-case, no ERI_ prefix
 *   logos/           — wordmarks and icon marks
 *   pillar-icons/    — pillar arch/arrow motif icons (pillar-N-icon.webp)
 *   framework/       — 5-pillar radial diagrams and supporting diagrams
 *   pillar-elements/ — pillar element variants (long/regular/extended/symbol/text × solid/transparent)
 *   member-logos/    — ERI member company logotypes
 *   datasource-logos/— data source and partner logotypes
 *
 * Do not reference local paths — always use these constants.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ";

// ─── LOGOS ───────────────────────────────────────────────────────────────────
export const logos = {
  eriLogoFullColor:       `${CDN}/eri-logo-full-color_64e5c7db.webp`,
  eriLogoFullColorSvg:    `${CDN}/eri-logo-full-color_775a0122.svg`,
  eriIconMark:            `${CDN}/eri-icon-mark_6c872e6b.webp`,
  exponentialRoadmapLogo: `${CDN}/exponential-roadmap-logo_6ca65904.webp`,
  // Canonical browser favicon — white background, 12% corner radius, PNG only
  faviconWhiteRounded32:  `${CDN}/favicon-white-rounded-32_05ba5ceb.png`,
  faviconWhiteRounded180: `${CDN}/favicon-white-rounded-180_2daaa7d4.png`,
  faviconWhiteRounded192: `${CDN}/favicon-white-rounded-192_54fb4338.png`,
};

// ─── HERO BACKGROUND IMAGES ─────────────────────────────────────────────────
// Dark hero backgrounds for use in full-viewport hero sections.
// Always use with white or Accent Lime (#93E07D) text overlay.
export const heroImages = {
  // Human-AI Lab — PRIMARY: two crossing S-curves (amber + lime) on deep teal grid,
  // with a distributed human network of person icons connected by luminous lines.
  // Use for: Human-AI Lab, any human+AI collaboration narrative.
  halHumanNetwork: `${CDN}/hal-hero-human-v3-network_9ab07ca2.png`,

  // Human-AI Lab — MINIMAL: same S-curves without human network overlay.
  // Use for: generic ERI dark hero, any dual-transition narrative without explicit human element.
  halSCurveDual: `${CDN}/hero-scurve-dual_823ed0f9.webp`,

  // Crocodile Economics: diverging jaw (cyan GDP up + amber emissions down),
  // atmospheric teal bg with grid and particle effects.
  // Use for: Crocodile Economics app, any decoupling / absolute-reduction narrative.
  crocodileDecoupling: `${CDN}/crocodile-hero-hybrid-v1_67b8bdc5.png`,

  // Human-AI Lab — REACHING: two constellation figures (male left, female right)
  // reaching toward each other across the S-curve crossing point.
  // Use for: Human-AI Lab, human collaboration with AI, gender-balanced team narratives.
  halMFReaching: `${CDN}/hal-hero-human-v9-mf-reaching_e8bf7da7.png`,

  // Human-AI Lab — HANDS: two translucent wireframe hands reaching toward each other,
  // fingertips meeting at the S-curve crossing point with a golden burst of light.
  // Michelangelo-inspired composition. Use for: HAL, human-AI connection, moment-of-contact narratives.
  halHandsTouching: `${CDN}/hal-hero-human-v2-hands_75d155b6.png`,

  // Trust Centre — polygon dot-network shield on dark teal background with circuit traces.
  // Use for: Trust Centre, security, data integrity, compliance contexts.
  // In code: import ERI_HERO_IMAGE_TRUST from @eri/components rather than using this token directly.
  trust: `${CDN}/eri-trust-hero-clean_4d9b9a4a.png`,
};

// ─── PILLAR BOTTOM ICONS (arch/arrow motif) ──────────────────────────────────
export const pillarBottomIcons = {
  pillar1: `${CDN}/pillar-1-icon_689cc920.webp`,
  pillar2: `${CDN}/pillar-2-icon_a3284f78.webp`,
  pillar3: `${CDN}/pillar-3-icon_2709a1d3.webp`,
  pillar4: `${CDN}/pillar-4-icon_fec16945.webp`,
  pillar5: `${CDN}/pillar-5-icon_d1641d43.webp`,
};

// pillarMarks — symbol variant (icon only, solid background)
export const pillarMarks = {
  pillar1: `${CDN}/pillar-1-symbol-solid_8d3dbd30.webp`,
  pillar2: `${CDN}/pillar-2-symbol-solid_23a0f808.webp`,
  pillar3: `${CDN}/pillar-3-symbol-solid_4e733602.webp`,
  pillar4: `${CDN}/pillar-4-symbol-solid_592e997b.webp`,
  pillar5: `${CDN}/pillar-5-symbol-solid_9f908c73.webp`,
};

// ─── FRAMEWORK DIAGRAMS ──────────────────────────────────────────────────────
export const frameworkImages = {
  exponentialFramework:  `${CDN}/exponential-framework_6be34b5a.webp`,
  actionAreas:           `${CDN}/ERI_ExpFramework_ActionAreas_545baa2a.webp`,
  leadershipCategories:  `${CDN}/ERI_ExpFramework_LeadershipCategories_64fd8bae.webp`,
  netZero:               `${CDN}/ExponentialFramework_netZero_9de663ae.webp`,
  brandingGuidelines:    `${CDN}/ERI_branding_guidelines_87eb0fd1.webp`,
};

export const frameworkV5 = {
  // 5-pillar radial diagrams
  fivePillarsBg:           `${CDN}/framework-5pillars-bg_c25e9b21.webp`,
  fivePillarsBgLogo:       `${CDN}/framework-5pillars-bg-logo_790f2a4b.webp`,
  fivePillarsBgLogoTitle:  `${CDN}/framework-5pillars-bg-logo-title_caed33f7.webp`,
  fivePillarsExtended:     `${CDN}/framework-5pillars-extended_e27900d3.webp`,
  fivePillarsTransparent:  `${CDN}/framework-5pillars-transparent_cbcf178a.webp`,
  fivePillarsSymbols:      `${CDN}/framework-5pillars-symbols-transparent_2a526468.webp`,
  fivePillarsText:         `${CDN}/framework-5pillars-text-transparent_2a0dab3e.webp`,
  fivePillarsShortText:    `${CDN}/ERI_5_Pillars_Short_Text_Transp_RGB_dc461568.png`,
  // Supporting diagrams
  leadershipA:             `${CDN}/framework-leadership-a_4f00e442.webp`,
  leadershipB:             `${CDN}/framework-leadership-b_bd313508.webp`,
  pillarsLinear:           `${CDN}/framework-pillars-linear_1be10f1f.webp`,
  reducingEnabling:        `${CDN}/framework-reducing-enabling_e9e099f4.webp`,
};

// ─── PILLAR ELEMENTS ─────────────────────────────────────────────────────────
// Long variant (primary, for presentations)
export const pillarsLong: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/pillar-1-long-solid_75ca2c8a.webp`,      transparent: `${CDN}/pillar-1-long-transparent_98c3fea4.webp` },
  2: { solid: `${CDN}/pillar-2-long-solid_b9e78323.webp`,      transparent: `${CDN}/pillar-2-long-transparent_b7e87478.webp` },
  3: { solid: `${CDN}/pillar-3-long-solid_df1d4894.webp`,      transparent: `${CDN}/pillar-3-long-transparent_478d2dee.webp` },
  4: { solid: `${CDN}/pillar-4-long-solid_6df8e54c.webp`,      transparent: `${CDN}/pillar-4-long-transparent_f2493619.webp` },
  5: { solid: `${CDN}/pillar-5-long-solid_31a052e7.webp`,      transparent: `${CDN}/pillar-5-long-transparent_0f1fb890.webp` },
};

// Regular variant (scaled-down, for data slides)
export const pillarsRegular: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/pillar-1-regular-solid_34b7dc97.webp`,   transparent: `${CDN}/pillar-1-regular-transparent_4096abe8.webp` },
  2: { solid: `${CDN}/pillar-2-regular-solid_ab77167b.webp`,   transparent: `${CDN}/pillar-2-regular-transparent_28fe0d04.webp` },
  3: { solid: `${CDN}/pillar-3-regular-solid_9a6c624f.webp`,   transparent: `${CDN}/pillar-3-regular-transparent_9d7c20a7.webp` },
  4: { solid: `${CDN}/pillar-4-regular-solid_0d97451f.webp`,   transparent: `${CDN}/pillar-4-regular-transparent_715c59f9.webp` },
  5: { solid: `${CDN}/pillar-5-regular-solid_27addedc.webp`,   transparent: `${CDN}/pillar-5-regular-transparent_ffaa5a6f.webp` },
};

// Extended variant (with action blocks)
export const pillarsExtended: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/pillar-1-extended-solid_c6fea749.webp`,  transparent: `${CDN}/pillar-1-extended-transparent_f7f0abcc.webp` },
  2: { solid: `${CDN}/pillar-2-extended-solid_e413bc26.webp`,  transparent: `${CDN}/pillar-2-extended-transparent_6d357aa2.webp` },
  3: { solid: `${CDN}/pillar-3-extended-solid_129651d3.webp`,  transparent: `${CDN}/pillar-3-extended-transparent_0be693fc.webp` },
  4: { solid: `${CDN}/pillar-4-extended-solid_84bb9802.webp`,  transparent: `${CDN}/pillar-4-extended-transparent_b2bbf810.webp` },
  5: { solid: `${CDN}/pillar-5-extended-solid_71fed0dd.webp`,  transparent: `${CDN}/pillar-5-extended-transparent_44605a10.webp` },
};

// Short variant — symbol (icon only) and text (number + name)
export const pillarsShort: Record<number, { symbol: string; symbolTransp: string; text: string; textTransp: string }> = {
  1: { symbol: `${CDN}/pillar-1-symbol-solid_8d3dbd30.webp`,   symbolTransp: `${CDN}/pillar-1-symbol-transparent_be9a8d71.webp`,   text: `${CDN}/pillar-1-text-solid_e91e5f08.webp`,   textTransp: `${CDN}/pillar-1-text-transparent_14c2dbd9.webp` },
  2: { symbol: `${CDN}/pillar-2-symbol-solid_23a0f808.webp`,   symbolTransp: `${CDN}/pillar-2-symbol-transparent_92c1f8f9.webp`,   text: `${CDN}/pillar-2-text-solid_f7115245.webp`,   textTransp: `${CDN}/pillar-2-text-transparent_d67c92fb.webp` },
  3: { symbol: `${CDN}/pillar-3-symbol-solid_4e733602.webp`,   symbolTransp: `${CDN}/pillar-3-symbol-transparent_7f22bcd0.webp`,   text: `${CDN}/pillar-3-text-solid_fc6cfedd.webp`,   textTransp: `${CDN}/pillar-3-text-transparent_f1cf2473.webp` },
  4: { symbol: `${CDN}/pillar-4-symbol-solid_592e997b.webp`,   symbolTransp: `${CDN}/pillar-4-symbol-transparent_2e116c40.webp`,   text: `${CDN}/pillar-4-text-solid_56ee0295.webp`,   textTransp: `${CDN}/pillar-4-text-transparent_9d18d238.webp` },
  5: { symbol: `${CDN}/pillar-5-symbol-solid_9f908c73.webp`,   symbolTransp: `${CDN}/pillar-5-symbol-transparent_3c43c45b.webp`,   text: `${CDN}/pillar-5-text-solid_42c28dbf.webp`,   textTransp: `${CDN}/pillar-5-text-transparent_0b85bfff.webp` },
};

// ─── MEMBER COMPANY LOGOTYPES ─────────────────────────────────────────────────
export const memberLogos: Record<string, { name: string; url: string; sector?: string }> = {
  afry:                { name: "AFRY",                  url: `${CDN}/afry-logo_5d25ca8d.webp`,                  sector: "Engineering" },
  alfaLaval:           { name: "Alfa Laval",            url: `${CDN}/alfa-laval-logo_9309c994.webp`,            sector: "Industrial" },
  apple:               { name: "Apple",                 url: `${CDN}/apple-logo_255c3687.webp`,                 sector: "Technology" },
  axelJohnson:         { name: "Axel Johnson",          url: `${CDN}/axel-johnson-logo_28311721.webp`,          sector: "Investment" },
  bt:                  { name: "BT",                    url: `${CDN}/bt-logo_d3683a2e.webp`,                    sector: "Telecoms" },
  ericsson:            { name: "Ericsson",              url: `${CDN}/ericsson-logo_36fef01e.webp`,              sector: "Technology" },
  google:              { name: "Google",                url: `${CDN}/google-logo_f127e1bf.webp`,                sector: "Technology" },
  handelsbanken:       { name: "Handelsbanken",         url: `${CDN}/handelsbanken-logo_512b4f78.webp`,         sector: "Finance" },
  houdiniSportswear:   { name: "Houdini Sportswear",   url: `${CDN}/houdini-sportswear-logo_881deb10.webp`,   sector: "Apparel" },
  icebug:              { name: "Icebug",                url: `${CDN}/icebug-logo_b84d308e.webp`,                sector: "Apparel" },
  ikea:                { name: "IKEA",                  url: `${CDN}/ikea-logo_26047fb0.webp`,                  sector: "Retail" },
  investorAb:          { name: "Investor AB",           url: `${CDN}/investor-ab-logo_1aa672a8.webp`,           sector: "Investment" },
  juanValdezCafe:      { name: "Juan Valdez Café",      url: `${CDN}/juan-valdez-cafe-logo_aa8886b3.webp`,      sector: "Food & Beverage" },
  maxBurgers:          { name: "Max Burgers",           url: `${CDN}/max-burgers-logo_d1d37117.webp`,           sector: "Food & Beverage" },
  netflix:             { name: "Netflix",               url: `${CDN}/netflix-logo_7a66f54f.webp`,               sector: "Media" },
  oatly:               { name: "Oatly",                 url: `${CDN}/oatly-logo_e7e935ba.webp`,                 sector: "Food & Beverage" },
  oracle:              { name: "Oracle",                url: `${CDN}/oracle-logo_8aaa2878.webp`,                sector: "Technology" },
  polestar:            { name: "Polestar",              url: `${CDN}/polestar-logo_7991cd8e.webp`,              sector: "Automotive" },
  powercellSweden:     { name: "PowerCell Sweden",      url: `${CDN}/powercell-sweden-logo_9cbab63c.webp`,      sector: "Energy" },
  ragnsells:           { name: "Ragn-Sells",            url: `${CDN}/ragnsells-logo_269530a0.webp`,             sector: "Waste & Recycling" },
  scanGlobalLogistics: { name: "Scan Global Logistics", url: `${CDN}/scan-global-logistics-logo_add4fa3e.webp`, sector: "Logistics" },
  scania:              { name: "Scania",                url: `${CDN}/scania-logo_8e61095e.webp`,                sector: "Automotive" },
  skanska:             { name: "Skanska",               url: `${CDN}/skanska-logo_ff07a68d.webp`,               sector: "Construction" },
  speedyHire:          { name: "Speedy Hire",           url: `${CDN}/speedy-hire-logo_fe52c971.webp`,           sector: "Equipment Hire" },
  spotify:             { name: "Spotify",               url: `${CDN}/spotify-logo_70f403a1.webp`,               sector: "Media" },
  stegra:              { name: "Stegra",                url: `${CDN}/stegra-logo_5fc0f38f.webp`,                sector: "Green Steel" },
  tele2:               { name: "Tele2",                 url: `${CDN}/tele2-logo_3ecd98de.webp`,                 sector: "Telecoms" },
  teliaCompany:        { name: "Telia Company",         url: `${CDN}/telia-company-logo_ff637b46.webp`,         sector: "Telecoms" },
  unilever:            { name: "Unilever",              url: `${CDN}/unilever-logo_8889bae7.webp`,              sector: "Consumer Goods" },
};

// ─── DATA SOURCE & PARTNER LOGOS ─────────────────────────────────────────────
export const dataSourceLogos: Record<string, { name: string; url: string; category: string; description?: string; darkBackground?: boolean }> = {
  cdp:               { name: "CDP",                category: "Climate Data",     url: `${CDN}/cdp-logo_cce59d3e.webp`,                  description: "Corporate climate disclosure platform" },
  sbti:              { name: "SBTi",               category: "Standards",        url: `${CDN}/sbti-logo_c443004e.webp`,                 description: "Science Based Targets initiative" },
  tpi:               { name: "TPI",                category: "Climate Data",     url: `${CDN}/tpi-logo_8c0a85cd.webp`,                  description: "Transition Pathway Initiative" },
  gleif:             { name: "GLEIF",              category: "Company Data",     url: `${CDN}/gleif-logo_1564ec4e.webp`,                description: "Global Legal Entity Identifier Foundation" },
  msci:              { name: "MSCI",               category: "ESG Ratings",      url: `${CDN}/msci-logo_697a38d2.webp`,                 description: "ESG ratings and analytics" },
  wba:               { name: "WBA",                category: "Benchmarks",       url: `${CDN}/wba-logo_a7d5909f.webp`,                  description: "World Benchmarking Alliance" },
  netzerotracker:    { name: "Net Zero Tracker",   category: "Climate Data",     url: `${CDN}/net-zero-tracker-logo_9a6f718f.webp`,     description: "Net Zero Tracker" },
  bcorp:             { name: "B Corp",             category: "Certification",    url: `${CDN}/b-corp-logo_2a5f8eeb.webp`,               description: "B Corp certification" },
  eurostat:          { name: "Eurostat",           category: "Statistical Data", url: `${CDN}/eurostat-logo_5e0881d5.webp`,             description: "EU statistical office" },
  wikidata:          { name: "Wikidata",           category: "Open Data",        url: `${CDN}/wikidata-logo_064f2f7b.webp`,             description: "Free open knowledge base" },
  klimatkollen:      { name: "Klimatkollen",       category: "Climate Data",     url: `${CDN}/klimatkollen-logo_69e86393.webp`,         description: "Swedish climate data platform" },
  lobbymap:          { name: "LobbyMap",           category: "Policy Data",      url: `${CDN}/lobbymap-logo_bf257500.webp`,             description: "Corporate lobbying tracker" },
  perplexity:        { name: "Perplexity AI",      category: "AI Tools",         url: `${CDN}/perplexity-ai-logo_0c220c4f.webp`,        description: "AI-powered research assistant" },
  smeclimatehub:     { name: "SME Climate Hub",    category: "Standards",        url: `${CDN}/sme-climate-hub-logo_9687a4db.webp`,      description: "SME climate commitment platform" },
  srNavigator:       { name: "SR Navigator",       category: "ERI Tools",        url: `${CDN}/sr-navigator-logo_8fe4a7c5.webp`,         description: "Sustainability Reporting Navigator" },
  linkedin:          { name: "LinkedIn",           category: "Social",           url: `${CDN}/linkedin-logo_8d548e22.webp`,             description: "Professional network" },
  github:            { name: "GitHub",             category: "Developer",        url: `${CDN}/github-logo_3da73845.webp`,               description: "Code repository and collaboration" },
  oxfordNetZero:     { name: "Oxford Net Zero",    category: "Research",         url: `${CDN}/oxford-net-zero-logo_ce1013f6.webp`,      description: "Oxford University Net Zero programme" },
  oxfordUniversity:  { name: "Oxford University",  category: "Research",         url: `${CDN}/oxford-university-logo_eca7f3ea.webp`,    description: "University of Oxford" },
  ipcc:              { name: "IPCC",               category: "Research",         url: `${CDN}/ipcc-logo_ab7ea87a.webp`,                 description: "Intergovernmental Panel on Climate Change" },
  unfccc:            { name: "UNFCCC",             category: "Policy",           url: `${CDN}/unfccc-logo_fa309fd3.webp`,               description: "UN Framework Convention on Climate Change" },
  wbcsd:             { name: "WBCSD",              category: "Standards",        url: `${CDN}/wbcsd-logo_b3e424e8.webp`,                description: "World Business Council for Sustainable Development" },
  wri:               { name: "WRI",                category: "Research",         url: `${CDN}/wri-logo_83f04a6e.webp`,                  description: "World Resources Institute" },
  projectDrawdown:   { name: "Project Drawdown",   category: "Research",         url: `${CDN}/project-drawdown-logo_2c67a47c.webp`,     description: "Climate solutions research" },
  climatechampions:  { name: "Climate Champions",  category: "Initiatives",      url: `${CDN}/climate-champions-logo_f27672a0.webp`,    description: "UNFCCC Race to Zero Champions" },
  breakthroughs2030: { name: "2030 Breakthroughs", category: "Initiatives",      url: `${CDN}/2030-breakthroughs-logo_0024771e.webp`,   description: "Exponential Roadmap 2030 Breakthroughs", darkBackground: true },
  klimatkommunerna:  { name: "Klimatkommunerna",   category: "Initiatives",      url: `${CDN}/klimatkommunerna-logo_551ccf43.webp`,     description: "Swedish climate municipalities network" },
  viablecities:      { name: "Viable Cities",      category: "Initiatives",      url: `${CDN}/viable-cities-logo_42211258.webp`,        description: "Swedish smart city programme" },
  naturvardsverket:  { name: "Naturvårdsverket",   category: "Government",       url: `${CDN}/naturvardsverket-logo_bc234e18.webp`,     description: "Swedish Environmental Protection Agency", darkBackground: true },
};
