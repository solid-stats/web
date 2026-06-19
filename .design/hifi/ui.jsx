/* Solid Stats UI kit — primitives. Exports to window for cross-file use. */
const { useState, useMemo, useEffect, useRef } = React;

/* ---- Icon: render Lucide SVG directly from icon node data (no createIcons) ---- */
function lucidePascal(name) {
  return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function iconSvg(name, size, stroke) {
  const L = window.lucide;
  const node = L && L.icons && L.icons[lucidePascal(name)];
  if (!node) return '';
  const kids = node.map(([tag, attrs]) =>
    '<' + tag + ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') + '></' + tag + '>'
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
}
function Icon({ name, size = 18, stroke = 2, className, style }) {
  const html = useMemo(() => iconSvg(name, size, stroke), [name, size, stroke]);
  return <span className={className} style={{ display: 'inline-flex', lineHeight: 0, ...style }} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* ---- Brand mark (HUD reticle) ---- */
function BrandMark({ size = 22 }) {
  return (
    <svg className="mark" width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect className="bar-out" x="4" y="4" width="28" height="28" rx="4" strokeWidth="2.6" />
      <rect className="bar dim" x="10" y="20" width="4" height="6" rx="1" />
      <rect className="bar" x="16" y="15" width="4" height="11" rx="1" />
      <rect className="bar" x="22" y="10" width="4" height="16" rx="1" />
    </svg>
  );
}
function Brand({ onClick }) {
  return (
    <div className="brand" onClick={onClick}>
      <BrandMark />
      <span className="wm">Solid<span className="thin">Stats</span></span>
    </div>
  );
}

/* ---- Button ---- */
function Button({ variant = 'secondary', size, icon, children, className = '', ...rest }) {
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}${!children ? ' btn-icon' : ''} ${className}`;
  return (
    <button className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

/* ---- Badge ---- */
const OUTCOME = {
  win: { cls: 'b-win', icon: 'check', label: 'Win' },
  loss: { cls: 'b-loss', icon: 'x', label: 'Loss' },
  unknown: { cls: 'b-warn', icon: 'circle-help', label: 'Unknown' },
  parsed: { cls: 'b-win', icon: 'check', label: 'Parsed' },
  parsing: { cls: 'b-info', icon: 'loader', label: 'Parsing' },
  failed: { cls: 'b-loss', icon: 'triangle-alert', label: 'Failed' },
  pending: { cls: 'b-neutral', icon: 'clock', label: 'Pending' },
  approved: { cls: 'b-win', icon: 'badge-check', label: 'Approved' },
  rejected: { cls: 'b-loss', icon: 'x-circle', label: 'Rejected' },
  conflict: { cls: 'b-warn', icon: 'triangle-alert', label: 'Conflict' },
};
function Badge({ kind, children, icon, cls }) {
  const p = OUTCOME[kind];
  if (p) return <span className={`badge ${p.cls}`}><Icon name={p.icon} />{children || p.label}</span>;
  return <span className={`badge ${cls || 'b-neutral'}`}>{icon && <Icon name={icon} />}{children}</span>;
}

/* ---- Stat tile ---- */
function Tile({ icon, label, value, delta, dir }) {
  return (
    <div className="tile">
      <div className="k">{icon && <Icon name={icon} size={14} />}{label}</div>
      <div className="v">{value}</div>
      {delta && <div className={`d ${dir || ''}`}>{dir && <Icon name={dir === 'up' ? 'trending-up' : 'trending-down'} size={12} />}{delta}</div>}
    </div>
  );
}

/* ---- Tabs ---- */
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(t => (
        <div key={t.id} role="tab" aria-selected={active === t.id} tabIndex={0}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(t.id); } }}>
          {t.icon && <Icon name={t.icon} size={15} />}{t.label}
        </div>
      ))}
    </div>
  );
}

/* ---- Avatar (monogram; swap for image-slot when real assets exist) ---- */
function Avatar({ name, lg }) {
  const initials = (name || '?').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase();
  return <span className={`avatar${lg ? ' lg' : ''}`}>{initials}</span>;
}

/* ---- Sparkline ---- */
function Sparkline({ points, color = 'var(--chart-1)', w = 160, h = 34 }) {
  const max = Math.max(...points), min = Math.min(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i * step},${h - ((p - min) / span) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2" points={d} />
    </svg>
  );
}

/* ---- Provenance line ---- */
function Provenance({ children = 'Up to date · updated 4 min ago', live = true, tone }) {
  return <span className={`prov${tone ? ' prov-' + tone : ''}`}>{live && <span className="dot" />}{children}</span>;
}

/* ---- Tier pip meter (shared by Overview score cells + profile) ---- */
function Pips({ tier }) {
  const lvl = (window.SS_TIER && window.SS_TIER.level[tier]) || 0;
  return (
    <span className="pips" aria-hidden="true">
      {[1, 2, 3, 4].map(i => <i key={i} className={i <= lvl ? 'on' : ''} />)}
    </span>
  );
}

/* ---- Freshness indicator (live data-trust state, DS vocabulary) ----
   Up to date · Stale · Offline · Reconnecting — shared across pages. */
function Freshness({ t, state = 'ok', mins = 4 }) {
  const map = {
    ok:      { cls: 'ok',    icon: 'circle',     label: t('fresh_ok'),      meta: t('fresh_ago',   { n: mins }) },
    stale:   { cls: 'stale', icon: 'clock',      label: t('fresh_stale'),   meta: t('fresh_ago',   { n: 38 }) },
    offline: { cls: 'off',   icon: 'wifi-off',   label: t('fresh_offline'), meta: t('fresh_cache', { n: 9 }) },
    recon:   { cls: 'recon', icon: 'refresh-cw', label: t('fresh_recon'),   meta: null },
  };
  const s = map[state] || map.ok;
  return (
    <span className={`fresh-pill fresh-${s.cls}`} role="status">
      {s.cls === 'ok'
        ? <span className="fresh-dot" />
        : <Icon name={s.icon} size={13} className={s.cls === 'recon' ? 'spin' : ''} />}
      <span className="fresh-label">{s.label}</span>
      {s.meta && <span className="fresh-meta">· {s.meta}</span>}
    </span>
  );
}

Object.assign(window, { useState, useMemo, useEffect, useRef, Icon, BrandMark, Brand, Button, Badge, Tile, Tabs, Avatar, Sparkline, Provenance, Pips, Freshness, OUTCOME });
