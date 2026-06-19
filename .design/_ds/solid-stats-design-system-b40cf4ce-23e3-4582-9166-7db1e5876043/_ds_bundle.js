/* @ds-bundle: {"format":3,"namespace":"SolidStatsDesignSystem_b40cf4","components":[],"sourceHashes":{"assets/image-slot.js":"cf5f1791dd04","ui_kits/web/app.jsx":"13a6a484bb42","ui_kits/web/data.js":"6905e3049edc","ui_kits/web/screens-public.jsx":"90b5bd2836a8","ui_kits/web/screens-staff.jsx":"d355c0b9b49d","ui_kits/web/shell.jsx":"da4bc4fe79c6","ui_kits/web/ui.jsx":"2c9aa050dad5"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SolidStatsDesignSystem_b40cf4 = window.SolidStatsDesignSystem_b40cf4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/image-slot.js
try { (() => {
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/image-slot.js", error: String((e && e.message) || e) }); }

// ui_kits/web/app.jsx
try { (() => {
/* Solid Stats UI kit — app controller. */

function App() {
  const [route, setRoute] = useState({
    name: 'overview',
    params: {}
  });
  const [lang, setLang] = useState('EN');
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name, route.params.slug, route.params.id]);
  const go = (name, params = {}) => setRoute({
    name,
    params
  });
  const onRequest = seed => setModal(seed || {});
  const login = () => setUser({
    name: 'You',
    role: 'moderator'
  });
  let screen;
  switch (route.name) {
    case 'player':
      screen = /*#__PURE__*/React.createElement(PlayerProfile, {
        slug: route.params.slug,
        go: go,
        onRequest: onRequest
      });
      break;
    case 'replay':
      screen = /*#__PURE__*/React.createElement(ReplayDetail, {
        id: route.params.id,
        go: go,
        onRequest: onRequest
      });
      break;
    case 'queue':
      screen = user ? /*#__PURE__*/React.createElement(ModeratorQueue, {
        go: go
      }) : /*#__PURE__*/React.createElement(SignInWall, {
        login: login
      });
      break;
    case 'request':
      screen = user ? /*#__PURE__*/React.createElement(RequestDetail, {
        id: route.params.id,
        go: go
      }) : /*#__PURE__*/React.createElement(SignInWall, {
        login: login
      });
      break;
    case 'players':
    case 'squads':
    case 'bounty':
    case 'commanders':
    case 'replays':
      screen = /*#__PURE__*/React.createElement(ListStub, {
        name: route.name,
        go: go
      });
      break;
    default:
      screen = /*#__PURE__*/React.createElement(StatsOverview, {
        go: go
      });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(TopNav, {
    route: route,
    go: go,
    lang: lang,
    setLang: setLang,
    user: user,
    onLogin: login,
    onLogout: () => {
      setUser(null);
      go('overview');
    }
  }), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, screen), /*#__PURE__*/React.createElement(Footer, null), /*#__PURE__*/React.createElement(MobileTabBar, {
    route: route,
    go: go,
    user: user,
    onLogin: login
  }), modal && /*#__PURE__*/React.createElement(RequestModal, {
    seed: modal,
    user: user,
    onLogin: login,
    onClose: () => setModal(null)
  }));
}
function SignInWall({
  login
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      maxWidth: 460,
      paddingTop: 40,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar lg",
    style: {
      margin: '0 auto',
      background: 'var(--surface-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 24
  })), /*#__PURE__*/React.createElement("h1", {
    className: "page-title",
    style: {
      marginTop: 14
    }
  }, "Staff area"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub"
  }, "Moderator or admin role required. Sign in with Steam to continue."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn steam",
    onClick: login
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gamepad-2",
    size: 16
  }), "Sign in with Steam")));
}

/* Honest stub for list surfaces not fully built — labels what it represents. */
function ListStub({
  name,
  go
}) {
  const map = {
    players: {
      icon: 'user',
      t: 'Players',
      d: 'Searchable, server-driven player list (10k–100k rows) with the same dense table + filters shown on Overview.'
    },
    squads: {
      icon: 'users',
      t: 'Squads',
      d: 'Squad list + profiles with membership timelines and effectiveness inputs.'
    },
    bounty: {
      icon: 'target',
      t: 'Bounty leaderboards',
      d: 'Per-rotation bounty rankings with formula breakdown.'
    },
    commanders: {
      icon: 'shield',
      t: 'Commander-side stats',
      d: 'KS games, wins/losses, and filterable unknown legacy outcomes.'
    },
    replays: {
      icon: 'film',
      t: 'Replays',
      d: 'Indexable replay catalog — see a built example via any replay row on Overview.'
    }
  };
  const m = map[name];
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, m.t), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, m.d)), /*#__PURE__*/React.createElement(Provenance, null)), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      color: 'var(--fg-2)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: m.icon,
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "This surface shares the Overview table pattern. Open a ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--primary)'
    },
    onClick: () => go('overview'),
    href: "#"
  }, "player"), " or ", /*#__PURE__*/React.createElement("a", {
    style: {
      color: 'var(--primary)'
    },
    onClick: () => go('replay', {
      id: '48213'
    }),
    href: "#"
  }, "replay"), " to see a fully built screen.")));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/data.js
