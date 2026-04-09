export function renderPlacementTest() {
  return `
    <div class="screen test-screen">
      <div class="test-header">
        <div class="test-meta">
          <div class="test-counter">QUESTION <span id="current-q">1</span> OF 10</div>
          <div class="test-badge">✨ You're doing great!</div>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="test-progress" style="width: 10%"></div>
        </div>
      </div>

      <div class="test-body" id="test-container">
        <!-- Dynamic content rendered by JS -->
        <div class="loader"><div class="spinner"></div><p>Loading test...</p></div>
      </div>

      <div class="bottom-nav" style="padding:16px 20px;">
        <button class="btn btn-primary" id="btn-next" disabled>
          Confirm →
        </button>
      </div>
    </div>
  `;
}

export function renderTestQuestion(q, onSelect) {
  const optionsHtml = q.options.map((opt, i) => {
    const letter = String.fromCharCode(65 + i); // A, B, C...
    return `
      <div class="test-option" data-idx="${i}" onclick="window._selectOption(${i})">
        <div class="option-letter">${letter}</div>
        <div class="option-text">${opt}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="test-question-card">
      <div class="test-question-label">Choose the correct word:</div>
      <div class="test-question-text">${q.question.replace('____', '<span class="test-question-gap">____</span>')}</div>
    </div>
    <div class="test-options" id="test-options">
      ${optionsHtml}
    </div>
  `;
}
