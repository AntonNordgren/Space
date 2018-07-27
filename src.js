
const Game = {
    canvas : undefined,
    canvasContext : undefined,
    playerImage : undefined,
    backgroundImage : undefined,
    bulletImage : undefined
}

Game.start = function() {
    Game.canvas = document.getElementById('myCanvas');
    Game.canvasContext = Game.canvas.getContext('2d');

    Game.playerImage = new Image();
    Game.playerImage.src = "player.png";
    Game.backgroundImage = new Image();
    Game.backgroundImage.src = "background.png";
    Game.bulletImage = new Image();
    Game.bulletImage.src = "bullet.png";

    document.onkeypress = handleKeyPress;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;
    
    Game.mainloop();
}

Game.clearScreen = function() {
    Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
}

Game.drawImage = function (sprite, position, rotation, origin) {
    Game.canvasContext.save();
    Game.canvasContext.translate(position.x, position.y);
    Game.canvasContext.rotate(rotation);
    Game.canvasContext.drawImage(sprite, 0, 0, sprite.width, sprite.height, -origin.x, -origin.y, sprite.width, sprite.height);
    Game.canvasContext.restore();
};

Game.renderPlayer = function() {
   let opposite = Mouse.x - Player.pos.x;
   let adjecent = Mouse.y - Player.pos.y;
   Game.drawImage(Game.playerImage, Player.pos, -Math.atan2(opposite * -1, adjecent * -1), Player.origin);
}

Game.update = function() {
    Player.gameAreaCollision();
    Bullet.bulletHandler();
}

Game.renderBackground = function() {
    Game.drawImage(Game.backgroundImage, { x : 0, y : 0 }, 0, { x : 0, y : 0 });
}

Game.renderBullets = function() {
    if(Player.bullets.length !== 0) {
        for(let i = 0; i < Player.bullets.length; i++) {
            Game.drawImage(Game.bulletImage, Player.bullets[i].pos, 0, Player.bullets[i].origin);
        }
    }
}

Game.render = function() {
    Game.clearScreen();
    Game.renderBackground();
    Game.renderBullets();
    Game.renderPlayer();
}

Game.mainloop = function() {
    Game.clearScreen();
    Game.update();
    Game.render();
    setInterval(Game.mainloop, 1000 / 60);
}

document.addEventListener('DOMContentLoaded', Game.start);

const Player = {
    width : 100,
    height : 80,
    pos : { x: 380, y : 280 },
    origin : {x : 50, y : 40 },
    velX : 0,
    velY : 0,
    speed : 0.006,
    bullets : []
}

Player.gameAreaCollision = function() {
    if(Player.pos.x < 0)
        Player.pos.x = 0;
    else if(Player.pos.x > Game.canvas.width - Player.width)
        Player.pos.x = Game.canvas.width - Player.width;
    else
        Player.pos.x += Player.velX;

    if(Player.y < 0)
        Player.y = 0;
    else if(Player.pos.y > Game.canvas.height - Player.height)
        Player.pos.y = Game.canvas.height - Player.height;
    else
    Player.pos.y += Player.velY;
}

Player.shoot = function(r) {
    let newBullet = new Bullet(Player.pos.x - 5 , Player.pos.y - 5, r);
    Player.bullets.push(newBullet);
}

function Bullet(x_, y_, r){
    this.pos = { x : x_, y : y_},
    this.width = 5;
    this.height = 5;
    this.speed = .05;
    this.origin = { x : 2.5, y : 2.5 },
    this.r = r;
    this.velX = Math.sin(r) * this.speed;
    this.velY = Math.cos(r) * this.speed;
}


Bullet.bulletHandler = function() {
    if(Player.bullets.length !== 0) {
        for(let i = 0; i < Player.bullets.length; i++) {
            Player.bullets[i].pos.y += Player.bullets[i].velY;
            Player.bullets[i].pos.x += Player.bullets[i].velX;
        }
    }
}

const Mouse = {
    x : undefined,
    y : undefined
}

function handleMouseMove(evt) {
    Mouse.x = evt.pageX;
    Mouse.y = evt.pageY;
}

function handleMouseDown(evt) {
    Mouse.x = evt.pageX;
    Mouse.y = evt.pageY;
    let opposite = Mouse.x - Player.pos.x;
    let adjecent = Mouse.y - Player.pos.y;

    Player.shoot(Math.atan2(opposite, adjecent));
}

function handleKeyPress(evt) {
    switch(evt.key) {
        case "w":
            Player.velY = -1 * Player.speed;
            break;
        case "a":
            Player.velX = -1 * Player.speed;
            break;
        case "s":
            Player.velY = 1 * Player.speed;
            break;
        case "d":
            Player.velX = 1 * Player.speed;
            break;
    }
}

function handleKeyUp() {
    Player.velX = 0;
    Player.velY = 0;
}
