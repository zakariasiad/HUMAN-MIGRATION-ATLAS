"use client";

/* eslint @typescript-eslint/no-explicit-any: off -- Globe.gl exposes an untyped fluent API. */

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowDownRight, ArrowLeftRight, BookOpen, ChevronDown, CircleHelp, Clock3, Compass, Globe2, Layers3, MapPin, Pause, Play, RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { MigrationStory, MigrationLayer } from "@/data/migrations";
import { migrations, layerLabels } from "@/data/migrations";

type GlobeInstance = { (element: HTMLElement): any };
const eras = [
  { value: 70000, label: "70,000 years ago", labelAr: "قبل 70 ألف سنة", description: "Early dispersals beyond Africa", descriptionAr: "الانتشار البشري المبكر خارج إفريقيا" },
  { value: 12000, label: "12,000 years ago", labelAr: "قبل 12 ألف سنة", description: "A changing climate and new lifeways", descriptionAr: "مناخ متغير وأنماط معيشة جديدة" },
  { value: 4000, label: "4,000 years ago", labelAr: "قبل 4 آلاف سنة", description: "Farming, cities, and long-distance networks", descriptionAr: "الزراعة والمدن وشبكات التواصل البعيدة" },
  { value: 500, label: "500 years ago", labelAr: "قبل 500 سنة", description: "Expanding global connections", descriptionAr: "اتساع الروابط العالمية" },
  { value: 0, label: "Today", labelAr: "اليوم", description: "Migration in the contemporary world", descriptionAr: "الهجرة في العالم المعاصر" },
];
const layerOrder: MigrationLayer[] = ["human-origins", "prehistoric", "historical", "modern"];

