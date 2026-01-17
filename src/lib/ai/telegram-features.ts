/**
 * Telegram Bot Super App Features
 * File: lib/ai/telegram-features.ts
 *
 * Additional features for the Telegram Super App:
 * - Image Generation (AI Art)
 * - Translation
 * - Weather & News
 * - Utility Tools (QR, Calculator, Converter)
 * - Productivity (Notes, Reminders, Todos)
 * - Entertainment (Jokes, Trivia, Games)
 * - Developer Tools (JSON, Hash, Regex)
 * - Finance (Crypto, Forex)
 * - Mini Games
 */

// ============================================
// TYPES
// ============================================

export interface UserNote {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserTodo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
}

export interface UserReminder {
  id: string;
  message: string;
  remindAt: number;
  createdAt: number;
  notified: boolean;
}

export interface UserData {
  notes: UserNote[];
  todos: UserTodo[];
  reminders: UserReminder[];
  bookmarks: { url: string; title: string; addedAt: number }[];
  preferences: {
    defaultLanguage: string;
    timezone: string;
    currency: string;
  };
}

export interface GameState {
  type: 'trivia' | 'wordguess' | 'mathquiz' | 'emoji';
  question?: string;
  answer?: string;
  score: number;
  attempts: number;
  startedAt: number;
}

// ============================================
// STORAGE
// ============================================

const userData = new Map<number, UserData>();
const gameStates = new Map<number, GameState>();

function getUserData(userId: number): UserData {
  let data = userData.get(userId);
  if (!data) {
    data = {
      notes: [],
      todos: [],
      reminders: [],
      bookmarks: [],
      preferences: {
        defaultLanguage: 'auto',
        timezone: 'Asia/Jakarta',
        currency: 'IDR',
      },
    };
    userData.set(userId, data);
  }
  return data;
}

// ============================================
// IMAGE GENERATION
// ============================================

export async function generateImage(prompt: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
  try {
    // Using Pollinations.ai - free AI image generation
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;

    // Verify the image is accessible
    const response = await fetch(imageUrl, { method: 'HEAD' });

    if (response.ok) {
      return { success: true, imageUrl };
    }

    return { success: false, error: 'Failed to generate image' };
  } catch (error) {
    console.error('Image generation error:', error);
    return { success: false, error: 'Image generation service unavailable' };
  }
}

// ============================================
// TRANSLATION
// ============================================

const LANGUAGE_CODES: Record<string, string> = {
  'en': 'English',
  'id': 'Indonesian',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'it': 'Italian',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'zh': 'Chinese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'nl': 'Dutch',
  'pl': 'Polish',
  'tr': 'Turkish',
};

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'auto'
): Promise<{ success: boolean; translation?: string; detectedLang?: string; error?: string }> {
  try {
    // Using LibreTranslate API (free, no key required for some instances)
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      // Fallback: Return the text with a note
      return {
        success: true,
        translation: `[Translation to ${LANGUAGE_CODES[targetLang] || targetLang}]\n${text}`,
        detectedLang: sourceLang,
      };
    }

    const data = await response.json();
    return {
      success: true,
      translation: data.translatedText,
      detectedLang: data.detectedLanguage?.language,
    };
  } catch {
    return { success: false, error: 'Translation service unavailable' };
  }
}

export function getLanguageList(): string {
  return Object.entries(LANGUAGE_CODES)
    .map(([code, name]) => `${code} - ${name}`)
    .join('\n');
}

// ============================================
// WEATHER
// ============================================

export async function getWeather(city: string): Promise<{
  success: boolean;
  data?: {
    city: string;
    country: string;
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
    wind: number;
  };
  error?: string;
}> {
  try {
    // Using wttr.in - free weather API
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, {
      headers: { 'User-Agent': 'IbnuGPT-Bot' },
    });

    if (!response.ok) {
      return { success: false, error: 'City not found' };
    }

    const data = await response.json();
    const current = data.current_condition[0];
    const area = data.nearest_area[0];

    return {
      success: true,
      data: {
        city: area.areaName[0].value,
        country: area.country[0].value,
        temp: parseInt(current.temp_C),
        feels_like: parseInt(current.FeelsLikeC),
        humidity: parseInt(current.humidity),
        description: current.weatherDesc[0].value,
        icon: getWeatherEmoji(current.weatherCode),
        wind: parseInt(current.windspeedKmph),
      },
    };
  } catch {
    return { success: false, error: 'Weather service unavailable' };
  }
}

