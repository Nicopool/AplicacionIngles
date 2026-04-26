// =====================================================
// API SERVICE — Acceso a datos de la BD
// =====================================================
import { supabase } from './supabase.js';

// --- READING ---

/** Obtener textos de reading filtrados por nivel */
export async function getReadingByLevel(level) {
  const { data, error } = await supabase
    .from('reading_content')
    .select('*')
    .eq('level', level);
  if (error) throw error;
  return data;
}

/** Actualizar perfil del usuario */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// --- EXERCISES (Writing / Listening / Speaking) ---

/** Obtener ejercicios por tipo y nivel */
export async function getExercises(type, level) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('type', type)
    .eq('level', level);
  if (error) throw error;
  return data;
}

// --- HANGMAN ---

/** Obtener palabras del ahorcado por nivel */
export async function getHangmanWords(level) {
  const { data, error } = await supabase
    .from('hangman_words')
    .select('*')
    .eq('level', level);
  if (error) throw error;
  return data;
}

// --- PLACEMENT TEST ---

/** Obtener preguntas del test de nivel */
export async function getPlacementQuestions() {
  const { data, error } = await supabase
    .from('placement_test_questions')
    .select('*')
    .order('difficulty_order', { ascending: true });
  if (error) throw error;
  return data;
}

/** Guardar resultado del placement test */
export async function savePlacementResult(profileId, score, assignedLevel) {
  return supabase.from('user_placement_results').insert([{ profile_id: profileId, score, assigned_level: assignedLevel }]);
}

// --- VOCABULARIO / FLASHCARDS ---