try { (() => {
/* Sample data for the Solid Stats web UI kit. All fictional. */
window.SS_DATA = function () {
  const players = [{
    slug: 'vasiliy',
    name: 'Vasiliy',
    squad: '7th Guards',
    kills: 1284,
    deaths: 312,
    kd: 4.11,
    tk: 12,
    bounty: 14208,
    steam: '••••3071',
    nicks: 3,
    outcome: 'win'
  }, {
    slug: 'strelok',
    name: 'Strelok',
    squad: 'Vympel',
    kills: 1102,
    deaths: 291,
    kd: 3.78,
    tk: 8,
    bounty: 12940,
    steam: '••••8842',
    nicks: 2,
    outcome: 'win'
  }, {
    slug: 'prizrak',
    name: 'Призрак',
    squad: null,
    kills: 988,
    deaths: 1073,
    kd: 0.92,
    tk: 31,
    bounty: 9415,
    steam: '••••1190',
    nicks: 5,
    outcome: 'unknown'
  }, {
    slug: 'kobra',
    name: 'Kobra',
    squad: 'Vympel',
    kills: 944,
    deaths: 402,
    kd: 2.35,
    tk: 4,
    bounty: 8820,
    steam: '••••2204',
    nicks: 1,
    outcome: 'win'
  }, {
    slug: 'ghost-9',
    name: 'Ghost_9',
    squad: '7th Guards',
    kills: 901,
    deaths: 510,
    kd: 1.77,
    tk: 19,
    bounty: 8110,
    steam: '••••6677',
    nicks: 4,
    outcome: 'loss'
  }, {
    slug: 'medved',
    name: 'Медведь',
    squad: 'Iron Wolves',
    kills: 870,
    deaths: 366,
    kd: 2.38,
    tk: 6,
    bounty: 7995,
    steam: '••••0455',
    nicks: 2,
    outcome: 'win'
  }, {
    slug: 'sokol',
    name: 'Sokol',
    squad: 'Iron Wolves',
    kills: 812,
    deaths: 489,
    kd: 1.66,
    tk: 11,
    bounty: 7240,
    steam: '••••3318',
    nicks: 1,
    outcome: 'loss'
  }, {
    slug: 'viper',
    name: 'Viper',
    squad: 'Vympel',
    kills: 760,
    deaths: 320,
    kd: 2.38,
    tk: 2,
    bounty: 6980,
    steam: '••••7701',
    nicks: 2,
    outcome: 'win'
  }];
  const squads = [{
    slug: '7th-guards',
    name: '7th Guards',
    tag: '7GD',
    members: 24,
    kills: 9840,
    kd: 2.71,
    eff: 1.34,
    bounty: 58210
  }, {
    slug: 'vympel',
    name: 'Vympel',
    tag: 'VYM',
    members: 19,
    kills: 8720,
    kd: 2.55,
    eff: 1.28,
    bounty: 51400
  }, {
    slug: 'iron-wolves',
    name: 'Iron Wolves',
    tag: 'IRW',
    members: 21,
    kills: 7110,
    kd: 2.02,
    eff: 1.11,
    bounty: 44980
  }, {
    slug: 'nightjar',
    name: 'Nightjar',
    tag: 'NJR',
    members: 16,
    kills: 5240,
    kd: 1.74,
    eff: 0.98,
    bounty: 33120
  }];
  const replays = [{
    id: '48213',
    mission: 'Op. Northwind',
    map: 'Chernarus',
    date: '2026-05-28',
    rotation: 14,
    players: 64,
    status: 'parsed',
    kills: 412,
    ks_a: 'Vasiliy',
    ks_b: 'Strelok',
    winner: 'WEST'
  }, {
    id: '48198',
    mission: 'Op. Iron Veil',
    map: 'Takistan',
    date: '2026-05-26',
    rotation: 14,
    players: 58,
    status: 'parsed',
    kills: 388,
    ks_a: 'Kobra',
    ks_b: 'Medved',
    winner: 'unknown'
  }, {
    id: '48171',
    mission: 'Op. Red Dawn',
    map: 'Altis',
    date: '2026-05-24',
    rotation: 14,
    players: 60,
    status: 'parsing',
    kills: 0,
    ks_a: '—',
    ks_b: '—',
    winner: 'unknown'
  }, {
    id: '48150',
    mission: 'Op. Cold Harbor',
    map: 'Livonia',
    date: '2026-05-22',
    rotation: 13,
    players: 52,
    status: 'failed',
    kills: 0,
    ks_a: '—',
    ks_b: '—',
    winner: 'unknown'
  }];
  const events = [{
    t: '04:12.8',
    type: 'kill',
    actor: 'Vasiliy',
    victim: 'Призрак',
    side: 'WEST → EAST',
    vehicle: false
  }, {
    t: '06:55.1',
    type: 'kill',
    actor: 'Strelok',
    victim: 'Ghost_9',
    side: 'EAST → WEST',
    vehicle: true
  }, {
    t: '08:30.4',
    type: 'teamkill',
    actor: 'Призрак',
    victim: 'Sokol',
    side: 'EAST → EAST',
    vehicle: false
  }, {
    t: '11:02.7',
    type: 'kill',
    actor: 'Kobra',
    victim: 'Medved',
    side: 'WEST → EAST',
    vehicle: false
  }, {
    t: '12:48.0',
    type: 'kill',
    actor: 'Viper',
    victim: 'Vasiliy',
    side: 'EAST → WEST',
    vehicle: false
  }, {
    t: '15:21.3',
    type: 'teamkill',
    actor: 'Ghost_9',
    victim: 'Vasiliy',
    side: 'WEST → WEST',
    vehicle: false
  }];
  const requests = [{
    id: '4471',
    type: 'Add kills',
    reqType: 'kills',
    who: 'Vasiliy',
    entity: 'Replay #48213',
    age: '2h',
    priority: 'high',
    status: 'pending'
  }, {
    id: '4469',
    type: 'Identity',
    reqType: 'identity',
    who: 'Призрак',
    entity: 'Player · Призрак',
    age: '5h',
    priority: 'med',
    status: 'pending'
  }, {
    id: '4465',
    type: 'Commander dispute',
    reqType: 'commander',
    who: 'Kobra',
    entity: 'Replay #48198',
    age: '1d',
    priority: 'high',
    status: 'pending'
  }, {
    id: '4460',
    type: 'Remove teamkill',
    reqType: 'teamkills',
    who: 'Sokol',
    entity: 'Replay #48213',
    age: '1d',
    priority: 'low',
    status: 'pending'
  }, {
    id: '4452',
    type: 'Remove from replay',
    reqType: 'remove',
    who: 'Viper',
    entity: 'Replay #48150',
    age: '2d',
    priority: 'med',
    status: 'approved'
  }, {
    id: '4448',
    type: 'Identity',
    reqType: 'identity',
    who: 'Ghost_9',
    entity: 'Player · Ghost_9',
    age: '3d',
    priority: 'low',
    status: 'rejected'
  }];
  const rotations = [{
    r: 14,
    label: 'Rotation 14',
    range: 'May 12 – Jun 9',
    kills: 412,
    kd: 4.11,
    bounty: 3120
  }, {
    r: 13,
    label: 'Rotation 13',
    range: 'Apr 14 – May 11',
    kills: 388,
    kd: 3.42,
    bounty: 2890
  }, {
    r: 12,
    label: 'Rotation 12',
    range: 'Mar 17 – Apr 13',
    kills: 301,
    kd: 2.98,
    bounty: 2410
  }, {
    r: 11,
    label: 'Rotation 11',
    range: 'Feb 18 – Mar 16',
    kills: 277,
    kd: 3.10,
    bounty: 2180
  }];
  const nickHistory = [{
    nick: 'Vasiliy',
    from: '2025-11',
    to: 'present',
    src: 'replay #48213'
  }, {
    nick: 'Vasya_77',
    from: '2025-04',
    to: '2025-11',
    src: 'replay #41002'
  }, {
    nick: 'V.',
    from: '2024-09',
    to: '2025-04',
    src: 'manual · moderator'
  }];
  const squadHistory = [{
    squad: '7th Guards',
    from: '2025-06',
    to: 'present'
  }, {
    squad: 'Nightjar',
    from: '2024-10',
    to: '2025-06'
  }, {
    squad: 'unknown gap',
    from: '2024-07',
    to: '2024-10',
    gap: true
  }];
  return {
    players,
    squads,
    replays,
    events,
    requests,
    rotations,
    nickHistory,
    squadHistory
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/data.js", error: String((e && e.message) || e) }); }

// ui_kits/web/screens-public.jsx
try { (() => {
/* Solid Stats UI kit — public screens: Overview, Player profile, Replay detail. */
const D = window.SS_DATA;
function RotationPill() {
  const [r, setR] = useState(14);
  return /*#__PURE__*/React.createElement("button", {
    className: "selpill",
    onClick: () => setR(r === 14 ? 13 : 14)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "repeat",
    size: 15
  }), "Rotation ", r, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 15
  }));
}
function DensityToggle({
  density,
  setDensity
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "seg",
    role: "group",
    "aria-label": "Row density"
  }, /*#__PURE__*/React.createElement("button", {
    className: density === 'compact' ? 'on' : '',
    onClick: () => setDensity('compact')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rows-3",
    size: 14
  }), "Compact"), /*#__PURE__*/React.createElement("button", {
    className: density === 'comfortable' ? 'on' : '',
    onClick: () => setDensity('comfortable')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "rows-2",
    size: 14
  }), "Comfortable"));
}

/* ---------------- Stats Overview ---------------- */
function StatsOverview({
  go
}) {
  const [density, setDensity] = useState('compact');
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Overview"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "SolidGames operational statistics \xB7 Rotation 14 \xB7 May 12 \u2013 Jun 9")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement(Provenance, null), /*#__PURE__*/React.createElement(RotationPill, null), /*#__PURE__*/React.createElement(DensityToggle, {
    density: density,
    setDensity: setDensity
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tiles"
  }, /*#__PURE__*/React.createElement(Tile, {
    icon: "user",
    label: "Players",
    value: "3,182",
    delta: "+41",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "film",
    label: "Replays parsed",
    value: "23,456",
    delta: "+18",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "crosshair",
    label: "Kills \xB7 rotation",
    value: "118,204",
    delta: "+6.2%",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "users",
    label: "Active squads",
    value: "1,204",
    delta: "\u22123",
    dir: "down"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid-2 section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy"
  }), "Top players"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-right",
    onClick: () => go('players')
  }, "All players")), /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", {
    className: `tbl${density === 'compact' ? ' compact' : ''}`
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "#"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Player"), /*#__PURE__*/React.createElement("th", null, "Kills"), /*#__PURE__*/React.createElement("th", null, "K/D"), /*#__PURE__*/React.createElement("th", null, "Bounty"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Last"))), /*#__PURE__*/React.createElement("tbody", null, D.players.map((p, i) => /*#__PURE__*/React.createElement("tr", {
    key: p.slug,
    onClick: () => go('player', {
      slug: p.slug
    })
  }, /*#__PURE__*/React.createElement("td", {
    className: `l rank${i < 3 ? ' top' : ''}`
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cell-id"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nm"
  }, p.name), /*#__PURE__*/React.createElement("span", {
    className: "sub"
  }, p.squad || '— no squad'))), /*#__PURE__*/React.createElement("td", null, p.kills.toLocaleString('en-US')), /*#__PURE__*/React.createElement("td", {
    className: p.kd >= 1 ? 'pos' : 'neg'
  }, p.kd.toFixed(2)), /*#__PURE__*/React.createElement("td", null, p.bounty.toLocaleString('en-US')), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, p.outcome === 'unknown' ? /*#__PURE__*/React.createElement(Badge, {
    kind: "unknown"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.outcome === 'win' ? 'var(--win)' : 'var(--loss)'
    }
  }, p.outcome === 'win' ? '▲ W' : '▼ L')))))))), /*#__PURE__*/React.createElement("div", {
    className: "grid-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "users"
  }), "Top squads")), /*#__PURE__*/React.createElement("div", {
    className: "card-pad partlist",
    style: {
      padding: 8
    }
  }, D.squads.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "part",
    key: s.slug,
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('squads')
  }, /*#__PURE__*/React.createElement("span", {
    className: "idchip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rank top mono"
  }, i + 1), /*#__PURE__*/React.createElement(Avatar, {
    name: s.tag
  }), /*#__PURE__*/React.createElement("b", null, s.name)), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, s.kills.toLocaleString('en-US'), " k \xB7 eff ", s.eff.toFixed(2)))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "shield"
  }), "Commander-side")), /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("dl", {
    className: "kvs"
  }, /*#__PURE__*/React.createElement("dt", null, "Games (rotation)"), /*#__PURE__*/React.createElement("dd", null, "214"), /*#__PURE__*/React.createElement("dt", null, "WEST wins"), /*#__PURE__*/React.createElement("dd", {
    className: "pos"
  }, "96"), /*#__PURE__*/React.createElement("dt", null, "EAST wins"), /*#__PURE__*/React.createElement("dd", {
    className: "pos"
  }, "84"), /*#__PURE__*/React.createElement("dt", null, "Unknown outcome"), /*#__PURE__*/React.createElement("dd", {
    style: {
      color: 'var(--warn)'
    }
  }, "34")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "shield",
    onClick: () => go('commanders')
  }, "Commander stats")))))), /*#__PURE__*/React.createElement("div", {
    className: "card section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "film"
  }), "Recent replays"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-right",
    onClick: () => go('replays')
  }, "All replays")), /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl compact"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Replay"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Mission"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Map"), /*#__PURE__*/React.createElement("th", null, "Players"), /*#__PURE__*/React.createElement("th", null, "Kills"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", null, D.replays.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    onClick: () => go('replay', {
      id: r.id
    })
  }, /*#__PURE__*/React.createElement("td", {
    className: "l mono"
  }, "#", r.id), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("b", null, r.mission)), /*#__PURE__*/React.createElement("td", {
    className: "l muted"
  }, r.map), /*#__PURE__*/React.createElement("td", null, r.players), /*#__PURE__*/React.createElement("td", null, r.kills || '—'), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Badge, {
    kind: r.status
  })))))))));
}

