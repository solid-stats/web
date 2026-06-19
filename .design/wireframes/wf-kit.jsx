/* wf-kit.jsx — low-fi wireframe primitives, DARK gunmetal.
   Deliberately low fidelity (handwritten labels via Caveat, grey placeholder
   bars) so the conversation stays about STRUCTURE, not final pixels — but on a
   dark surface to reflect the dark-first product. Same component API as before.
   All components exported to window. */

const WF = {
  // ink scale (gunmetal, blue-tinted)
  page:   '#0d1217',   // deepest backdrop (bg-0)
  bar:    '#121922',   // sticky bars (bg-1)
  panel:  '#19212b',   // cards (surface-1)
  panel2: '#212b36',   // table headers / inputs (surface-2)
  panel3: '#27323e',   // hover/active (surface-3)
  line:   '#2d3946',   // hairline (border-1)
  line2:  '#3c4b59',   // emphasized (border-2)
  ink:    '#e7edf3',   // fg-1
  sub:    '#9aa7b4',   // fg-2
  faint:  '#697682',   // fg-3
  fill:   '#2a3540',   // placeholder bar fill
  fillHi: '#34404c',
  // one signal accent — cyan
  accent: '#36C5E0',
  accentWash:'rgba(54,197,224,0.14)',
  // semantics
  win:    '#4ecb86', winWash:'rgba(78,203,134,0.15)',
  loss:   '#e56a5c', lossWash:'rgba(229,106,92,0.15)',
  amber:  '#e3aa3e', amberWash:'rgba(227,170,62,0.15)',
  info:   '#6ba8ef',
  hand:   '"Caveat", "Segoe Print", cursive',
  mono:   '"IBM Plex Mono", ui-monospace, monospace',
};

function wfBox(extra = {}) {
  return {
    border: `1.4px solid ${WF.line}`,
    borderRadius: '9px 7px 10px 8px',   // slightly irregular = sketchy
    background: WF.panel,
    boxSizing: 'border-box',
    ...extra,
  };
}

function Hand({ children, size = 18, weight = 600, color = WF.ink, caps = false, style = {} }) {
  return (
    <span style={{
      fontFamily: WF.hand, fontSize: size, fontWeight: weight, color,
      lineHeight: 1.05, letterSpacing: caps ? '0.05em' : '0',
      textTransform: caps ? 'uppercase' : 'none', ...style,
    }}>{children}</span>
  );
}

function Mono({ children, size = 13, weight = 500, color = WF.ink, style = {} }) {
  return (
    <span style={{
      fontFamily: WF.mono, fontSize: size, fontWeight: weight, color,
      fontVariantNumeric: 'tabular-nums', lineHeight: 1, ...style,
    }}>{children}</span>
  );
}

function Bar({ w = 60, h = 8, style = {} }) {
  return <span style={{ display: 'inline-block', width: w, height: h, borderRadius: h, background: WF.fill, ...style }} />;
}

function Thumb({ s = 26, round = false, label }) {
  return (
    <span style={{
      width: s, height: s, flex: `0 0 ${s}px`, display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center',
      border: `1.3px solid ${WF.line2}`, borderRadius: round ? '50%' : 5,
      background: WF.panel2, color: WF.sub, position: 'relative', overflow: 'hidden',
    }}>
      {label
        ? <Hand size={s * 0.5} weight={700} color={WF.sub}>{label}</Hand>
        : <svg width={s} height={s} style={{ position: 'absolute', inset: 0, opacity: .3 }}>
            <line x1="2" y1="2" x2={s - 2} y2={s - 2} stroke={WF.sub} strokeWidth="1" />
            <line x1={s - 2} y1="2" x2="2" y2={s - 2} stroke={WF.sub} strokeWidth="1" />
          </svg>}
    </span>
  );
}

function Badge({ kind = 'neutral', children, glyph, style = {} }) {
  const map = {
    win:    [WF.win, WF.winWash],
    loss:   [WF.loss, WF.lossWash],
    amber:  [WF.amber, WF.amberWash],
    accent: [WF.accent, WF.accentWash],
    neutral:[WF.sub, 'rgba(154,167,180,0.12)'],
  };
  const [fg, bg] = map[kind] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 3, background: bg,
      border: `1px solid ${fg}`, color: fg,
      fontFamily: WF.mono, fontSize: 10.5, fontWeight: 600, lineHeight: 1.4,
      letterSpacing: '0.02em', whiteSpace: 'nowrap', ...style,
    }}>{glyph && <b style={{ fontFamily: WF.hand, fontSize: 13, fontWeight: 700 }}>{glyph}</b>}{children}</span>
  );
}

function Delta({ v, dir = 'up' }) {
  const up = dir === 'up';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: up ? WF.win : WF.loss }}>
      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d={up ? 'M2 6l2.5-3L7 6' : 'M2 3l2.5 3L7 3'} />
      </svg>
      <Mono size={11} color="currentColor">{v}</Mono>
    </span>
  );
}

function Field({ children, w = 200, accent = false, caret = false, style = {} }) {
  return (
    <span style={wfBox({
      display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 8, width: w, padding: '7px 10px', borderRadius: 4,
      borderColor: accent ? WF.accent : WF.line2,
      background: accent ? WF.accentWash : WF.panel2,
      ...style,
    })}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>{children}</span>
      {caret && <span style={{ color: accent ? WF.accent : WF.sub, fontSize: 11 }}>▾</span>}
    </span>
  );
}

function Btn({ children, primary = false, w, style = {} }) {
  return (
    <span style={wfBox({
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 4,
      width: w, justifyContent: 'center',
      background: primary ? WF.accent : WF.panel2,
      borderColor: primary ? WF.accent : WF.line2,
      ...style,
    })}>
      <Hand size={16} weight={600} color={primary ? WF.page : WF.ink}>{children}</Hand>
    </span>
  );
}

function Brand({ size = 18, color = WF.ink }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
      <span style={{
        width: size + 3, height: size + 3, border: `2px solid ${color}`, borderRadius: 4,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ width: 5, height: 5, background: WF.accent, borderRadius: '50%' }} />
      </span>
      <Hand size={size} weight={700} caps color={color} style={{ letterSpacing: '0.1em' }}>Solid Stats</Hand>
    </span>
  );
}

function Overline({ children, style = {} }) {
  return (
    <span style={{
      fontFamily: WF.mono, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: WF.faint, ...style,
    }}>{children}</span>
  );
}

function Spark({ w = 70, h = 20, color = WF.accent }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={`M2 ${h-4} L${w*0.18} ${h*0.55} L${w*0.34} ${h*0.7} L${w*0.5} ${h*0.3} L${w*0.66} ${h*0.45} L${w*0.82} ${h*0.18} L${w-2} 4`} />
    </svg>
  );
}

// callout pin — explains a wireframe decision (yellow sticky look)
function Pin({ children, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px',
      background: 'rgba(227,170,62,0.12)', border: `1px dashed ${WF.amber}`,
      borderRadius: 3, ...style,
    }}>
      <Hand size={13} color={WF.amber}>{children}</Hand>
    </span>
  );
}

Object.assign(window, { WF, wfBox, Hand, Mono, Bar, Thumb, Badge, Delta, Field, Btn, Brand, Overline, Spark, Pin });
