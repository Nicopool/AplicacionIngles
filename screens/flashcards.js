import { AppHeader } from '../components/common.js';

export function renderFlashcards() {
  return `
    <div class="screen flashcard-screen">
      ${AppHeader('Banco de Repaso')}
      
      <div id="flashcards-container">
        <!-- Renderizado de tarjetas dinámico -->
      </div>

      <div class="vocab-list" id="vocab-list">
         <div class="test-question-label mt-24 mb-12" style="padding-left:10px;">Todas tus palabras:</div>
         <div class="loader"><div class="spinner"></div></div>
      </div>
    </div>
  `;
}

export function renderSingleFlashcard(vocab) {
  return `
    <div class="flashcard-container" id="fc-cont" onclick="this.querySelector('.flashcard').classList.toggle('flipped')">
      <div class="flashcard">
        <div class="flashcard-face flashcard-front">
          <div class="flashcard-hint">Tap to flip</div>
          <div class="flashcard-word">${vocab.word}</div>
        </div>
        <div class="flashcard-face flashcard-back">
          <div class="flashcard-translation">${vocab.translation}</div>
        </div>
      </div>
    </div>
    <div class="flashcard-actions">
      <button class="fc-btn fc-btn-wrong" id="fc-wrong">❌ No la sabía</button>
      <button class="fc-btn fc-btn-right" id="fc-right">✅ Lo sabía</button>
    </div>
  `;
}
