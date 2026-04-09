import { AppHeader } from '../components/common.js';

export function renderSpeaking() {
  return `
    <div class="screen exercise-screen">
      ${AppHeader('Speaking Practice')}
      
      <div class="exercise-body">
        <div class="speaking-card">
          <div class="test-question-label mb-16">Lee la siguiente frase en voz alta:</div>
          <div class="speaking-phrase" id="speaking-prompt">
            Loading...
          </div>
          
          <div style="height:40px;"></div>

          <button class="mic-btn" id="btn-mic">
            🎤
          </button>
          <div class="mic-label" id="mic-status">Toca para hablar</div>
          
          <div id="speaking-result" style="display:none; margin-top:24px;"></div>
        </div>
      </div>

      <div class="action-bar" style="padding:16px 20px;">
        <button class="btn btn-secondary" id="btn-next-speaking" style="display:none; width:100%;">
          Siguiente →
        </button>
      </div>
    </div>
  `;
}