/* ---------------- Player Profile ---------------- */
function PlayerProfile({
  slug,
  go,
  onRequest
}) {
  const p = D.players.find(x => x.slug === slug) || D.players[0];
  const [tab, setTab] = useState('overview');
  const tabs = [{
    id: 'overview',
    label: 'Overview',
    icon: 'bar-chart-3'
  }, {
    id: 'rotations',
    label: 'Rotations',
    icon: 'repeat'
  }, {
    id: 'bounty',
    label: 'Bounty',
    icon: 'target'
  }, {
    id: 'history',
    label: 'History',
    icon: 'history'
  }, {
    id: 'provenance',
    label: 'Provenance',
    icon: 'shield-check'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-left",
    onClick: () => go('overview')
  }, "Back to overview"), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-head"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    lg: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "name"
  }, p.name), /*#__PURE__*/React.createElement("div", {
    className: "row2"
  }, p.squad ? /*#__PURE__*/React.createElement(Badge, {
    cls: "b-primary",
    icon: "users"
  }, p.squad) : /*#__PURE__*/React.createElement(Badge, {
    kind: "unknown"
  }, "No squad"), /*#__PURE__*/React.createElement("span", {
    className: "prov"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gamepad-2",
    size: 14
  }), "SteamID ", p.steam), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, p.nicks, " known nicknames"))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "flag-triangle-right",
    onClick: () => onRequest({
      kind: 'identity',
      who: p.name
    })
  }, "Submit request"))), /*#__PURE__*/React.createElement("div", {
    className: "tiles section-gap"
  }, /*#__PURE__*/React.createElement(Tile, {
    icon: "crosshair",
    label: "Kills",
    value: p.kills.toLocaleString('en-US'),
    delta: "+128",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "skull",
    label: "Deaths",
    value: p.deaths.toLocaleString('en-US'),
    delta: "+11",
    dir: "down"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "activity",
    label: "K / D",
    value: p.kd.toFixed(2),
    delta: "+0.3",
    dir: "up"
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "alert-triangle",
    label: "Teamkills",
    value: p.tk
  }), /*#__PURE__*/React.createElement(Tile, {
    icon: "target",
    label: "Bounty",
    value: p.bounty.toLocaleString('en-US'),
    delta: "R14"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 6px'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    tabs: tabs,
    active: tab,
    onChange: setTab
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, tab === 'overview' && /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "repeat"
  }), "Per-rotation performance"), /*#__PURE__*/React.createElement("table", {
    className: "tbl compact"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Rotation"), /*#__PURE__*/React.createElement("th", null, "Kills"), /*#__PURE__*/React.createElement("th", null, "K/D"), /*#__PURE__*/React.createElement("th", null, "Bounty"))), /*#__PURE__*/React.createElement("tbody", null, D.rotations.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.r
  }, /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("b", null, r.label), /*#__PURE__*/React.createElement("div", {
    className: "sub muted",
    style: {
      fontSize: 11
    }
  }, r.range)), /*#__PURE__*/React.createElement("td", null, r.kills), /*#__PURE__*/React.createElement("td", {
    className: "pos"
  }, r.kd.toFixed(2)), /*#__PURE__*/React.createElement("td", null, r.bounty.toLocaleString('en-US'))))))), /*#__PURE__*/React.createElement("div", {
    className: "grid-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up"
  }), "Kills \xB7 last 8 rotations"), /*#__PURE__*/React.createElement(Sparkline, {
    points: [180, 210, 240, 277, 301, 360, 388, 412],
    w: 260,
    h: 56
  })), /*#__PURE__*/React.createElement("div", {
    className: "banner",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info"
  }), "Stats recalculate automatically when a correction is approved."))), tab === 'history' && /*#__PURE__*/React.createElement("div", {
    className: "grid-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  }), "Nickname history"), /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, D.nickHistory.map((n, i) => /*#__PURE__*/React.createElement("div", {
    className: "tl-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, /*#__PURE__*/React.createElement("b", null, n.nick), i === 0 && /*#__PURE__*/React.createElement(Badge, {
    cls: "b-primary"
  }, "current")), /*#__PURE__*/React.createElement("div", {
    className: "when"
  }, n.from, " \u2192 ", n.to, " \xB7 ", n.src)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users"
  }), "Squad membership"), /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, D.squadHistory.map((s, i) => /*#__PURE__*/React.createElement("div", {
    className: "tl-item",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.gap ? 'circle-help' : 'users',
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t",
    style: s.gap ? {
      color: 'var(--warn)'
    } : {}
  }, s.gap ? 'Unknown gap' : /*#__PURE__*/React.createElement("b", null, s.squad)), /*#__PURE__*/React.createElement("div", {
    className: "when"
  }, s.from, " \u2192 ", s.to))))))), tab === 'rotations' && /*#__PURE__*/React.createElement(RotationsTab, null), tab === 'bounty' && /*#__PURE__*/React.createElement(BountyExplain, null), tab === 'provenance' && /*#__PURE__*/React.createElement("dl", {
    className: "kvs",
    style: {
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement("dt", null, "Last updated"), /*#__PURE__*/React.createElement("dd", null, "4 min ago"), /*#__PURE__*/React.createElement("dt", null, "Derived from"), /*#__PURE__*/React.createElement("dd", null, "1,284 replay events"), /*#__PURE__*/React.createElement("dt", null, "Canonical player ID"), /*#__PURE__*/React.createElement("dd", null, "cp_88421"), /*#__PURE__*/React.createElement("dt", null, "Linked SteamIDs"), /*#__PURE__*/React.createElement("dd", null, "2 (masked)"), /*#__PURE__*/React.createElement("dt", null, "Manual patches"), /*#__PURE__*/React.createElement("dd", null, "1 \xB7 moderator")))));
}
function RotationsTab() {
  return /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Rotation"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Range"), /*#__PURE__*/React.createElement("th", null, "Kills"), /*#__PURE__*/React.createElement("th", null, "K/D"), /*#__PURE__*/React.createElement("th", null, "Bounty"))), /*#__PURE__*/React.createElement("tbody", null, D.rotations.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.r
  }, /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("b", null, r.label)), /*#__PURE__*/React.createElement("td", {
    className: "l muted"
  }, r.range), /*#__PURE__*/React.createElement("td", null, r.kills), /*#__PURE__*/React.createElement("td", {
    className: "pos"
  }, r.kd.toFixed(2)), /*#__PURE__*/React.createElement("td", null, r.bounty.toLocaleString('en-US'))))));
}
function BountyExplain() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "banner",
    style: {
      background: 'var(--primary-weak)',
      borderColor: 'var(--primary-border)',
      color: 'var(--primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "target"
  }), "Bounty points are statistics only \u2014 never money."), /*#__PURE__*/React.createElement("dl", {
    className: "kvs"
  }, /*#__PURE__*/React.createElement("dt", null, "Bounty \xB7 Rotation 14"), /*#__PURE__*/React.createElement("dd", null, "3,120 pts"), /*#__PURE__*/React.createElement("dt", null, "Victim effectiveness \xD7"), /*#__PURE__*/React.createElement("dd", null, "1.8"), /*#__PURE__*/React.createElement("dt", null, "Squad effectiveness \xD7"), /*#__PURE__*/React.createElement("dd", null, "1.3"), /*#__PURE__*/React.createElement("dt", null, "Valid enemy kills"), /*#__PURE__*/React.createElement("dd", null, "142"), /*#__PURE__*/React.createElement("dt", null, "Teamkills (no points)"), /*#__PURE__*/React.createElement("dd", null, "12")), /*#__PURE__*/React.createElement("p", {
    className: "page-sub",
    style: {
      marginTop: 12
    }
  }, "Weights use each victim's individual and squad effectiveness from the ", /*#__PURE__*/React.createElement("b", null, "previous"), " rotation."));
}

