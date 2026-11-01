import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Home, Users, Monitor, Smartphone, ArrowLeft } from "lucide-react";
import { MobileSupport } from "./MobileSupport";
import { getLocalLanguage } from "@/data/languageCatalog";
import "@/app-shell.css";

function readTVMode() { try { return localStorage.getItem("namqula-tv") === "true"; } catch { return false; } }
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation(); const navigate = useNavigate();
  const [tv, setTV] = useState(readTVMode);
  const admin = location.pathname.startsWith("/admin");
  const game = location.pathname.startsWith("/games/");
  const course = getLocalLanguage(location.pathname.split("/")[2]);
  useEffect(() => {
    document.documentElement.dataset.displayMode = tv ? "tv" : "adaptive";
    try { localStorage.setItem("namqula-tv", String(tv)); } catch { /* Storage is optional. */ }
    return () => { delete document.documentElement.dataset.displayMode; };
  }, [tv]);
  useEffect(() => {
    if (course?.isAvailable) { try { localStorage.setItem("namqula-last-language", course.slug); } catch { /* Storage is optional. */ } }
  }, [course]);
  useEffect(() => {
    if (!tv) return;
    const move = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const active = document.activeElement as HTMLElement | null;
      if (active?.matches("input,textarea,select,[contenteditable=true]")) return;
      if (event.key === "Escape" || event.key === "BrowserBack") { event.preventDefault(); navigate("/"); return; }
      if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
      const candidates = Array.from(document.querySelectorAll<HTMLElement>("a[href],button:not(:disabled),[role=button][tabindex='0']")).filter(el => el.getClientRects().length && !el.closest("[aria-hidden=true]"));
      if (!candidates.length) return;
      if (!active || !candidates.includes(active)) { event.preventDefault(); candidates[0].focus(); return; }
      const origin = active.getBoundingClientRect(); const ox=origin.x+origin.width/2, oy=origin.y+origin.height/2;
      const direction=event.key; let best: HTMLElement | undefined; let score=Infinity;
      for (const candidate of candidates) {
        if (candidate===active) continue;
        const box=candidate.getBoundingClientRect(); const dx=box.x+box.width/2-ox, dy=box.y+box.height/2-oy;
        const forward=direction==="ArrowRight"?dx:direction==="ArrowLeft"?-dx:direction==="ArrowDown"?dy:-dy;
        const cross=direction==="ArrowRight"||direction==="ArrowLeft"?Math.abs(dy):Math.abs(dx);
        const distance=forward+cross*3;
        if (forward>2 && distance<score) { best=candidate; score=distance; }
      }
      if (best) { event.preventDefault(); best.focus(); best.scrollIntoView({block:"nearest",inline:"nearest",behavior:"auto"}); }
    };
    document.addEventListener("keydown",move);
    return () => document.removeEventListener("keydown",move);
  }, [tv, navigate, location.pathname]);
  useEffect(() => { if (location.hash === "#languages") document.getElementById("languages")?.scrollIntoView({block: "start"}); }, [location.pathname, location.hash]);
  const links=[{to:"/",label:"Learn",icon:Home},{to:"/#languages",label:"Languages",icon:BookOpen},{to:"/community",label:"Community",icon:Users}];
  if (admin) return <>{children}</>;
  return <div className={`app-shell ${game ? "is-game" : ""}`}>
    <a className="skip-link" href="#app-content">Skip to content</a>
    <aside className="app-rail" aria-label="Main navigation">
      <Link className="app-brand" to="/"><img src="/logo.webp" alt=""/><span>NAMQULA<small>Learn through play</small></span></Link>
      <nav>{links.map(({to,label,icon:Icon})=><Link key={label} to={to} aria-current={(to==="/community"?location.pathname.startsWith(to):to==="/"&&location.pathname==="/")?"page":undefined}><Icon aria-hidden="true"/><span>{label}</span></Link>)}</nav>
      <button className="display-toggle" onClick={()=>setTV(!tv)} aria-pressed={tv}>{tv?<Smartphone/>:<Monitor/>}<span>{tv?"Standard display":"TV / remote mode"}</span></button>
      <p className="rail-note">{tv?"Use arrow keys to move. Press OK / Enter to select.":"Your language. Your pace."}</p>
    </aside>
    <header className="app-topbar">
      {location.pathname!=="/"?<button onClick={()=>navigate(game?`/language/${course?.slug??"oshikwanyama"}`:"/")} aria-label="Back"><ArrowLeft/></button>:<img src="/logo.webp" alt="NAMQULA"/>}
      <span>{course?.name??"NAMQULA"}</span>
      <button onClick={()=>setTV(!tv)} aria-pressed={tv} aria-label={tv?"Use standard display":"Use TV and remote display"}><Monitor/></button>
    </header>
    <main id="app-content" className="app-content" tabIndex={-1}><MobileSupport />{children}<footer className="corpus-credit"><a href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">AISOD Corpus of Language Data</a><p>With thanks to all its contributors. Preserving our languages, cultures and knowledge together.</p><a href="https://corpus.aisod.tech" target="_blank" rel="noopener noreferrer">Help grow the corpus</a></footer></main>
    <nav className="app-bottom-nav" aria-label="Main navigation">{links.map(({to,label,icon:Icon})=><Link key={label} to={to} aria-current={(to==="/community"?location.pathname.startsWith(to):to==="/"&&location.pathname==="/")?"page":undefined}><Icon aria-hidden="true"/><span>{label}</span></Link>)}</nav>
  </div>;
}
