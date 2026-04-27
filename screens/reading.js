import { AppHeader } from '../components/common.js';

// Color palette per level
const LEVEL_COLORS = {
  A1: { bg: '#DCFCE7', text: '#16A34A', icon: '🌱', label: 'Beginner' },
  A2: { bg: '#DBEAFE', text: '#2563EB', icon: '🌿', label: 'Basic' },
  B1: { bg: '#FEF3C7', text: '#D97706', icon: '🔥', label: 'Intermediate' },
  B2: { bg: '#EDE9FE', text: '#7C3AED', icon: '⚡', label: 'Advanced' },
  C1: { bg: '#FEE2E2', text: '#DC2626', icon: '💀', label: 'Expert' },
};

export function renderReadingList(level) {
  const lc = LEVEL_COLORS[level] || LEVEL_COLORS['A1'];

  return `
    <div class="screen reading-list-screen" style="min-height:100vh; background: var(--bg); padding-bottom: 90px;">

      <!-- Hero Banner -->
      <div style="
        background: linear-gradient(135deg, ${lc.text}18 0%, ${lc.text}06 100%);
        border-bottom: 1px solid ${lc.text}20;
        padding: 20px 20px 24px;
      ">
        <!-- Back row -->
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
          <button onclick="window._nav('dashboard')" style="
            width:36px; height:36px; border-radius:50%; border:none;
            background:white; box-shadow:0 2px 8px rgba(0,0,0,0.1);
            font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;
            transition: transform 0.15s;
          " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">←</button>
          <span style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px;">Immersive Reading</span>
        </div>

        <!-- Title + Badge -->
        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div>
            <div style="font-size:28px; font-weight:900; color:var(--text-main); line-height:1.1; margin-bottom:8px;">
              ${lc.icon} Stories<br><span style="color:${lc.text};">Level ${level}</span>
            </div>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.5; max-width:200px;">
              Tap any word to translate it instantly and save it to your vocabulary.
            </div>
          </div>
          <div style="
            background:${lc.bg}; color:${lc.text}; border:2px solid ${lc.text}30;
            border-radius:16px; padding:10px 14px; text-align:center;
            font-weight:800; font-size:13px; white-space:nowrap; flex-shrink:0;
          ">
            ${lc.icon}<br>${lc.label}
          </div>
        </div>

        <!-- Stats chips -->
        <div style="display:flex; gap:10px; margin-top:20px;">
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:var(--text-main);" id="rl-count">…</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">Stories</div>
          </div>
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:var(--text-main);" id="rl-time">…</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">Tot. mins</div>
          </div>
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:${lc.text};">+5</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">XP / Quiz</div>
          </div>
        </div>
      </div>

      <!-- Tip banner -->
      <div style="margin:16px 16px 0; background:${lc.bg}; border-radius:14px; padding:12px 16px; display:flex; align-items:center; gap:10px;">
        <span style="font-size:20px;">💡</span>
        <span style="font-size:12px; color:${lc.text}; font-weight:600; line-height:1.4;">
          Tap words to hear pronunciation and auto-save to Flashcards!
        </span>
      </div>

      <!-- Section label -->
      <div style="padding:20px 20px 10px; display:flex; align-items:center; justify-content:space-between;">
        <div style="font-size:15px; font-weight:800; color:var(--text-main);">📚 Available Stories</div>
        <div style="font-size:12px; color:var(--text-muted); background:var(--bg-card); padding:4px 10px; border-radius:100px; font-weight:600; border:1px solid var(--border);">
          ${level}
        </div>
      </div>

      <!-- Reading cards (dynamic) -->
      <div id="reading-list-container" style="padding:0 16px;">
        <div class="loader"><div class="spinner"></div></div>
      </div>
    </div>
  `;
}

export function renderReadingContent(reading) {
  // Parse content for tap-to-translate
  const words = reading.content.split(' ').map(w => `<span class="tap-word">${w}</span>`).join(' ');

  const query = reading.title.toLowerCase().split(' ').join(',');
  const heroImg = `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80`;
  const dynamicImg = `https://source.unsplash.com/featured/800x600/?${query},learning`;

  return `
    <div class="screen reading-screen">
      ${AppHeader('Reading: ' + reading.title)}
      <div class="reading-hero-img">
        <img src="${dynamicImg}" style="width:100%; height:100%; object-fit:cover; border-radius:32px;" alt="Reading Background" onerror="this.src='${heroImg}'">
        <div class="reading-level-tag">${reading.level} READING</div>
        <div class="reading-title">${reading.title}</div>
      </div>
      
      <div class="reading-content-card">
        <div class="reading-text" id="reading-text">
          ${words}
        </div>

        <button class="btn btn-primary mt-24" id="btn-finish-reading" style="width:100%;">
          Finished Reading? Take Quiz! 📝
        </button>
      </div>

      <div class="reading-bar">
        <div class="reading-progress">
          <div class="reading-progress-fill" style="width: 0%"></div>
        </div>
        <div class="reading-controls">
          <button class="reading-ctrl-btn" style="font-size:14px; font-weight:700;">1.0x</button>
          <button class="reading-ctrl-btn"><i class="bi bi-rewind-fill"></i></button>
          <button class="reading-play-btn" id="btn-play-all"><i class="bi bi-play-fill"></i></button>
          <button class="reading-ctrl-btn"><i class="bi bi-fast-forward-fill"></i></button>
          <button class="reading-ctrl-btn"><i class="bi bi-gear-fill"></i></button>
        </div>
      </div>
      
      <!-- Translation Pop-up (Hidden) -->
      <div id="translation-popup" class="translation-popup" style="display:none;">
        <div class="popup-lang">Spanish <span style="float:right; color:var(--gold)">⭐</span></div>
        <div class="popup-translation" id="popup-text">...</div>
        <div class="popup-actions">
          <button class="popup-audio-btn" id="popup-audio">🔊</button>
          <button class="popup-save-btn" id="popup-save">💾</button>
        </div>
      </div>
    </div>
  `;
}
