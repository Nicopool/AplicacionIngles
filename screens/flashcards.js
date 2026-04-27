// =====================================================
// VOCABULARY BANK — Flashcards Screen
// =====================================================

export function renderFlashcards() {
  return `
    <div class="screen" style="min-height:100vh; background:var(--bg); padding-bottom:90px;">

      <!-- Header -->
      <div style="
        background: linear-gradient(135deg, #7C3AED18 0%, #2563EB08 100%);
        border-bottom: 1px solid var(--border);
        padding: 20px 20px 24px;
      ">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
          <button onclick="window._nav('dashboard')" style="
            width:36px; height:36px; border-radius:50%; border:none;
            background:white; box-shadow:0 2px 8px rgba(0,0,0,0.1);
            font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;
          ">←</button>
          <span style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.8px;">Vocabulary Bank</span>
        </div>

        <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px;">
          <div>
            <div style="font-size:26px; font-weight:900; color:var(--text-main); line-height:1.1; margin-bottom:6px;">
              💾 My Words
            </div>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.4; max-width:200px;">
              Every word you translate in Reading is saved here automatically.
            </div>
          </div>
          <div style="
            background:#EDE9FE; color:#7C3AED; border:2px solid #DDD6FE;
            border-radius:16px; padding:10px 14px; text-align:center;
            font-weight:800; font-size:13px; flex-shrink:0;
          ">
            💾<br>Vocab
          </div>
        </div>

        <!-- Stats row -->
        <div style="display:flex; gap:10px; margin-top:20px;">
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:var(--text-main);" id="vc-count">…</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">Saved</div>
          </div>
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:#7C3AED;" id="vc-streak">🔥</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">Streak</div>
          </div>
          <div style="flex:1; background:white; border-radius:12px; padding:10px 12px; box-shadow:0 2px 6px rgba(0,0,0,0.06); text-align:center;">
            <div style="font-size:20px; font-weight:900; color:#16A34A;">+1</div>
            <div style="font-size:10px; color:var(--text-muted); font-weight:700; text-transform:uppercase; margin-top:2px;">XP / Word</div>
          </div>
        </div>
      </div>

      <!-- Featured Flashcard -->
      <div style="padding:20px 16px 0;">
        <div style="font-size:14px; font-weight:800; color:var(--text-main); margin-bottom:12px;">
          ⚡ Today's Featured Card
        </div>
        <div id="flashcards-container">
          <!-- Dynamic flashcard -->
          <div class="loader"><div class="spinner"></div></div>
        </div>
      </div>

      <!-- Search bar -->
      <div style="padding: 20px 16px 8px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="font-size:14px; font-weight:800; color:var(--text-main); flex:1;" id="vc-words-title">📚 All Words</div>
          <div style="position:relative;">
            <input id="vocab-search" type="text" placeholder="Search…" oninput="window._filterVocab(this.value)" style="
              padding:8px 12px 8px 32px; border-radius:100px;
              border:1.5px solid var(--border); background:var(--bg-card);
              font-size:13px; color:var(--text-main); width:130px;
              outline:none; transition:border 0.2s;
            " onfocus="this.style.borderColor='var(--primary)'" onblur="this.style.borderColor='var(--border)'">
            <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); font-size:13px; color:var(--text-muted);">🔍</span>
          </div>
        </div>
      </div>

      <!-- Word list -->
      <div id="vocab-list" style="padding:0 16px;">
        <div class="loader"><div class="spinner"></div></div>
      </div>

    </div>
  `;
}

export function renderSingleFlashcard(vocab) {
  return `
    <style>
      .fc-3d { perspective: 1000px; }
      .fc-inner {
        position: relative; width: 100%; height: 160px;
        transform-style: preserve-3d;
        transition: transform 0.55s cubic-bezier(.4,0,.2,1);
        cursor: pointer;
      }
      .fc-inner.flipped { transform: rotateY(180deg); }
      .fc-face {
        position: absolute; inset: 0; border-radius: 22px;
        backface-visibility: hidden; -webkit-backface-visibility: hidden;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 20px;
      }
      .fc-front {
        background: linear-gradient(135deg, #7C3AED, #4F46E5);
        color: white; box-shadow: 0 12px 32px -6px rgba(124,58,237,0.45);
      }
      .fc-back {
        background: linear-gradient(135deg, #16A34A, #0891B2);
        color: white; transform: rotateY(180deg);
        box-shadow: 0 12px 32px -6px rgba(22,163,74,0.45);
      }
      .fc-tap-hint { font-size: 11px; opacity: 0.75; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
      .fc-word { font-size: 36px; font-weight: 900; letter-spacing: -1px; }
      .fc-translation { font-size: 30px; font-weight: 900; }
      .fc-sub { font-size: 13px; opacity: 0.8; margin-top: 6px; font-style: italic; }
    </style>

    <div class="fc-3d" onclick="this.querySelector('.fc-inner').classList.toggle('flipped')">
      <div class="fc-inner" id="fc-card">
        <div class="fc-face fc-front">
          <div class="fc-tap-hint">👆 Tap to reveal</div>
          <div class="fc-word">${vocab.word}</div>
          <div class="fc-sub">in English</div>
        </div>
        <div class="fc-face fc-back">
          <div class="fc-tap-hint">🇪🇸 Translation</div>
          <div class="fc-translation">${vocab.translation || '—'}</div>
        </div>
      </div>
    </div>

    <div style="display:flex; gap:10px; margin-top:14px;" id="fc-actions">
      <button id="fc-wrong" style="
        flex:1; padding:14px; border-radius:14px; border:2px solid #FEE2E2;
        background:#FFF7F7; color:#DC2626; font-weight:800; font-size:13px; cursor:pointer;
        transition: all 0.15s;
      " onmouseover="this.style.background='#FEE2E2'" onmouseout="this.style.background='#FFF7F7'">
        ❌ Didn't know
      </button>
      <button id="fc-right" style="
        flex:1; padding:14px; border-radius:14px; border:2px solid #DCFCE7;
        background:#F0FDF4; color:#16A34A; font-weight:800; font-size:13px; cursor:pointer;
        transition: all 0.15s;
      " onmouseover="this.style.background='#DCFCE7'" onmouseout="this.style.background='#F0FDF4'">
        ✅ Got it!
      </button>
    </div>
  `;
}
