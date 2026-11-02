# NAMQULA search and discovery



Production builds generate 19 public HTML pages: home plus six profiles, six vocabulary collections and six game pages. All share the same reviewed catalog and exact pack counts as the app. Initial HTML contains visible language information, internal links and vocabulary; React replaces that fallback with the interactive experience. No crawler-only content or invented reviews/ratings are used.



Each page includes a unique title, description, canonical play.aisod.tech address, absolute social image, Organization/WebSite/WebPage and applicable breadcrumb structured data. Client navigation updates the same metadata. Admin, unknown and community routes receive client noindex; admin/community are excluded from the sitemap and crawling directives. Robots directives do not provide access control. Query variations canonicalize to the public route.



The build emits sitemap.xml and robots.txt. Submit https://play.aisod.tech/sitemap.xml through the domain owner’s Google Search Console and Bing Webmaster Tools. No ownership verification, indexing submission or ranking guarantee is claimed. Search engines decide when to crawl and index. Canonical tags consolidate the hosting aliases, but redirects and true HTTP 404/private-route headers require host-level support.



Validation covers every generated page, unique titles, canonical/social metadata, JSON-LD, vocabulary counts and sitemap. Check live raw HTML after publication: SPA host rewrites must serve generated route files.



Public content credits AISOD Corpus of Language Data and all its contributors. Original provenance and rights remain in pack metadata and maintainer records.


Installed-app updates activate before offline downloads begin. The controlled app requests saving in the background so a slow download cannot indefinitely delay a published release. Readiness is confirmed only after saving finishes.
