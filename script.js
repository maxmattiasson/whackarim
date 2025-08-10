const squares = document.querySelectorAll('.square');
const score = document.getElementById('score');
const startButton = document.getElementById('go');
const clock = document.getElementById('timer');
const puntos = document.getElementById('points');
const soundSpawn = document.getElementById('s-spawn');
const soundHit = document.getElementById('s-hit');
const game = document.getElementById('game');
const hsBadge = document.getElementById('highscore');


const TOTAL_SPAWNS = 30;   
const START_MS = 1200;  
const END_MS   = 380;     
const DESPAWN_MS = 1700;
const FIRST_DELAY_MS = 800;

let runGame = false;
let currentScore = 0;
let countdown = 25;
let gameInterval = null;
let countdownInterval = null;

let spawns = 0;
let spawnTimeoutId = null;

const despawnTimers = new Map();
const BACKEND_URL = 'https://lolguesser-backend.onrender.com/api/wam';

const LS_KEYS = {
  name: 'wamName',
  high: 'wamHigh',
  submitted: 'wamSubmittedHigh',
};

const lerp = (a, b, t) => a + (b - a) * t;
function nextDelay(i) {
  const t = Math.min(1, i / (TOTAL_SPAWNS - 1));
  const base = Math.round(lerp(START_MS, END_MS, t));
  const jitter = Math.round(base * 0.08 * (Math.random() - 0.5));
  return Math.max(END_MS, base + jitter);
}

startButton.addEventListener('pointerdown', () => {
  startGame();
})

renderHighBadge();

function startGame(){
  if (runGame) return;

  countdown = 25;
  currentScore = 0;
  score.textContent = `Poäng: ${currentScore}`;
  clock.textContent = countdown;

  runGame = true;
  spawns = 0;

  spawnTimeoutId = setTimeout(scheduleNextSpawn, FIRST_DELAY_MS);

  countdownInterval = setInterval(() => {
    countdown--;
    clock.textContent = countdown;

    if (countdown <= 0) {
      stopGame();
    }
  }, 1000);
}

function scheduleNextSpawn(){
  if (!runGame) return;
  if (spawns >= TOTAL_SPAWNS) return;

  const didSpawn = spawnOne();
  if (didSpawn) spawns++;

  spawnTimeoutId = setTimeout(scheduleNextSpawn, nextDelay(spawns));
}

function spawnOne(){
    const randomSquare = pickFreeSquare();
    if (!randomSquare) return false;

    const mole = randomSquare.querySelector('.mole');
    const spawnTime = Date.now();
 
    const prev = despawnTimers.get(randomSquare);
      if (prev) clearTimeout(prev);

    randomSquare.classList.add('active');
    playSpawn();
    mole.addEventListener('pointerdown', () => handleClick(randomSquare, spawnTime), {once: true});
    
  const id = setTimeout(() => {
    randomSquare.classList.remove('active');
    despawnTimers.delete(randomSquare);
  }, DESPAWN_MS);
  despawnTimers.set(randomSquare, id);  
    return true;
  }

function pickFreeSquare() {
  const free = [...squares].filter(sq => !sq.classList.contains('active') && !sq.classList.contains('hit'));
  if (free.length === 0) return null;
  return free[Math.floor(Math.random() * free.length)];
}

function handleClick(randomSquare, spawnTime){
  const reactionTime = Date.now() - spawnTime;

  let points;

 if (reactionTime <= 375) {
  points = 5;
} else if (reactionTime <= 395) {
  points = 4;
} else if (reactionTime <= 560) {
  points = 3;
} else if (reactionTime <= 710) {
  points = 2;
} else {
  points = 1;
}
    playHit();
    currentScore += points;
    score.textContent = `Poäng: ${currentScore}`;
  
    randomSquare.classList.remove('active');
    randomSquare.classList.add('hit');

      const id = despawnTimers.get(randomSquare);
      if (id) { clearTimeout(id); despawnTimers.delete(randomSquare); }

    setTimeout(() => {
    randomSquare.classList.remove('hit');
    }, 1000)
}

function stopGame(){
  if (!runGame) return;

  runGame = false;
  clearTimeout(spawnTimeoutId);
  clearInterval(countdownInterval);
  
  squares.forEach(sq => sq.classList.remove('active','hit'));

  setTimeout(() => {
    score.textContent = `Du fick ${currentScore} poäng`;
    onGameEndPersistAndPrompt(currentScore);
  }, 1000)
}

