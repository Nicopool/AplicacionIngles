import { supabase } from './services/supabase.js';
import * as authService from './services/auth.js';
import * as apiService from './services/api.js';
import * as dbService from './local_db/db.js';

import { renderLanding } from './screens/landing.js';
import { renderAuth } from './screens/auth.js?v=5';
import { renderPlacementTest, renderTestQuestion } from './screens/test.js';
import { renderDashboard } from './screens/dashboard.js';
import { renderReadingList, renderReadingContent } from './screens/reading.js';
import { renderReadingQuiz, renderQuizQuestion } from './screens/reading_quiz.js';
import { renderWriting } from './screens/writing.js';
import { renderListening, renderListeningLevelSelect } from './screens/listening.js';
import { renderSpeaking } from './screens/speaking.js';
import { renderFlashcards, renderSingleFlashcard } from './screens/flashcards.js';
import { renderHangman, renderHangmanLevelSelect, HANGMAN_CONFIG } from './screens/hangman.js';
import { renderProfile } from './screens/profile.js';
import { renderNavBar } from './components/navbar.js';
import { Toast } from './components/common.js';

const app = document.getElementById('app');

// ================= ESTADO GLOBAL =================
let state = {
  user: null,
  profile: null,
  currentScreen: 'landing',
  
  // Test
  placementQuestions: [],
  placementAnswers: [],
  currentTestIdx: 0,
  
  // Módulos
  currentReading: null,
  currentExercises: [],
  currentExerciseIdx: 0,
  currentHangmanWord: null,
  hangmanGuessed: [],
  hangmanLives: 3
};

// ================= PERFIL DEMO (sin login) =================
const DEMO_PROFILE = {
  id: 'demo-user',
  username: 'Estudiante',
  level: 'A1',
  avatar_url: '🧑‍🎓',
  user_stats: [{ xp: 120, current_streak: 3 }]
};

// ================= INICIALIZACIÓN =================
async function init() {
  try {
    await dbService.initLocalDB();
  } catch (e) {
    console.error("Local DB Error", e);
  }

  // Usar perfil demo directamente, sin login
  state.profile = DEMO_PROFILE;
  state.user = { id: DEMO_PROFILE.id };

  // Ocultar splash screen una vez que la app esté lista
  if (window._hideSplash) window._hideSplash();

  navigate('landing');

  // Escuchar red para sincronizar local
  window.addEventListener('online', syncOfflineData);
}


// ================= NAVEGACIÓN (RUTEO) =================
export async function navigate(screen, data = null) {
  // Animación de salida (opcional)
  app.style.opacity = '0';
  
  setTimeout(async () => {
    state.currentScreen = screen;
    state.currentExerciseIdx = 0; // Reset index when jumping between modules
    let html = '';
    
    switch (screen) {
      case 'landing':
        html = renderLanding();
        break;
      
      case 'login':
      case 'register':
        // Auth eliminado — redirigir al dashboard directamente
        return navigate('dashboard');

      case 'placement_test':
        html = renderPlacementTest();
        break;

      case 'dashboard':
        html = renderDashboard(state.profile);
        html += renderNavBar('dashboard');
        break;
        
      case 'modules':
      case 'reading_list':
        html = renderReadingList(state.profile.level);
        html += renderNavBar('modules');
        break;
        
      case 'reading_content':
        state.currentReading = data;
        html = renderReadingContent(data);
        break;

      case 'reading_quiz':
        state.currentReading = data;
        html = renderReadingQuiz(data);
        break;

      case 'listening_levels':
        html = renderListeningLevelSelect(state.profile.level);
        html += renderNavBar('modules');
        break;

      case 'writing':
      case 'speaking':
        if(screen==='writing') html = renderWriting();
        if(screen==='speaking') html = renderSpeaking();
        break;

      case 'listening':
        html = '<div class="loader"><div class="spinner"></div></div>';
        break;
        
      case 'flashcards':
        html = renderFlashcards();
        html += renderNavBar('flashcards');
        break;

      case 'profile':
        html = renderProfile(state.profile);
        html += renderNavBar('none');
        break;

      case 'hangman':
      case 'games':
        // Muestra el selector de nivel
        html = renderHangmanLevelSelect(state.profile.level);
        html += renderNavBar('games');
        break;

      case 'hangman_game':
        // Lanza el juego con el nivel elegido (pasado en data)
        html = '<div class="loader"><div class="spinner"></div></div>';
        break;

      default:
        html = renderLanding();
    }
    
    app.innerHTML = html;
    app.style.opacity = '1';

    // Disparar lógica específica de la vista después de renderizar HTML
    runScreenLogic(screen === 'games' ? 'hangman' : screen, data);
  }, 150);
}

// Exponer navigate globalmente (para onclick en HTML string)
window._nav = navigate;