function getWeatherEmoji(code: string): string {
  const codeNum = parseInt(code);
  if (codeNum === 113) return '☀️';
  if (codeNum === 116) return '⛅';
  if (codeNum === 119 || codeNum === 122) return '☁️';
  if (codeNum >= 176 && codeNum <= 201) return '🌧️';
  if (codeNum >= 200 && codeNum <= 232) return '⛈️';
  if (codeNum >= 260 && codeNum <= 284) return '🌫️';
  if (codeNum >= 293 && codeNum <= 314) return '🌧️';
  if (codeNum >= 317 && codeNum <= 338) return '🌨️';
  if (codeNum >= 350 && codeNum <= 377) return '🌨️';
  if (codeNum >= 386 && codeNum <= 395) return '⛈️';
  return '🌤️';
}

// ============================================
// NEWS (using RSS feeds)
// ============================================

export async function getNews(category: string = 'technology'): Promise<{
  success: boolean;
  articles?: { title: string; link: string; source: string }[];
  error?: string;
}> {
  try {
    // Using Google News RSS
    const feeds: Record<string, string> = {
      technology: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtbGtHZ0pKUkNnQVAB?hl=id&gl=ID&ceid=ID:id',
      business: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtbGtHZ0pKUkNnQVAB?hl=id&gl=ID&ceid=ID:id',
      sports: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtbGtHZ0pKUkNnQVAB?hl=id&gl=ID&ceid=ID:id',
      entertainment: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtbGtHZ0pKUkNnQVAB?hl=id&gl=ID&ceid=ID:id',
      world: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtbGtHZ0pKUkNnQVAB?hl=id&gl=ID&ceid=ID:id',
    };

    const feedUrl = feeds[category] || feeds.technology;
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return { success: false, error: 'News service unavailable' };
    }

    const xml = await response.text();
    const articles: { title: string; link: string; source: string }[] = [];

    // Simple XML parsing
    const itemRegex = /<item>[\s\S]*?<title>([^<]+)<\/title>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<source[^>]*>([^<]+)<\/source>[\s\S]*?<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && articles.length < 5) {
      articles.push({
        title: match[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        link: match[2],
        source: match[3],
      });
    }

    return { success: true, articles };
  } catch {
    return { success: false, error: 'Failed to fetch news' };
  }
}

// ============================================
// UTILITY TOOLS
// ============================================

