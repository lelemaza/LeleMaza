/* =====================================================================
   APP.JS — Website ka logic. Isko edit karne ki normally zaroorat nahi.
   ===================================================================== */

const app = document.getElementById('app');
const brandLink = document.getElementById('brandLink');
const searchInput = document.getElementById('searchInput');

// ---- Apply site name everywhere ----
document.title = SITE.name;
brandLink.textContent = SITE.name;

// ---- Icon set for custom player controls ----
const ICONS = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>`,
  volHigh: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 10v4h4l5 5V5L7 10H3zm13.5 2c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  volMute: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 8v1.79l2.48 2.48c.01-.09.02-.18.02-.27zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4l-1.88 1.88L12 7.76V4z"/></svg>`,
  fsEnter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
  fsExit: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`
};

// ---- Helpers ----
function escapeHtml(str){
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function slugify(str){
  return String(str).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)/g,'');
}

function findVideo(id){
  return VIDEOS.find(v => v.id === id);
}

function seriesVideos(seriesName){
  return VIDEOS
    .filter(v => v.series === seriesName)
    .sort((a,b) => (a.part||0) - (b.part||0));
}

function randomOthers(excludeId){
  const pool = VIDEOS.filter(v => v.id !== excludeId);
  for(let i = pool.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

// Returns player markup + whether it's a real <video> (custom controls) or a YouTube iframe
function playerMarkup(url){
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if(yt){
    return {
      isVideo: false,
      html: `<iframe src="https://www.youtube.com/embed/${yt[1]}" title="video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>`
    };
  }
  return {
    isVideo: true,
    html: `<video id="mainVideo" src="${escapeHtml(url)}" autoplay playsinline webkit-playsinline disablePictureInPicture></video>`
  };
}

// ---- Card renderer ----
function cardHtml(v){
  const showBadge = v.part ? `<span class="part-badge">Part ${escapeHtml(v.part)}</span>` : '';
  return `
    <div class="card" data-id="${escapeHtml(v.id)}" tabindex="0" role="button" aria-label="Play ${escapeHtml(v.title)}">
      <div class="thumb">
        <img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy">
        ${showBadge}
        <div class="play-dot">
          <svg width="46" height="46" viewBox="0 0 24 24" fill="#E8A33D"><circle cx="12" cy="12" r="11" fill="rgba(11,14,20,0.7)" stroke="#E8A33D" stroke-width="1.4"/><path d="M10 8l6 4-6 4V8z"/></svg>
        </div>
      </div>
      <div class="card-info">
        <h3>${escapeHtml(v.title)}</h3>
        <p class="series-name">${escapeHtml(v.series)}</p>
      </div>
    </div>`;
}

function attachCardHandlers(){
  document.querySelectorAll('.card').forEach(card => {
    const go = () => { window.location.hash = `#/watch/${encodeURIComponent(card.dataset.id)}`; };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
  });
}

// ---- Page renderers ----
function renderHome(query){
  const q = (query||'').trim().toLowerCase();
  const list = q
    ? VIDEOS.filter(v => v.title.toLowerCase().includes(q) || v.series.toLowerCase().includes(q))
    : VIDEOS;

  if(list.length === 0){
    app.innerHTML = `
      <div class="empty-state">
        <h2>Kuch nahi mila</h2>
        <p>"${escapeHtml(query)}" se milta koi video nahi hai. Kuch aur try karo.</p>
        <a class="back-link" href="#/">Sare videos dekho</a>
      </div>`;
    return;
  }

  app.innerHTML = `
    <h1 class="section-title">${q ? `Results for "${escapeHtml(query)}"` : 'All Videos'}</h1>
    <p class="section-sub">${q ? `${list.length} video(s) mile` : 'Kuch bhi play karo, shuru ho jao'}</p>
    <div class="grid">${list.map(cardHtml).join('')}</div>
  `;
  attachCardHandlers();
}

function renderWatch(id){
  const v = findVideo(id);
  if(!v){
    app.innerHTML = `
      <div class="empty-state">
        <h2>Video nahi mila</h2>
        <p>Ye video available nahi hai.</p>
        <a class="back-link" href="#/">Home par wapas jao</a>
      </div>`;
    return;
  }

  const others = randomOthers(v.id);
  const player = playerMarkup(v.videoUrl);

  app.innerHTML = `
    <div class="watch-page">
      <div class="player-wrap" id="playerWrap">
        ${player.html}
        ${player.isVideo ? `
        <div class="seek-zone seek-left" id="seekLeft"></div>
        <div class="seek-zone seek-right" id="seekRight"></div>
        <div class="seek-indicator seek-indicator-left" id="seekIndicatorLeft">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style="transform:scaleX(-1)"><path d="M4 18l8.5-6L4 6v12zm9 0l8.5-6L13 6v12z"/></svg>
          <span>10s</span>
        </div>
        <div class="seek-indicator seek-indicator-right" id="seekIndicatorRight">
          <span>10s</span>
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M4 18l8.5-6L4 6v12zm9 0l8.5-6L13 6v12z"/></svg>
        </div>
        <div class="video-controls" id="videoControls">
          <div class="progress-row">
            <input type="range" id="seekBar" class="seek-bar" value="0" min="0" max="100" step="0.1">
          </div>
          <div class="controls-row">
            <button id="playPauseBtn" class="ctrl-btn" aria-label="Play or pause"></button>
            <span id="timeLabel" class="time-label">0:00 / 0:00</span>
            <div class="spacer"></div>
            <button id="muteBtn" class="ctrl-btn" aria-label="Mute or unmute"></button>
            <input type="range" id="volumeBar" class="volume-bar" min="0" max="1" step="0.05" value="1">
            <button id="fsBtn" class="ctrl-btn" aria-label="Fullscreen"></button>
          </div>
        </div>` : ''}
      </div>
      <h1 class="video-title">${escapeHtml(v.title)}</h1>
      <button class="series-pill" id="seriesBtn" data-series="${escapeHtml(v.series)}">
        Series: <b>${escapeHtml(v.series)}</b> →
      </button>

      <div class="filmstrip"></div>

      <section class="more-videos">
        <h2 class="section-title" style="font-size:22px;">More to watch</h2>
        <div class="grid">${others.map(cardHtml).join('')}</div>
      </section>
    </div>
  `;
  attachCardHandlers();

  document.getElementById('seriesBtn').addEventListener('click', () => {
    window.location.hash = `#/series/${encodeURIComponent(slugify(v.series))}`;
  });

  setupFakeFullscreen();
  if(player.isVideo) setupCustomControls();
}

function renderSeries(slug){
  const seriesName = (VIDEOS.find(v => slugify(v.series) === slug) || {}).series;
  if(!seriesName){
    app.innerHTML = `
      <div class="empty-state">
        <h2>Series nahi mili</h2>
        <a class="back-link" href="#/">Home par wapas jao</a>
      </div>`;
    return;
  }

  const parts = seriesVideos(seriesName);
  app.innerHTML = `
    <div class="series-page">
      <h1 class="section-title">${escapeHtml(seriesName)}</h1>
      <p class="section-sub">${parts.length} part${parts.length > 1 ? 's' : ''}</p>
      <div class="grid">${parts.map(cardHtml).join('')}</div>
    </div>
  `;
  attachCardHandlers();
}

// ---- Fake fullscreen on phone landscape (avoids native OS fullscreen hint) ----
let _fsMediaQuery = null;
let _fsHandler = null;

function teardownFakeFullscreen(){
  if(_fsMediaQuery && _fsHandler){
    _fsMediaQuery.removeEventListener('change', _fsHandler);
  }
  _fsMediaQuery = null;
  _fsHandler = null;
  document.body.classList.remove('lock-scroll', 'video-fullscreen-active');
  const playerWrap = document.querySelector('.player-wrap');
  if(playerWrap) playerWrap.classList.remove('fake-fullscreen', 'rotated-landscape');
}

function setupFakeFullscreen(){
  const playerWrap = document.querySelector('.player-wrap');
  if(!playerWrap) return;

  _fsMediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 500px)');

  _fsHandler = (e) => {
    const fsBtn = document.getElementById('fsBtn');
    if(e.matches){
      playerWrap.classList.add('fake-fullscreen');
      document.body.classList.add('lock-scroll', 'video-fullscreen-active');
      if(fsBtn) fsBtn.innerHTML = ICONS.fsExit;
    } else {
      playerWrap.classList.remove('fake-fullscreen');
      document.body.classList.remove('lock-scroll', 'video-fullscreen-active');
      if(fsBtn) fsBtn.innerHTML = ICONS.fsEnter;
    }
  };

  _fsMediaQuery.addEventListener('change', _fsHandler);
  _fsHandler(_fsMediaQuery);
}