/* ---------------- Replay Detail ---------------- */
function ReplayDetail({
  id,
  go,
  onRequest
}) {
  const r = D.replays.find(x => x.id === id) || D.replays[0];
  const [filter, setFilter] = useState('all');
  const events = D.events.filter(e => filter === 'all' || e.type === filter);
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-left",
    onClick: () => go('overview')
  }, "Back"), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "page-title",
    style: {
      fontSize: 24,
      whiteSpace: 'nowrap'
    }
  }, r.mission), /*#__PURE__*/React.createElement(Badge, {
    kind: r.status
  }), r.winner !== 'unknown' ? /*#__PURE__*/React.createElement(Badge, {
    kind: "win"
  }, r.winner, " won") : /*#__PURE__*/React.createElement(Badge, {
    kind: "unknown"
  }, "Winner unknown")), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "#", r.id, " \xB7 ", r.map, " \xB7 ", r.date, " \xB7 Rotation ", r.rotation, " \xB7 ", r.players, " players")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "external-link"
  }, "Source"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "sm",
    icon: "flag-triangle-right",
    onClick: () => onRequest({
      kind: 'commander',
      who: r.mission
    })
  }, "Dispute")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2 section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "list"
  }), "Events"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, ['all', 'kill', 'teamkill'].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    className: filter === f ? 'on' : '',
    onClick: () => setFilter(f)
  }, f === 'all' ? 'All' : f === 'kill' ? 'Kills' : 'Teamkills')))), /*#__PURE__*/React.createElement("div", null, events.map((e, i) => /*#__PURE__*/React.createElement("div", {
    className: "evt",
    key: i
  }, /*#__PURE__*/React.createElement("span", {
    className: "time"
  }, e.t), /*#__PURE__*/React.createElement("span", null, e.type === 'teamkill' ? /*#__PURE__*/React.createElement(Badge, {
    kind: "loss",
    icon: "alert-triangle"
  }, "TK") : /*#__PURE__*/React.createElement(Badge, {
    cls: "b-primary",
    icon: e.vehicle ? 'car' : 'crosshair'
  }, e.vehicle ? 'Vehicle' : 'Kill')), /*#__PURE__*/React.createElement("span", {
    className: "who"
  }, /*#__PURE__*/React.createElement("b", null, e.actor), " ", /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "\u2192"), " ", /*#__PURE__*/React.createElement("b", null, e.victim), " ", /*#__PURE__*/React.createElement("span", {
    className: "who side muted mono",
    style: {
      fontSize: 11
    }
  }, " \xB7 ", e.side)), /*#__PURE__*/React.createElement("span", {
    className: "req-btn"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "flag-triangle-right",
    onClick: () => onRequest({
      kind: e.type === 'teamkill' ? 'teamkills' : 'kills',
      who: `${r.mission} · ${e.t}`
    })
  }, "Request")))))), /*#__PURE__*/React.createElement("div", {
    className: "grid-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield"
  }), "Commander-side (KS)"), /*#__PURE__*/React.createElement("dl", {
    className: "kvs"
  }, /*#__PURE__*/React.createElement("dt", null, "WEST commander"), /*#__PURE__*/React.createElement("dd", null, r.ks_a), /*#__PURE__*/React.createElement("dt", null, "EAST commander"), /*#__PURE__*/React.createElement("dd", null, r.ks_b), /*#__PURE__*/React.createElement("dt", null, "Outcome"), /*#__PURE__*/React.createElement("dd", {
    style: {
      color: r.winner === 'unknown' ? 'var(--warn)' : 'var(--win)'
    }
  }, r.winner === 'unknown' ? 'Unknown' : r.winner))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users"
  }), "Participants \xB7 ", r.players), /*#__PURE__*/React.createElement("div", {
    className: "partlist"
  }, D.players.slice(0, 5).map(p => /*#__PURE__*/React.createElement("div", {
    className: "part",
    key: p.slug,
    style: {
      cursor: 'pointer'
    },
    onClick: () => go('player', {
      slug: p.slug
    })
  }, /*#__PURE__*/React.createElement("span", {
    className: "idchip"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name
  }), /*#__PURE__*/React.createElement("b", null, p.name)), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, p.kills > 1000 ? 'WEST' : 'EAST'))))), /*#__PURE__*/React.createElement("div", {
    className: "banner",
    style: {
      margin: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info"
  }), "Timeline loads progressively to keep replay pages fast and indexable."))));
}
Object.assign(window, {
  StatsOverview,
  PlayerProfile,
  ReplayDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/screens-public.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/screens-staff.jsx
try { (() => {
/* Solid Stats UI kit — staff screens: moderator queue, request detail, request submission flow. */
const SD = window.SS_DATA;
const PRIO = {
  high: {
    cls: 'b-loss',
    label: 'High'
  },
  med: {
    cls: 'b-warn',
    label: 'Med'
  },
  low: {
    cls: 'b-neutral',
    label: 'Low'
  }
};

/* ---------------- Moderator Queue ---------------- */
function ModeratorQueue({
  go
}) {
  const [status, setStatus] = useState('pending');
  const rows = SD.requests.filter(r => status === 'all' || r.status === status);
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Request queue"), /*#__PURE__*/React.createElement("div", {
    className: "page-sub"
  }, "Moderation \xB7 default priority = risk + age")), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, ['pending', 'approved', 'rejected', 'all'].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    className: status === s ? 'on' : '',
    onClick: () => setStatus(s)
  }, s[0].toUpperCase() + s.slice(1)))))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tw"
  }, /*#__PURE__*/React.createElement("table", {
    className: "tbl"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Priority"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Type"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Requester"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Affected entity"), /*#__PURE__*/React.createElement("th", null, "Age"), /*#__PURE__*/React.createElement("th", {
    className: "l"
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.id,
    onClick: () => go('request', {
      id: r.id
    })
  }, /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Badge, {
    cls: PRIO[r.priority].cls
  }, PRIO[r.priority].label)), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("b", null, r.type), /*#__PURE__*/React.createElement("div", {
    className: "sub muted",
    style: {
      fontSize: 11
    }
  }, "#", r.id)), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement("span", {
    className: "idchip"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.who
  }), /*#__PURE__*/React.createElement("span", null, r.who))), /*#__PURE__*/React.createElement("td", {
    className: "l muted"
  }, r.entity), /*#__PURE__*/React.createElement("td", null, r.age), /*#__PURE__*/React.createElement("td", {
    className: "l"
  }, /*#__PURE__*/React.createElement(Badge, {
    kind: r.status
  })))))))));
}

