
const Game = {
    canvas : undefined,
    canvasContext : undefined,
    playerImage : undefined,
    backgroundImage : undefined,
    bulletImage : undefined,
    nrOfEnemies : 1,
    enemies : []
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
    Game.emenyImage = new Image();
    Game.emenyImage.src = "enemy.png";

    document.onkeypress = handleKeyPress;
    document.onkeyup = handleKeyUp;
    document.onmousemove = handleMouseMove;
    document.onmousedown = handleMouseDown;

    Game.spawnEnemies(Game.nrOfEnemies);
    Game.mainloop();
}

Game.spawnEnemies = function(nrOfEnemies) {
    for(let i = 0; i < nrOfEnemies; i++ ) {
        let dirX = Math.ceil(Math.random() * 2) == 1 ? 1 : -1;
        let dirY = Math.ceil(Math.random() * 2) == 1 ? 1 : -1;
        let enemyWidth = 100;
        let enemyHeight = 76;
        let posX = Math.ceil(Math.random() * Game.canvas.width);
        let posY = Math.ceil(Math.random() * Game.canvas.height);

        if(posX < enemyWidth) {
            posX = enemyWidth + 10;
        }
        else if(posX > Game.canvas.width - enemyWidth) {
            posX = Game.canvas.width - enemyWidth - 10;
        }

        if(posY < enemyHeight) {
            posY = enemyHeight + 10;
        }
        else if(posY > Game.canvas.height - enemyHeight) {
            posY = Game.canvas.height - enemyHeight - 10;
        }

        Game.enemies.push(new Enemy(posX, posY, 0, dirX, dirY));
    }
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
   let opposite = Mouse.x - Player.pos.x - 160;
   let adjecent = Mouse.y - Player.pos.y - 30;
   Game.drawImage(Game.playerImage, Player.pos, -Math.atan2(opposite * -1, adjecent * -1), Player.origin);
   /*
   Game.canvasContext.fillStyle = "white";
   Game.canvasContext.fillText("Player.x : " + Player.pos.x, 10 , 30);
   Game.canvasContext.fillText("Player.y : " + Player.pos.y, 10 , 60);
   */
}

Game.update = function() {
    Player.gameAreaCollision();
    Bullet.bulletHandler();
    Enemy.update();
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
    Game.renderEnemies();
}

Game.mainloop = function() {
    Game.clearScreen();
    Game.update();
    Game.render();
    window.requestAnimationFrame(Game.mainloop);
}

document.addEventListener('DOMContentLoaded', Game.start);

const Player = {
    width : 100,
    height : 80,
    pos : { x: 800, y : 450 },
    origin : {x : 50, y : 40 },
    velX : 0,
    velY : 0,
    speed : 5,
    bullets : []
}

Player.gameAreaCollision = function() {
    if(Player.pos.x < Player.height / 2)
        Player.pos.x = Player.height / 2;
    else if(Player.pos.x > Game.canvas.width - Player.height / 2)
        Player.pos.x = Game.canvas.width - Player.height / 2;
    else
        Player.pos.x += Player.velX;

    if(Player.pos.y < Player.height / 2)
        Player.pos.y = Player.height / 2;
    else if(Player.pos.y > Game.canvas.height - Player.height / 2)
        Player.pos.y = Game.canvas.height - Player.height / 2;
    else
        Player.pos.y += Player.velY;
}

Player.shoot = function(r) {
    let newBullet = new Bullet(Player.pos.x - 5 , Player.pos.y - 5, r);
    Player.bullets.push(newBullet);
}

function Bullet(_x, _y, r,){
    this.pos = { x : _x, y : _y},
    this.width = 5;
    this.height = 5;
    this.speed = 20;
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

        for(let i = 0; i < Player.bullets.length; i++) {
            if(Player.bullets[i].pos.x < 0 || Player.bullets[i].pos.x > Game.canvas.width ||
               Player.bullets[i].pos.y < 0 || Player.bullets[i].pos.y > Game.canvas.height) {
                   
                Player.bullets.splice(Player.bullets[i], 1);
            }
        }
    }
}

function Enemy(_x, _y, r, dirX, dirY) {
    this.pos = { x : _x, y : _y },
    this.width = 100;
    this.height = 76;
    this.speed = 0.6;
    this.origin = { x : 2.5, y : 2.5 };
    this.r = r;
    this.dirX = dirX;
    this.dirY = dirY;
    this.velX = dirX * this.speed;
    this.velY = dirY * this.speed;
    this.bullets = [];
}

Enemy.update = function() {
    if(Game.enemies.length !== 0) {
        for(let i = 0; i < Game.enemies.length; i++) {
            if(Game.enemies[i].pos.x > Game.canvas.width - Game.enemies[i].width || Game.enemies[i].pos.x < 0) {
                Game.enemies[i].velX = Game.enemies[i].velX * -1;
            }
            if(Game.enemies[i].pos.y > Game.canvas.height - Game.enemies[i].height || Game.enemies[i].pos.y < 0) {
                Game.enemies[i].velY = Game.enemies[i].velY * -1;
            }
            Game.enemies[i].pos.x += Game.enemies[i].velX * Game.enemies[i].speed;
            Game.enemies[i].pos.y += Game.enemies[i].velY * Game.enemies[i].speed;
        }
    }
}

Game.renderEnemies = function() {
    if(Game.enemies.length !== 0) {
        for(let i = 0; i < Game.enemies.length; i++) {
            Game.drawImage(Game.emenyImage, Game.enemies[i].pos, 0, Game.enemies[i].origin);
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
    let opposite = Mouse.x - Player.pos.x - 160;
    let adjecent = Mouse.y - Player.pos.y - 30;

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