export default function Home() {
  const globeHost = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [eraIndex, setEraIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeLayers, setActiveLayers] = useState<MigrationLayer[]>(["prehistoric", "historical", "modern"]);
  const [migrationData, setMigrationData] = useState<MigrationStory[]>(migrations);
  const [selected, setSelected] = useState<MigrationStory>(migrations[0]);
  const [query, setQuery] = useState("");
  const [showLayers, setShowLayers] = useState(false);
  const [globeReady, setGlobeReady] = useState(false);
  const ar = language === "ar";
  const era = eras[eraIndex];

  const visibleMigrations = useMemo(() => migrationData.filter((item) => {
    const layerMatch = activeLayers.includes(item.layer);
    const eraValue = era.value;
    const timeMatch = item.periodStart >= eraValue && item.periodEnd <= eraValue;
    const q = query.trim().toLowerCase();
    const searchMatch = !q || [item.title, item.titleAr, item.from.name, item.from.nameAr, item.to.name, item.to.nameAr, item.category].some((s) => s.toLowerCase().includes(q));
    return layerMatch && timeMatch && searchMatch;
  }), [activeLayers, era.value, query, migrationData]);

  useEffect(() => {
    let disposed = false;
    let instance: any;
    const host = globeHost.current;
    if (!host) return;
    import("globe.gl").then((module) => {
      if (disposed || !globeHost.current) return;
      const Globe = (module.default ?? module) as GlobeInstance;
      instance = Globe()(host)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("#65d8d0")
        .atmosphereAltitude(0.18)
        .width(host.clientWidth)
        .height(host.clientHeight)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointAltitude(0.015)
        .pointRadius(0.28)
        .pointLabel((d: any) => `<div style="background:#101923;border:1px solid #38515d;border-radius:10px;padding:10px 12px;color:#eaf6f7;font:12px/1.5 sans-serif"><strong>${d.label}</strong><br/><span style="color:#9db3bd">${d.detail}</span></div>`)
        .arcStartLat((d: any) => d.startLat)
        .arcStartLng((d: any) => d.startLng)
        .arcEndLat((d: any) => d.endLat)
        .arcEndLng((d: any) => d.endLng)
        .arcColor((d: any) => [d.color, d.color])
        .arcAltitude((d: any) => d.altitude ?? 0.22)
        .arcStroke(0.55)
        .arcDashLength(0.45)
        .arcDashGap(0.18)
        .arcDashAnimateTime(2400)
        .onPointClick((d: any) => { const item = migrationData.find((m) => m.id === d.id); if (item) setSelected(item); });
      globeRef.current = instance;
      instance.pointOfView({ lat: 20, lng: 18, altitude: 2.15 }, 0);
      setGlobeReady(true);
      const resize = () => { if (host && instance) instance.width(host.clientWidth).height(host.clientHeight); };
      window.addEventListener("resize", resize);
      (instance as any).__cleanup = () => window.removeEventListener("resize", resize);
    }).catch(() => setGlobeReady(false));
    return () => { disposed = true; if (instance?.__cleanup) instance.__cleanup(); if (instance?._destructor) instance._destructor(); globeRef.current = null; };
  }, []);

  useEffect(() => {
    fetch("/api/migrations")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (Array.isArray(payload?.migrations) && payload.migrations.length > 0) {
          setMigrationData(payload.migrations);
          setSelected((current) => payload.migrations.find((item: MigrationStory) => item.id === current.id) ?? payload.migrations[0]);
        }
      })
      .catch(() => { /* Keep the bundled educational sample available offline. */ });
  }, []);

  useEffect(() => {
    const instance = globeRef.current;
    if (!instance) return;
    const arcs = visibleMigrations.map((m) => ({ startLat:m.from.lat, startLng:m.from.lng, endLat:m.to.lat, endLng:m.to.lng, color:m.color, altitude: m.layer === "modern" ? 0.12 : 0.22, id:m.id }));
    const points = visibleMigrations.flatMap((m) => [
      { lat:m.from.lat, lng:m.from.lng, color:m.color, label: ar ? m.from.nameAr : m.from.name, detail: ar ? m.titleAr : m.title, id:m.id },
      { lat:m.to.lat, lng:m.to.lng, color:m.color, label: ar ? m.to.nameAr : m.to.name, detail: ar ? m.titleAr : m.title, id:m.id },
    ]);
    instance.arcsData(arcs).pointsData(points);
  }, [visibleMigrations, ar, globeReady]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setEraIndex((index) => (index + 1) % eras.length), 3600);
    return () => window.clearInterval(timer);
  }, [playing]);

  const toggleLayer = (layer: MigrationLayer) => setActiveLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]);
  const title = (item: MigrationStory) => ar ? item.titleAr : item.title;
  const area = (item: MigrationStory, side: "from" | "to") => ar ? item[side].nameAr : item[side].name;
  const setEraBySlider = (value: number) => { const nearest = eras.reduce((best, current, index) => Math.abs(current.value - value) < Math.abs(eras[best].value - value) ? index : best, 0); setEraIndex(nearest); };

  return <main className={`app-shell ${ar ? "rtl" : ""}`} dir={ar ? "rtl" : "ltr"}>
    <aside className="rail">
      <div className="brand-mark"><Globe2 size={22}/></div>
      <button className="rail-button active" aria-label="Explore atlas"><Compass size={19}/></button>
      <button className="rail-button" aria-label="Migration layers" onClick={() => setShowLayers((v) => !v)}><Layers3 size={19}/></button>
      <button className="rail-button" aria-label="Research notes" onClick={() => setSelected(migrationData[0] ?? migrations[0])}><BookOpen size={19}/></button>
      <div className="rail-spacer"/>
      <button className="rail-button" aria-label="Help" title="About this prototype"><CircleHelp size={19}/></button>
      <div className="avatar">HA</div>
    </aside>

    <section className="workspace">
      <header className="topbar">
        <div className="crumb"><span>ATLAS</span><span className="crumb-slash">/</span><span>{ar ? "استكشاف الهجرات" : "MIGRATION EXPLORER"}</span></div>
        <div className="top-actions"><span className="live-pill"><span className="live-dot"/> {ar ? "نموذج تفاعلي" : "INTERACTIVE PREVIEW"}</span><button className="language-button" onClick={() => setLanguage(ar ? "en" : "ar")}>{ar ? "EN  English" : "ع  العربية"}</button></div>
      </header>

      <div className="page-heading"><div><div className="eyebrow"><Sparkles size={13}/> {ar ? "أطلس الزمان والمكان" : "A LIVING ATLAS OF TIME & PLACE"}</div><h1>{ar ? "رحلة البشرية" : "Humanity, in motion."}</h1><p>{ar ? "استكشف كيف تحرك البشر عبر الأرض — من الانتشار القديم إلى عالم اليوم." : "Trace the journeys that shaped us, from ancient dispersals to a connected world."}</p></div><div className="heading-stat"><span className="stat-number">300k+</span><span>{ar ? "سنوات من التاريخ البشري" : "YEARS OF HUMAN STORY"}</span></div></div>

      <div className="content-grid">
        <section className="map-panel">
          <div className="map-topline"><div className="map-context"><span className="context-dot"/><span>{ar ? era.labelAr : era.label}</span><ChevronDown size={14}/></div><div className="map-tools"><button className={showLayers ? "tool-button selected" : "tool-button"} onClick={() => setShowLayers((v) => !v)}><SlidersHorizontal size={15}/><span>{ar ? "الطبقات" : "Layers"}</span></button><button className="tool-button" onClick={() => { globeRef.current?.pointOfView({lat:20,lng:18,altitude:2.15},900); }}><RotateCcw size={15}/></button></div></div>
          {showLayers && <div className="layer-popover"><div className="popover-title">{ar ? "طبقات الهجرة" : "VISIBLE LAYERS"}</div>{layerOrder.map((layer) => <label className="layer-option" key={layer}><input type="checkbox" checked={activeLayers.includes(layer)} onChange={() => toggleLayer(layer)}/><span className="layer-swatch" style={{background:layer === "prehistoric" ? "#5ce1c6" : layer === "historical" ? "#a78bfa" : layer === "modern" ? "#fbbf24" : "#60a5fa"}}/><span>{ar ? layerLabels[layer].ar : layerLabels[layer].en}</span></label>)}</div>}
          <div className="globe-stage"><div className="star-field"/><div className="globe-glow"/><div className="globe-host" ref={globeHost}/>{!globeReady && <div className="globe-loading"><div className="loading-ring"/><span>{ar ? "جارٍ تحميل الكرة الأرضية…" : "Preparing the globe…"}</span></div>}<div className="map-caption"><span className="caption-line"/><span>{ar ? "مسارات توضيحية — وليست حدودًا سياسية" : "ILLUSTRATIVE ROUTES · NOT POLITICAL BOUNDARIES"}</span></div><div className="map-legend"><span><i className="legend-dot mint"/> {ar ? "ما قبل التاريخ" : "PREHISTORY"}</span><span><i className="legend-dot violet"/> {ar ? "تاريخية" : "HISTORICAL"}</span><span><i className="legend-dot amber"/> {ar ? "معاصرة" : "CONTEMPORARY"}</span></div></div>
          <div className="timeline"><div className="timeline-header"><div className="timeline-title"><Clock3 size={16}/><span>{ar ? "الخط الزمني" : "TIME NAVIGATOR"}</span></div><div className="timeline-controls"><button className="play-button" onClick={() => setPlaying((v) => !v)} aria-label={playing ? "Pause timeline" : "Play timeline"}>{playing ? <Pause size={14} fill="currentColor"/> : <Play size={14} fill="currentColor"/>}{playing ? (ar ? "إيقاف" : "Pause") : (ar ? "تشغيل الرحلة" : "Play journey")}</button><span className="timeline-date">{ar ? era.labelAr : era.label}</span></div></div><input aria-label="Select historical era" className="era-slider" type="range" min="0" max={eras.length-1} step="1" value={eraIndex} onChange={(e) => setEraIndex(Number(e.target.value))}/><div className="era-ticks">{eras.map((item,index) => <button key={item.value} className={index === eraIndex ? "era-tick current" : "era-tick"} onClick={() => setEraIndex(index)}><span className="tick-dot"/><span>{ar ? item.labelAr : item.label}</span></button>)}</div><div className="era-description">{ar ? era.descriptionAr : era.description}</div></div>
        </section>

        <aside className="insight-column">
          <div className="section-title"><div><span className="eyebrow">{ar ? "مكتبة المسارات" : "FIELD NOTES"}</span><h2>{ar ? "قصص الهجرة" : "Migration stories"}</h2></div><span className="count-badge">{visibleMigrations.length.toString().padStart(2,"0")}</span></div>
          <div className="search-box"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ar ? "ابحث عن منطقة أو هجرة…" : "Search a place or migration…"} /><kbd>/</kbd></div>
          <div className="story-list">{visibleMigrations.length === 0 && <div className="empty-state">{ar ? "لا توجد نتائج لهذه الفترة. جرّب حقبة أخرى أو فعّل طبقة إضافية." : "No stories match this era. Try another time or enable more layers."}</div>}{visibleMigrations.map((item) => <button key={item.id} className={selected.id === item.id ? "story-card selected" : "story-card"} onClick={() => { setSelected(item); globeRef.current?.pointOfView({lat:(item.from.lat+item.to.lat)/2,lng:(item.from.lng+item.to.lng)/2,altitude:1.65},900); }}><span className="story-accent" style={{background:item.color}}/><span className="story-body"><span className="story-category">{ar ? item.categoryAr : item.category}</span><span className="story-name">{title(item)}</span><span className="story-route"><MapPin size={12}/>{area(item,"from")} <ArrowLeftRight size={12}/> {area(item,"to")}</span></span><ArrowDownRight className="story-arrow" size={16}/></button>)}</div>
          <div className="detail-card"><div className="detail-header"><span className="eyebrow">{ar ? "قصة محددة" : "SELECTED JOURNEY"}</span><span className={`confidence confidence-${selected.confidence}`}>{ar ? (selected.confidence === "high" ? "أدلة قوية" : selected.confidence === "medium" ? "أدلة متوسطة" : "أدلة أولية") : (selected.confidence === "high" ? "WELL SUPPORTED" : selected.confidence === "medium" ? "ONGOING RESEARCH" : "EMERGING EVIDENCE")}</span></div><h3>{title(selected)}</h3><p>{ar ? selected.summaryAr : selected.summary}</p><div className="detail-route"><div><span>{ar ? "من" : "ORIGIN"}</span><strong>{area(selected,"from")}</strong></div><ArrowLeftRight size={15}/><div><span>{ar ? "إلى" : "DESTINATION"}</span><strong>{area(selected,"to")}</strong></div></div><div className="evidence-note"><BookOpen size={15}/><div><strong>{ar ? "ملاحظة حول الأدلة" : "Evidence note"}</strong><p>{ar ? selected.evidenceAr : selected.evidence}</p></div></div></div>
          <div className="source-footer"><Activity size={14}/><span>{ar ? "بيانات تجريبية لأغراض العرض — ليست إحصاءات آنية" : "DEMO DATA · NOT LIVE MIGRATION STATISTICS"}</span></div>
        </aside>
      </div>
      <footer className="app-footer"><span>HUMAN MIGRATION ATLAS <span className="footer-sep">·</span> V0.1</span><span>{ar ? "التواريخ والمسارات القديمة تقريبية وقابلة للمراجعة" : "Ancient dates and routes are approximate and revisable."}</span><a href="https://github.com/zakariasiad/HUMAN-MIGRATION-ATLAS" target="_blank" rel="noreferrer">GITHUB ↗</a></footer>
    </section>
  </main>;
}
