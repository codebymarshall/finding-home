/*

The Game

*/

let gameChar;
let gameChar_x;
let gameChar_y;
let floorPos_y;
let isLeft;
let isRight;
let isFalling;
let isPlummeting;
let cameraPos_X;
let game_score;
let lives;
let scene;
let rain;
let theme;
let playButton;
let rainDrops;
let lightningAlpha;
let splashes;
let platforms;
let enemies;
let jump;
let left;
let right;
let standing;
let enemy;
let isAudioPlaying = false; // Flag to track audio state
let gameState = "menu";
let menuButtons;

function preload() {
  soundFormats("mp3");
  rain = loadSound("assets/rain.mp3");
  theme = loadSound("assets/theme.mp3");
  (jump = loadImage("assets/jump.png")),
    (left = loadImage("assets/left.png")),
    (right = loadImage("assets/right.png")),
    (stand = loadImage("assets/stand.png")),
    (enemy = loadImage("assets/enemy.png"));
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  floorPos_y = windowHeight * 0.7;
  lives = 3;
  isAudioPlaying = false;

  menuButtons = {
    play: createButton("Play"),
    instructions: createButton("Instructions"),
    back: createButton("Back"),
    returnToMenu: createButton("Return to Menu"),
  };

  // Position all buttons
  menuButtons.play.position(width / 2 - 40, height / 2);
  menuButtons.instructions.position(width / 2 - 40, height / 2 + 40);
  menuButtons.back.position(width / 2 - 40, height / 2 + 80);
  menuButtons.returnToMenu.position(width / 2 - 40, height / 2 + 80);

  // Hide buttons that shouldn't be visible initially
  menuButtons.back.hide();
  menuButtons.returnToMenu.hide();

  menuButtons.play.mousePressed(() => {
    gameState = "playing";
    hideMenuButtons();
    startAudio();
    startGame();
  });

  menuButtons.instructions.mousePressed(() => {
    gameState = "instructions";
    menuButtons.play.hide();
    menuButtons.instructions.hide();
    menuButtons.back.show();
  });

  menuButtons.back.mousePressed(() => {
    gameState = "menu";
    menuButtons.play.show();
    menuButtons.instructions.show();
    menuButtons.back.hide();
  });

  menuButtons.returnToMenu.mousePressed(() => {
    gameState = "menu";
    lives = 3;
    isAudioPlaying = true;
    menuButtons.returnToMenu.hide();
    setup();
  });

  startGame(); // Initialize game elements
}
function startGame() {
  rainDrops = [];
  splashes = [];
  platforms = [];
  enemies = [];

  scene = {
    trees: {
      x_pos: [],
      y_pos: floorPos_y - 144,
      draw: function () {
        for (let i = 0; i < this.x_pos.length; i++) {
          let treeX = this.x_pos[i];
          let treeY = this.y_pos + 45;

          // Check for overlap with canyons
          let isOverlapping = false;
          for (let j = 0; j < scene.canyons.x_pos.length; j++) {
            if (
              treeX - 40 < scene.canyons.x_pos[j] + scene.canyons.width[j] &&
              treeX + 65 > scene.canyons.x_pos[j]
            ) {
              isOverlapping = true;
              break;
            }
          }

          if (!isOverlapping) {
            fill(139, 69, 19);
            rect(treeX, treeY, 30, 100);
            fill(0, 150, 0);
            triangle(
              this.x_pos[i] - 40,
              this.y_pos + 70,
              this.x_pos[i] + 15,
              this.y_pos - 40,
              this.x_pos[i] + 65,
              this.y_pos + 70
            );
            triangle(
              this.x_pos[i] - 40,
              this.y_pos + 40,
              this.x_pos[i] + 15,
              this.y_pos - 60,
              this.x_pos[i] + 65,
              this.y_pos + 40
            );
          }
        }
      },
      create: function () {
        for (let i = 0; i < 100; i++) {
          this.x_pos.push(random(0, scene.house.center + 100));
        }
      },
    },
    mountains: {
      x_pos: [],
      y_pos: windowHeight * 0.5,
      draw: function () {
        for (let i = 0; i < this.x_pos.length; i++) {
          let mountainX = this.x_pos[i];

          // Check for overlap with canyons
          let isOverlapping = false;
          for (let j = 0; j < scene.canyons.x_pos.length; j++) {
            if (
              mountainX + 300 <
                scene.canyons.x_pos[j] + scene.canyons.width[j] &&
              mountainX + 550 > scene.canyons.x_pos[j]
            ) {
              isOverlapping = true;
              break;
            }
          }

          if (!isOverlapping) {
            fill(123, 113, 103);
            noStroke();
            // This is the small mountain
            triangle(
              this.x_pos[i] + 400,
              floorPos_y,
              this.x_pos[i] + 480,
              floorPos_y - 150,
              this.x_pos[i] + 550,
              floorPos_y
            );
            // this is the big mountain
            triangle(
              this.x_pos[i] + 300,
              floorPos_y,
              this.x_pos[i] + 380,
              floorPos_y - 300,
              this.x_pos[i] + 450,
              floorPos_y
            );
            fill(255);
            // this is the small mountain
            triangle(
              this.x_pos[i] + 440,
              floorPos_y - 75,
              this.x_pos[i] + 480,
              floorPos_y - 150,
              this.x_pos[i] + 515,
              floorPos_y - 75
            );
            // this is the big mountain
            triangle(
              this.x_pos[i] + 340,
              floorPos_y - 150,
              this.x_pos[i] + 380,
              floorPos_y - 300,
              this.x_pos[i] + 415,
              floorPos_y - 150
            );
          }
        }
      },
      create: function () {
        for (let i = 0; i < 100; i++) {
          this.x_pos.push(random(0, scene.house.center + 100));
        }
      },
    },
    stars: {
      x_pos: [],
      y_pos: [],
      x_offset: [],
      y_offset: [],
      size: [],
      draw: function () {
        for (let i = 0; i < this.x_pos.length; i++) {
          fill(255);
          ellipse(
            this.x_pos[i] + this.x_offset[i],
            this.y_pos[i] + this.y_offset[i],
            this.size[i],
            this.size[i]
          );
        }
      },
      create: function () {
        for (let i = 0; i < 1000; i++) {
          this.x_pos.push(random(0, scene.house.center + 100));
          this.y_pos.push(random(0, windowHeight / 3));
          this.x_offset.push(random(0, scene.house.center + 100));
          this.y_offset.push(random(0, windowHeight / 5));
          this.size.push(random(2, 5));
        }
      },
    },
    //win condition
    house: {
      center: random(15000, 20000),
      x_pos: 0,
      width: 200,
      isReached: false,
      initialize: function () {
        this.x_pos = this.center - this.width;
      },
      draw: function () {
        if (this.isReached) {
          // Draw the house body
          fill(100);
          rect(this.x_pos, floorPos_y - 100, this.width, 100);
          fill(200);
          rect(this.x_pos + 80, floorPos_y, 50, -85);
          // Draw the roof
          fill(54, 24, 24);
          triangle(
            this.x_pos - 50,
            floorPos_y - 100,
            this.x_pos + 250,
            floorPos_y - 100,
            this.x_pos + 100,
            floorPos_y - 200
          );
        } else {
          // Draw the house body
          fill(100);
          rect(this.x_pos, floorPos_y - 100, this.width, 100);
          // Draw the closed door
          fill(30);
          rect(this.x_pos + 80, floorPos_y, 50, -85);
          // Draw the door knob
          fill(255, 255, 0);
          ellipse(this.x_pos + 120, floorPos_y - 30, 10, 10);
          // Draw the roof
          fill(54, 24, 24);
          triangle(
            this.x_pos - 50,
            floorPos_y - 100,
            this.x_pos + 250,
            floorPos_y - 100,
            this.x_pos + 100,
            floorPos_y - 200
          );
        }
      },
      check: function () {
        if (
          gameChar_x > this.x_pos &&
          gameChar_x < this.x_pos + this.width &&
          gameChar_y >= floorPos_y
        ) {
          this.isReached = true;
          textSize(60);
          textAlign(CENTER);
          fill(255);
          text("Level Complete", width / 2, height / 2);
          text(
            "Returning to Main Menu in 10 seconds",
            gameChar_x,
            height / 2 + 60
          );
          isLeft = false;
          isRight = false;
          setTimeout(() => {
            // Code to execute after 10 seconds
            setup();
          });
          return;
        }
      },
    },
    collectables: [
      {
        draw: function (t_collectable) {
          let collectableX = t_collectable.x_pos;
          let collectableSize = t_collectable.size;

          // Check for overlap with canyons
          let isOverlapping = false;
          for (let j = 0; j < scene.canyons.x_pos.length; j++) {
            if (
              collectableX - collectableSize / 2 <
                scene.canyons.x_pos[j] + scene.canyons.width[j] &&
              collectableX + collectableSize / 2 > scene.canyons.x_pos[j]
            ) {
              isOverlapping = true;
              break;
            }
          }

          if (!isOverlapping) {
            fill(170, 170, 0);
            stroke(0);
            strokeWeight(1.5);
            ellipse(
              t_collectable.x_pos,
              t_collectable.y_pos,
              t_collectable.size,
              t_collectable.size
            );
            noStroke();
            fill(255);
            textSize(13);
            textAlign(CENTER);
            text("$", t_collectable.x_pos, t_collectable.y_pos + 4);
          }
        },
        check: function (t_collectable) {
          if (
            dist(
              gameChar_x,
              gameChar_y,
              t_collectable.x_pos,
              t_collectable.y_pos
            ) < t_collectable.size
          ) {
            t_collectable.isFound = true;
            game_score += 1;
          }
        },
        main: function () {
          for (let i = 0; i < scene.collectables.length; i++) {
            if (scene.collectables[i].isFound == false) {
              scene.collectables[0].draw(scene.collectables[i]);
              scene.collectables[0].check(scene.collectables[i]);
            }
          }
        },
        create: function () {
          for (let i = 0; i < 50; i++) {
            scene.collectables.push({
              x_pos: random(0, scene.house.center + 100),
              y_pos: floorPos_y - 10,
              size: 20,
              isFound: false,
            });
          }
        },
      },
    ],
    canyons: {
      x_pos: [],
      width: [],
      draw: function (t_canyon) {
        fill(43, 47, 119);
        rect(t_canyon.x_pos, floorPos_y - 1, t_canyon.width, windowHeight);
      },
      check: function (t_canyon) {
        if (
          gameChar_x > t_canyon.x_pos &&
          gameChar_x < t_canyon.x_pos + t_canyon.width &&
          gameChar_y >= floorPos_y
        ) {
          isPlummeting = true;
          checkPlayerDie();
        }
      },
      main: function () {
        for (let i = 0; i < this.x_pos.length; i++) {
          this.draw({
            x_pos: this.x_pos[i],
            width: this.width[i],
          });
          this.check({
            x_pos: this.x_pos[i],
            width: this.width[i],
          });
        }
      },
      create: function () {
        for (let i = 0; i < 60; i++) {
          this.x_pos.push(random(500, scene.house.center + 100));
          this.width.push(random(15, 40));
        }
      },
    },
    clouds: {
      x_pos: [],
      y_pos: [],
      size: [],
      draw: function () {
        for (let i = 0; i < this.x_pos.length; i++) {
          //first cloud
          fill(209, 209, 209);
          ellipse(
            this.x_pos[i] + 50,
            this.y_pos[i] + 50,
            this.size[i] + 20,
            this.size[i] + 20
          );
          ellipse(
            this.x_pos[i] + 90,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
          ellipse(
            this.x_pos[i] + 10,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
          // second cloud
          ellipse(
            this.x_pos[i] + 450,
            this.y_pos[i] + 50,
            this.size[i] + 20,
            this.size[i] + 20
          );
          ellipse(
            this.x_pos[i] + 490,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
          ellipse(
            this.x_pos[i] + 410,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
          // thrid cloud
          ellipse(
            this.x_pos[i] + 850,
            this.y_pos[i] + 50,
            this.size[i] + 20,
            this.size[i] + 20
          );
          ellipse(
            this.x_pos[i] + 890,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
          ellipse(
            this.x_pos[i] + 810,
            this.y_pos[i] + 50,
            this.size[i],
            this.size[i]
          );
        }
      },
      create: function () {
        for (let i = 0; i < 200; i++) {
          this.x_pos.push(random(-width * 10, width * 10));
          this.y_pos.push(random(20, height / 4));
          this.size.push(random(60, 80));
        }
      },
    },
    moon: {
      x_pos: random(0, 300),
      y_pos: 50,
      size: 100,
      speed: 0.3,
      draw: function () {
        fill(141, 141, 144);
        ellipse(this.x_pos, this.y_pos, this.size, this.size);
        this.x_pos += this.speed;
        if (this.x_pos >= width || this.x_pos <= 0) {
          this.speed *= -1;
        }
      },
    },
    lives: {
      draw: function () {
        for (let i = 0; i < lives; i++) {
          fill(255, 0, 0);
          noStroke();
          ellipse(cameraPos_X - (i * 30 + 20), 50, 10, 10);
        }
      },
    },
    rain: {},
  };

  scene.canyons.create(); // Make sure canyons are created first

  // create enemy
  for (i = 0; i < 60; i++) {
    let newX = random(500, scene.house.center);
    let isOverCanyon = false;

    // Check if position overlaps with any canyon
    for (let j = 0; j < scene.canyons.x_pos.length; j++) {
      if (
        newX > scene.canyons.x_pos[j] - 100 &&
        newX < scene.canyons.x_pos[j] + scene.canyons.width[j] + 100
      ) {
        isOverCanyon = true;
        break;
      }
    }

    // Only create enemy if not over canyon
    if (!isOverCanyon) {
      enemies.push(new Enemies(newX, floorPos_y - 5, 150));
    }
  }

  for (i = 0; i < 100; i++) {
    platforms.push(
      createPlatforms(random(0, 18000), floorPos_y - 100, random(50, 150))
    );
  }
  for (let i = 0; i < 600; i++) {
    rainDrops.push(new RainDrop());
  }
  lightningAlpha = 0;
  gameChar_x = windowWidth * 0.2;
  gameChar_y = floorPos_y;
  game_score = 0;
  isLeft = false; //char movement states
  isRight = false;
  isFalling = false;
  isPlummeting = false;
  scene.clouds.create(); //Create clouds
  scene.stars.create(); // Create stars
  scene.mountains.create(); //Create mountains
  scene.trees.create(); //Create trees
  scene.collectables[0].create(); // Create collectables
  scene.house.initialize(); // Initialize house position
  (gameChar = {
    draw: function () {
      if (isLeft) {
        image(left, gameChar_x - 50, gameChar_y - 100);
      } else if (isRight) {
        image(right, gameChar_x - 50, gameChar_y - 100);
      } else if (isFalling || isPlummeting) {
        image(jump, gameChar_x - 50, gameChar_y - 100);
      } else {
        image(stand, gameChar_x - 50, gameChar_y - 100);
        console.log("this is game char x" + gameChar_x);
      }
    },
  }),
    (cameraPos_X = 0); //game world camera
}
function draw() {
  if (gameState === "menu" || gameState === "instructions") {
    background(43, 47, 119);
    textSize(32);
    textAlign(CENTER);
    fill(255);
    text("Finding Home", width / 2, height / 2 - 60);

    if (gameState === "instructions") {
      textSize(20);
      text(
        "Use Arrow Keys or A/D to move\nPress W or UP to jump\nCollect coins and reach home!",
        width / 2,
        height / 2
      );
    }
  } else if (gameState === "dead") {
    background(43, 47, 119);
    textSize(50);
    textAlign(CENTER);
    fill(255);
    text("GAME OVER", width / 2, height / 2);
  } else {
    //camera tracking
    if (isRight == true && isFalling == false) {
      cameraPos_X += 2;
    } else if (isLeft == true && isFalling == false) {
      cameraPos_X -= 2;
    } else {
      //stay still
    }
    background(43, 47, 119);
    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
    push(); //part of camera tracking code
    translate(-cameraPos_X + 100, 0);
    scene.mountains.draw(); //draw mountains
    scene.trees.draw(); //draw the tree
    scene.stars.draw(); //draw stars
    scene.moon.draw(); //draw moon
    scene.clouds.draw(); //draw clouds
    fill(255);
    text("Score  " + game_score, cameraPos_X - 20, 30); //draw game score
    scene.canyons.main(); //draw & check the canyon
    for (var i = 0; i < platforms.length; i++) {
      platforms[i].draw();
    }
    scene.lives.draw(); //draw lives on screen
    scene.collectables[0].main(); //draw & check the collectable
    scene.house.draw(); //draw house
    scene.house.check(); //house check
    gameChar.draw(); //the game character
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].draw();
      let isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
      if (isContact) {
        lives -= 1;
        if (lives > 0) {
          startGame(); // Reset position if still have lives
        }
        checkPlayerDie(); // Check for game over
        break;
      }
    }
    pop();
    for (let i = rainDrops.length - 1; i >= 0; i--) {
      let drop = rainDrops[i];
      drop.show();
      drop.fall();
      drop.drift();

      if (drop.isOffScreen()) {
        rainDrops.splice(i, 1);

        // Determine how many new drops to spawn
        let newDropsCount = floor(random(30, 50)); // Spawns between 2 and 5 drops

        // Spawn the new drops
        for (let j = 0; j < newDropsCount; j++) {
          rainDrops.push(new RainDrop());
        }
      }
    }
    for (let i = splashes.length - 1; i >= 0; i--) {
      //splash
      splashes[i].show();
      splashes[i].move();
      if (splashes[i].alpha <= 0) {
        splashes.splice(i, 1);
      }
    }
    if (random(1) < 0.01) {
      // 1% chance of lightning on each draw cycle
      lightningAlpha = 200; // Start with a strong flash
      // Play thunder sound here if desired
    }
    fill(255, 255, 255, lightningAlpha);
    rect(0, 0, width, height);
    lightningAlpha = constrain(lightningAlpha - 10, 0, 255); // Fade out the flash
  }
  interactions();
}
function keyPressed() {
  if (
    keyCode == 65 ||
    (keyCode == LEFT_ARROW && isPlummeting == false && isRight == false)
  ) {
    isLeft = true;
  }
  if (
    keyCode == 68 ||
    (keyCode == RIGHT_ARROW && isPlummeting == false && isLeft == false)
  ) {
    isRight = true;
  }
  if (keyCode == 87 || (keyCode == UP_ARROW && isPlummeting == false)) {
    if (isFalling != true) {
      gameChar_y -= 100;
    }
  }
}
function keyReleased() {
  if (keyCode == 65 || keyCode == LEFT_ARROW) {
    isLeft = false;
  }
  if (keyCode == 68 || keyCode == RIGHT_ARROW) {
    isRight = false;
  }
}
function checkPlayerDie() {
  if (lives <= 0) {
    // Game over when no lives remain
    gameState = "dead";
    menuButtons.returnToMenu.show();

    // Stop all audio
    rain.stop();
    theme.stop();
    isAudioPlaying = false;
  } else if (isPlummeting) {
    // Handle plummeting with lives remaining
    lives -= 1;
    startGame();
  }
}
function interactions() {
  if (isPlummeting == true) {
    //plummeting interaction
    gameChar_y += 5;
    isLeft = false; // prevents bug allowing player to keep holding the key and get out of plummeting mode
    isRight = false;
    isFalling = false;
  }
  if (isLeft) {
    //char movement
    gameChar_x = constrain(gameChar_x - 4, 0, Infinity);
    cameraPos_X = constrain(cameraPos_X - 2, 0, Infinity);
  }
  if (isRight) {
    gameChar_x += 4;
    cameraPos_X += 2;
  }
  //jumping dectection
  if (gameChar_y < floorPos_y && isRight == true) {
    //added additional conditional to avoid bug with camera
    let isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
        isContact = true;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 2;
      isFalling = true;
      cameraPos_X += 2;
    }
  } else if (gameChar_y < floorPos_y && isLeft == true) {
    //added additional conditional to avoid bug with camera
    let isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
        isContact = true;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 2;
      isFalling = true;
      cameraPos_X -= 2;
    }
  } else if (gameChar_y < floorPos_y) {
    let isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
        isContact = true;
        break;
      }
    }
    if (isContact == false) {
      gameChar_y += 2;
      isFalling = true;
    }
  } else {
    isFalling = false;
  }
}
function startAudio() {
  // Check if AudioContext is in "suspended" state (autoplay policy)
  if (getAudioContext().state === "suspended") {
    getAudioContext().resume();
  }

  if (isAudioPlaying) {
    rain.stop(); // Stop the rain sound
    theme.stop(); // Stop the theme sound
  } else {
    rain.setVolume(0.4); // Set rain volume to 50%
    theme.setVolume(0.8); // Set theme volume to 80%
    rain.loop(); // Start looping the rain sound
    theme.loop(); // Start looping the theme sound
  }

  isAudioPlaying = !isAudioPlaying; // Toggle the audio state
}
class RainDrop {
  constructor() {
    this.x = random(width);
    this.y = random(-height, 0);
    this.length = random(5, 15);
    this.speed = random(4, 10);
    this.xSpeed = random(-1, 1); // Wind effect
  }

