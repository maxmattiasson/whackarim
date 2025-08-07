const squares = document.querySelectorAll('.square');
const score = document.getElementById('score');
const startButton = document.getElementById('go');
const clock = document.getElementById('timer');
const puntos = document.getElementById('points');

let runGame = false;
let currentScore = 0;
let countdown = 20;
let gameInterval = null;
let countdownInterval = null;


startButton.addEventListener('pointerdown', () => {
  startGame();
})

function startGame(){
  if (runGame) return;

  countdown = 20;
  currentScore = 0;
  score.textContent = `Poäng: ${currentScore}`;

  runGame = true;
  gameInterval = setInterval(() => {
    const randomSquare = squares[Math.floor(Math.random()*squares.length)];
    const mole = randomSquare.querySelector('.mole');
    const spawnTime = Date.now();
 
    if (!randomSquare.classList.contains('active')){
    randomSquare.classList.add('active');
    mole.addEventListener('pointerdown', () => handleClick(randomSquare, spawnTime), {once: true});
    }
    setTimeout(() => {
    randomSquare.classList.remove('active');
    }, 1700)
  }, 2000);

    countdownInterval = setInterval(() => {
    countdown--;
    clock.textContent = countdown;

    if (countdown <= 0) {
      stopGame();
    }
  }, 1000);
}

function handleClick(randomSquare, spawnTime){
  const reactionTime = Date.now() - spawnTime;

 if (reactionTime <= 385) {
  points = 5;
} else if (reactionTime <= 405) {
  points = 4;
} else if (reactionTime <= 460) {
  points = 3;
} else if (reactionTime <= 510) {
  points = 2;
} else {
  points = 1;
}

    currentScore += points;
    score.textContent = `Poäng: ${currentScore}`;
  
    randomSquare.classList.remove('active');
    randomSquare.classList.add('hit');

    setTimeout(() => {
    randomSquare.classList.remove('hit');
    }, 1000)
}


function stopGame(){
  runGame = false;
  clearInterval(gameInterval);
  clearInterval(countdownInterval);
  setTimeout(() => {
    score.textContent = `Bra jobbat! Du fick ${currentScore} poäng`;
  }, 2000)
}