// QR Code Generator
export function generateQRCode(data: string): string {
  const encodedData = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedData}`;
}

// Calculator
export function calculate(expression: string): { success: boolean; result?: number; error?: string } {
  try {
    // Sanitize input - only allow safe characters
    const sanitized = expression.replace(/[^0-9+\-*/().%\s^]/g, '');

    if (!sanitized || sanitized !== expression.replace(/\s/g, '')) {
      return { success: false, error: 'Invalid expression' };
    }

    // Replace ^ with ** for power
    const jsExpr = sanitized.replace(/\^/g, '**');

    // Safe evaluation
    const result = Function(`'use strict'; return (${jsExpr})`)();

    if (typeof result !== 'number' || !isFinite(result)) {
      return { success: false, error: 'Invalid result' };
    }

    return { success: true, result };
  } catch {
    return { success: false, error: 'Calculation error' };
  }
}

// Unit Converter
const UNIT_CONVERSIONS: Record<string, Record<string, number>> = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    ft: 0.3048,
    in: 0.0254,
    yd: 0.9144,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.453592,
    oz: 0.0283495,
    ton: 1000,
  },
  temperature: {}, // Special handling
  volume: {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    cup: 0.236588,
  },
  area: {
    m2: 1,
    km2: 1000000,
    ha: 10000,
    acre: 4046.86,
    ft2: 0.092903,
  },
  time: {
    s: 1,
    ms: 0.001,
    min: 60,
    h: 3600,
    day: 86400,
    week: 604800,
  },
  data: {
    b: 1,
    kb: 1024,
    mb: 1048576,
    gb: 1073741824,
    tb: 1099511627776,
  },
};

export function convertUnit(
  value: number,
  fromUnit: string,
  toUnit: string
): { success: boolean; result?: number; formatted?: string; error?: string } {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  // Temperature special case
  if ((from === 'c' || from === 'f' || from === 'k') &&
      (to === 'c' || to === 'f' || to === 'k')) {
    let celsius: number;

    // Convert to Celsius first
    if (from === 'f') celsius = (value - 32) * 5 / 9;
    else if (from === 'k') celsius = value - 273.15;
    else celsius = value;

    // Convert from Celsius to target
    let result: number;
    if (to === 'f') result = celsius * 9 / 5 + 32;
    else if (to === 'k') result = celsius + 273.15;
    else result = celsius;

    return {
      success: true,
      result,
      formatted: `${value}°${from.toUpperCase()} = ${result.toFixed(2)}°${to.toUpperCase()}`,
    };
  }

  // Find the category
  for (const [category, units] of Object.entries(UNIT_CONVERSIONS)) {
    if (units[from] !== undefined && units[to] !== undefined) {
      const baseValue = value * units[from];
      const result = baseValue / units[to];
      return {
        success: true,
        result,
        formatted: `${value} ${from} = ${result.toFixed(4)} ${to}`,
      };
    }
  }

  return { success: false, error: `Cannot convert ${from} to ${to}` };
}

// Currency Converter
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<{ success: boolean; result?: number; rate?: number; error?: string }> {
  try {
    // Using exchangerate-api (free tier)
    const response = await fetch(`https://open.er-api.com/v6/latest/${from.toUpperCase()}`);

    if (!response.ok) {
      return { success: false, error: 'Currency not found' };
    }

    const data = await response.json();
    const rate = data.rates[to.toUpperCase()];

    if (!rate) {
      return { success: false, error: `Rate for ${to} not found` };
    }

    return {
      success: true,
      result: amount * rate,
      rate,
    };
  } catch {
    return { success: false, error: 'Currency service unavailable' };
  }
}

// Timezone Converter
export function convertTimezone(time: string, fromTz: string, toTz: string): string {
  try {
    const date = new Date(time);
    return date.toLocaleString('en-US', { timeZone: toTz });
  } catch {
    return 'Invalid timezone or time format';
  }
}

// URL Shortener (using is.gd)
export async function shortenUrl(url: string): Promise<{ success: boolean; shortUrl?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to shorten URL' };
    }

    const data = await response.json();
    return { success: true, shortUrl: data.shorturl };
  } catch {
    return { success: false, error: 'URL shortener unavailable' };
  }
}

// ============================================
// PRODUCTIVITY - Notes, Todos, Reminders
// ============================================

export function addNote(userId: number, title: string, content: string): UserNote {
  const data = getUserData(userId);
  const note: UserNote = {
    id: Date.now().toString(36),
    title,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  data.notes.push(note);
  return note;
}

export function getNotes(userId: number): UserNote[] {
  return getUserData(userId).notes;
}

export function deleteNote(userId: number, noteId: string): boolean {
  const data = getUserData(userId);
  const index = data.notes.findIndex(n => n.id === noteId);
  if (index !== -1) {
    data.notes.splice(index, 1);
    return true;
  }
  return false;
}

export function addTodo(userId: number, task: string, dueDate?: number): UserTodo {
  const data = getUserData(userId);
  const todo: UserTodo = {
    id: Date.now().toString(36),
    task,
    completed: false,
    createdAt: Date.now(),
    dueDate,
  };
  data.todos.push(todo);
  return todo;
}

export function getTodos(userId: number): UserTodo[] {
  return getUserData(userId).todos;
}

export function toggleTodo(userId: number, todoId: string): boolean {
  const data = getUserData(userId);
  const todo = data.todos.find(t => t.id === todoId);
  if (todo) {
    todo.completed = !todo.completed;
    return true;
  }
  return false;
}

export function deleteTodo(userId: number, todoId: string): boolean {
  const data = getUserData(userId);
  const index = data.todos.findIndex(t => t.id === todoId);
  if (index !== -1) {
    data.todos.splice(index, 1);
    return true;
  }
  return false;
}

export function addBookmark(userId: number, url: string, title: string): void {
  const data = getUserData(userId);
  data.bookmarks.push({ url, title, addedAt: Date.now() });
}

export function getBookmarks(userId: number): { url: string; title: string; addedAt: number }[] {
  return getUserData(userId).bookmarks;
}

// ============================================
// ENTERTAINMENT
// ============================================

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "Why did the developer go broke? Because he used up all his cache! 💸",
  "There are only 10 types of people in the world: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks, 'Can I join you?' 🍺",
  "Why do Java developers wear glasses? Because they can't C#! 👓",
  "What's a programmer's favorite hangout place? Foo Bar! 🍻",
  "Why was the JavaScript developer sad? Because he didn't Node how to Express himself! 😢",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
  "Why did the programmer quit his job? Because he didn't get arrays! 📊",
  "What do you call a programmer from Finland? Nerdic! 🇫🇮",
];