/* ---------------- Request Detail ---------------- */
function RequestDetail({
  id,
  go
}) {
  const r = SD.requests.find(x => x.id === id) || SD.requests[0];
  const [comment, setComment] = useState('');
  const [decision, setDecision] = useState(r.status === 'pending' ? null : r.status);
  const decide = d => {
    if (!comment.trim()) {
      setErr(true);
      return;
    }
    setDecision(d);
  };
  const [err, setErr] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "arrow-left",
    onClick: () => go('queue')
  }, "Back to queue"), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 12,
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "page-title",
    style: {
      fontSize: 22,
      whiteSpace: 'nowrap'
    }
  }, r.type), /*#__PURE__*/React.createElement("span", {
    className: "mono muted"
  }, "#", r.id), /*#__PURE__*/React.createElement(Badge, {
    cls: PRIO[r.priority].cls
  }, PRIO[r.priority].label, " priority"), /*#__PURE__*/React.createElement(Badge, {
    kind: decision || 'pending'
  })), /*#__PURE__*/React.createElement("span", {
    className: "idchip"
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.who
  }), /*#__PURE__*/React.createElement("span", null, r.who, " \xB7 ", r.age, " ago")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-2 section-gap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "file-text"
  }), "Submitted"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      marginTop: 0
    }
  }, "Kill at 04:12 against \u041F\u0440\u0438\u0437\u0440\u0430\u043A is missing from my totals \u2014 confirmed in the linked replay timeline. Please re-add it to Rotation 14."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    cls: "b-primary",
    icon: "film"
  }, r.entity), /*#__PURE__*/React.createElement(Badge, {
    cls: "b-neutral",
    icon: "user"
  }, r.who))), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paperclip"
  }), "Evidence"), /*#__PURE__*/React.createElement("div", {
    className: "attachgrid"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: `req-${r.id}-a`,
    shape: "rounded",
    radius: "6",
    placeholder: "Screenshot"
  }), /*#__PURE__*/React.createElement("image-slot", {
    id: `req-${r.id}-b`,
    shape: "rounded",
    radius: "6",
    placeholder: "Screenshot"
  }), /*#__PURE__*/React.createElement("image-slot", {
    id: `req-${r.id}-c`,
    shape: "rounded",
    radius: "6",
    placeholder: "+ add"
  })), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "prov",
    style: {
      marginTop: 10,
      color: 'var(--primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 14
  }), "ocap.solidgames.gg/48213?f=375")), /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bar-chart-3"
  }), "Current stat context"), /*#__PURE__*/React.createElement("dl", {
    className: "kvs"
  }, /*#__PURE__*/React.createElement("dt", null, "Kills (R14)"), /*#__PURE__*/React.createElement("dd", null, "142"), /*#__PURE__*/React.createElement("dt", null, "After approval"), /*#__PURE__*/React.createElement("dd", {
    className: "pos"
  }, "143 (+1)")))), /*#__PURE__*/React.createElement("div", {
    className: "grid-side"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-head"
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement(Icon, {
    name: "history"
  }), "Audit timeline")), /*#__PURE__*/React.createElement("div", {
    className: "card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "flag-triangle-right",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "Request submitted by ", /*#__PURE__*/React.createElement("b", null, r.who)), /*#__PURE__*/React.createElement("div", {
    className: "when"
  }, r.age, " ago \xB7 14:02 UTC"))), /*#__PURE__*/React.createElement("div", {
    className: "tl-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "paperclip",
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, "2 attachments + 1 external link added"), /*#__PURE__*/React.createElement("div", {
    className: "when"
  }, r.age, " ago"))), decision && /*#__PURE__*/React.createElement("div", {
    className: "tl-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot",
    style: {
      borderColor: decision === 'approved' ? 'var(--win-border)' : 'var(--loss-border)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: decision === 'approved' ? 'badge-check' : 'x-circle',
    size: 14
  })), /*#__PURE__*/React.createElement("div", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, decision === 'approved' ? 'Approved' : 'Rejected', " by ", /*#__PURE__*/React.createElement("b", null, "moderator")), /*#__PURE__*/React.createElement("div", {
    className: "when"
  }, "just now \xB7 ", comment || '—')))))), !decision && /*#__PURE__*/React.createElement("div", {
    className: "card card-pad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "side-head"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gavel"
  }), "Decision"), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Comment (required)"), /*#__PURE__*/React.createElement("div", {
    className: `control${err ? ' err' : ''}`
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: "2",
    placeholder: "Explain your decision \u2014 visible in request history",
    value: comment,
    onChange: e => {
      setComment(e.target.value);
      setErr(false);
    }
  })), err && /*#__PURE__*/React.createElement("span", {
    className: "help err"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 12
  }), "A comment is required to approve or reject."), /*#__PURE__*/React.createElement("span", {
    className: "help"
  }, "Approving creates a correction patch; server-2 recalculates affected aggregates.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "success",
    icon: "badge-check",
    onClick: () => decide('approved')
  }, "Approve"), /*#__PURE__*/React.createElement(Button, {
    variant: "danger",
    icon: "x-circle",
    onClick: () => decide('rejected')
  }, "Reject"))), decision && /*#__PURE__*/React.createElement("div", {
    className: "banner",
    style: {
      margin: 0,
      background: 'var(--win-weak)',
      borderColor: 'var(--win-border)',
      color: 'var(--win)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "badge-check"
  }), "Decision recorded. ", decision === 'approved' ? 'Aggregates are recalculating.' : 'Requester can reopen this request.'))));
}

