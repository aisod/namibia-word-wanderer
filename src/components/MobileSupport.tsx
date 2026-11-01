import { useEffect, useState, useRef } from "react";

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: string }>;
}

export function MobileSupport() {
  const [online, setOnline] = useState(navigator.onLine);
  const [status, setStatus] = useState("Preparing offline play…");
  const [install, setInstall] = useState<InstallPrompt | null>(null);
  const [help, setHelp] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const applyingUpdate = useRef(false);
  useEffect(() => {
    const connect = () => setOnline(navigator.onLine);
    const offer = (event: Event) => { event.preventDefault(); setInstall(event as InstallPrompt); };
    const installed = () => { setInstall(null); setHelp(false); };
    window.addEventListener("online", connect); window.addEventListener("offline", connect);
    window.addEventListener("beforeinstallprompt", offer); window.addEventListener("appinstalled", installed);
    return () => { window.removeEventListener("online", connect); window.removeEventListener("offline", connect); window.removeEventListener("beforeinstallprompt", offer); window.removeEventListener("appinstalled", installed); };
  }, []);
  useEffect(() => {
    if (!import.meta.env.PROD) { setStatus("Offline play is available in the published app."); return; }
    if (!("serviceWorker" in navigator)) { setStatus("Offline saving is unavailable in this browser."); return; }
    let cancelled = false;
    const report = (message: string) => { if (!cancelled) setStatus(message); };
    const check = () => {
      const worker = navigator.serviceWorker.controller;
      if (!worker) return;
      const channel = new MessageChannel();
      channel.port1.onmessage = event => { if (event.data?.ready) report("Ready for offline play · all 6 languages saved"); channel.port1.close(); };
      worker.postMessage("OFFLINE_STATUS", [channel.port2]);
    };
    const controllerChanged = () => { if (applyingUpdate.current) window.location.reload(); else check(); };
    navigator.serviceWorker.addEventListener("controllerchange", controllerChanged);
    report("Preparing offline play… Keep this app open and connected.");
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).then(registration => {
      check();
      const watch = (worker: ServiceWorker | null) => worker?.addEventListener("statechange", () => {
        if (worker.state === "redundant") report("Offline download failed. Reconnect and retry.");
        if (worker.state === "installed" && navigator.serviceWorker.controller) { setWaiting(worker); report("A new version is ready when you are."); }
      });
      watch(registration.installing);
      registration.addEventListener("updatefound", () => watch(registration.installing));
      if (registration.waiting) { setWaiting(registration.waiting); report("A new version is ready when you are."); }
    }).catch(() => report("Offline download failed. Reconnect and retry."));
    return () => { cancelled = true; navigator.serviceWorker.removeEventListener("controllerchange", controllerChanged); };
  }, [attempt]);
  const installApp = async () => {
    if (!install) { setHelp(!help); return; }
    try { await install.prompt(); await install.userChoice; } finally { setInstall(null); }
  };
  return <section className="mobile-support" aria-label="Install and offline play">
    <div><strong>{online ? "Take NAMQULA with you" : "You’re offline"}</strong><p role="status">{status}</p>{!online && <p>Saved games work offline. Community and new downloads need internet.</p>}</div>
    {waiting && <button onClick={() => { applyingUpdate.current = true; waiting.postMessage("ACTIVATE_UPDATE"); }}>Update NAMQULA</button>}
    <button onClick={installApp}>{install ? "Install NAMQULA" : "Add to your phone"}</button>
    {status.includes("failed") && <button onClick={() => setAttempt(attempt + 1)}>Retry download</button>}
    {help && <p className="install-help">iPhone: open in Safari, tap Share, then Add to Home Screen and Open as Web App if shown. Android: open the browser menu and choose Install app or Add to Home screen. Open once online and wait for “Ready for offline play”. Keep app storage to retain downloaded words.</p>}
  </section>;
}