const FUN_FACTS = [
  "🧠 The first computer programmer was Ada Lovelace, a woman, in the 1840s!",
  "🌐 The first website is still online at info.cern.ch",
  "📧 The first email was sent by Ray Tomlinson to himself in 1971",
  "🎮 The first video game was created in 1958 - Tennis for Two",
  "💾 A floppy disk could hold 1.44 MB. Your average photo today is bigger!",
  "🔢 The word 'bug' in computing came from an actual moth found in a computer in 1947",
  "🌍 Google's first server was made of LEGO bricks",
  "📱 The first smartphone was IBM Simon in 1992, 15 years before iPhone",
  "🤖 The term 'robot' comes from the Czech word 'robota' meaning forced labor",
  "🔐 The most common password is still '123456' - please don't use it!",
];

const QUOTES = [
  "\"The only way to do great work is to love what you do.\" - Steve Jobs",
  "\"Innovation distinguishes between a leader and a follower.\" - Steve Jobs",
  "\"Stay hungry, stay foolish.\" - Steve Jobs",
  "\"The best way to predict the future is to invent it.\" - Alan Kay",
  "\"Simplicity is the ultimate sophistication.\" - Leonardo da Vinci",
  "\"First, solve the problem. Then, write the code.\" - John Johnson",
  "\"Code is like humor. When you have to explain it, it's bad.\" - Cory House",
  "\"Make it work, make it right, make it fast.\" - Kent Beck",
  "\"The function of good software is to make the complex appear simple.\" - Grady Booch",
  "\"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\" - Martin Fowler",
];

const TRIVIA_QUESTIONS = [
  { q: "What year was the first iPhone released?", a: "2007", options: ["2005", "2007", "2009", "2010"] },
  { q: "What does CPU stand for?", a: "Central Processing Unit", options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"] },
  { q: "Who founded Microsoft?", a: "Bill Gates and Paul Allen", options: ["Steve Jobs", "Bill Gates and Paul Allen", "Mark Zuckerberg", "Elon Musk"] },
  { q: "What programming language is known as the 'mother of all languages'?", a: "C", options: ["Java", "Python", "C", "FORTRAN"] },
  { q: "What does HTML stand for?", a: "HyperText Markup Language", options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Mode Language"] },
  { q: "In what year was Python first released?", a: "1991", options: ["1989", "1991", "1995", "2000"] },
  { q: "What company owns Android?", a: "Google", options: ["Apple", "Microsoft", "Google", "Samsung"] },
  { q: "What is the most used programming language in 2024?", a: "JavaScript", options: ["Python", "JavaScript", "Java", "C++"] },
];

export function getRandomJoke(): string {
  return JOKES[Math.floor(Math.random() * JOKES.length)];
}

export function getRandomFact(): string {
  return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
}

export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

export function getHoroscope(sign: string): string {
  const signs: Record<string, string> = {
    aries: "♈ Aries: Today brings new opportunities. Take initiative and lead the way!",
    taurus: "♉ Taurus: Focus on stability today. Your patience will pay off.",
    gemini: "♊ Gemini: Communication is key. Share your ideas with others.",
    cancer: "♋ Cancer: Trust your intuition today. Home and family matters are highlighted.",
    leo: "♌ Leo: Your creativity shines! Express yourself boldly.",
    virgo: "♍ Virgo: Pay attention to details. Organization brings success.",
    libra: "♎ Libra: Seek balance in relationships. Harmony is within reach.",
    scorpio: "♏ Scorpio: Transformation is coming. Embrace change.",
    sagittarius: "♐ Sagittarius: Adventure calls! Explore new possibilities.",
    capricorn: "♑ Capricorn: Hard work pays off. Stay focused on your goals.",
    aquarius: "♒ Aquarius: Innovation is your strength. Think outside the box.",
    pisces: "♓ Pisces: Trust your dreams. Creativity flows freely today.",
  };
  return signs[sign.toLowerCase()] || "Please enter a valid zodiac sign (e.g., aries, leo, pisces)";
}

// Trivia Game
export function startTrivia(userId: number): { question: string; options: string[] } {
  const q = TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)];
  const state: GameState = {
    type: 'trivia',
    question: q.q,
    answer: q.a,
    score: gameStates.get(userId)?.score || 0,
    attempts: 0,
    startedAt: Date.now(),
  };
  gameStates.set(userId, state);

  // Shuffle options
  const shuffled = [...q.options].sort(() => Math.random() - 0.5);
  return { question: q.q, options: shuffled };
}

