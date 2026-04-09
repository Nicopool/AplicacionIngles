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

/** Obtener preguntas para un quiz de lectura (Exactamente 15 preguntas) */
export async function getQuestionsByReading(readingId) {
  try {
    const { data, error } = await supabase
      .from('reading_questions')
      .select('*')
      .eq('reading_id', readingId);
      
    if (!error && data && data.length >= 15) {
      // Retornar al azar 15 preguntas
      return data.sort(() => 0.5 - Math.random()).slice(0, 15);
    } else if (!error && data && data.length > 0) {
      // Si hay menos de 15, retorna las que hay, rellenando con genericas
      const questions = [...data];
      const fallback = getFallbackQuestions();
      while (questions.length < 15) {
        questions.push(fallback[questions.length % fallback.length]);
      }
      return questions;
    }
  } catch (e) {
    console.warn("Using fallback quiz questions", e);
  }
  
  return getFallbackQuestions().slice(0, 15);
}

function getFallbackQuestions() {
  return [
    { question: "What is the primary theme of the text?", options: ["Historical context", "Author's personal life", "Detailed scientific data", "A general overview and key facts"], correct_option: 3 },
    { question: "Which of the following best describes the author's tone?", options: ["Informative and clear", "Angry and frustrated", "Humorous and sarcastic", "Sad and melancholic"], correct_option: 0 },
    { question: "According to the reading, what is a key takeaway?", options: ["The issue is unsolvable.", "It requires a bit of effort and practice.", "It provides a clear pathway forward.", "It only applies to complete experts."], correct_option: 2 },
    { question: "What can be inferred from the vocabulary used?", options: ["The topic is outdated.", "The subject matter is important.", "No one cares about this issue.", "It is only a temporary trend."], correct_option: 1 },
    { question: "How should a student approach this topic according to the text?", options: ["By ignoring the difficult words.", "By practicing steadily every day.", "By translating the entire text at once.", "By memorizing everything."], correct_option: 1 },
    { question: "Which of the following words best matches the context of the reading?", options: ["Development", "Irrelevance", "Failure", "Boredom"], correct_option: 0 },
    { question: "What is the main purpose of the opening paragraph?", options: ["To introduce the topic", "To provide a conclusion", "To confuse the reader", "To summarize everything"], correct_option: 0 },
    { question: "Who is the most likely target audience for this text?", options: ["Experts in the field", "General learners", "Children under five", "Animals"], correct_option: 1 },
    { question: "What does the text imply about the future of this topic?", options: ["It will disappear.", "It is uncertain.", "It holds promise and relevance.", "It is already in the past."], correct_option: 2 },
    { question: "Which statement would the author most likely agree with?", options: ["Consistency is key.", "Learning is too hard.", "We should give up.", "Translations are always perfect."], correct_option: 0 },
    { question: "What structural method does the author use?", options: ["Chronological order", "Explaining concepts with context", "Random thoughts", "Only bullet points"], correct_option: 1 },
    { question: "How does the passage conclude?", options: ["With a strong recommendation", "Without any resolution", "With an unrelated joke", "With a detailed warning"], correct_option: 0 },
    { question: "What is the most challenging aspect mentioned?", options: ["Finding motivation", "Mastering the nuances", "Reading the instructions", "Nothing is challenging"], correct_option: 1 },
    { question: "What role does context play in this reading?", options: ["It is irrelevant", "It helps understand the true meaning", "It confuses the core message", "It is historically inaccurate"], correct_option: 1 },
    { question: "What is the ultimate goal presented by the text?", options: ["To master the subject comfortably", "To pass a single test", "To memorize facts", "To translate word by word"], correct_option: 0 }
  ];
}
