const squares = document.querySelectorAll('.square');
const score = document.getElementById('score');
const startButton = document.getElementById('go');
const clock = document.getElementById('timer');
const puntos = document.getElementById('points');
const soundSpawn = document.getElementById('s-spawn');
const soundHit = document.getElementById('s-hit');
const game = document.getElementById('game');

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

  console.log(reactionTime, points)

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
    score.textContent = `Bra jobbat! Du fick ${currentScore} poäng`;
  }, 2000)
}

function playSpawn() {
  soundSpawn.currentTime = 0;
  soundSpawn.play();
}
function playHit() {
  soundHit.currentTime = 0;
  soundHit.play();
}
  const dlg = document.getElementById('myDialog');
  document.getElementById('leaderboard-btn').addEventListener('click', () => dlg.showModal());
  document.getElementById('closeBtn').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    const rect = dlg.getBoundingClientRect();
    const inCard = e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom;
    if (!inCard) dlg.close();
  });
  
game.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });