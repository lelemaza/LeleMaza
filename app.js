/* =====================================================================
   APP.JS — Website ka logic. Isko edit karne ki normally zaroorat nahi.
   ===================================================================== */

const app = document.getElementById('app');
const brandLink = document.getElementById('brandLink');
const searchInput = document.getElementById('searchInput');

// ---- Apply site name everywhere ----
document.title = SITE.name;
brandLink.textContent = SITE.name;

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

function embedFor(url){
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if(yt){
    return `<iframe src="https://www.youtube.com/embed/${yt[1]}" title="video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
  }
  return `<video id="mainVideo" src="${escapeHtml(url)}" autoplay playsinline webkit-playsinline disablePictureInPicture></video>`;
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

  app.innerHTML = `
    <div class="watch-page">
      <div class="player-wrap">
        ${embedFor(v.videoUrl)}
        <div class="custom-controls" id="customControls">
          <button id="playPauseBtn" class="ctrl-btn">▶</button>
          <input type="range" id="seekBar" class="seek-bar" value="0" min="0" max="100" step="0.1">
          <span id="timeLabel" class="time-label">0:00 / 0:00</span>
          <button id="muteBtn" class="ctrl-btn">🔊</button>
          <button id="fsBtn" class="ctrl-btn">⤢</button>
        </div>
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
  setupCustomControls();
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
  document.body.classList.remove('lock-scroll');
}

function setupFakeFullscreen(){
  const playerWrap = document.querySelector('.player-wrap');
  if(!playerWrap) return;

  _fsMediaQuery = window.matchMedia('(orientation: landscape) and (max-height: 500px)');

  _fsHandler = (e) => {
    if(e.matches){
      playerWrap.classList.add('fake-fullscreen');
      document.body.classList.add('lock-scroll');
    } else {
      playerWrap.classList.remove('fake-fullscreen');
      document.body.classList.remove('lock-scroll');
    }
  };

  _fsMediaQuery.addEventListener('change', _fsHandler);
  _fsHandler(_fsMediaQuery);
}

// ---- Custom video controls (play/pause, seek, mute, fullscreen toggle) ----
function setupCustomControls(){
  const video = document.getElementById('mainVideo');
  if(!video) return; // YouTube iframe case — skip

  const playPauseBtn = document.getElementById('playPauseBtn');
  const seekBar = document.getElementById('seekBar');
  const timeLabel = document.getElementById('timeLabel');
  const muteBtn = document.getElementById('muteBtn');
  const fsBtn = document.getElementById('fsBtn');
  const playerWrap = document.querySelector('.player-wrap');

  function fmt(t){
    if(isNaN(t)) return '0:00';
    const m = Math.floor(t/60);
    const s = Math.floor(t%60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  video.addEventListener('click', () => video.paused ? video.play() : video.pause());
  playPauseBtn.addEventListener('click', () => video.paused ? video.play() : video.pause());
  video.addEventListener('play', () => playPauseBtn.textContent = '⏸');
  video.addEventListener('pause', () => playPauseBtn.textContent = '▶');

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
    muteBtn.textContent = video.muted ? '🔇' : '🔊';
  });

  fsBtn.addEventListener('click', () => {
    playerWrap.classList.toggle('fake-fullscreen');
    document.body.classList.toggle('lock-scroll');
  });
}

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
