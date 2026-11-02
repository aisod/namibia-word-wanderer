import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageMetadata, SEO_IMAGE } from "@/lib/seo";
export function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageMetadata(pathname);
    document.title = page.title;
    const meta = (attribute: string, key: string, value: string) => {
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.appendChild(node); }
      node.content = value;
    };
    meta("name", "description", page.description);
    meta("name", "robots", page.indexable ? "index, follow, max-image-preview:large" : "noindex, follow");
    for (const prefix of ["og", "twitter"]) {
      const attribute = prefix === "og" ? "property" : "name";
      meta(attribute, `${prefix}:title`, page.title); meta(attribute, `${prefix}:description`, page.description);
      meta(attribute, `${prefix}:image`, SEO_IMAGE); meta(attribute, `${prefix}:image:alt`, "NAMQULA — learn languages through play");
    }
    meta("property", "og:url", page.url); meta("property", "og:site_name", "NAMQULA");
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = page.url;
    let schema = document.getElementById("namqula-schema");
    if (!schema) { schema = document.createElement("script"); schema.id = "namqula-schema"; schema.setAttribute("type", "application/ld+json"); document.head.appendChild(schema); }
    schema.textContent = JSON.stringify(page.data);
  }, [pathname]);
  return null;
}
