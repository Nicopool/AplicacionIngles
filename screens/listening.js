import { AppHeader } from '../components/common.js';

// Configuración de niveles de Listening
export const LISTENING_CONFIG = {
  A1: { label: 'A1 — Principiante', emoji: '🌱', color: '#16A34A', desc: 'Audios lentos y vocabulario básico.' },
  A2: { label: 'A2 — Básico',       emoji: '🌿', color: '#2563EB', desc: 'Conversaciones breves de la vida diaria.' },
  B1: { label: 'B1 — Intermedio',   emoji: '🔥', color: '#D97706', desc: 'Velocidad normal y oraciones más largas.' },
  B2: { label: 'B2 — Avanzado',     emoji: '⚡', color: '#7C3AED', desc: 'Acentos reales y vocabulario complejo.' },
  C1: { label: 'C1 — Experto',      emoji: '💀', color: '#DC2626', desc: 'Audios rápidos, modismos y sin subtítulos.' },
};

/** Pantalla de selección de nivel de Listening */
export function renderListeningLevelSelect(currentLevel) {
  const levels = Object.entries(LISTENING_CONFIG);

  const cards = levels.map(([key, cfg]) => {
    const isActive = key === currentLevel;
    return `
      <button class="hm-level-card ${isActive ? 'hm-level-active' : ''}"
              onclick="window._startListeningLevel('${key}')"
              style="--level-color: ${cfg.color}">
        <span class="hm-level-emoji">${cfg.emoji}</span>
        <div class="hm-level-info">
          <div class="hm-level-name">${cfg.label}</div>
          <div class="hm-level-desc">${cfg.desc}</div>
        </div>
        <div class="hm-level-arrow" style="font-size:20px; font-weight:900; color:var(--text-muted)">→</div>
      </button>
    `;
  }).join('');

  return `
    <div class="screen bg-white" style="min-height:100vh; background: var(--bg);">
      <div class="hangman-header">
        <button class="hangman-back-btn" onclick="window._back()">←</button>
        <div>
          <div class="hangman-title">Listening Skills</div>
          <div class="hangman-subtitle">ELIGE TU NIVEL</div>
        </div>
        <div style="width:40px;"></div>
      </div>

      <div class="hm-level-hero">
        <div class="hm-level-hero-icon">🎧</div>
        <p class="hm-level-hero-text">Tu nivel actual es <strong>${currentLevel}</strong>. Afina tu oído eligiendo el desafío adecuado.</p>
      </div>

      <div class="hm-level-list">
        ${cards}
      </div>
    </div>
  `;
}

export function renderListening(level) {
  const cfg = LISTENING_CONFIG[level] || LISTENING_CONFIG['A1'];
  
  return `
    <div class="screen exercise-screen">
      <div class="hangman-header" style="background:var(--bg-card); padding:16px; border-bottom:1px solid var(--border);">
        <button class="hangman-back-btn" onclick="window._nav('listening_levels')">←</button>
        <div style="text-align:center;">
          <div class="hangman-title">Listening Practice</div>
          <div class="hangman-subtitle" style="color:${cfg.color}">${cfg.emoji} ${cfg.label}</div>
        </div>
        <div style="width:40px;"></div>
      </div>
      
      <div class="exercise-body">
        <div class="audio-player paused" id="audio-player">
          <div style="font-weight:700; text-align:center; margin-bottom:8px;">Pista 1</div>
          <div class="audio-waveform">
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
            <div class="wave-bar"></div><div class="wave-bar"></div>
          </div>
          <div class="audio-controls">
            <button class="audio-btn">⏪</button>
            <button class="audio-play-main" id="btn-listen-play">▶</button>
            <button class="audio-btn">⏩</button>
          </div>
        </div>

        <div class="exercise-card">
          <div class="test-question-label">Escucha y completa:</div>
          <div class="test-question-text" id="listening-prompt" style="line-height:2.5;">
             Loading...
          </div>
          <div id="listening-result" style="display:none;"></div>
        </div>
      </div>

      <div class="action-bar" style="padding:16px 20px;">
        <button class="btn btn-primary" id="btn-check-listening" style="width:100%;">
          Comprobar
        </button>
      </div>
    </div>
  `;
}
