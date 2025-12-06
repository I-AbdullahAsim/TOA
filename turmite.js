// turmite.js
// 2D Turmite engine + UI glue + gallery + AI palette generation

import { getPattern } from './patterns/index.js';

(() => {
  // --- DOM references
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const canvasSizeSel = document.getElementById('canvasSize');
  const modeSelect = document.getElementById('modeSelect');
  const statesInput = document.getElementById('statesInput');
  const stepsRange = document.getElementById('stepsPerFrame');
  const stepsLabel = document.getElementById('stepsLabel');
  const maxStepsInput = document.getElementById('maxSteps');
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const resetBtn = document.getElementById('resetBtn');
  const saveBtn = document.getElementById('saveBtn');
  const saveToGalleryBtn = document.getElementById('saveToGalleryBtn');
  const shareText = document.getElementById('shareText');
  const galleryDiv = document.getElementById('gallery');
  const clearGalleryBtn = document.getElementById('clearGalleryBtn');

  // Pattern modules are imported and used via getPattern()

  // --- grid & turmite state
  let W = parseInt(canvasSizeSel.value, 10) || 512;
  let H = W;
  let grid; // grid: Uint8Array
  let turmites = []; // Array of {x, y, dir} for multiple turmites
  let colors = ['#000000', '#ffffff']; // Default colors
  let animationRunning = false;
  let raf = null;
  let stepsPerFrame = parseInt(stepsRange.value, 10);
  let maxSteps = parseInt(maxStepsInput.value, 10);
  let stepsDone = 0;
  const DIRS = [[0,-1],[1,0],[0,1],[-1,0]]; // N,E,S,W

  // --- helpers
  function resizeCanvas(size) {
    W = size;
    H = size;
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);
  }

  function buildGrid(states=2) {
    // use Uint8Array; index = y*W + x
    grid = new Uint8Array(W * H);
    for (let i=0;i<grid.length;i++) grid[i]=0;
  }

  function paletteToArray(pal) { return pal.slice(); }

  // --- turmite engine
  function startTurmite(modeName) {
    // Get pattern module
    const pattern = getPattern(modeName);
    
    // Get number of states from user input
    let numStates = 4; // default
    if (statesInput) {
      numStates = parseInt(statesInput.value, 10) || 4;
    }
    if (numStates < 2) numStates = 2;
    if (numStates > 10) numStates = 10;
    
    // Generate randomized turn sequence using pattern module
    const turns = pattern.generateTurns(numStates);
    
    // Generate colors using pattern module
    colors = pattern.getColors(numStates);

    // reset canvas + grid
    resizeCanvas(parseInt(canvasSizeSel.value,10));
    buildGrid(numStates);
    
    // Initialize turmites using pattern module
    turmites = pattern.initTurmites(W, H);
    
    // Debug: Check if turmites were initialized
    if (!turmites || turmites.length === 0) {
      console.error('Failed to initialize turmites!', modeName);
      return;
    }
    
    stepsDone = 0;
    maxSteps = parseInt(maxStepsInput.value,10) || 2000000;

    // clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);

    // save share string
    const share = JSON.stringify({
      mode: modeName, size: W, states: numStates, stepsPerFrame: stepsPerFrame, maxSteps: maxSteps
    });
    shareText.value = share;

    // run
    animationRunning = true;
    runFrame(() => turmiteStepBatch(turns, numStates));
  }

  function turmiteStepBatch(turns, states) {
    // run stepsPerFrame micro-steps and render to canvas
    // Check if we have turmites
    if (!turmites || turmites.length === 0) {
      console.error('No turmites initialized!');
      return;
    }
    
    // Distribute steps across all turmites
    const stepsPerTurmite = Math.ceil(stepsPerFrame / turmites.length);
    
    for (let step = 0; step < stepsPerFrame && stepsDone < maxSteps; step++) {
      // Cycle through turmites for better visual distribution
      const turmiteIdx = step % turmites.length;
      const t = turmites[turmiteIdx];
      
      const idx = (t.y|0) * W + (t.x|0);
      const state = grid[idx] | 0;

      // draw pixel using color for cell state
      const color = colors[state % colors.length] || '#000';
      ctx.fillStyle = color;
      ctx.fillRect(t.x, t.y, 1, 1);

      // determine turn (L or R)
      const turn = turns[state % turns.length];
      t.dir = (t.dir + (turn === 'R' ? 1 : -1) + 4) % 4;

      // write new state
      grid[idx] = (state + 1) % states;

      // move forward
      t.x += DIRS[t.dir][0];
      t.y += DIRS[t.dir][1];

      // wrap
      if (t.x < 0) t.x = W - 1;
      if (t.x >= W) t.x = 0;
      if (t.y < 0) t.y = H - 1;
      if (t.y >= H) t.y = 0;

      stepsDone++;
    }
  }

  function runFrame(stepFn) {
    if (!animationRunning) return;
    // stepFn must run a batch of steps and draw
    stepFn();
    // stop when reached
    if (stepsDone >= maxSteps) {
      animationRunning = false;
      cancelAnimationFrame(raf);
      return;
    }
    raf = requestAnimationFrame(()=>runFrame(stepFn));
  }

  function stop() {
    animationRunning = false;
    if (raf) cancelAnimationFrame(raf);
  }

  function reset() {
    stop();
    turmites = [];
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);
    buildGrid(2);
    shareText.value = '';
  }

  // --- gallery (localStorage)
  function loadGallery() {
    galleryDiv.innerHTML = '';
    const arr = JSON.parse(localStorage.getItem('turmiteGallery')||'[]');
    arr.forEach((dataUrl, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      const img = document.createElement('img');
      img.src = dataUrl;
      const del = document.createElement('button');
      del.textContent='✕';
      del.title='Remove';
      del.onclick = ()=> {
        arr.splice(i,1);
        localStorage.setItem('turmiteGallery', JSON.stringify(arr));
        loadGallery();
      };
      item.appendChild(img);
      item.appendChild(del);
      galleryDiv.appendChild(item);
    });
  }

  function saveToGallery() {
    const dataUrl = canvas.toDataURL('image/png');
    const arr = JSON.parse(localStorage.getItem('turmiteGallery')||'[]');
    arr.unshift(dataUrl);
    // cap gallery at 50 items
    if (arr.length > 50) arr.length = 50;
    localStorage.setItem('turmiteGallery', JSON.stringify(arr));
    loadGallery();
  }

  function clearGallery() {
    localStorage.removeItem('turmiteGallery');
    loadGallery();
  }

  // --- events & wiring
  stepsRange.addEventListener('input', e => {
    stepsPerFrame = parseInt(e.target.value,10);
    stepsLabel.textContent = stepsPerFrame;
  });

  canvasSizeSel.addEventListener('change', () => {
    resizeCanvas(parseInt(canvasSizeSel.value,10));
    reset();
  });

  startBtn.addEventListener('click', () => {
    const mode = modeSelect.value;
    startTurmite(mode);
  });

  stopBtn.addEventListener('click', ()=> stop());
  resetBtn.addEventListener('click', ()=> reset());
  saveBtn.addEventListener('click', ()=> {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `turmite-${Date.now()}.png`;
    link.click();
  });

  saveToGalleryBtn.addEventListener('click', ()=> saveToGallery());
  clearGalleryBtn.addEventListener('click', ()=> clearGallery());

  // initialize
  (function init() {
    resizeCanvas(W);
    buildGrid(2);
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,W,H);
    loadGallery();
  })();

})();

