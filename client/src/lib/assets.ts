/**
 * ERI Brand Asset CDN URLs
 * All assets are hosted on CloudFront CDN via manus-upload-file --webdev
 * Do not reference local paths — always use these constants.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ";

export const logos = {
  eriLogoFullColor:  `${CDN}/eri-logo-full-color_f5763508.png`,
  eriLogoFullColorSvg: `${CDN}/eri-logo-full-color_775a0122.svg`,
  eriIconMark:       `${CDN}/eri-icon-mark_08cd328f.webp`,
  exponentialLogo:   `${CDN}/exponential-logo_0cda439e.webp`,
  favicon:           `${CDN}/favicon_28cbda94.webp`,
  faviconIco:        `${CDN}/favicon_46e834ad.ico`,
};

export const pillarBottomIcons = {
  pillar1: `${CDN}/pillar1-bottom_f35f20cf.webp`,
  pillar2: `${CDN}/pillar2-bottom_b9301a6c.webp`,
  pillar3: `${CDN}/pillar3-bottom_e103f8a6.webp`,
  pillar4: `${CDN}/pillar4-bottom_7d7dbab5.webp`,
  pillar5: `${CDN}/pillar5-bottom_35874da5.webp`,
};

export const pillarMarks = {
  pillar1: `${CDN}/ERI_Pillar1_69ff8186.webp`,
  pillar2: `${CDN}/ERI_Pillar2_b9ad7cb5.webp`,
  pillar3: `${CDN}/ERI_Pillar3_60b22d2b.webp`,
  pillar4: `${CDN}/ERI_Pillar4_0ec99cd9.webp`,
  pillar5: `${CDN}/ERI_Pillar5_83235237.webp`,
};

export const frameworkImages = {
  exponentialFramework:         `${CDN}/exponential-framework_6be34b5a.webp`,
  actionAreas:                  `${CDN}/ERI_ExpFramework_ActionAreas_545baa2a.webp`,
  leadershipCategories:         `${CDN}/ERI_ExpFramework_LeadershipCategories_64fd8bae.webp`,
  netZero:                      `${CDN}/ExponentialFramework_netZero_9de663ae.webp`,
  brandingGuidelines:           `${CDN}/ERI_branding_guidelines_87eb0fd1.webp`,
};

// Framework v5 diagrams
export const frameworkV5 = {
  // Full 5-pillar radial diagrams
  fivePillarsBg:            `${CDN}/ERI_5Pillars_BG_ae436884.png`,
  fivePillarsBgLogo:        `${CDN}/ERI_5Pillars_BG_Logo_1bacc79a.png`,
  fivePillarsBgLogoTitle:   `${CDN}/ERI_5Pillars_BG_Logo_Title_0cbf7c89.png`,
  fivePillarsExtended:      `${CDN}/ERI_5Pillars_Extended_7ed6daca.png`,
  fivePillarsTransparent:   `${CDN}/ERI_5Pillars_Transparent_76a0d349.png`,
  fivePillarsShortText:     `${CDN}/ERI_5_Pillars_Short_Text_Transp_RGB_dc461568.png`,
  fivePillarsSymbols:       `${CDN}/ERI_5_Pillars_Symbols_Transp_RGB_e34a44e2.png`,
  fivePillarsText:          `${CDN}/ERI_5_Pillars_Text_Transp_RGB_909b21e5.png`,
  // Supporting diagrams
  leadershipA:              `${CDN}/ERI_Leadership_A_c6dc798d.png`,
  leadershipB:              `${CDN}/ERI_Leadership_B_691e4143.png`,
  pillarsLinear:            `${CDN}/ERI_Pillars_6a5b1840.png`,
  reducingEnabling:         `${CDN}/ERI_ReducingEnabling_e8800305.png`,
};

// Pillar elements — Long variant (primary, for presentations)
export const pillarsLong: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/ERI_Pillar_1_Long_RGB_be48b143.png`,      transparent: `${CDN}/ERI_Pillar_1_Long_Transp_RGB_779b620c.png` },
  2: { solid: `${CDN}/ERI_Pillar_2_Long_RGB_426442d5.png`,      transparent: `${CDN}/ERI_Pillar_2_Long_Transp_RGB_e6ad26cb.png` },
  3: { solid: `${CDN}/ERI_Pillar_3_Long_RGB_3fe36f01.png`,      transparent: `${CDN}/ERI_Pillar_3_Long_Transp_RGB_91c00371.png` },
  4: { solid: `${CDN}/ERI_Pillar_4_Long_RGB_8f71fa05.png`,      transparent: `${CDN}/ERI_Pillar_4_Long_Transp_RGB_262fb181.png` },
  5: { solid: `${CDN}/ERI_Pillar_5_Long_RGB_d1a704f1.png`,      transparent: `${CDN}/ERI_Pillar_5_Long_Transp_RGB_c76155f7.png` },
};

// Pillar elements — Regular variant (scaled-down, for data slides)
export const pillarsRegular: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/ERI_Pillar_1_RGB_f2b1a447.png`,           transparent: `${CDN}/ERI_Pillar_1_Transp_RGB_4e17abcb.png` },
  2: { solid: `${CDN}/ERI_Pillar_2_RGB_46b39138.png`,           transparent: `${CDN}/ERI_Pillar_2_Transp_RGB_3a00adc5.png` },
  3: { solid: `${CDN}/ERI_Pillar_3_RGB_fa4a1212.png`,           transparent: `${CDN}/ERI_Pillar_3_Transp_RGB_4f33eff0.png` },
  4: { solid: `${CDN}/ERI_Pillar_4_RGB_d5ba88d5.png`,           transparent: `${CDN}/ERI_Pillar_4_Transp_RGB_d75aa31b.png` },
  5: { solid: `${CDN}/ERI_Pillar_5_RGB_04c5e102.png`,           transparent: `${CDN}/ERI_Pillar_5_Transp_RGB_0f516df6.png` },
};

// Pillar elements — Extended variant (with action blocks)
export const pillarsExtended: Record<number, { solid: string; transparent: string }> = {
  1: { solid: `${CDN}/ERI_Pillar_1_Extented_RGB_c72c044a.png`,  transparent: `${CDN}/ERI_Pillar_1_Extented_Transp_RGB_6310874d.png` },
  2: { solid: `${CDN}/ERI_Pillar_2_Extented_RGB_8887e8e8.png`,  transparent: `${CDN}/ERI_Pillar_2_Extented_Transp_RGB_5bd37356.png` },
  3: { solid: `${CDN}/ERI_Pillar_3_Extented_RGB_b8d21717.png`,  transparent: `${CDN}/ERI_Pillar_3_Extented_Transp_RGB_71c60005.png` },
  4: { solid: `${CDN}/ERI_Pillar_4_Extented_RGB_2e66300d.png`,  transparent: `${CDN}/ERI_Pillar_4_Extented_Transp_RGB_d61049be.png` },
  5: { solid: `${CDN}/ERI_Pillar_5_Extented_RGB_4662ed0a.png`,  transparent: `${CDN}/ERI_Pillar_5_Extented_Transp_RGB_ee2d205a.png` },
};

// Pillar elements — Short variant (symbol or text only)
export const pillarsShort: Record<number, { symbol: string; symbolTransp: string; text: string; textTransp: string }> = {
  1: { symbol: `${CDN}/ERI_Pillar_1_Symbol_RGB_bd5bc7c1.png`, symbolTransp: `${CDN}/ERI_Pillar_1_Symbol_Transp_RGB_b509a59c.png`, text: `${CDN}/ERI_Pillar_1_Text_RGB_b91508f0.png`, textTransp: `${CDN}/ERI_Pillar_1_Text_Transp_RGB_a4e887fb.png` },
  2: { symbol: `${CDN}/ERI_Pillar_2_Symbol_RGB_35296527.png`, symbolTransp: `${CDN}/ERI_Pillar_2_Symbol_Transp_RGB_9aaa96c5.png`, text: `${CDN}/ERI_Pillar_2_Text_RGB_39ee791f.png`, textTransp: `${CDN}/ERI_Pillar_2_Text_Transp_RGB_ab990cc2.png` },
  3: { symbol: `${CDN}/ERI_Pillar_3_Symbol_RGB_99abeec2.png`, symbolTransp: `${CDN}/ERI_Pillar_3_Symbol_Transp_RGB_90bab0da.png`, text: `${CDN}/ERI_Pillar_3_Text_RGB_e589b56c.png`, textTransp: `${CDN}/ERI_Pillar_3_Text_Transp_RGB_4c14a666.png` },
  4: { symbol: `${CDN}/ERI_Pillar_4_Symbol_RGB_afeba676.png`, symbolTransp: `${CDN}/ERI_Pillar_4_Symbol_Transp_RGB_f4017ee0.png`, text: `${CDN}/ERI_Pillar_4_Text_RGB_b0223cf5.png`, textTransp: `${CDN}/ERI_Pillar_4_Text_Transp_RGB_93502912.png` },
  5: { symbol: `${CDN}/ERI_Pillar_5_Symbol_RGB_400dd958.png`, symbolTransp: `${CDN}/ERI_Pillar_5_Symbol_Transp_RGB_64804012.png`, text: `${CDN}/ERI_Pillar_5_Text_RGB_87dba8df.png`, textTransp: `${CDN}/ERI_Pillar_5_Text_Transp_RGB_e7ab9f61.png` },
};

// Member company logotypes
export const memberLogos: Record<string, { name: string; url: string; sector?: string }> = {
  afry:                  { name: "AFRY",                   url: `${CDN}/afry_logo_7a356573.jpeg`,                   sector: "Engineering" },
  alfaLaval:             { name: "Alfa Laval",             url: `${CDN}/alfa_laval_logo_e1980ce0.jpeg`,             sector: "Industrial" },
  apple:                 { name: "Apple",                  url: `${CDN}/apple_23e3c4b7.jpg`,                        sector: "Technology" },
  axelJohnson:           { name: "Axel Johnson",           url: `${CDN}/AxelJohnson_logo_0ea2ad8b.jpeg`,            sector: "Investment" },
  bt:                    { name: "BT",                     url: `${CDN}/bt_logo_ef828607.jpeg`,                     sector: "Telecoms" },
  ericsson:              { name: "Ericsson",               url: `${CDN}/ericsson_logo_082a9175.jpeg`,               sector: "Technology" },
  google:                { name: "Google",                 url: `${CDN}/google_logo_f29cae55.jpeg`,                 sector: "Technology" },
  handelsbanken:         { name: "Handelsbanken",          url: `${CDN}/Handelsbanken_logo_96bfd364.png`,           sector: "Finance" },
  houdiniSportswear:     { name: "Houdini Sportswear",    url: `${CDN}/houdini_sportswear_logo_2466f43a.jpeg`,    sector: "Apparel" },
  icebug:                { name: "Icebug",                 url: `${CDN}/Icebug_logo_2b5b62f0.jpeg`,                sector: "Apparel" },
  ikea:                  { name: "IKEA",                   url: `${CDN}/ikea_89cd68c0.jpg`,                         sector: "Retail" },
  investorAb:            { name: "Investor AB",            url: `${CDN}/investor_ab_logo_505f487d.jpeg`,            sector: "Investment" },
  juanValdezCafe:        { name: "Juan Valdez Café",       url: `${CDN}/juan_valdez_cafe_logo_d3023a45.jpeg`,       sector: "Food & Beverage" },
  maxBurgers:            { name: "Max Burgers",            url: `${CDN}/Max_Burgers_logo_80348600.jpeg`,            sector: "Food & Beverage" },
  netflix:               { name: "Netflix",                url: `${CDN}/netflix_logo_e71a7bdb.jpeg`,                sector: "Media" },
  oatly:                 { name: "Oatly",                  url: `${CDN}/Oatly_logo_36fc37e4.jpeg`,                  sector: "Food & Beverage" },
  oracle:                { name: "Oracle",                 url: `${CDN}/oracle_logo_5d064a95.jpeg`,                 sector: "Technology" },
  polestar:              { name: "Polestar",               url: `${CDN}/polestar_logo_cc654cd6.jpg`,                sector: "Automotive" },
  powercellSweden:       { name: "PowerCell Sweden",       url: `${CDN}/powercell_sweden_ab_logo_e25553c9.jpeg`,    sector: "Energy" },
  ragnsells:             { name: "Ragn-Sells",             url: `${CDN}/ragnsells_logo_6a86779f.jpeg`,              sector: "Waste & Recycling" },
  scanGlobalLogistics:   { name: "Scan Global Logistics",  url: `${CDN}/scan_global_logistics_logo_a618e915.jpeg`,  sector: "Logistics" },
  scania:                { name: "Scania",                 url: `${CDN}/Scania_logo_346cbc2c.jpeg`,                 sector: "Automotive" },
  skanska:               { name: "Skanska",                url: `${CDN}/Skanska_logo_9553338a.png`,                 sector: "Construction" },
  speedyHire:            { name: "Speedy Hire",            url: `${CDN}/speedy_hire_logo_0e49cc28.jpeg`,            sector: "Equipment Hire" },
  spotify:               { name: "Spotify",                url: `${CDN}/Spotify_logo_a473dbde.jpeg`,                sector: "Media" },
  stegra:                { name: "Stegra",                 url: `${CDN}/Stegra_logo_f9be5f0a.jpeg`,                 sector: "Green Steel" },
  tele2:                 { name: "Tele2",                  url: `${CDN}/tele2_logo_939414c6.jpeg`,                  sector: "Telecoms" },
  teliaCompany:          { name: "Telia Company",          url: `${CDN}/teliacompany_logo_ce6b5d1e.jpeg`,           sector: "Telecoms" },
  unilever:              { name: "Unilever",               url: `${CDN}/unilever_logo_e8b8dd8d.jpeg`,               sector: "Consumer Goods" },
};

// Data source & partner logos — typed with name, category, and description
export const dataSourceLogos: Record<string, { name: string; url: string; category: string; description?: string }> = {
  // Climate data & ratings
  cdp:                  { name: "CDP",                      category: "Climate Data",      url: `${CDN}/CDP_logo_bfb8c25c.jpeg`,                    description: "Corporate climate disclosure platform" },
  sbti:                 { name: "SBTi",                     category: "Standards",         url: `${CDN}/SBTi_logo_e552178d.jpeg`,                   description: "Science Based Targets initiative" },
  tpi:                  { name: "TPI",                      category: "Climate Data",      url: `${CDN}/TPI_logo_c4b3d367.jpeg`,                    description: "Transition Pathway Initiative" },
  gleif:                { name: "GLEIF",                    category: "Company Data",      url: `${CDN}/GLEIF_logo_592027b2.jpeg`,                  description: "Global Legal Entity Identifier Foundation" },
  msci:                 { name: "MSCI",                     category: "ESG Ratings",       url: `${CDN}/MSCI_logo_8077cc51.jpeg`,                   description: "ESG ratings and analytics" },
  wba:                  { name: "WBA",                      category: "Benchmarks",        url: `${CDN}/WBA_logo_7e3c884f.jpeg`,                    description: "World Benchmarking Alliance" },
  netzerotracker:       { name: "Net Zero Tracker",         category: "Climate Data",      url: `${CDN}/net_zero_tracker_logo_4e3226ae.jpeg`,       description: "Net Zero Tracker" },
  bcorp:                { name: "B Corp",                   category: "Certification",     url: `${CDN}/B-Corp-Logo_a6ffbcae.png`,                  description: "B Corp certification" },
  eurostat:             { name: "Eurostat",                 category: "Statistical Data",  url: `${CDN}/Eurostat_logo_825ea18d.jpeg`,               description: "EU statistical office" },
  wikidata:             { name: "Wikidata",                 category: "Open Data",         url: `${CDN}/Wikidata_logo_69b76071.jpeg`,               description: "Free open knowledge base" },
  klimatkollen:         { name: "Klimatkollen",             category: "Climate Data",      url: `${CDN}/Klimatkollen_logo_36a1c588.jpeg`,           description: "Swedish climate data platform" },
  lobbymap:             { name: "LobbyMap",                 category: "Policy Data",       url: `${CDN}/LobbyMap_logo_b2589caf.png`,                description: "Corporate lobbying tracker" },
  perplexity:           { name: "Perplexity AI",            category: "AI Tools",          url: `${CDN}/Perplexity_AI_logo_icon_f861980d.png`,      description: "AI-powered research assistant" },
  smeclimatehub:        { name: "SME Climate Hub",          category: "Standards",         url: `${CDN}/smeclimatehub_logo_a1f8ae12.jpeg`,          description: "SME climate commitment platform" },
  srNavigator:          { name: "SR Navigator",             category: "ERI Tools",         url: `${CDN}/SR_Nav_logo_f3648f63.jpeg`,                 description: "Sustainability Reporting Navigator" },
  // Social & professional
  linkedin:             { name: "LinkedIn",                 category: "Social",            url: `${CDN}/LinkedIn_icon_0fcf881c.png`,                description: "Professional network" },
  github:               { name: "GitHub",                   category: "Developer",         url: `${CDN}/github_logo_a6bc7505.jpeg`,                 description: "Code repository and collaboration" },
  // Research & academia
  oxfordNetZero:        { name: "Oxford Net Zero",          category: "Research",          url: `${CDN}/OxfordNetZero_logo_e5280644.png`,           description: "Oxford University Net Zero programme" },
  oxfordUniversity:     { name: "Oxford University",        category: "Research",          url: `${CDN}/OxfordUniversity_logo_99d8193c.png`,        description: "University of Oxford" },
  ipcc:                 { name: "IPCC",                     category: "Research",          url: `${CDN}/ipcc_logo_aa7ef046.jpeg`,                   description: "Intergovernmental Panel on Climate Change" },
  unfccc:               { name: "UNFCCC",                   category: "Policy",            url: `${CDN}/unfccc_logo_46eda936.jpeg`,                 description: "UN Framework Convention on Climate Change" },
  wbcsd:                { name: "WBCSD",                    category: "Standards",         url: `${CDN}/wbcsd_logo_95dfa23f.jpeg`,                  description: "World Business Council for Sustainable Development" },
  wri:                  { name: "WRI",                      category: "Research",          url: `${CDN}/WRI_logo_87910e38.jpeg`,                    description: "World Resources Institute" },
  projectDrawdown:      { name: "Project Drawdown",         category: "Research",          url: `${CDN}/project_drawdown_logo_d315fcfc.jpeg`,       description: "Climate solutions research" },
  // Initiatives & campaigns
  climatechampions:     { name: "Climate Champions",        category: "Initiatives",       url: `${CDN}/climatechampions_logo_efb5a6d9.jpeg`,       description: "UNFCCC Race to Zero Champions" },
  breakthroughs2030:    { name: "2030 Breakthroughs",       category: "Initiatives",       url: `${CDN}/2030_breakthroughs_2032a9ec.webp`,          description: "Exponential Roadmap 2030 Breakthroughs" },
  klimatkommunerna:     { name: "Klimatkommunerna",         category: "Initiatives",       url: `${CDN}/Klimatkommunerna_logo_cda749cd.jpeg`,       description: "Swedish climate municipalities network" },
  viablecities:         { name: "Viable Cities",            category: "Initiatives",       url: `${CDN}/viablecities_logo_fa4b5162.jpeg`,           description: "Swedish smart city programme" },
  naturvardsverket:     { name: "Naturvårdsverket",         category: "Government",        url: `${CDN}/naturvardsverket-logo_6b89c9a9.svg`,        description: "Swedish Environmental Protection Agency" },
};