function playSpawn() {
  soundSpawn.currentTime = 0;
  soundSpawn.play();
}
function playHit() {
  soundHit.currentTime = 0;
  soundHit.play();
}
  const dlg = document.getElementById('submit-dialog');
  document.getElementById('closeBtn').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const inCard = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
    if (!inCard) dlg.close();
  });
  
game.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

// ===== Leaderboard / High Score local state =====


function loadState() {
  return {
    name: localStorage.getItem(LS_KEYS.name) ?? '',
    high: Number(localStorage.getItem(LS_KEYS.high) ?? 0),
    submitted: Number(localStorage.getItem(LS_KEYS.submitted) ?? 0),
  };
}

function saveName(name) {
  localStorage.setItem(LS_KEYS.name, name.trim());
}

function saveHighScore(score) {
  const current = Number(localStorage.getItem(LS_KEYS.high) ?? 0);
  if (score > current) {
    localStorage.setItem(LS_KEYS.high, String(score));
    renderHighBadge();
}
}

function markSubmitted(highScore) {
  localStorage.setItem(LS_KEYS.submitted, String(highScore));
}

function canSubmitNow() {
  const { high, submitted } = loadState();
  return high > 0 && high > submitted;
}

// Hydrate dialog UI whenever it opens
dlg.addEventListener('close', () => {
  // no-op, but kept if you want to react on close later
});

document.getElementById('submit-btn').addEventListener('click', () => {
  hydrateSubmitUI();
  dlg.showModal();
});

function hydrateSubmitUI() {
  const { name, high, submitted } = loadState();
  const hsValue = document.getElementById('hs-value');
  const nameInput = document.getElementById('player-name');
  const submitBtn = document.getElementById('submit-best');
  const statusEl = document.getElementById('submit-status');

  if (hsValue) hsValue.textContent = String(high);
  if (nameInput && !nameInput.value) nameInput.value = name;

  if (submitBtn) {
    submitBtn.disabled = !(high > 0 && high > submitted);
    submitBtn.textContent = submitBtn.disabled ? 'Already submitted best' : 'Submit best to leaderboard';
  }
  if (statusEl) statusEl.textContent = '';
}

// Save name as user types
const nameInputEl = document.getElementById('player-name');
if (nameInputEl) {
  nameInputEl.addEventListener('input', (e) => saveName(e.target.value));
}

// Handle submit
const submitBtnEl = document.getElementById('submit-best');
const statusEl = document.getElementById('submit-status');

if (submitBtnEl) {
  submitBtnEl.addEventListener('click', async () => {
    const { name, high } = loadState();
    if (!name || !canSubmitNow()) return;

    submitBtnEl.disabled = true;
    statusEl.textContent = 'Submitting…';

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // include auth/cookie if needed: credentials: 'include',
        body: JSON.stringify({ name, score: high }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `HTTP ${res.status}`);
      }

      markSubmitted(high);
      statusEl.textContent = 'Submitted! 🎉';
      hydrateSubmitUI();
    } catch (err) {
      statusEl.textContent = 'Submit failed. Try again later.';
      submitBtnEl.disabled = false;
      console.error(err);
    }
  });
}

function onGameEndPersistAndPrompt(finalScore) {
  saveHighScore(finalScore);
  hydrateSubmitUI();
  const { high, submitted } = loadState();
  if (finalScore === high && high > submitted) {
    dlg.showModal(); // auto-open if new PB not yet submitted
  }
}

function renderHighBadge(){
  const { high } = loadState();
  if (hsBadge) hsBadge.textContent = `Ditt highscore: ${high}`;
}

async function showLeaderboard() {
  const { name } = loadState();
  if (!name) {
    alert('Set your name first!');
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/top/${encodeURIComponent(name)}`);
    const data = await res.json();

    if (!data.top || data.top.length === 0) {
      alert('No scores yet!');
      return;
    }

    // Build leaderboard text
    let lines = data.top.map(r => `${r.rank}. ${r.name} — ${r.high}`);

    // Add your own line if not already in top 10
    if (data.you && data.you.rank > 10) {
      lines.push(`…`);
      lines.push(`${data.you.rank}. ${data.you.name} — ${data.you.high}`);
    }

    alert(lines.join('\n')); // replace with nicer dialog rendering if you want
  } catch (err) {
    console.error('Failed to load leaderboard', err);
  }
}

document.getElementById('leaderboard-btn').addEventListener('click', showLeaderboard);
