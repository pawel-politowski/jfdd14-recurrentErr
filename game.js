const canvas = document.querySelector("#gameScreen");
const ctx = canvas.getContext("2d");
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const treeImg = document.querySelector('#imgTree');
const groundImg = document.querySelector('#imgGround');
const gameScore = document.querySelector('#gameScore');

class GameObject {
    constructor(x, y , width , height, image){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = image;
    } 
}

class Player extends GameObject {
    constructor(x, y, image){
        super(x, y , 30, 30, image);  
        this.speedX = 0;
        this.speedY = 0; 
    }

    init(ctx){
        ctx.fillStyle = 'black'; // bez tej deklaracji jeżeli drawImage
        ctx.fillRect(this.x, this.y, this.width, this.height); // drawImage jeżeli używamy tekstur
      } 

    newPos(){
        this.x += this.speedX; 
        this.y += this.speedY;  
    }
  }

class Obstacle extends GameObject {
  constructor(x, y, width, height, image) {
    super(x, y, width, height, image);
  }

  init(ctx){
    for(var h = 0; h < this.height; h += this.image.height) {
      for(var w = 0; w < this.width; w += this.image.width) {
        ctx.drawImage(this.image, this.x+w, this.y+h);
      }
    }
  } 

  update(){
    this.y += 2; // speed of obstacle
  }    
}

const obstacles = [];
const backgrounds = [];

function createNewObstacle(pathWidth){
  const randomOne = Math.floor(Math.random() * ((gameWidth-pathWidth)/20)) * 20; // losowa szerokość pierwszej przeszkody 
  const randomTwo = num => num >= gameWidth - pathWidth ? 0 : num + pathWidth; // początek drugiej przeszkody w zależności od tego jaką długość ma przeszkoda pierwsza
  const obstacleOne = new Obstacle(0, -80, randomOne, 80,treeImg);
  const obstacleTwo = new Obstacle(randomTwo(randomOne), -80, gameWidth - randomTwo(randomOne), 80,treeImg);
  obstacles.push([obstacleOne,obstacleTwo]);   
}

function createNewBackground(){
  const bckgr = new Obstacle(0, -800, 800, 800,groundImg);
  backgrounds.push(bckgr);
}

document.addEventListener('keydown', function (element) {
    event.preventDefault();
    if (element.code === "ArrowLeft") {
        player.speedX = -4;     
    }
    if (element.code === "ArrowRight") {
        player.speedX = 4;      
    }  
    if (element.code === "ArrowUp") {
        player.speedY = -2;
    }
    if (element.code === "ArrowDown") {
        player.speedY = 2;
    }
});
document.addEventListener('keyup', function (element) {
    if (element.code === "ArrowLeft") {
        player.speedX = 0;     
    }
    if (element.code === "ArrowRight") {
        player.speedX = 0;      
    }  
    if (element.code === "ArrowUp") {
        player.speedY = 0;
    }
    if (element.code === "ArrowDown") {
        player.speedY = 0;
    }
});

let spcBtwnObs = 200;
let pathWidth = 200;
let gamePoints = 0;

createNewObstacle(pathWidth);
createNewBackground();
backgrounds[0].y = 0;

const player = new Player (380, 760);

function animationFrame() { 
    
  checkCollision();  
  checkColObs();

  if(gamePoints===1500){
    spcBtwnObs -= 50;
    pathWidth -= 50;  
  }

  if(gamePoints===3000){
    spcBtwnObs -= 50;
    pathWidth -= 50;  
  }

  const gameDistance = `Dystans: ${(gamePoints/1000).toFixed(1)} km`; // wyświetlanie wyniku gracza 
  
  if(gameDistance !== gameScore.innerHTML){ // odświeżanie wyniku gracza
    
    gameScore.innerHTML = gameDistance;

  }

  ctx.clearRect(0, 0, gameWidth, gameHeight);

  if(backgrounds[backgrounds.length-1].y >= 0){
    createNewBackground();  
  }

  if(backgrounds[0].y >= gameHeight){
    backgrounds.shift();  
  }

  if(obstacles[obstacles.length-1][0].y >= spcBtwnObs){
    createNewObstacle(pathWidth);  
  }

  if(obstacles[0][0].y >= gameHeight){
    obstacles.shift();  
  }

  if(backgrounds.length!==0){
    backgrounds.forEach(element=>{
      element.init(ctx);
      element.update();
    });
  }

  if(obstacles.length!==0){
    obstacles.forEach(element=>{
      element[0].init(ctx);
      element[1].init(ctx);
      element[0].update();
      element[1].update();
    });
  }

  player.init(ctx);
  player.newPos(ctx);
  
  gamePoints++;
 
}

const refreshFrame = setInterval(animationFrame, 20); // setInterval odświeża canvas 50 razy na sekundę

function checkColObs() {
  obstacles.forEach(el=>{
    el.forEach(el=>{  
  const topObstacle = el.y;
  const bottomObstacle = el.y + el.height;
  const playerTop = player.y;
  const playerBottom = player.y + player.height;
      
  const leftObstacle = el.x;
  const rightObstacle = el.x + el.width;
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
      
      if ((bottomObstacle > playerTop &&
          topObstacle < playerBottom) &&
          (leftObstacle < playerRight &&
          rightObstacle > playerLeft)) {
          console.log("kolizja");
          clearInterval(refreshFrame);   
      }
})})};


function checkCollision() {
  const playerTop = player.y;
  const playerBottom = player.y + player.height;
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
  if (playerTop <= 0 ||
      playerBottom >= gameHeight ||
      playerLeft <= 0 ||
      playerRight >= gameWidth) {
          console.log("kolizja");
          clearInterval(refreshFrame);  
                 
      } 
};