/* ---------------- Request submission flow (modal stepper) ---------------- */
const REQ_TYPES = [{
  id: 'identity',
  t: 'Identity / nickname',
  d: 'Link accounts, fix a nickname',
  icon: 'user'
}, {
  id: 'kills',
  t: 'Add / remove kills',
  d: 'Correct a kill count',
  icon: 'crosshair'
}, {
  id: 'teamkills',
  t: 'Add / remove teamkills',
  d: 'Correct a teamkill',
  icon: 'alert-triangle'
}, {
  id: 'remove',
  t: 'Remove from replay',
  d: 'I was not in this match',
  icon: 'user-minus'
}, {
  id: 'commander',
  t: 'Commander dispute',
  d: 'Dispute a KS outcome',
  icon: 'shield'
}];
function RequestModal({
  seed,
  onClose,
  user,
  onLogin
}) {
  const [step, setStep] = useState(user ? 0 : -1);
  const [type, setType] = useState(seed && seed.kind ? seed.kind : null);
  const [linked, setLinked] = useState(seed && seed.who ? seed.who : '');
  const [desc, setDesc] = useState('');
  const [touched, setTouched] = useState(false);
  const linkErr = touched && !linked.trim();
  const descErr = touched && desc.trim().length < 8;
  const next = () => {
    if (step === 1) {
      setTouched(true);
      if (!linked.trim() || desc.trim().length < 8) return;
      setTouched(false);
    }
    setStep(step + 1);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "scrim",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal",
    onClick: e => e.stopPropagation(),
    role: "dialog",
    "aria-modal": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-head"
  }, /*#__PURE__*/React.createElement("h3", null, step === 3 ? 'Request submitted' : 'Submit a correction request'), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "x",
    onClick: onClose,
    "aria-label": "Close"
  })), step === -1 && /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "banner",
    style: {
      margin: 0,
      background: 'var(--info-weak)',
      borderColor: 'var(--info-border)',
      color: 'var(--info)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock"
  }), "Sign in with Steam to submit requests. You'll return here afterwards."), /*#__PURE__*/React.createElement("button", {
    className: "btn steam",
    onClick: () => {
      onLogin();
      setStep(0);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gamepad-2",
    size: 16
  }), "Sign in with Steam")), step === 0 && /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Request type"), /*#__PURE__*/React.createElement("div", {
    className: "choice"
  }, REQ_TYPES.map(rt => /*#__PURE__*/React.createElement("div", {
    key: rt.id,
    className: `choice-item${type === rt.id ? ' sel' : ''}`,
    onClick: () => setType(rt.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: rt.icon
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ci-t"
  }, rt.t), /*#__PURE__*/React.createElement("div", {
    className: "ci-d"
  }, rt.d)), type === rt.id && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    style: {
      marginLeft: 'auto'
    }
  })))))), step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Linked entity"), /*#__PURE__*/React.createElement("div", {
    className: `control${linkErr ? ' err' : ''}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Player, squad, or replay #",
    value: linked,
    onChange: e => setLinked(e.target.value)
  })), linkErr && /*#__PURE__*/React.createElement("span", {
    className: "help err"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 12
  }), "Link the player or replay this request is about.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Description"), /*#__PURE__*/React.createElement("div", {
    className: `control${descErr ? ' err' : ''}`
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    placeholder: "Describe the correction and where to verify it",
    value: desc,
    onChange: e => setDesc(e.target.value)
  })), descErr ? /*#__PURE__*/React.createElement("span", {
    className: "help err"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 12
  }), "Add at least a sentence of detail.") : /*#__PURE__*/React.createElement("span", {
    className: "help"
  }, "Draft autosaves to your account \xB7 kept 7 days."))), step === 2 && /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Evidence (optional)"), /*#__PURE__*/React.createElement("div", {
    className: "attachgrid"
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "new-req-a",
    shape: "rounded",
    radius: "6",
    placeholder: "Drop image"
  }), /*#__PURE__*/React.createElement("image-slot", {
    id: "new-req-b",
    shape: "rounded",
    radius: "6",
    placeholder: "Drop image"
  }), /*#__PURE__*/React.createElement("image-slot", {
    id: "new-req-c",
    shape: "rounded",
    radius: "6",
    placeholder: "+ add"
  })), /*#__PURE__*/React.createElement("span", {
    className: "help"
  }, "Images up to 8 MB \xB7 or paste an external link below.")), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "External link"), /*#__PURE__*/React.createElement("div", {
    className: "control"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "https://ocap.solidgames.gg/\u2026"
  })))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "modal-body",
    style: {
      alignItems: 'center',
      textAlign: 'center',
      padding: '28px 18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "avatar lg",
    style: {
      background: 'var(--win-weak)',
      borderColor: 'var(--win-border)',
      color: 'var(--win)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "t-h3",
    style: {
      marginTop: 12
    }
  }, "Request #4472 submitted"), /*#__PURE__*/React.createElement("p", {
    className: "page-sub",
    style: {
      maxWidth: 360
    }
  }, "A moderator will review it. Track status in ", /*#__PURE__*/React.createElement("b", null, "My requests"), " \u2014 you'll get an in-app notification on a decision.")), step >= 0 && step < 3 && /*#__PURE__*/React.createElement("div", {
    className: "modal-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "steps"
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `step-dot${i < step ? ' done' : i === step ? ' on' : ''}`
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, step > 0 && /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setStep(step - 1)
  }, "Back"), step < 2 ? /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "arrow-right",
    disabled: step === 0 && !type,
    onClick: next
  }, "Continue") : /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "send",
    onClick: () => setStep(3)
  }, "Submit request"))), step === 3 && /*#__PURE__*/React.createElement("div", {
    className: "modal-foot",
    style: {
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onClose
  }, "Done"))));
}
Object.assign(window, {
  ModeratorQueue,
  RequestDetail,
  RequestModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/screens-staff.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/shell.jsx
try { (() => {
/* Solid Stats UI kit — app shell: top nav, mobile tab bar, footer. */

const NAV = [{
  id: 'overview',
  label: 'Overview',
  icon: 'bar-chart-3'
}, {
  id: 'players',
  label: 'Players',
  icon: 'user'
}, {
  id: 'squads',
  label: 'Squads',
  icon: 'users'
}, {
  id: 'bounty',
  label: 'Bounty',
  icon: 'target'
}, {
  id: 'commanders',
  label: 'Commanders',
  icon: 'shield'
}, {
  id: 'replays',
  label: 'Replays',
  icon: 'film'
}];
const TABBAR = [{
  id: 'overview',
  label: 'Stats',
  icon: 'bar-chart-3'
}, {
  id: 'players',
  label: 'Players',
  icon: 'user'
}, {
  id: 'bounty',
  label: 'Bounty',
  icon: 'target'
}, {
  id: 'replays',
  label: 'Replays',
  icon: 'film'
}, {
  id: 'account',
  label: 'Account',
  icon: 'circle-user'
}];
function TopNav({
  route,
  go,
  lang,
  setLang,
  user,
  onLogin,
  onLogout
}) {
  const section = route.name;
  return /*#__PURE__*/React.createElement("header", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container nav-inner"
  }, /*#__PURE__*/React.createElement(Brand, {
    onClick: () => go('overview')
  }), /*#__PURE__*/React.createElement("nav", {
    className: "nav-links",
    "aria-label": "Primary"
  }, NAV.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `nav-link${section === n.id ? ' active' : ''}`,
    onClick: () => go(n.id),
    role: "link",
    tabIndex: 0,
    onKeyDown: e => {
      if (e.key === 'Enter') go(n.id);
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: n.icon,
    size: 15
  }), n.label))), /*#__PURE__*/React.createElement("div", {
    className: "nav-right"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "search",
    "aria-label": "Search"
  }), /*#__PURE__*/React.createElement("button", {
    className: "selpill",
    style: {
      padding: '6px 9px'
    },
    onClick: () => setLang(lang === 'EN' ? 'RU' : 'EN')
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "languages",
    size: 15
  }), lang), user ? /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    icon: "gavel",
    onClick: () => go('queue')
  }, "Moderation") : null, user ? /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    icon: "log-out",
    onClick: onLogout,
    "aria-label": "Sign out"
  }) : /*#__PURE__*/React.createElement("button", {
    className: "btn btn-sm steam",
    onClick: onLogin
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "gamepad-2",
    size: 14
  }), "Sign in with Steam"))));
}
function MobileTabBar({
  route,
  go,
  user,
  onLogin
}) {
  const section = route.name;
  return /*#__PURE__*/React.createElement("nav", {
    className: "tabbar",
    "aria-label": "Mobile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tabbar-inner"
  }, TABBAR.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: section === t.id ? 'active' : '',
    onClick: () => t.id === 'account' ? user ? go('queue') : onLogin() : go(t.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 20
  }), t.label))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, "SolidStats \u2014 community statistics \xB7 not affiliated with Valve.")), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, "Public stats \xB7 no login required")));
}
Object.assign(window, {
  TopNav,
  MobileTabBar,
  Footer,
  NAV
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web/ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Solid Stats UI kit — primitives. Exports to window for cross-file use. */
const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;

/* ---- Icon: render Lucide SVG directly from icon node data (no createIcons) ---- */
function lucidePascal(name) {
  return name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}
function iconSvg(name, size, stroke) {
  const L = window.lucide;
  const node = L && L.icons && L.icons[lucidePascal(name)];
  if (!node) return '';
  const kids = node.map(([tag, attrs]) => '<' + tag + ' ' + Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ') + '></' + tag + '>').join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${kids}</svg>`;
}
function Icon({
  name,
  size = 18,
  stroke = 2,
  className,
  style
}) {
  const html = useMemo(() => iconSvg(name, size, stroke), [name, size, stroke]);
  return /*#__PURE__*/React.createElement("span", {
    className: className,
    style: {
      display: 'inline-flex',
      lineHeight: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}

/* ---- Brand mark (HUD reticle) ---- */
function BrandMark({
  size = 22
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: "mark",
    width: size,
    height: size,
    viewBox: "0 0 36 36",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    className: "bar-out",
    x: "4",
    y: "4",
    width: "28",
    height: "28",
    rx: "4",
    strokeWidth: "2.6"
  }), /*#__PURE__*/React.createElement("rect", {
    className: "bar dim",
    x: "10",
    y: "20",
    width: "4",
    height: "6",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    className: "bar",
    x: "16",
    y: "15",
    width: "4",
    height: "11",
    rx: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    className: "bar",
    x: "22",
    y: "10",
    width: "4",
    height: "16",
    rx: "1"
  }));
}
function Brand({
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "brand",
    onClick: onClick
  }, /*#__PURE__*/React.createElement(BrandMark, null), /*#__PURE__*/React.createElement("span", {
    className: "wm"
  }, "Solid", /*#__PURE__*/React.createElement("span", {
    className: "thin"
  }, "Stats")));
}

