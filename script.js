const start = document.getElementById('start-game');
const beaver = document.querySelectorAll('.square');

let gameStart = false;
let currentScore = 0;
let intervalSmack = null;
let countdown = 20;
let timerInterval = null;
let currentTargetTime = 0;

const options = [
  document.getElementById('1'),
  document.getElementById('2'),
  document.getElementById('3'),
  document.getElementById('4'),
  document.getElementById('5'),
  document.getElementById('6'),
  document.getElementById('7'),
  document.getElementById('8'),
  document.getElementById('9'),
]


start.addEventListener('click', () => {
  startGame();
  setTimeout(stopGame, 20000);
});


function startGame(){
  currentScore = 0;
  updateScore();
  document.getElementById('board').style.backgroundColor = '';
  gameStart = true;
  toSmack();

  countdown = 20;
document.getElementById('time-left').textContent = countdown;

timerInterval = setInterval(() => {
  countdown--;
  document.getElementById('time-left').textContent = countdown;
  if (countdown <= 0) {
    clearInterval(timerInterval);
  }
}, 1000);
}

function toSmack(){
  if (gameStart) {
  intervalSmack = setInterval(() => {
    let num = Math.floor(Math.random()*options.length);
    let target = options[num];
    target.classList.add('toClick');
    currentTargetTime = Date.now(); 
    setTimeout(() => {
      target.classList.remove('toClick');
    }, 1000);
}, 2000);
}
}

function updateScore(){
  document.getElementById('score').textContent = currentScore;
}

function stopGame(){
  gameStart = false;
  clearInterval(intervalSmack);
  document.getElementById('points').textContent = `Du fick ${currentScore} poäng, snyggt!`;
  document.getElementById('board').style.backgroundColor = 'grey';
  clearInterval(timerInterval);
}


beaver.forEach(b => {
  ['click', 'touchstart'].forEach(eventType => {
    b.addEventListener(eventType, (e) => {
      e.preventDefault(); 
      handleClick(b);
    }, { passive: false });
  });
});

function handleClick(b) {
  if (b.classList.contains('toClick')) {
    const reactionTime = Date.now() - currentTargetTime;
    const points = Math.max(1, Math.floor((1000 - reactionTime) / 100));
    currentScore += points;
    updateScore();
    b.classList.remove('toClick');
  }
}