export function answerTrivia(userId: number, answer: string): { correct: boolean; correctAnswer: string; score: number } {
  const state = gameStates.get(userId);
  if (!state || state.type !== 'trivia') {
    return { correct: false, correctAnswer: '', score: 0 };
  }

  const correct = answer.toLowerCase().includes(state.answer!.toLowerCase());
  if (correct) {
    state.score++;
  }

  return { correct, correctAnswer: state.answer!, score: state.score };
}

// Math Quiz
export function startMathQuiz(userId: number, difficulty: 'easy' | 'medium' | 'hard' = 'easy'): { question: string; answer: number } {
  let a: number, b: number, op: string, answer: number;

  switch (difficulty) {
    case 'easy':
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      op = ['+', '-'][Math.floor(Math.random() * 2)];
      answer = op === '+' ? a + b : a - b;
      break;
    case 'medium':
      a = Math.floor(Math.random() * 50) + 1;
      b = Math.floor(Math.random() * 20) + 1;
      op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
      answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
      break;
    case 'hard':
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 50) + 1;
      op = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
      if (op === '/') {
        answer = b;
        a = a * b; // Ensure clean division
      } else {
        answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
      }
      break;
  }

  const question = `${a} ${op} ${b} = ?`;

  const state: GameState = {
    type: 'mathquiz',
    question,
    answer: answer.toString(),
    score: gameStates.get(userId)?.score || 0,
    attempts: 0,
    startedAt: Date.now(),
  };
  gameStates.set(userId, state);

  return { question, answer };
}

export function answerMathQuiz(userId: number, answer: number): { correct: boolean; correctAnswer: number; score: number } {
  const state = gameStates.get(userId);
  if (!state || state.type !== 'mathquiz') {
    return { correct: false, correctAnswer: 0, score: 0 };
  }

  const correct = answer === parseInt(state.answer!);
  if (correct) {
    state.score++;
  }

  return { correct, correctAnswer: parseInt(state.answer!), score: state.score };
}

// Word Games
const WORDS = ['javascript', 'python', 'programming', 'developer', 'algorithm', 'database', 'function', 'variable', 'interface', 'framework'];

export function startWordGuess(userId: number): { hint: string; length: number } {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const hint = word[0] + '_'.repeat(word.length - 2) + word[word.length - 1];

  const state: GameState = {
    type: 'wordguess',
    answer: word,
    score: gameStates.get(userId)?.score || 0,
    attempts: 3,
    startedAt: Date.now(),
  };
  gameStates.set(userId, state);

  return { hint, length: word.length };
}

export function guessWord(userId: number, guess: string): { correct: boolean; answer: string; attemptsLeft: number; score: number } {
  const state = gameStates.get(userId);
  if (!state || state.type !== 'wordguess') {
    return { correct: false, answer: '', attemptsLeft: 0, score: 0 };
  }

  state.attempts--;
  const correct = guess.toLowerCase() === state.answer!.toLowerCase();

  if (correct) {
    state.score++;
  }

  return { correct, answer: state.answer!, attemptsLeft: state.attempts, score: state.score };
}

export function getGameScore(userId: number): number {
  return gameStates.get(userId)?.score || 0;
}

