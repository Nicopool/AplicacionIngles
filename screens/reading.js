import { AppHeader } from '../components/common.js';

export function renderReadingList(level) {
  return `
    <div class="screen bg-white" style="min-height:100vh; background: var(--bg);">
      ${AppHeader('Reading Inmersivo')}
      
      <div style="padding:20px;">
        <div class="test-question-label mb-16">Textos Disponibles (Nivel ${level})</div>
        <div id="reading-list-container">
          <div class="loader"><div class="spinner"></div></div>
        </div>
      </div>
    </div>
  `;
}

export function renderReadingContent(reading) {
  // Parse content for tap-to-translate
  const words = reading.content.split(' ').map(w => `<span class="tap-word">${w}</span>`).join(' ');

  const query = reading.title.toLowerCase().split(' ').join(',');
  const heroImg = `https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80`; // Fallback image base
  // Note: Real dynamic search would need an API key, so we'll use a curated educational collection fallback or keywords in Unsplash Source
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
      
      <!-- Pop-up Traducción (Oculto) -->
      <div id="translation-popup" class="translation-popup" style="display:none;">
        <div class="popup-lang">Español <span style="float:right; color:var(--gold)">⭐</span></div>
        <div class="popup-translation" id="popup-text">...</div>
        <div class="popup-actions">
          <button class="popup-audio-btn" id="popup-audio">🔊</button>
          <button class="popup-save-btn" id="popup-save">💾</button>
        </div>
      </div>
    </div>
  `;
}
