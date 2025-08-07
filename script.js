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
    mole.addEventListener('pointerdown', handleClick);
    }
    setTimeout(() => {
    randomSquare.classList.remove('active');
    mole.removeEventListener('pointerdown', handleClick);
    }, 1700)
  }, 2000)
}
}

function handleClick(){
  const timer = new Date();
}