/* Presets loader: fetch /presets/presets.json, render cards, generate deterministic thumbnails,
   and allow user to load a preset into the main UI. */

(async function loadAndRenderPresets() {
  const PRESETS_URL = '/presets/presets.json';
  let presets = [];
  try {
    const res = await fetch(PRESETS_URL, {cache: "no-cache"});
    if (!res.ok) throw new Error('Failed to fetch presets.json: ' + res.status);
    presets = await res.json();
  } catch (err) {
    console.error(err);
    return;
  }

  // Container where preset cards go (the gallery Div from your UI)
  const galleryDiv = document.getElementById('gallery');
  if (!galleryDiv) {
    console.warn('No #gallery container found to render presets.');
    return;
  }

  // Simple seeded RNG (mulberry32) so thumbnails are deterministic
  function seededRNG(seed) {
    let t = seed >>> 0;
    return function() {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Small turmite thumbnail renderer: returns dataURL
  function generateThumbnailDataURL(preset, size = 128, steps = 25000) {
    // Check cache
    const cacheKey = 'preset_thumb_v1_' + preset.id + '_' + preset.seed;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return Promise.resolve(cached);

    return new Promise((resolve) => {
      // Offscreen canvas
      const c = document.createElement('canvas');
      c.width = size; c.height = size;
      const cx = c.getContext('2d', { alpha: false });
      cx.fillStyle = '#000'; cx.fillRect(0,0,size,size);

      // seeded RNG for deterministic behaviour
      const rnd = seededRNG(preset.seed);

      // small grid and simple turmite logic adapted for thumbnail
      const W = size, H = size;
      const grid = new Uint8Array(W * H);
      let x = Math.floor(W/2), y = Math.floor(H/2), dir = Math.floor(rnd()*4);
      const DIRS = [[0,-1],[1,0],[0,1],[-1,0]];

      // palette: use preset.palette
      const pal = preset.palette && Array.isArray(preset.palette) && preset.palette.length > 0 ? preset.palette : ['#000','#fff'];

      // derive turns & states by preset.mode (simple mapping)
      const modeToTurns = {
        symmetric: ['L','R','L','R'],
        fractal: ['R','R','L'],
        growth: ['L','R','R'],
        loop: ['L','R'],
        organic: ['L','R','R'],
        turmite: ['L','R']
      };
      const turns = modeToTurns[preset.mode] || ['L','R'];
      // states: heuristics
      const states = (preset.mode === 'turmite' ? Math.max(2, Math.min(6, (preset.palette||[]).length)) :
                     preset.mode === 'symmetric' ? 4 :
                     preset.mode === 'fractal' ? 3 :
                     preset.mode === 'growth' ? 3 : 2);

      function step() {
        const idx = y * W + x;
        const state = grid[idx];
        // draw
        cx.fillStyle = pal[state % pal.length];
        cx.fillRect(x, y, 1, 1);
        // turn
        const turn = turns[state % turns.length];
        dir = (dir + (turn === 'R' ? 1 : -1) + 4) % 4;
        // write
        grid[idx] = (state + 1) % states;
        // move
        x += DIRS[dir][0]; y += DIRS[dir][1];
        if (x < 0) x = W-1; if (x >= W) x = 0;
        if (y < 0) y = H-1; if (y >= H) y = 0;
      }

      // Run steps in chunks so UI isn't blocked too long
      const CHUNK = 2000;
      let remaining = steps;
      function runChunk() {
        const n = Math.min(CHUNK, remaining);
        for (let i=0;i<n;i++) step();
        remaining -= n;
        if (remaining > 0) {
          // yield control briefly
          setTimeout(runChunk, 0);
        } else {
          const dataURL = c.toDataURL('image/png');
          try { localStorage.setItem(cacheKey, dataURL); } catch(e){ /* ignore storage errors */ }
          resolve(dataURL);
        }
      }
      runChunk();
    });
  }

  // Render preset card in gallery
  function renderPresetCard(preset) {
    const card = document.createElement('div');
    card.className = 'gallery-item preset-card';
    card.title = preset.name + ' — ' + (preset.desc || '');

    const img = document.createElement('img');
    img.style.maxWidth = '100%';
    img.style.maxHeight = '100%';
    img.alt = preset.name;
    // placeholder until thumbnail ready
    img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" fill="#ddd" font-family="Arial" font-size="12" dominant-baseline="middle" text-anchor="middle">Loading</text></svg>`);

    const btnLoad = document.createElement('button');
    btnLoad.textContent = 'Load';
    btnLoad.style.position = 'absolute';
    btnLoad.style.right = '6px';
    btnLoad.style.bottom = '6px';
    btnLoad.onclick = () => applyPresetToUI(preset);

    // delete thumb button
    const btnDel = document.createElement('button');
    btnDel.textContent = '×';
    btnDel.title = 'Clear cached thumbnail';
    btnDel.style.position = 'absolute';
    btnDel.style.left = '6px';
    btnDel.style.bottom = '6px';
    btnDel.onclick = () => {
      const cacheKey = 'preset_thumb_v1_' + preset.id + '_' + preset.seed;
      localStorage.removeItem(cacheKey);
      // regenerate immediately
      generateThumbnailDataURL(preset).then(url => { img.src = url; });
    };

    card.appendChild(img);
    card.appendChild(btnLoad);
    card.appendChild(btnDel);

    // tooltip/name overlay
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.top = '6px';
    label.style.left = '6px';
    label.style.right = '6px';
    label.style.color = '#fff';
    label.style.fontSize = '11px';
    label.style.textShadow = '0 1px 2px rgba(0,0,0,0.8)';
    label.textContent = preset.name;
    card.appendChild(label);

    galleryDiv.appendChild(card);

    // async thumbnail generation
    generateThumbnailDataURL(preset, 128, 20000).then(url => {
      img.src = url;
    }).catch(err => {
      console.error('Thumb error', err);
    });
  }

  // Apply preset into main UI and start the engine
  function applyPresetToUI(preset) {
    const modeSel = document.getElementById('modeSelect');
    const statesInput = document.getElementById('statesInput');
    const canvasSizeSel = document.getElementById('canvasSize');
    const maxStepsInput = document.getElementById('maxSteps');
    const stepsRange = document.getElementById('stepsPerFrame');

    // Mode
    if (modeSel && preset.mode) {
        modeSel.value = preset.mode;
    }

    // Canvas size
    if (canvasSizeSel && preset.size) {
        canvasSizeSel.value = preset.size;
    }

    // Steps
    if (stepsRange && preset.stepsPerFrame) {
        stepsRange.value = preset.stepsPerFrame;
        document.getElementById('stepsLabel').textContent = preset.stepsPerFrame;
    }
    if (maxStepsInput && preset.maxSteps) {
        maxStepsInput.value = preset.maxSteps;
    }

    // States handling (if preset has states info)
    if (statesInput && preset.states) {
        statesInput.value = preset.states;
    }

    // Now start engine with preset
    document.getElementById('startBtn').click();
  }

  // render all presets
  presets.forEach(p => renderPresetCard(p));

})();