window._back = () => {
  // Simple "back" logic for a SPA
  const s = state.currentScreen;
  if(['reading_list', 'writing', 'listening_levels', 'speaking', 'flashcards', 'hangman', 'profile'].includes(s)) {
    navigate('dashboard');
  } else if(['login', 'register', 'placement_test'].includes(s)) {
    navigate('landing');
  } else if(s === 'reading_content') {
    navigate('reading_list'); // Vuelve a la lista de lecturas
  } else if(s === 'reading_quiz') {
    navigate('reading_content', state.currentReading); // Vuelve a la lectura en vez del dashboard
  } else {
    navigate('dashboard');
  }
};

window._logout = async () => {
  const result = await Swal.fire({
    title: '¿Salir?',
    text: "Volverás a la pantalla de inicio.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--primary)',
    cancelButtonColor: 'var(--text-muted)',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    // Restablecer perfil demo y volver al inicio
    state.profile = DEMO_PROFILE;
    state.user = { id: DEMO_PROFILE.id };
    navigate('landing');
  }
};

// ================= LÓGICA DE PANTALLAS =================

async function runScreenLogic(screen, data) {
  if (screen === 'placement_test') {
    startPlacementTest();
  }
  else if (screen === 'modules' || screen === 'reading_list') {
    loadReadingList();
  }
  else if (screen === 'reading_content') {
    setupReadingInteractions();
  }
  else if (screen === 'reading_quiz') {
    loadReadingQuiz(data);
  }
  else if (screen === 'writing' || screen === 'speaking') {
    loadExercises(screen);
  }
  else if (screen === 'listening') {
    // Renderiza la pantalla pasando el nivel (data)
    app.innerHTML = renderListening(data);
    loadExercises('listening', data);
  }
  else if (screen === 'flashcards') {
    loadFlashcards();
  }
  else if (screen === 'profile') {
    setupProfileInteractions();
  }
  else if (screen === 'hangman') {
    // Solo renderiza el selector — no hace falta lógica extra
  }
  else if (screen === 'hangman_game') {
    startHangman(data); // data = nivel elegido (ej: 'B1')
  }
}


// ===== AUTH =====
function handleAuthSubmit(type) {
  const form = document.getElementById('auth-form');
  const btn = document.getElementById('submit-btn');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerHTML = 'Cargando...';
    
    const email = document.getElementById('email').value;
    const pwd = 'Linguist2026!'; // Default password for simplified access
    
    try {
      if (type === 'register') {
        const user = document.getElementById('username').value;
        await authService.register(email, pwd, user);
        state.user = await authService.login(email, pwd); // auto-login
        state.profile = await authService.getProfile(state.user.id);
        navigate('placement_test'); // Forzar test inicial
      } else {
        state.user = await authService.login(email, pwd);
        state.profile = await authService.getProfile(state.user.id);
        authService.updateStreak(state.profile.id); // Actualizar racha diaria al loguear
        Toast('¡Bienvenido!');
        navigate('dashboard');
      }
    } catch (err) {
      Toast(err.message || 'Error de autenticación', 'error');
      btn.disabled = false;
      btn.innerHTML = type === 'register' ? 'Continuar →' : 'Iniciar Sesión';
    }
  });
}

// ===== PLACEMENT TEST =====
async function startPlacementTest() {
  try {
    const q = await apiService.getPlacementQuestions();
    state.placementQuestions = q;
    state.currentTestIdx = 0;
    state.placementAnswers = [];
    showTestQuestion();
  } catch(e) {
    Toast('Error cargando test. Entrando con nivel A1', 'error');
    navigate('dashboard');
  }
}

function showTestQuestion() {
  const container = document.getElementById('test-container');
  const btnNext = document.getElementById('btn-next');
  document.getElementById('current-q').innerText = state.currentTestIdx + 1;
  
  const pct = ((state.currentTestIdx) / state.placementQuestions.length) * 100;
  document.getElementById('test-progress').style.width = pct + '%';
  
  const q = state.placementQuestions[state.currentTestIdx];
  container.innerHTML = renderTestQuestion(q);
  
  window._selectOption = (idx) => {
    state.placementAnswers[state.currentTestIdx] = idx;
    // UI Update
    document.querySelectorAll('.test-option').forEach((el, i) => {
      el.classList.toggle('selected', i === idx);
    });
    btnNext.disabled = false;
  };

  btnNext.onclick = async () => {
    state.currentTestIdx++;
    if (state.currentTestIdx >= state.placementQuestions.length) {
       await finishPlacementTest();
    } else {
       btnNext.disabled = true;
       showTestQuestion();
    }
  };
}

async function finishPlacementTest() {
  const container = document.getElementById('test-container');
  container.innerHTML = '<div class="loader"><div class="spinner"></div><p>Calculando nivel...</p></div>';
  document.getElementById('btn-next').style.display = 'none';

  let score = 0;
  state.placementAnswers.forEach((ans, i) => {
    if (ans === state.placementQuestions[i].correct_option) score++;
  });

  const level = apiService.calculateLevel(score, state.placementQuestions.length);
  
  try {
    await apiService.savePlacementResult(state.profile.id, score, level);
    await authService.updateLevel(state.profile.id, level);
  } catch(e) {
    console.warn("DB update failed in test, but proceeding:", e);
  }
  
  state.profile.level = level;
  Toast(`¡Genial! Tu nivel asignado es ${level}`);
  navigate('dashboard');
}