/** Obtener vocabulario guardado del usuario */
export async function getUserVocabulary(profileId) {
  const { data, error } = await supabase
    .from('user_vocabulary')
    .select('*')
    .eq('profile_id', profileId)
    .order('added_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Guardar una palabra al banco de repaso */
export async function saveWord(profileId, word, translation) {
  // Evitar duplicados
  const { data: existing } = await supabase
    .from('user_vocabulary')
    .select('id')
    .eq('profile_id', profileId)
    .eq('word', word.toLowerCase())
    .maybeSingle();
  if (existing) return;
  return supabase.from('user_vocabulary').insert([{ profile_id: profileId, word: word.toLowerCase(), translation }]);
}

/** Eliminar palabra del banco */
export async function deleteWord(wordId) {
  return supabase.from('user_vocabulary').delete().eq('id', wordId);
}

// --- TRADUCCIONES (MyMemory API — Gratis) ---

/** Traducir una palabra al español usando MyMemory */
export async function translateWord(word) {
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|es`);
    const json = await res.json();
    if (json.responseStatus === 200) {
      return json.responseData.translatedText;
    }
    return null;
  } catch {
    return null;
  }
}

// --- TTS (Web Speech API) ---

/** Obtener una voz femenina en inglés */
function getFemaleVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Buscar voces que suelan ser de mujer por nombre (Google, Samantha, Victoria, etc.)
  return voices.find(v => v.lang.startsWith('en') && 
    (v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Victoria'))) || 
    voices.find(v => v.lang.startsWith('en'));
}

/** Pronunciar una palabra o frase corta en inglés */
export function speakWord(word) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const utter = new SpeechSynthesisUtterance(word);
  utter.voice = getFemaleVoice();
  utter.lang = 'en-US';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

/** Pronunciar un texto largo */
export function speakText(text, rate = 0.9) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.voice = getFemaleVoice();
  utter.lang = 'en-US';
  utter.rate = rate;
  window.speechSynthesis.speak(utter);
}

// --- PROFILES & LEADERBOARD ---

/** Obtain global leaderboard (top users by XP) */
export async function getLeaderboard(limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      username,
      avatar_url,
      user_stats ( xp, current_streak )
    `)
    .order('user_stats(xp)', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
}

/** Update user profile (username and avatar) */
export async function updateProfile(profileId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/** Calculate level based on test score */
export function calculateLevel(score, total) {
  const pct = (score / total) * 100;
  if (pct < 20) return 'A1';
  if (pct < 40) return 'A2';
  if (pct < 60) return 'B1';
  if (pct < 80) return 'B2';
  return 'C1';
}

/**
 * Genera 5 preguntas de comprensión basadas en el contenido REAL del texto.
 * Si la BD tiene preguntas, las usa. Si no, genera automáticamente del texto.
 */
export async function getQuestionsByReading(readingId, readingContent) {
  const QUIZ_SIZE = 5;
  try {
    const { data, error } = await supabase
      .from('reading_questions')
      .select('*')
      .eq('reading_id', readingId);

    if (!error && data && data.length >= QUIZ_SIZE) {
      return data.sort(() => 0.5 - Math.random()).slice(0, QUIZ_SIZE);
    }

    // Si hay algunas preguntas en BD pero no suficientes, las mezclamos con generadas del texto
    const dbQuestions = (!error && data && data.length > 0) ? data : [];
    const generated = readingContent ? generateQuestionsFromText(readingContent, QUIZ_SIZE) : getGenericFallback();
    const combined = [...dbQuestions, ...generated];
    return combined.slice(0, QUIZ_SIZE);

  } catch (e) {
    console.warn("Generando preguntas del texto...", e);
  }

  return readingContent
    ? generateQuestionsFromText(readingContent, QUIZ_SIZE)
    : getGenericFallback().slice(0, QUIZ_SIZE);
}

/**
 * Analizador de texto que extrae oraciones clave y construye preguntas
 * de comprensión verdaderas basadas en el contenido real.
 */
function generateQuestionsFromText(text, count = 5) {
  // 1. Limpiar y dividir el texto en oraciones
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 30 && s.split(' ').length >= 5);

  if (sentences.length < 3) return getGenericFallback().slice(0, count);

  // 2. Extraer las palabras clave del texto (sustantivos/conceptos relevantes)
  const allWords = text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const stopWords = new Set(['the','a','an','is','are','was','were','to','of','and','in','it','that','this',
    'for','on','with','as','at','by','from','or','but','not','be','been','has','have','had','its',
    'their','they','he','she','we','you','i','my','your','our','his','her','can','will','do','did',
    'what','when','where','who','how','which','there','so','if','than','then','about','more']);
  const keywords = [...new Set(allWords.filter(w => w.length > 4 && !stopWords.has(w)))];

  // 3. Barajar oraciones para variedad
  const shuffled = [...sentences].sort(() => 0.5 - Math.random());
  const picked = shuffled.slice(0, Math.min(count * 2, shuffled.length));

  const questions = [];

  // ── Plantilla A: "According to the text, what is said about [keyword]?" ──
  const makeKeywordQ = (sentence, kw) => {
    const kwDisplay = kw.charAt(0).toUpperCase() + kw.slice(1);
    // Extraer una frase corta que responda la pregunta (primeras 6 palabras del sentence)
    const shortAnswer = sentence.split(' ').slice(0, 7).join(' ').replace(/[,;]$/, '');
    const distractors = generateDistractors(shortAnswer, sentence, keywords);
    const allOpts = shuffle([shortAnswer, ...distractors.slice(0, 3)]);
    return {
      question: `According to the text, which statement about "${kwDisplay}" is most accurate?`,
      options: allOpts,
      correct_option: allOpts.indexOf(shortAnswer)
    };
  };

  // ── Plantilla B: "Complete the sentence from the text: [sentence with gap]" ──
  const makeCompletionQ = (sentence) => {
    const words = sentence.split(' ');
    if (words.length < 6) return null;
    // Elegir una palabra "importante" en la mitad de la oración
    const midPoint = Math.floor(words.length / 2);
    let gapIdx = midPoint;
    for (let i = midPoint; i < words.length; i++) {
      const clean = words[i].replace(/[^a-zA-Z]/g, '');
      if (clean.length > 3 && !stopWords.has(clean.toLowerCase())) { gapIdx = i; break; }
    }
    const answer = words[gapIdx].replace(/[^a-zA-Z]/g, '');
    if (!answer || answer.length < 3) return null;

    const blanked = [...words];
    blanked[gapIdx] = '______';
    const questionSentence = blanked.join(' ');

    // Distractores: palabras similares del texto
    const pool = keywords.filter(w => w !== answer.toLowerCase() && Math.abs(w.length - answer.length) <= 3);
    const wrongOpts = pool.sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1));
    while (wrongOpts.length < 3) wrongOpts.push(['quickly', 'carefully', 'important', 'different', 'special'].find(x => x !== answer.toLowerCase()) || 'often');

    const allOpts = shuffle([answer, ...wrongOpts.slice(0, 3)]);
    return {
      question: `Complete the sentence from the text: "${questionSentence}"`,
      options: allOpts,
      correct_option: allOpts.indexOf(answer)
    };
  };

  // ── Plantilla C: "What does the text say about...?" (Verdadero/Falso style) ──
  const makeTrueFalseQ = (sentence) => {
    const shortened = sentence.length > 80 ? sentence.substring(0, 80) + '...' : sentence;
    // Crear una versión modificada (falsa)
    const words = sentence.split(' ');
    const falseSentence = createFalseSentence(sentence, keywords, stopWords);
    const opts = shuffle([shortened, falseSentence, 'The text does not mention this topic.', 'This contradicts the main idea.']);
    return {
      question: `Which of the following appears in the text?`,
      options: opts,
      correct_option: opts.indexOf(shortened)
    };
  };

  // ── Plantilla D: "What is the main idea of the text?" ──
  const makeMainIdeaQ = (text, title) => {
    // Usar la primera oración como idea principal
    const firstSentence = sentences[0] || '';
    const short = firstSentence.split(' ').slice(0, 8).join(' ');
    const distractors = [
      'A fictional story with no real information.',
      'A list of grammar rules for beginners.',
      'A personal diary entry about daily life.',
    ];
    const allOpts = shuffle([short, ...distractors]);
    return {
      question: `What is the main topic of this reading?`,
      options: allOpts,
      correct_option: allOpts.indexOf(short)
    };
  };

  // ── Construir las 5 preguntas ──
  // Pregunta 1: Tema principal (siempre)
  questions.push(makeMainIdeaQ(text));

  // Preguntas 2-3: Completar oración (basadas en oraciones distintas)
  for (let i = 0; i < picked.length && questions.length < 3; i++) {
    const q = makeCompletionQ(picked[i]);
    if (q) questions.push(q);
  }

  // Pregunta 4: Verdadero/Falso con fragmento real
  if (picked[1]) questions.push(makeTrueFalseQ(picked[1]));

  // Pregunta 5: Keyword (si hay keywords disponibles)
  const kw = keywords[Math.floor(Math.random() * Math.min(keywords.length, 10))];
  const kwSentence = sentences.find(s => s.toLowerCase().includes(kw)) || picked[0];
  if (kw && kwSentence && questions.length < 5) questions.push(makeKeywordQ(kwSentence, kw));

  // Rellenar si no llegamos a 5
  while (questions.length < count) {
    const extra = makeCompletionQ(sentences[questions.length % sentences.length]);
    questions.push(extra || getGenericFallback()[questions.length]);
  }

  return questions.slice(0, count);
}