/* ---- Button ---- */
function Button({
  variant = 'secondary',
  size,
  icon,
  children,
  className = '',
  ...rest
}) {
  const cls = `btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''}${!children ? ' btn-icon' : ''} ${className}`;
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls
  }, rest), icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === 'sm' ? 14 : 16
  }), children);
}

/* ---- Badge ---- */
const OUTCOME = {
  win: {
    cls: 'b-win',
    icon: 'check',
    label: 'Win'
  },
  loss: {
    cls: 'b-loss',
    icon: 'x',
    label: 'Loss'
  },
  unknown: {
    cls: 'b-warn',
    icon: 'circle-help',
    label: 'Unknown'
  },
  parsed: {
    cls: 'b-win',
    icon: 'check',
    label: 'Parsed'
  },
  parsing: {
    cls: 'b-info',
    icon: 'loader',
    label: 'Parsing'
  },
  failed: {
    cls: 'b-loss',
    icon: 'triangle-alert',
    label: 'Failed'
  },
  pending: {
    cls: 'b-neutral',
    icon: 'clock',
    label: 'Pending'
  },
  approved: {
    cls: 'b-win',
    icon: 'badge-check',
    label: 'Approved'
  },
  rejected: {
    cls: 'b-loss',
    icon: 'x-circle',
    label: 'Rejected'
  },
  conflict: {
    cls: 'b-warn',
    icon: 'triangle-alert',
    label: 'Conflict'
  }
};
function Badge({
  kind,
  children,
  icon,
  cls
}) {
  const p = OUTCOME[kind];
  if (p) return /*#__PURE__*/React.createElement("span", {
    className: `badge ${p.cls}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.icon
  }), children || p.label);
  return /*#__PURE__*/React.createElement("span", {
    className: `badge ${cls || 'b-neutral'}`
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon
  }), children);
}

/* ---- Stat tile ---- */
function Tile({
  icon,
  label,
  value,
  delta,
  dir
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tile"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 14
  }), label), /*#__PURE__*/React.createElement("div", {
    className: "v"
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    className: `d ${dir || ''}`
  }, dir && /*#__PURE__*/React.createElement(Icon, {
    name: dir === 'up' ? 'trending-up' : 'trending-down',
    size: 12
  }), delta));
}

/* ---- Tabs ---- */
function Tabs({
  tabs,
  active,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tabs",
    role: "tablist"
  }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    role: "tab",
    "aria-selected": active === t.id,
    tabIndex: 0,
    className: `tab${active === t.id ? ' active' : ''}`,
    onClick: () => onChange(t.id),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(t.id);
      }
    }
  }, t.icon && /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 15
  }), t.label)));
}

/* ---- Avatar (monogram; swap for image-slot when real assets exist) ---- */
function Avatar({
  name,
  lg
}) {
  const initials = (name || '?').replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    className: `avatar${lg ? ' lg' : ''}`
  }, initials);
}

/* ---- Sparkline ---- */
function Sparkline({
  points,
  color = 'var(--chart-1)',
  w = 160,
  h = 34
}) {
  const max = Math.max(...points),
    min = Math.min(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i * step},${h - (p - min) / span * (h - 4) - 2}`).join(' ');
  return /*#__PURE__*/React.createElement("svg", {
    width: w,
    height: h,
    viewBox: `0 0 ${w} ${h}`,
    preserveAspectRatio: "none",
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("polyline", {
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    points: d
  }));
}

/* ---- Provenance line ---- */
function Provenance({
  children = 'Up to date · updated 4 min ago',
  live = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "prov"
  }, live && /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), children);
}
Object.assign(window, {
  useState,
  useMemo,
  useEffect,
  useRef,
  Icon,
  BrandMark,
  Brand,
  Button,
  Badge,
  Tile,
  Tabs,
  Avatar,
  Sparkline,
  Provenance,
  OUTCOME
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web/ui.jsx", error: String((e && e.message) || e) }); }

})();