// ===== READING =====
async function loadReadingList() {
  const c = document.getElementById('reading-list-container');
  try {
    let readingData = await apiService.getReadingByLevel(state.profile.level);
    
    // Cache offline
    dbService.cacheItems('reading', readingData);

    if(!readingData.length && !navigator.onLine) {
      readingData = await dbService.getLocalItems('reading');
    }

    if(!readingData.length) {
      c.innerHTML = '<p>No hay textos para tu nivel aún.</p>'; return;
    }

    let html = '';
    readingData.forEach((r, i) => {
      window[`_goReading${i}`] = () => navigate('reading_content', r);
      html += `
        <div class="module-row mb-16" onclick="window._goReading${i}()">
          <div class="module-row-icon" style="background:var(--primary-light); color:var(--primary)">📖</div>
          <div class="module-row-info">
            <div class="module-row-name">${r.title}</div>
            <div class="module-row-detail">3 min · ${r.level}</div>
          </div>
          <div class="module-row-arrow">→</div>
        </div>
      `;
    });
    c.innerHTML = html;
  } catch(e) {
    c.innerHTML = '<p>Error cargando textos.</p>';
  }
}

function setupReadingInteractions() {
  const words = document.querySelectorAll('.tap-word');
  const popup = document.getElementById('translation-popup');
  const popupText = document.getElementById('popup-text');
  
  let currentWordRaw = '';
  
  words.forEach(el => {
    el.addEventListener('click', async (e) => {
      // Limpiar previas
      words.forEach(w => w.classList.remove('translated'));
      el.classList.add('translated');
      
      const word = el.innerText.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if(!word) return;
      currentWordRaw = word;

      // Position popup
      const rect = el.getBoundingClientRect();
      popup.style.display = 'block';
      popup.style.top = (rect.top - 120) + 'px';
      popup.style.left = Math.max(10, (rect.left - 100)) + 'px'; // Prevenir offscreen
      
      popupText.innerHTML = '<div class="spinner" style="width:20px;height:20px;"></div>';
      
      // Traducir y hablar
      apiService.speakWord(word);
      const translation = await apiService.translateWord(word);
      popupText.innerText = translation ? translation : '???';

      // Auto-guardado
      if (translation && navigator.onLine && state.profile.id !== 'demo-123') {
        apiService.saveWord(state.profile.id, word, translation);
      } else if (translation) {
        dbService.queueSync(word, translation, state.profile.id);
      }
    });
  });

  // Cerrar popup al hacer click fuera
  document.addEventListener('click', (e) => {
    if(!e.target.closest('.tap-word') && !e.target.closest('.translation-popup')) {
      popup.style.display = 'none';
      words.forEach(w => w.classList.remove('translated'));
    }
  });

  // Controles del Reproductor de Audio
  const btnPlay = document.getElementById('btn-play-all');
  let isPlaying = false;
  let currentRate = 0.9;

  btnPlay.onclick = () => {
    if (!isPlaying) {
      isPlaying = true;
      btnPlay.innerText = '⏸';
      Toast('Reproduciendo texto completo...', 'info');
      
      const fullText = Array.from(words).map(el => el.innerText).join(' ');
      apiService.speakText(fullText, currentRate);
      
      // Simular progreso
      const progressFill = document.querySelector('.reading-progress-fill');
      progressFill.style.transition = `width ${fullText.length / 10}s linear`;
      progressFill.style.width = '100%';
    } else {
      isPlaying = false;
      btnPlay.innerText = '▶';
      window.speechSynthesis.cancel();
    }
  };

  // Otros controles (Speed, Rewind, etc.)
  const ctrlBtns = document.querySelectorAll('.reading-ctrl-btn');
  ctrlBtns.forEach(btn => {
    btn.onclick = () => {
      if (btn.innerText.includes('1.0x')) {
        currentRate = currentRate === 0.9 ? 1.2 : 0.9;
        btn.innerText = currentRate === 0.9 ? '1.0x' : '1.5x';
        Toast(`Velocidad: ${btn.innerText}`);
        if(isPlaying) {
          window.speechSynthesis.cancel();
          const fullText = Array.from(words).map(el => el.innerText).join(' ');
          apiService.speakText(fullText, currentRate);
        }
      } 
      else if (btn.innerText === '⏪') {
        window.speechSynthesis.cancel();
        isPlaying = false;
        btnPlay.innerText = '▶';
        document.querySelector('.reading-progress-fill').style.width = '0%';
        Toast('Reiniciado');
      }
    };
  });

  // Botones popup
  document.getElementById('popup-audio').onclick = () => apiService.speakWord(currentWordRaw);
  document.getElementById('popup-save').onclick = () => Toast('Guardado en Flashcards');

  // Terminar
  document.getElementById('btn-finish-reading').onclick = async () => {
    window.speechSynthesis.cancel();
    navigate('reading_quiz', state.currentReading);
  };
}