// ---- Custom video controls (play/pause, seek, volume, fullscreen) ----
function setupCustomControls(){
  const video = document.getElementById('mainVideo');
  if(!video) return; // YouTube iframe — has its own controls, skip

  const playerWrap = document.getElementById('playerWrap');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const seekBar = document.getElementById('seekBar');
  const timeLabel = document.getElementById('timeLabel');
  const muteBtn = document.getElementById('muteBtn');
  const volumeBar = document.getElementById('volumeBar');
  const fsBtn = document.getElementById('fsBtn');

  playPauseBtn.innerHTML = ICONS.play;
  muteBtn.innerHTML = ICONS.volHigh;
  fsBtn.innerHTML = playerWrap.classList.contains('fake-fullscreen') ? ICONS.fsExit : ICONS.fsEnter;

  function fmt(t){
    if(isNaN(t)) return '0:00';
    const m = Math.floor(t/60);
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function togglePlay(){ video.paused ? video.play() : video.pause(); }

  playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('play', () => { playPauseBtn.innerHTML = ICONS.pause; });
  video.addEventListener('pause', () => { playPauseBtn.innerHTML = ICONS.play; });

  video.addEventListener('loadedmetadata', () => {
    timeLabel.textContent = `${fmt(0)} / ${fmt(video.duration)}`;
  });

  video.addEventListener('timeupdate', () => {
    if(video.duration){
      seekBar.value = (video.currentTime / video.duration) * 100;
      timeLabel.textContent = `${fmt(video.currentTime)} / ${fmt(video.duration)}`;
    }
  });

  seekBar.addEventListener('input', () => {
    if(video.duration) video.currentTime = (seekBar.value / 100) * video.duration;
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? ICONS.volMute : ICONS.volHigh;
    volumeBar.value = video.muted ? 0 : video.volume;
  });

  volumeBar.addEventListener('input', () => {
    video.volume = volumeBar.value;
    video.muted = (Number(volumeBar.value) === 0);
    muteBtn.innerHTML = video.muted ? ICONS.volMute : ICONS.volHigh;
  });

  fsBtn.addEventListener('click', () => {
    const isActive = playerWrap.classList.contains('fake-fullscreen') || playerWrap.classList.contains('rotated-landscape');

    if(isActive){
      playerWrap.classList.remove('fake-fullscreen', 'rotated-landscape');
      document.body.classList.remove('lock-scroll', 'video-fullscreen-active');
      fsBtn.innerHTML = ICONS.fsEnter;
    } else {
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      playerWrap.classList.add(isPortrait ? 'rotated-landscape' : 'fake-fullscreen');
      document.body.classList.add('lock-scroll', 'video-fullscreen-active');
      fsBtn.innerHTML = ICONS.fsExit;
    }
  });

  // ---- Double-tap to seek: right side +10s, left side -10s ----
  const seekLeft = document.getElementById('seekLeft');
  const seekRight = document.getElementById('seekRight');
  const indicatorLeft = document.getElementById('seekIndicatorLeft');
  const indicatorRight = document.getElementById('seekIndicatorRight');

  function flashIndicator(el){
    el.classList.remove('show');
    void el.offsetWidth; // restart animation
    el.classList.add('show');
  }

  function attachDoubleTapSeek(zone, seconds, indicatorEl){
    let lastTap = 0;
    zone.addEventListener('click', () => {
      const now = Date.now();
      if(now - lastTap < 350){
        const target = video.currentTime + seconds;
        video.currentTime = Math.min(Math.max(target, 0), video.duration || target);
        flashIndicator(indicatorEl);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    });
  }

  attachDoubleTapSeek(seekLeft, -10, indicatorLeft);
  attachDoubleTapSeek(seekRight, 10, indicatorRight);

  // Auto-hide controls a few seconds after activity, while playing
  let hideTimer;
  function showControls(){
    playerWrap.classList.remove('controls-hidden');
    clearTimeout(hideTimer);
    if(!video.paused){
      hideTimer = setTimeout(() => playerWrap.classList.add('controls-hidden'), 3000);
    }
  }
  ['mousemove','touchstart','click'].forEach(evt => playerWrap.addEventListener(evt, showControls));
  video.addEventListener('play', showControls);
  video.addEventListener('pause', () => { clearTimeout(hideTimer); playerWrap.classList.remove('controls-hidden'); });
  showControls();
}

// Safety net: if the browser auto-triggers its own native fullscreen on a
// <video> (some Android Chrome versions do this on rotate), exit it right
// away — our CSS-based fake-fullscreen takes over instead.
document.addEventListener('fullscreenchange', () => {
  if(document.fullscreenElement && document.fullscreenElement.tagName === 'VIDEO'){
    document.exitFullscreen().catch(() => {});
  }
});

// ---- Router ----
function router(){
  teardownFakeFullscreen();
  const hash = window.location.hash || '#/';
  const [, path, param] = hash.split('/');

  if(path === 'watch' && param){
    renderWatch(decodeURIComponent(param));
  } else if(path === 'series' && param){
    renderSeries(decodeURIComponent(param));
  } else {
    renderHome(searchInput.value);
  }
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

window.addEventListener('hashchange', router);

searchInput.addEventListener('input', () => {
  if(window.location.hash.startsWith('#/watch') || window.location.hash.startsWith('#/series')){
    window.location.hash = '#/';
  }
  renderHome(searchInput.value);
});

brandLink.addEventListener('click', () => { searchInput.value = ''; });

// ---- Init ----
router();