// ── Helpers ──

function generateDistractors(answer, sentence, keywords) {
  const ansWords = answer.toLowerCase().split(' ');
  // Crear distractores plausibles modificando el answer
  const d1 = keywords.filter(w => !ansWords.includes(w)).slice(0, 1)[0] || 'always';
  const swapMap = { 'not': '', 'always': 'never', 'many': 'few', 'first': 'last', 'can': 'cannot' };
  let d2 = answer;
  for (const [k, v] of Object.entries(swapMap)) {
    if (d2.toLowerCase().includes(k)) { d2 = d2.toLowerCase().replace(k, v); break; }
  }
  return [
    answer.split(' ').reverse().join(' ').slice(0, answer.length),
    d2 !== answer ? d2 : `${d1} ${answer.split(' ').slice(-2).join(' ')}`,
    `This information is not in the text.`,
    `The opposite of what the text says.`
  ];
}

function createFalseSentence(sentence, keywords, stopWords) {
  const words = sentence.split(' ');
  const content = words.filter(w => {
    const clean = w.replace(/[^a-zA-Z]/g, '').toLowerCase();
    return clean.length > 4 && !stopWords.has(clean);
  });
  if (content.length === 0) return 'This was not mentioned in the text.';
  const replaced = keywords.filter(k => !sentence.toLowerCase().includes(k)).slice(0, 1)[0] || 'very different';
  const target = content[Math.floor(Math.random() * content.length)];
  return sentence.replace(target, replaced).substring(0, 80) + '...';
}

function shuffle(arr) {
  return [...arr].sort(() => 0.5 - Math.random());
}

function getGenericFallback() {
  return [
    { question: "What is the primary theme of the text?", options: ["Historical context", "Author's personal life", "Scientific data only", "A general overview of key facts"], correct_option: 3 },
    { question: "Which best describes the author's tone?", options: ["Informative and clear", "Angry and frustrated", "Humorous and sarcastic", "Sad and melancholic"], correct_option: 0 },
    { question: "What is a key takeaway from the reading?", options: ["The issue is unsolvable.", "Effort and practice are needed.", "Only experts can understand it.", "The topic is irrelevant today."], correct_option: 1 },
    { question: "What can be inferred from the vocabulary?", options: ["The topic is outdated.", "The subject matter is important.", "Nobody cares about this.", "It is a temporary trend."], correct_option: 1 },
    { question: "What is the ultimate goal presented?", options: ["To master the subject comfortably", "To pass a single test", "To memorize all facts", "To translate word by word"], correct_option: 0 },
  ];
}