// ===== EJERCICIOS (Writing/Listening/Speaking) =====
async function loadExercises(type, levelOverride = null) {
  const levelToLoad = levelOverride || state.profile.level;
  try {
    const exs = await apiService.getExercises(type, levelToLoad);
    if(!exs.length) {
       document.querySelector('.exercise-body').innerHTML = '<p class="text-center mt-24">No hay ejercicios para tu nivel.</p>';
       document.querySelector('.bottom-nav').style.display='none';
       return;
    }
    state.currentExercises = exs;
    state.currentExerciseIdx = 0;
    renderCurrentExercise(type);
  } catch(e) {
    Toast('Error cargando', 'error');
  }
}

function renderCurrentExercise(type) {
  const ex = state.currentExercises[state.currentExerciseIdx];
  
  if (type === 'writing') {
    const parts = ex.prompt.split('___');
    let html = parts[0] + `<input type="text" id="write-ans" class="blank-input" placeholder="type here...">` + (parts[1] || '');
    document.getElementById('writing-prompt').innerHTML = html;
    
    // Grammar Rule
    const ruleCard = document.getElementById('grammar-rule-card');
    if (ex.grammar_info) {
      ruleCard.style.display = 'block';
      document.getElementById('grammar-text').innerText = ex.grammar_info;
    } else {
      ruleCard.style.display = 'none';
    }

    document.getElementById('btn-check-writing').onclick = () => {
      const v = document.getElementById('write-ans').value.trim().toLowerCase();
      const ans = ex.answer.toLowerCase();
      const res = document.getElementById('writing-result');
      res.style.display = 'flex';
      
      if(v === ans) {
        document.getElementById('write-ans').classList.add('correct');
        res.className = 'result-indicator correct';
        res.innerHTML = `✅ Excellent! +10 XP`;
        setTimeout(() => nextExercise(type), 1500);
      } else {
        document.getElementById('write-ans').classList.add('wrong');
        res.className = 'result-indicator wrong';
        res.innerHTML = `❌ It was: \${ex.answer}`;
      }
    };
  }
  
  if (type === 'listening') {
    document.getElementById('listening-prompt').innerHTML = ex.prompt.replace('___', '<input type="text" id="list-ans" class="blank-input">');
    const playBtn = document.getElementById('btn-listen-play');
    
    // Simular audio player
    playBtn.onclick = () => {
      document.getElementById('audio-player').classList.toggle('paused');
      playBtn.innerHTML = playBtn.innerHTML.includes('play') ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
      apiService.speakWord(ex.answer);
    };

    document.getElementById('btn-check-listening').onclick = () => {
       const v = document.getElementById('list-ans').value.trim().toLowerCase();
       const ans = ex.answer.toLowerCase();
       const res = document.getElementById('listening-result');
       res.style.display = 'flex';
       if(v === ans) {
         document.getElementById('list-ans').classList.add('correct');
         res.className = 'result-indicator correct';
         res.innerHTML = `✅ Well done!`;
         setTimeout(() => nextExercise(type), 1500);
       } else {
         document.getElementById('list-ans').classList.add('wrong');
         res.className = 'result-indicator wrong';
         res.innerHTML = `❌ Incorrect. Correct answer: \${ex.answer}`;
       }
    };
  }

  if (type === 'speaking') {
    const prompt = document.getElementById('speaking-prompt');
    prompt.innerHTML = ex.prompt;
    
    const micBtn = document.getElementById('btn-mic');
    const status = document.getElementById('mic-status');
    const res = document.getElementById('speaking-result');
    const nextBtn = document.getElementById('btn-next-speaking');

    micBtn.onclick = () => {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!Recognition) {
        Toast('Your browser does not support voice recognition. Simulating...', 'info');
        // Fallback simulation
        simulateSpeaking(ex, prompt, micBtn, status, res, nextBtn);
        return;
      }

      const rec = new Recognition();
      rec.lang = 'en-US';
      rec.interimResults = false;

      rec.onstart = () => {
        micBtn.classList.add('recording');
        status.innerText = "Listening...";
        res.style.display = 'none';
      };

      rec.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
        const target = ex.prompt.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
        
        micBtn.classList.remove('recording');
        res.style.display = 'flex';
        
        if (result.includes(target) || target.includes(result)) {
           prompt.innerHTML = `<span class="word-ok">${ex.prompt}</span>`;
           res.className = 'result-indicator correct';
           res.innerHTML = `✅ Perfect! You said: "${event.results[0][0].transcript}"`;
           nextBtn.style.display = 'block';
        } else {
           res.className = 'result-indicator wrong';
           res.innerHTML = `⚠️ Oops! You said: "${event.results[0][0].transcript}". Try again.`;
        }
      };

      rec.onerror = () => {
        micBtn.classList.remove('recording');
        status.innerText = "Error. Tap to retry";
      };

      rec.start();
    };

    nextBtn.onclick = () => nextExercise(type);
  }
}

