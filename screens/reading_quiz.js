import { AppHeader } from '../components/common.js';

export function renderReadingQuiz(reading) {
  return `
    <div class="screen quiz-screen">
      ${AppHeader('Quiz: ' + reading.title)}
      
      <div class="test-header">
        <div class="test-meta">
          <div class="test-counter">QUESTION <span id="quiz-current-q">1</span> OF <span id="quiz-total-q">0</span></div>
          <div class="test-badge">✨ Testing your comprehension</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="quiz-progress" style="width: 0%"></div>
        </div>
      </div>

      <div class="test-body" id="quiz-container" style="padding:20px;">
        <div class="loader"><div class="spinner"></div><p>Loading questions...</p></div>
      </div>

      <div class="bottom-nav" style="padding:16px 20px;">
        <button class="btn btn-primary" id="btn-next-quiz" disabled>
          Confirm →
        </button>
      </div>
    </div>
  `;
}

export function renderQuizQuestion(q) {
  const optionsHtml = q.options.map((opt, i) => {
    const letter = String.fromCharCode(65 + i);
    return `
      <div class="test-option" data-idx="${i}" onclick="window._selectQuizOption(${i})">
        <div class="option-letter">${letter}</div>
        <div class="option-text">${opt}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="test-question-card">
      <div class="test-question-label">Comprehension Question:</div>
      <div class="test-question-text">${q.question}</div>
    </div>
    <div class="test-options">
      ${optionsHtml}
    </div>
  `;
}
