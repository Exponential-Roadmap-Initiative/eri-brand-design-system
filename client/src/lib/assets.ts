/**
 * ERI Brand Asset CDN URLs
 * All assets are hosted on CloudFront CDN via manus-upload-file --webdev
 * Do not reference local paths — always use these constants.
 */

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663319595517/5mtZtU66sMbsnmPoVbf6UJ";

export const logos = {
  eriLogoFullColor:  `${CDN}/eri-logo-full-color_100fc0a3.svg`,
  eriIconMark:       `${CDN}/eri-icon-mark_f486f537.webp`,
  exponentialLogo:   `${CDN}/exponential-logo_ae763158.webp`,
  favicon:           `${CDN}/favicon_3635ea53.webp`,
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

export const dataSourceLogos: Record<string, string> = {
  cdp:                    `${CDN}/cdp-logo_e76366be.webp`,
  sbti:                   `${CDN}/sbti-logo_700c1951.webp`,
  tpi:                    `${CDN}/tpi-logo_a5342652.webp`,
  gleif:                  `${CDN}/gleif-logo_d88883e3.webp`,
  linkedin:               `${CDN}/linkedin-logo_c4f9145a.webp`,
  msci:                   `${CDN}/msci-logo_0ecbdd1d.webp`,
  wba:                    `${CDN}/wba-logo_f6034ede.webp`,
  netzerotracker:         `${CDN}/netzerotracker-logo_fd07d911.webp`,
  bcorp:                  `${CDN}/bcorp-logo_4c9bba04.webp`,
  eurostat:               `${CDN}/eurostat-logo_1651a69e.webp`,
  gics:                   `${CDN}/gics-logo_5aa0a786.webp`,
  wikidata:               `${CDN}/wikidata-logo_fbce8857.webp`,
  influencemap:           `${CDN}/influencemap-logo_305f7c1e.webp`,
  klimatkollen:           `${CDN}/klimatkollen-logo_796cd670.webp`,
  lobbymap:               `${CDN}/lobbymap-logo_f07ec2e0.webp`,
  perplexity:             `${CDN}/perplexity-logo_95a0e9a5.webp`,
  smeclimatehub:          `${CDN}/smeclimatehub-logo_4b080e9f.webp`,
  srNavigator:            `${CDN}/sr-navigator_2c2629fd.webp`,
  verifiedDeepResearch:   `${CDN}/verified-deep-research-icon_528b2293.webp`,
  eri:                    `${CDN}/eri-logo_90ce54d0.webp`,
};