function simulateSpeaking(ex, prompt, micBtn, status, res, nextBtn) {
  micBtn.classList.add('recording');
  status.innerText = "Simulating listening...";
  setTimeout(() => {
    micBtn.classList.remove('recording');
    status.innerText = "Tap to speak";
    res.style.display = 'flex';
    prompt.innerHTML = `<span class="word-ok">${ex.prompt}</span>`;
    res.className = 'result-indicator correct';
    res.innerHTML = `✅ Perfect pronunciation! (Simulated)`;
    nextBtn.style.display = 'block';
  }, 2000);
}

async function nextExercise(type) {
  state.currentExerciseIdx++;
  if (state.currentExerciseIdx >= state.currentExercises.length) {
    await completeActivity(30);
  } else {
    Toast('Well done! Moving to next exercise...', 'success');
    renderCurrentExercise(type);
  }
}

// ===== COMPLETE SCREEN =====
async function completeActivity(xpEarned) {
  if (navigator.onLine) {
    await authService.addXP(state.profile.id, xpEarned);
    state.profile.user_stats[0].xp += xpEarned;
  }
  
  app.innerHTML = `
    <div class="screen result-screen">
      <div class="result-emoji">🎉</div>
      <div class="result-title">Lesson Completed!</div>
      <div class="result-sub">You took a big step in your learning today!</div>
      
      <div class="xp-badge mt-24">+ ${xpEarned} XP</div>
      
      <button class="btn btn-primary" style="margin-top:auto;" onclick="window._nav('dashboard')">
        Continue
      </button>
    </div>
  `;
}

// ===== FLASHCARDS =====
async function loadFlashcards() {
  const cont = document.getElementById('flashcards-container');
  const list = document.getElementById('vocab-list');
  
  try {
    let vocab = [];
    if (state.profile.id !== 'demo-123' && navigator.onLine) {
      vocab = await apiService.getUserVocabulary(state.profile.id);
      dbService.cacheItems('vocabulary', vocab);
    } else {
      const localVocab = await dbService.getLocalItems('vocabulary') || [];
      const queuedVocab = await dbService.getLocalItems('syncQueue') || [];
      // Combinar y eliminar duplicados basados en 'word'
      const combined = [...localVocab, ...queuedVocab];
      const uniqueWords = new Set();
      vocab = combined.filter(v => {
        if(uniqueWords.has(v.word)) return false;
        uniqueWords.add(v.word);
        return true;
      });
    }

    if (!vocab.length) {
      cont.innerHTML = `<div class="empty-state">
        <div class="empty-emoji">🧊</div>
        <div class="empty-title">Your bank is empty</div>
        <div class="empty-sub">Translate words in the Reading section to see them here.</div>
      </div>`;
      list.innerHTML = '';
      return;
    }

    // Render tarjeta destacada (la más reciente o random)
    cont.innerHTML = renderSingleFlashcard(vocab[0]);

    // Botones FC
    document.getElementById('fc-right').onclick = () => Toast('+1 XP added');
    document.getElementById('fc-wrong').onclick = () => Toast('Will reappear soon');

    // Lista abajo
    let lHtml = '<div class="test-question-label mb-12">All your words:</div>';
    vocab.forEach(v => {
      lHtml += `
        <div class="vocab-item">
          <div>
            <div class="vocab-word">${v.word}</div>
            <div class="vocab-trans">${v.translation}</div>
          </div>
          <button class="vocab-play" onclick="window._speak('${v.word}')"><i class="bi bi-volume-up-fill"></i></button>
        </div>
      `;
    });
    list.innerHTML = lHtml;
    
    // Global function for play in list
    window._speak = (w) => apiService.speakWord(w);

  } catch(e) {
    console.error(e);
  }
}

// ===== HANGMAN =====
// ===== LISTENING & HANGMAN NAV =====
window._startListeningLevel = (level) => navigate('listening', level);
window._startHangmanLevel = (level) => navigate('hangman_game', level);