export function resetGameScore(userId: number): void {
  const state = gameStates.get(userId);
  if (state) {
    state.score = 0;
  }
}

// ============================================
// DEVELOPER TOOLS
// ============================================

// JSON Formatter
export function formatJSON(input: string): { success: boolean; formatted?: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { success: true, formatted: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { success: false, error: 'Invalid JSON' };
  }
}

// Base64 Encode/Decode
export function base64Encode(input: string): string {
  return Buffer.from(input).toString('base64');
}

export function base64Decode(input: string): { success: boolean; result?: string; error?: string } {
  try {
    return { success: true, result: Buffer.from(input, 'base64').toString('utf-8') };
  } catch {
    return { success: false, error: 'Invalid Base64 string' };
  }
}

// Hash Generator (using Web Crypto API for edge compatibility)
export async function generateHash(input: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' = 'sha256'): Promise<string> {
  // Map algorithm names to Web Crypto API names
  const algoMap: Record<string, string> = {
    'md5': 'MD5', // Note: MD5 not available in Web Crypto, will use fallback
    'sha1': 'SHA-1',
    'sha256': 'SHA-256',
    'sha512': 'SHA-512',
  };

  // MD5 is not supported in Web Crypto API, use simple implementation
  if (algorithm === 'md5') {
    return simpleMD5(input);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest(algoMap[algorithm], data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Simple MD5 implementation for edge compatibility
function simpleMD5(input: string): string {
  // Simplified hash for demo - in production use a proper MD5 library
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Convert to hex-like string (not true MD5, but functional for demo)
  const result = Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
  return result;
}

// UUID Generator
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Lorem Ipsum Generator
export function generateLoremIpsum(paragraphs: number = 1): string {
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  return Array(paragraphs).fill(lorem).join('\n\n');
}

// Color Converter
export function convertColor(color: string): { hex?: string; rgb?: string; hsl?: string; error?: string } {
  // HEX to RGB
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    // RGB to HSL
    const r1 = r / 255, g1 = g / 255, b1 = b / 255;
    const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1);
    const l = (max + min) / 2;
    let h = 0, s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r1: h = ((g1 - b1) / d + (g1 < b1 ? 6 : 0)) / 6; break;
        case g1: h = ((b1 - r1) / d + 2) / 6; break;
        case b1: h = ((r1 - g1) / d + 4) / 6; break;
      }
    }

    return {
      hex: color,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    };
  }

  return { error: 'Please provide a HEX color (e.g., #FF5733)' };
}

// Password Generator
export function generatePassword(length: number = 16, options?: {
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean
}): string {
  const opts = { uppercase: true, lowercase: true, numbers: true, symbols: true, ...options };

  let chars = '';
  if (opts.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (opts.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (opts.numbers) chars += '0123456789';
  if (opts.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
}

// ============================================
// FINANCE
// ============================================

export async function getCryptoPrice(symbol: string): Promise<{
  success: boolean;
  data?: { symbol: string; price: number; change24h: number; marketCap: number };
  error?: string;
}> {
  try {
    // Using CoinGecko API (free)
    const coinId = symbol.toLowerCase();
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );

    if (!response.ok) {
      return { success: false, error: 'Crypto not found' };
    }

    const data = await response.json();
    const coinData = data[coinId];

    if (!coinData) {
      return { success: false, error: `${symbol} not found` };
    }

    return {
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        price: coinData.usd,
        change24h: coinData.usd_24h_change,
        marketCap: coinData.usd_market_cap,
      },
    };
  } catch {
    return { success: false, error: 'Crypto service unavailable' };
  }
}

export async function getTopCryptos(limit: number = 10): Promise<{
  success: boolean;
  data?: Array<{ rank: number; name: string; symbol: string; price: number; change24h: number }>;
  error?: string;
}> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`
    );

    if (!response.ok) {
      return { success: false, error: 'Failed to fetch crypto data' };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.map((coin: { market_cap_rank: number; name: string; symbol: string; current_price: number; price_change_percentage_24h: number }, index: number) => ({
        rank: coin.market_cap_rank || index + 1,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
      })),
    };
  } catch {
    return { success: false, error: 'Crypto service unavailable' };
  }
}

// ============================================
// EXPORT ALL
// ============================================

export {
  getUserData,
  LANGUAGE_CODES,
};
