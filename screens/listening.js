import { AppHeader } from '../components/common.js';

export function renderListening() {
  return `
    <div class="screen exercise-screen">
      ${AppHeader('Listening Practice')}
      
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