async function startHangman(level) {
  // Si no se especifica nivel, usar el del perfil del usuario
  const chosenLevel = level || state.profile.level;
  const cfg = HANGMAN_CONFIG[chosenLevel] || HANGMAN_CONFIG['A1'];

  try {
    const words = await apiService.getHangmanWords(chosenLevel);
    dbService.cacheItems('hangman', words);

    let wList = words;
    if(!wList.length && !navigator.onLine) wList = await dbService.getLocalItems('hangman');
    
    // Fallback: palabras enriquecidas por nivel (hint + traducción + tipo + ejemplo)
    if(!wList.length) {
      const fallbacks = {
        A1: [
          { word:'DOG',   translation:'Perro',   type:'noun', hint:'A friendly animal that barks.', example:'My dog loves to play with a ball.' },
          { word:'SUN',   translation:'Sol',     type:'noun', hint:'The bright star in the sky during the day.', example:'The sun is very hot today.' },
          { word:'CAR',   translation:'Coche',   type:'noun', hint:'A machine with four wheels that you drive.', example:'We drive a red car to work.' },
          { word:'TREE',  translation:'Árbol',   type:'noun', hint:'A tall plant with a wooden trunk and leaves.', example:'The bird is singing in the tree.' },
          { word:'BIRD',  translation:'Pájaro',  type:'noun', hint:'An animal with wings and feathers that can fly.', example:'A little bird is eating seeds.' },
          { word:'FISH',  translation:'Pez',     type:'noun', hint:'An animal that lives in the water and swims.', example:'I saw a big fish in the river.' },
          { word:'BOY',   translation:'Niño',    type:'noun', hint:'A young male child.', example:'The young boy is playing in the park.' },
          { word:'APPLE', translation:'Manzana', type:'noun', hint:'A round fruit that is red or green.', example:'I eat an apple every morning.' },
        ],
        A2: [
          { word:'HOUSE', translation:'Casa',   type:'noun', hint:'A building where people live.', example:'They bought a new house near the beach.' },
          { word:'CHAIR', translation:'Silla',  type:'noun', hint:'A piece of furniture for one person to sit on.', example:'Please sit on this chair.' },
          { word:'WATER', translation:'Agua',   type:'noun', hint:'A clear liquid that falls as rain.', example:'Drink plenty of water every day.' },
          { word:'PARTY', translation:'Fiesta', type:'noun', hint:'A social event to celebrate something.', example:'We are going to a birthday party.' },
          { word:'TRAIN', translation:'Tren',   type:'noun', hint:'A vehicle with many cars that moves on tracks.', example:'The train arrives at the station at five.' },
          { word:'GREEN', translation:'Verde',  type:'adjective', hint:'The color of grass and leaves.', example:'The grass in the park is very green.' },
          { word:'RIVER', translation:'Río',    type:'noun', hint:'A large natural stream of water flowing to the sea.', example:'We went fishing in the river.' },
          { word:'MONEY', translation:'Dinero', type:'noun', hint:'Coins or notes used to buy things.', example:'She needs money to buy a ticket.' },
        ],
        B1: [
          { word:'GUITAR', translation:'Guitarra', type:'noun', hint:'A musical instrument with six strings.', example:'He plays the guitar in a rock band.' },
          { word:'DOCTOR', translation:'Doctor',   type:'noun', hint:'A person who treats people who are ill.', example:'You should see a doctor if you are sick.' },
          { word:'ISLAND', translation:'Isla',     type:'noun', hint:'A piece of land completely surrounded by water.', example:'They spent their vacation on a tropical island.' },
          { word:'FOREST', translation:'Bosque',   type:'noun', hint:'A large area covered mostly with trees.', example:'We went hiking in the dark forest.' },
          { word:'BRIDGE', translation:'Puente',   type:'noun', hint:'A structure built over a river or road.', example:'The bridge connects the two cities.' },
          { word:'CAMERA', translation:'Cámara',   type:'noun', hint:'A device for taking photographs or videos.', example:'Smile for the camera!' },
          { word:'PLANET', translation:'Planeta',  type:'noun', hint:'A large object in space that moves around a star.', example:'Earth is the third planet from the sun.' },
          { word:'DRAGON', translation:'Dragón',   type:'noun', hint:'A mythical creature that breathes fire.', example:'The knight fought the fire-breathing dragon.' },
        ],
        B2: [
          { word:'PYRAMID', translation:'Pirámide', type:'noun', hint:'A huge triangular structure built in ancient Egypt.', example:'Tourists love to visit the great pyramid.' },
          { word:'MYSTERY', translation:'Misterio', type:'noun', hint:'Something that is difficult or impossible to understand.', example:'The missing treasure remains an unsolved mystery.' },
          { word:'DIAMOND', translation:'Diamante', type:'noun', hint:'A precious stone consisting of a clear and colorless crystal.', example:'The ring has a beautiful, sparkling diamond.' },
          { word:'VOLCANO', translation:'Volcán',   type:'noun', hint:'A mountain that erupts and throws out hot lava.', example:'Smoke is coming out of the active volcano.' },
          { word:'GHOST',   translation:'Fantasma', type:'noun', hint:'The spirit of a dead person.', example:'The old abandoned house is said to have a ghost.' },
          { word:'CASTLE',  translation:'Castillo', type:'noun', hint:'A large building with high walls built to protect against attacks.', example:'The king lived in a magnificent stone castle.' },
          { word:'TORNADO', translation:'Tornado',  type:'noun', hint:'A violent, rotating column of air extending from a thunderstorm.', example:'They hid in the basement during the tornado.' },
          { word:'MIRROR',  translation:'Espejo',   type:'noun', hint:'A surface, typically of glass, which reflects an image.', example:'She looked at herself in the bathroom mirror.' },
        ],
        C1: [
          { word:'AVALANCHE', translation:'Avalancha', type:'noun', hint:'A mass of snow, ice, and rocks falling rapidly down a mountainside.', example:'The skiers narrowly escaped the sudden avalanche.' },
          { word:'DINOSAUR',  translation:'Dinosaurio',type:'noun', hint:'A fossil reptile of the Mesozoic era.', example:'The museum has a huge skeleton of a dinosaur.' },
          { word:'LABYRINTH', translation:'Laberinto', type:'noun', hint:'A complicated irregular network of passages or paths.', example:'They got lost inside the ancient labyrinth.' },
          { word:'ASTRONAUT', translation:'Astronauta',type:'noun', hint:'A person who is trained to travel in a spacecraft.', example:'The astronaut floated weightlessly in space.' },
          { word:'SYMPHONY',  translation:'Sinfonía',  type:'noun', hint:'An elaborate musical composition for full orchestra.', example:'The orchestra played a famous Beethoven symphony.' },
          { word:'TELESCOPE', translation:'Telescopio',type:'noun', hint:'An optical instrument to make distant objects appear nearer.', example:'We looked at the craters on the moon through a telescope.' },
          { word:'CATHEDRAL', translation:'Catedral',  type:'noun', hint:'The principal church of a diocese.', example:'The Gothic cathedral took hundreds of years to build.' },
          { word:'CHAMELEON', translation:'Camaleón',  type:'noun', hint:'A lizard that changes color to match its surroundings.', example:'The chameleon hid perfectly among the green leaves.' },
        ],
      };
      wList = fallbacks[chosenLevel] || fallbacks['A1'];
    }

    // Agarrar palabra aleatoria
    const hw = wList[Math.floor(Math.random() * wList.length)];
    state.currentHangmanWord = hw.word.toUpperCase();
    state.hangmanGuessed = [];
    state.hangmanLives = cfg.lives;   // ← vidas según nivel
    state.hangmanMaxLives = cfg.lives; // guardar máximo para la UI

    let html = renderHangman(hw, chosenLevel);
    app.innerHTML = html;

    renderHangmanUI(chosenLevel);
  } catch(e) {
    console.error(e);
    Toast('Error cargando minijuego');
    navigate('dashboard');
  }
}

