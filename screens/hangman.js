// =====================================================
// HANGMAN SCREENS — Selector de nivel + Juego
// =====================================================

// Configuración de dificultad por nivel
export const HANGMAN_CONFIG = {
  A1: { label: 'A1 — Beginner',      emoji: '🌱', lives: 8, color: '#16A34A', desc: 'Simple and common words. Perfect to start!' },
  A2: { label: 'A2 — Basic',          emoji: '🌿', lives: 7, color: '#2563EB', desc: 'Everyday vocabulary with a bit more difficulty.' },
  B1: { label: 'B1 — Intermediate',  emoji: '🔥', lives: 6, color: '#D97706', desc: 'Longer words. Concentration required.' },
  B2: { label: 'B2 — Advanced',      emoji: '⚡', lives: 5, color: '#7C3AED', desc: 'Complex vocabulary. For the brave only.' },
  C1: { label: 'C1 — Expert',        emoji: '💀', lives: 4, color: '#DC2626', desc: 'Extreme mode. Advanced phrases and words.' },
};

/** Pantalla de selección de nivel del ahorcado */
export function renderHangmanLevelSelect(currentLevel) {
  const levels = Object.entries(HANGMAN_CONFIG);

  const cards = levels.map(([key, cfg]) => {
    const isActive = key === currentLevel;
    return `
      <button class="hm-level-card ${isActive ? 'hm-level-active' : ''}"
              onclick="window._startHangmanLevel('${key}')"
              style="--level-color: ${cfg.color}">
        <span class="hm-level-emoji">${cfg.emoji}</span>
        <div class="hm-level-info">
          <div class="hm-level-name">${cfg.label}</div>
          <div class="hm-level-desc">${cfg.desc}</div>
        </div>
        <div class="hm-level-lives">
          ${'❤️'.repeat(cfg.lives > 6 ? 6 : cfg.lives)}${cfg.lives > 6 ? `+${cfg.lives - 6}` : ''}
        </div>
      </button>
    `;
  }).join('');

  return `
    <div class="screen hangman-level-screen">
      <div class="hangman-header">
        <button class="hangman-back-btn" onclick="window._back()">←</button>
        <div>
          <div class="hangman-title">The Hangman</div>
          <div class="hangman-subtitle">CHOOSE YOUR DIFFICULTY</div>
        </div>
        <div style="width:40px;"></div>
      </div>

      <div class="hm-level-hero">
        <div class="hm-level-hero-icon">🎮</div>
        <p class="hm-level-hero-text">Your current level is <strong>${currentLevel}</strong>. You can choose any level.</p>
      </div>

      <div class="hm-level-list">
        ${cards}
      </div>
    </div>
  `;
}

/** Pantalla principal del juego de ahorcado */
export function renderHangman(wordObj, level) {
  const cfg = HANGMAN_CONFIG[level] || HANGMAN_CONFIG['A1'];

  // Soporte para objetos enriquecidos o simples (compatibilidad con BD)
  const hint        = wordObj.hint        || wordObj;
  const translation = wordObj.translation || '';
  const type        = wordObj.type        || '';
  const example     = wordObj.example     || '';

  // Grammatical type labels in English
  const typeLabels = {
    noun: 'noun', verb: 'verb', adjective: 'adjective',
    adverb: 'adverb', phrase: 'phrase'
  };
  const typeLabel = typeLabels[type] || type;

  // Oración de ejemplo con el hueco donde va la palabra (si está disponible)
  const exampleHtml = example
    ? `<div class="hint-example">
         <span class="hint-example-label">📖 Example:</span>
         <em>"${example}"</em>
       </div>`
    : '';

  const translationHtml = translation
    ? `<div class="hint-translation">🇺🇸 ${translation}</div>`
    : '';

  const typeBadge = typeLabel
    ? `<span class="hint-type-badge">${typeLabel}</span>`
    : '';

  return `
    <div class="screen hangman-screen">
      <div class="hangman-header">
        <button class="hangman-back-btn" onclick="window._nav('hangman')">←</button>
        <div>
          <div class="hangman-title">The Hangman</div>
          <div class="hangman-subtitle" style="color:${cfg.color}">${cfg.emoji} ${cfg.label}</div>
        </div>
        <div class="hangman-lives" id="hm-lives">
          <!-- Corazones -->
        </div>
      </div>

      <div class="hangman-drawing">
        <svg class="hangman-svg" viewBox="0 0 100 120" stroke="var(--primary)" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M10 110 h80" />
          <path id="hm-part-1"  d="M30 110 v-100"  style="display:none;" />
          <path id="hm-part-2"  d="M30 10 h40"     style="display:none;" />
          <path id="hm-part-3"  d="M70 10 v20"     style="display:none;" />
          <circle id="hm-part-4"  cx="70" cy="40" r="10" style="display:none;" />
          <path id="hm-part-5"  d="M70 50 v30"     style="display:none;" />
          <path id="hm-part-6"  d="M70 60 l-15 15" style="display:none;" />
          <path id="hm-part-7"  d="M70 60 l15 15"  style="display:none;" />
          <path id="hm-part-8"  d="M70 80 l-15 20" style="display:none;" />
          <path id="hm-part-9"  d="M70 80 l15 20"  style="display:none;" />
          <circle id="hm-part-10" cx="67" cy="38" r="1.5" fill="var(--primary)" style="display:none;" />
          <circle id="hm-part-11" cx="73" cy="38" r="1.5" fill="var(--primary)" style="display:none;" />
        </svg>
      </div>

      <div class="hangman-word" id="hm-word-container">
        <!-- Letras dinámicas -->
      </div>

      <!-- Tarjeta de pista enriquecida -->
      <div class="hangman-hint-card">
        <div class="hint-header">
          <div class="hint-btn">💡 Hint</div>
          ${typeBadge}
        </div>
        <div class="hint-description">${hint}</div>
        ${translationHtml}
        ${exampleHtml}
      </div>

      <div class="hangman-keyboard" id="hm-keyboard">
        <!-- Teclado dinámico -->
      </div>
    </div>
  `;
}