  show() {
    stroke(171, 190, 191); // Blue for raindrop
    line(this.x, this.y, this.x, this.y + this.length);
  }

  fall() {
    this.y += this.speed;

    if (this.y > floorPos_y) {
      this.y = random(-height, 0);

      // Create a splash when a raindrop hits the bottom
      for (let j = 0; j < 5; j++) {
        splashes.push(new Splash(this.x));
      }
    }
  }
  drift() {
    this.x += this.xSpeed;
  }
  isOffScreen() {
    return this.y > floorPos_y;
  }
}
class Splash {
  constructor(x) {
    this.x = x;
    this.y = floorPos_y;
    this.size = random(3, 7);
    this.speed = random(1, 3);
    this.alpha = 255; // For fade effect
    this.xSpeed = random(-2, 2); // Horizontal spread of splash
  }

  show() {
    noStroke();
    fill(171, 190, 191, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  move() {
    this.y -= this.speed; // Move splash particle upward
    this.x += this.xSpeed;
    this.alpha -= 5; // Fade out effect
  }
}
function createPlatforms(x, y, length) {
  let p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(150);
      rect(this.x, this.y, this.length, 20);
    },
    checkContact: function (gc_x, gc_y) {
      if (gc_x > this.x && gc_x < this.x + this.length) {
        let d = this.y - gc_y;
        if (d >= 0 && d < 2) {
          return true;
        }
      }
      return false;
    },
  };
  return p;
}
function Enemies(x, y, range) {
  this.x = x;
  this.y = y;
  this.range = range;
  this.currentX = x;
  this.inc = random([-2, -1.5, -1, 1, 1.5, 2]); // Random speed and direction

  this.update = function () {
    let nextX = this.currentX + this.inc;

    // Check for canyon collision with a buffer zone
    let isNearCanyon = false;
    for (let i = 0; i < scene.canyons.x_pos.length; i++) {
      if (
        nextX > scene.canyons.x_pos[i] - 50 && // Add buffer before canyon
        nextX < scene.canyons.x_pos[i] + scene.canyons.width[i] + 50 // Add buffer after canyon
      ) {
        isNearCanyon = true;
        break;
      }
    }

    // Move freely within range if not near canyon
    if (!isNearCanyon) {
      this.currentX = nextX;
      // Check range boundaries
      if (this.currentX >= this.x + this.range) {
        this.inc = random([-2, -1.5, -1]); // Random negative speed
      } else if (this.currentX < this.x) {
        this.inc = random([1, 1.5, 2]); // Random positive speed
      }
    } else {
      // Reverse direction if near canyon
      this.inc *= -1;
    }
  };

  this.draw = function () {
    this.update();
    image(enemy, this.currentX - 50, this.y - 95);
  };

  this.checkContact = function (gc_x, gc_y) {
    let d = dist(gc_x, gc_y, this.currentX, this.y);
    if (d < 20) {
      return true;
    }
    return false;
  };
}
function hideMenuButtons() {
  Object.values(menuButtons).forEach((button) => button.hide());
}
