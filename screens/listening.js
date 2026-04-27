import { AppHeader } from '../components/common.js';

// Configuración de niveles de Listening
export const LISTENING_CONFIG = {
  A1: { label: 'A1 — Beginner',      emoji: '🌱', color: '#16A34A', desc: 'Slow audio and basic vocabulary.' },
  A2: { label: 'A2 — Basic',          emoji: '🌿', color: '#2563EB', desc: 'Short conversations from daily life.' },
  B1: { label: 'B1 — Intermediate',  emoji: '🔥', color: '#D97706', desc: 'Normal speed and longer sentences.' },
  B2: { label: 'B2 — Advanced',      emoji: '⚡', color: '#7C3AED', desc: 'Real accents and complex vocabulary.' },
  C1: { label: 'C1 — Expert',        emoji: '💀', color: '#DC2626', desc: 'Fast audio, idioms and no subtitles.' },
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
          <div class="hangman-subtitle">CHOOSE YOUR LEVEL</div>
        </div>
        <div style="width:40px;"></div>
      </div>

      <div class="hm-level-hero">
        <div class="hm-level-hero-icon">🎧</div>
        <p class="hm-level-hero-text">Your current level is <strong>${currentLevel}</strong>. Sharpen your ear by choosing the right challenge.</p>
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
          <div style="font-weight:700; text-align:center; margin-bottom:8px;">Track 1</div>
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
          <div class="test-question-label">Listen and fill in the blank:</div>
          <div class="test-question-text" id="listening-prompt" style="line-height:2.5;">
             Loading...
          </div>
          <div id="listening-result" style="display:none;"></div>
        </div>
      </div>

      <div class="action-bar" style="padding:16px 20px;">
        <button class="btn btn-primary" id="btn-check-listening" style="width:100%;">
          Check Answer
        </button>
      </div>
    </div>
  `;
}
