import { AppHeader } from '../components/common.js';

export function renderWriting() {
  return `
    <div class="screen exercise-screen">
      ${AppHeader('Writing Practice')}
      
      <div class="exercise-body">
        <div class="exercise-card">
          <div class="test-question-label">Complete the sentence:</div>
          <div class="test-question-text" id="writing-prompt" style="line-height:2.5;">
            <!-- Renderizado dinámico -->
            Loading...
          </div>
          
          <!-- Grammar Rule UI -->
          <div id="grammar-rule-card" class="mt-16" style="display:none; background: var(--primary-light); padding:12px; border-radius:12px; font-size:13px; color: var(--primary); border: 1px dashed var(--primary);">
            <i class="bi bi-lightbulb-fill"></i> <strong style="text-transform:uppercase; font-size:11px;">Grammar Rule:</strong><br>
            <span id="grammar-text"></span>
          </div>

          <div id="writing-result" class="mt-16" style="display:none;"></div>
        </div>
      </div>

      <div class="action-bar" style="padding:16px 20px;">
        <button class="btn btn-primary" id="btn-check-writing" style="width:100%;">
          Check Answer <i class="bi bi-check-circle-fill ml-8"></i>
        </button>
      </div>
    </div>
  `;
}
