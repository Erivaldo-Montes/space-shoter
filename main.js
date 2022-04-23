const player = document.querySelector(".player");
const playArea = document.querySelector(".play-area");
const score = document.querySelector(".score");
const allLifes = document.querySelectorAll(".life");
const lifesDiv = document.querySelector(".lifes");
const enemiesImgs = [
  "images/monster-1.png",
  "images/monster-2.png",
  "images/monster-3.png",
];

let createInterval;
let points = 0;
let moveBackgroundInterval;
let isGameOver = false;
let speedEnemy = 1;
let lifes = 3;

// check which key is pressed
const flyShip = (event) => {
  if (event.key == "ArrowDown") {
    event.preventDefault;
    moveDown();
  }
  if (event.key == "ArrowUp") {
    event.preventDefault;
    moveUp();
  }
  if (event.key == " ") {
    event.preventDefault;
    fireLaser();
  }
};

// move player down
const moveDown = () => {
  let currentTop = parseInt(getComputedStyle(player).top);
  if (currentTop >= playArea.offsetHeight - player.offsetHeight) {
    return;
  } else {
    player.style.top = `${currentTop + 30}px`;
  }
};

// move player up
const moveUp = () => {
  let currentTop = parseInt(getComputedStyle(player).top);
  if (currentTop <= 0) {
    return;
  } else {
    player.style.top = `${currentTop - 30}px`;
  }
};

// fire laser
const fireLaser = () => {
  let newLaser = createLaser();
  playArea.appendChild(newLaser);
  moveLaser(newLaser);
};

// create laser
const createLaser = () => {
  let laser = document.createElement("img");
  laser.classList.add("laser");
  laser.setAttribute(
    "style",
    `top: ${player.offsetTop}px; left: ${player.offsetLeft + 20}px;`
  );
  laser.src = "images/shoot-ship.gif";
  return laser;
};

// make laser move
const moveLaser = (laser) => {
  let timeLaser = setInterval(() => {
    let currentLeft = parseInt(getComputedStyle(laser).left);
    if (currentLeft >= playArea.offsetWidth) {
      playArea.removeChild(laser);
    } else {
      laser.style.left = `${currentLeft + 10}px`;
    }
  }, 30);
};

const moveBackground = () => {
  let currentLeft = parseInt(getComputedStyle(playArea).backgroundPositionX);
  playArea.style.backgroundPositionX = `${currentLeft - 1}px`;
};

// create explosion
const createExplosion = (enemy) => {
  let explosion = document.createElement("img");
  explosion.classList.add("explosion");
  explosion.src = "images/explosion.gif";
  explosion.setAttribute(
    "style",
    `top: ${enemy.offsetTop}px; left: ${enemy.offsetLeft}px;`
  );

  playArea.appendChild(explosion);
  setTimeout(() => {
    playArea.removeChild(explosion);
  }, 1000);
};

// collision between laser and enemy
const checkCollision = () => {
  let allEnemies = document.querySelectorAll(".enemy");
  let allLasers = document.querySelectorAll(".laser");
  allEnemies.forEach((enemy) => {
    //check collision between enemies and lasers
    allLasers.forEach((laser) => {
      if (
        laser.offsetTop + laser.offsetHeight >= enemy.offsetTop &&
        laser.offsetTop <= enemy.offsetTop + enemy.offsetHeight &&
        laser.offsetLeft + laser.offsetWidth >= enemy.offsetLeft &&
        laser.offsetLeft <= enemy.offsetLeft + enemy.offsetWidth
      ) {
        createExplosion(enemy);
        playArea.removeChild(enemy);
        points = points + 100;
        speedEnemy = speedEnemy + 0.3;

        // show the score
        document.querySelector("#score").innerHTML = points;
      }
    });
  });
};

// check collision between enemies and player
const checkCollisionPlayer = () => {
  let allEnemies = document.querySelectorAll(".enemy");
  allEnemies.forEach((enemy) => {
    if (
      enemy.offsetTop + enemy.offsetHeight >= player.offsetTop &&
      enemy.offsetTop <= player.offsetTop + player.offsetHeight &&
      enemy.offsetLeft + enemy.offsetWidth >= player.offsetLeft &&
      enemy.offsetLeft <= player.offsetLeft + player.offsetWidth
    ) {
      createExplosion(enemy);
      enemy.remove();
      checkLifes();
    }
  });
};

const checkLifes = () => {
  lifes--;
  allLifes[lifes].style.visibility = "hidden";
  allLifes[lifes].style.opacity = "0";
  if (lifes === 0) {
      gameOver();
    }
};

// create enemy in the play area
const createEnemy = () => {
  createInterval = setInterval(() => {
    let enemy = document.createElement("img");
    enemy.classList.add("enemy");
    enemy.src = enemiesImgs[Math.floor(Math.random() * enemiesImgs.length)];
    enemy.setAttribute(
      "style",
      `top: ${Math.floor(Math.random() * 500)}px; 
    left: ${playArea.offsetWidth + enemy.offsetWidth}px;`
    );

    console.log("left ", playArea.offsetWidth + enemy.offsetWidth);

    playArea.appendChild(enemy);
    moveEnemy(enemy);
  }, 2000);
};

// make enemies move
const moveEnemy = (enemy) => {
  let timeEnemy = setInterval(() => {
    let currentLeft = parseInt(getComputedStyle(enemy).left);
    if (currentLeft <= 0 - enemy.offsetWidth) {
      checkLifes();
      enemy.remove();
      clearInterval(timeEnemy);
    } else {
      enemy.style.left = `${currentLeft - speedEnemy}px`;
      if (checkCollision()) {
        playArea.removeChild(enemy);
        clearInterval(timeEnemy);
      } else if (checkCollisionPlayer()) {
        playArea.removeChild(enemy);
        clearInterval(timeEnemy);
      }
    }
  }, 30);
};

// start game
const playGame = () => {
  score.classList.add("show");
  lifes = 3;
  window.clearInterval(createInterval);
  window.clearInterval(moveBackgroundInterval);
  document
    .querySelector(".start-button")
    .removeEventListener("click", playGame);
  document.querySelector(".start-game").style.display = "none";
  moveBackgroundInterval = setInterval(moveBackground, 30);

  lifesDiv.classList.add("show");
  allLifes.forEach((life) => {
    life.style.visibility = "visible";
    life.style.opacity = "1";
  });
  createEnemy();
  moveBackground();
  window.addEventListener("keydown", flyShip);
};

// start menssage
const startGame = () => {
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", playGame);
};

// game over
const gameOver = () => {
  score.classList.toggle("show");
  isGameOver = true;
  window.removeEventListener("keydown", flyShip);
  window.clearInterval(moveBackgroundInterval);
  window.clearInterval(createInterval);

  lifesDiv.classList.remove("show");
  const enemies = document.querySelectorAll(".enemy");
  enemies.forEach((enemy) => enemy.remove());
  const gameOver = document.querySelector(".game-over");
  gameOver.style.visibility = "visible";
  gameOver.style.opacity = "1";

  let gameOverText = document.createElement("h1");
  gameOverText.innerText = `Game Over! Your score is ${points}`;
  gameOver.appendChild(gameOverText);
  score.classList.remove("show");
  points = 0;
  document.querySelector("#score").innerHTML = points;

  gameOver.addEventListener("click", () => {
    gameOver.style.visibility = "hidden";
    gameOver.style.opacity = "0";
    gameOver.innerText = "";
    player.style.top = "250px";
    playGame();
  });
};

startGame();
