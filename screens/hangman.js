export function renderHangman(hint) {
  return `
    <div class="screen hangman-screen">
      <div class="hangman-header">
        <button class="hangman-back-btn" onclick="window._back()">←</button>
        <div>
          <div class="hangman-title">El Ahorcado</div>
          <div class="hangman-subtitle">MINIJUEGO DE VOCABULARIO</div>
        </div>
        <div class="hangman-lives" id="hm-lives">
          <!-- Corazones -->
        </div>
      </div>

      <div class="hangman-drawing">
        <!-- SVG del ahorcado ampliado a 11 partes -->
        <svg class="hangman-svg" viewBox="0 0 100 120" stroke="var(--primary)" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M10 110 h80" /> <!-- Base -->
          <path id="hm-part-1" d="M30 110 v-100" style="display:none;" /> <!-- Poste -->
          <path id="hm-part-2" d="M30 10 h40" style="display:none;" /> <!-- Poste superior -->
          <path id="hm-part-3" d="M70 10 v20" style="display:none;" /> <!-- Cuerda -->
          <circle id="hm-part-4" cx="70" cy="40" r="10" style="display:none;" /> <!-- Cabeza -->
          <path id="hm-part-5" d="M70 50 v30" style="display:none;" /> <!-- Cuerpo -->
          <path id="hm-part-6" d="M70 60 l-15 15" style="display:none;" /> <!-- Brazo izq -->
          <path id="hm-part-7" d="M70 60 l15 15" style="display:none;" /> <!-- Brazo der -->
          <path id="hm-part-8" d="M70 80 l-15 20" style="display:none;" /> <!-- Pierna izq -->
          <path id="hm-part-9" d="M70 80 l15 20" style="display:none;" /> <!-- Pierna der -->
          <circle id="hm-part-10" cx="67" cy="38" r="1" fill="var(--primary)" style="display:none;" /> <!-- Ojo izq -->
          <circle id="hm-part-11" cx="73" cy="38" r="1" fill="var(--primary)" style="display:none;" /> <!-- Ojo der -->
        </svg>
      </div>

      <div class="hangman-word" id="hm-word-container">
        <!-- Letras y espacios -->
      </div>

      <div class="hangman-hint-card">
        <div class="hint-btn">💡 Pista</div>
        <div class="hint-text">"${hint}"</div>
      </div>

      <div class="hangman-keyboard" id="hm-keyboard">
        <!-- Teclado dinámico -->
      </div>
    </div>
  `;
}
