const squares = document.querySelectorAll('.square');
const score = document.getElementById('score');
const startButton = document.getElementById('go');

let runGame = false;
let currentScore = 0;
let countdown = 20;
let currentTargetTime = 0;

startButton.addEventListener('pointerdown', () => {
  startGame();
})

function startGame(){
  if (!runGame) {
  runGame = true;
  setInterval(() => {
    const randomSquare = squares[Math.floor(Math.random()*squares.length)];
    const mole = randomSquare.querySelector('.mole');
 
    if (!randomSquare.classList.contains('active')){
    randomSquare.classList.add('active');
    mole.addEventListener('pointerdown', () => handleClick(randomSquare), {once: true});
    }
    setTimeout(() => {
    randomSquare.classList.remove('active');
    mole.removeEventListener('pointerdown', handler);
    }, 1700)
  }, 2000)
}
}

function handleClick(randomSquare){
    randomSquare.classList.remove('active');
    randomSquare.classList.add('hit');

    setTimeout(() => {
    randomSquare.classList.remove('hit');
    }, 1000)
  currentScore++;
}