function renderHangmanUI(level) {
  const cfg = HANGMAN_CONFIG[level] || HANGMAN_CONFIG['A1'];
  const maxLives = state.hangmanMaxLives || cfg.lives;
  const word = state.currentHangmanWord;
  const wordCont = document.getElementById('hm-word-container');
  const keyCont = document.getElementById('hm-keyboard');
  const livesCont = document.getElementById('hm-lives');

  // Letras
  let wHtml = '';
  let justWon = true;

  for(let i=0; i<word.length; i++) {
    const char = word[i];
    if(char === ' ') {
      wHtml += `<div style="width:20px;"></div>`;
    } else {
      const guessed = state.hangmanGuessed.includes(char);
      if(!guessed) justWon = false;
      wHtml += `
        <div class="letter-slot">
          <div class="letter-char">${guessed ? char : ''}</div>
          <div class="letter-line"></div>
        </div>
      `;
    }
  }
  wordCont.innerHTML = wHtml;

  // Corazones (adaptados al número de vidas del nivel)
  let lHtml = '';
  for(let i = 0; i < maxLives; i++) {
    lHtml += `<div class="life-dot" style="font-size:${maxLives > 6 ? '12px' : '16px'}; display:inline;">${i >= state.hangmanLives ? '🖤' : '❤️'}</div>`;
  }
  livesCont.innerHTML = lHtml;

  // Dibujar partes del ahorcado (escalado a las vidas disponibles)
  // Con más vidas, se revelan menos partes por error
  const mistakes = maxLives - state.hangmanLives;
  const partsPerMistake = 11 / maxLives;

  for(let i=1; i<=11; i++) {
    const part = document.getElementById(`hm-part-${i}`);
    if(!part) continue;
    // Revelar parte i si los errores acumulados superan el umbral
    const show = mistakes > 0 && i <= Math.floor(mistakes * partsPerMistake);
    part.style.display = show ? 'block' : 'none';
  }

  // Teclado
  const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
  let kHtml = '';
  alphabet.forEach(letter => {
    let cls = '';
    if (state.hangmanGuessed.includes(letter)) {
      cls = word.includes(letter) ? 'used-correct' : 'used-wrong';
    }
    kHtml += `<button class="key-btn ${cls}" ${cls ? 'disabled' : ''} onclick="window._guessHm('${letter}')">${letter}</button>`;
  });
  keyCont.innerHTML = kHtml;

  // Lógica victoria/derrota
  if (justWon) {
    setTimeout(async () => {
      await Swal.fire({
        title: '¡Excelente!',
        text: '¡Adivinaste la palabra! Siguiente desafío...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      authService.addXP(state.profile.id, 20);
      startHangman(level); // Nueva palabra del mismo nivel
    }, 500);
  } else if (state.hangmanLives <= 0) {
    setTimeout(async () => {
      await Swal.fire({
        title: '¡Oh no!',
        text: 'La palabra era: ' + word,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
      startHangman(level);
    }, 1000);
  }
}

window._guessHm = (letter) => {
  if (state.hangmanLives <= 0 || state.hangmanGuessed.includes(letter)) return;
  state.hangmanGuessed.push(letter);
  if (!state.currentHangmanWord.includes(letter)) {
    state.hangmanLives--;
  }
  renderHangmanUI();
}

// --- LOGIC: READING QUIZ ---
let currentQuizIdx = 0;
let quizQuestions = [];
let quizAnswers = [];

async function loadReadingQuiz(reading) {
  try {
    currentQuizIdx = 0;
    quizAnswers = [];
    quizQuestions = await apiService.getQuestionsByReading(reading.id, reading.content);
    
    if (quizQuestions.length === 0) {
      Toast('No questions found for this reading', 'warning');
      return navigate('dashboard');
    }

    document.getElementById('quiz-total-q').innerText = quizQuestions.length;
    renderQuizStep();

  } catch (e) {
    console.error(e);
    Toast('Error loading quiz', 'error');
  }
}

function renderQuizStep() {
  const q = quizQuestions[currentQuizIdx];
  const container = document.getElementById('quiz-container');
  const btnNext = document.getElementById('btn-next-quiz');
  
  container.innerHTML = renderQuizQuestion(q);
  document.getElementById('quiz-current-q').innerText = currentQuizIdx + 1;
  document.getElementById('quiz-progress').style.width = `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%`;
  
  btnNext.disabled = true;
  btnNext.onclick = () => {
    const selected = quizAnswers[currentQuizIdx];
    if (selected === undefined) return;
    
    if (currentQuizIdx < quizQuestions.length - 1) {
      currentQuizIdx++;
      renderQuizStep();
    } else {
      finishReadingQuiz();
    }
  };
}

window._selectQuizOption = (idx) => {
  quizAnswers[currentQuizIdx] = idx;
  document.querySelectorAll('.test-option').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  document.getElementById('btn-next-quiz').disabled = false;
};

async function finishReadingQuiz() {
  let correct = 0;
  quizQuestions.forEach((q, i) => {
    if (quizAnswers[i] === q.correct_option) correct++;
  });
  
  const pct = (correct / quizQuestions.length) * 100;
  const xpEarned = Math.round(pct / 2); 
  
  await Swal.fire({
    title: 'Quiz Finished!',
    text: `You got ${correct} out of ${quizQuestions.length} correct.`,
    icon: 'success',
    confirmButtonText: 'Back to Modules'
  });
  
  await completeActivity(xpEarned);
}

// ===== PROFILE LOGIC =====
let selectedAvatar = null;

function setupProfileInteractions() {
  const btnSave = document.getElementById('btn-save-profile');
  const inputUser = document.getElementById('edit-username');
  
  selectedAvatar = state.profile.avatar_url || '👨‍🎓';

  window._selectAvatar = (avatar) => {
    selectedAvatar = avatar;
    // UI Feedback
    document.querySelectorAll('.avatar-option').forEach(el => {
      el.classList.remove('selected');
      el.style.border = '2px solid transparent';
      el.style.background = '#F8FAFC';
    });
    const target = Array.from(document.querySelectorAll('.avatar-option')).find(el => el.innerText.trim() === avatar);
    if(target) {
      target.classList.add('selected');
      target.style.border = '2px solid #2563EB';
      target.style.background = '#DBEAFE';
    }
    document.getElementById('current-avatar').innerText = avatar;
  };

  btnSave.onclick = async () => {
    const newUsername = inputUser.value.trim();
    if(!newUsername) return Toast('Por favor ingresa un nombre', 'error');

    if(state.profile.id === 'demo-123') {
      state.profile.username = newUsername;
      state.profile.avatar_url = selectedAvatar;
      Toast('Perfil actualizado (Modo Demo)');
      return navigate('dashboard');
    }

    try {
      btnSave.innerText = 'Guardando...';
      btnSave.disabled = true;

      const updated = await apiService.updateProfile(state.profile.id, {
        username: newUsername,
        avatar_url: selectedAvatar
      });

      state.profile = { ...state.profile, ...updated };
      Toast('¡Perfil actualizado con éxito!');
      navigate('dashboard');
    } catch(e) {
      console.error(e);
      Toast('Error actualizando perfil', 'error');
    } finally {
      btnSave.innerText = 'Guardar Cambios';
      btnSave.disabled = false;
    }
  };
}

// ===== SYNC OFFLINE =====
async function syncOfflineData() {
  if (!navigator.onLine) return;
  console.log('Online! Sincronizando datos...');
  try {
    const q = await dbService.flushSyncQueue();
    for (const item of q) {
      await apiService.saveWord(item.profileId, item.word, item.translation);
    }
    if (q.length > 0) Toast(`${q.length} palabras guardadas offline sincronizadas`);
  } catch(e) {
    console.error("Error sincronizando", e);
  }
}

// INICIAR LA APP AL CARGAR EL MAIN SCRIPT
// Los módulos ES son diferidos automáticamente, por lo que el DOM ya está listo.
// Usamos DOMContentLoaded como seguro; si ya ocurrió, llamamos init() directamente.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
