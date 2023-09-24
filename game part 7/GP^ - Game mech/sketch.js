/*

The Game Project 7

*/

let gameChar; let gameChar_x; let gameChar_y; let floorPos_y; let isLeft; let isRight; let isFalling; let isPlummeting; let cameraPos_X; let game_score; let lives; let scene; let rain; let theme; let playButton; let rainDrops; let lightningAlpha; let splashes; let platforms;let enemies; let jump; let left; let right; let standing; let enemy;
function preload()
{
	soundFormats('mp3')
	rain = loadSound("assets/rain.mp3");
	theme = loadSound("assets/theme.mp3");
	jump = loadImage("assets/jump.png"),
	left = loadImage("assets/left.png"),
	right = loadImage("assets/right.png"),
	stand = loadImage("assets/stand.png"),
	enemy = loadImage("assets/enemy.png")
}
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;
	playButton = createButton('Play Audio');
    playButton.mousePressed(startAudio);
	startGame();
}
function startGame()
{
	rainDrops = [];
	splashes = [];
	platforms = [];
	enemies = [];
	for (i = 0 ; i <20; i++)
	{
		enemies.push (new Enemies(random(-width*5,width*5),floorPos_y-5,150))
	}

	for (i = 0 ; i <20; i++)
	{
		platforms.push (createPlatforms(random(-width*5, width*5),floorPos_y-100,random(50,150)))
	}
	for (let i = 0; i < 300; i++) {
        rainDrops.push(new RainDrop());
    }
	lightningAlpha = 0;
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	game_score = 0
	isLeft = false //char movement states
	isRight = false
	isFalling = false
	isPlummeting = false
	scene = 
	{
		trees:
		{
			x_pos:[],
			y_pos: height/2,
			draw: function()
			{
				for (let i=0;i < this.x_pos.length;i++)
				{
					fill(139,69,19);
					rect(this.x_pos[i], this.y_pos+45,30, 100);
					fill(0,150,0);
					triangle(this.x_pos[i]-40,this.y_pos+70,this.x_pos[i]+15,this.y_pos-40,this.x_pos[i]+65,this.y_pos+70);
					triangle(this.x_pos[i]-40,this.y_pos+40,this.x_pos[i]+15,this.y_pos-60,this.x_pos[i]+65,this.y_pos+40);
				}
			},
			create: function()
			{
				for (let i = 0; i < 30; i++) 
				{
					this.x_pos.push(random(-width*5, width*5));
				}
			} 
		},
		mountains:
		{
			x_pos:[], 
			y_pos:100,
			draw: function()
			{
				for (let i=0;i < this.x_pos.length;i++)
				{
					fill(123,113,103);
					noStroke();
					triangle(this.x_pos[i]+400, floorPos_y,this.x_pos[i]+480,this.y_pos+50,this.x_pos[i]+550,floorPos_y);
					triangle(this.x_pos[i]+300, floorPos_y,this.x_pos[i]+380,this.y_pos+150,this.x_pos[i]+450,floorPos_y);
					fill(255);
					triangle(this.x_pos[i]+440, floorPos_y-140,this.x_pos[i]+480,this.y_pos+50,this.x_pos[i]+515,floorPos_y-140);
					triangle(this.x_pos[i]+340, floorPos_y-90,this.x_pos[i]+380,this.y_pos+150,this.x_pos[i]+415,floorPos_y-90);
				}
			},
			create: function ()
			{
				for (let i = 0; i < 20; i++) 
				{
					this.x_pos.push(random(-width*5, width*5));
				}
			}
		},
		stars: 
		{
			x_pos: [],
			y_pos: [],
			x_offset: [],
			y_offset: [],
			size: [],
			draw: function ()
			{
				for (let i=0;i < this.x_pos.length;i++)
				{
					fill(255);
					ellipse(this.x_pos[i] + this.x_offset[i] , this.y_pos[i] + this.y_offset[i] , this.size[i], this.size[i]);		
				}
			},
			create: function ()
			{
				for (let i = 0; i < 300; i++) 
				{
					this.x_pos.push(random(-width*5, width*5));
					this.y_pos.push(random(0, height/5));
					this.x_offset.push(random(-width/2, width/5));
					this.y_offset.push(random(-height/2, height/5));
					this.size.push(random(2, 5));  
				}
			}
		},
		house: 	//win condition 
		{
			x_pos: width + 600,
			width: 200,
			isReached: false,
			draw: function ()
			{
				if (this.isReached)
				{
					// Draw the house body
					fill(100);
					rect(this.x_pos, floorPos_y-100, this.width, 100);
					fill(200);
					rect(this.x_pos+80, floorPos_y, 50, -85);
					// Draw the roof
					fill(54, 24, 24);
					triangle(this.x_pos-50, floorPos_y-100, this.x_pos +250, floorPos_y-100, this.x_pos+100, floorPos_y-200);
				}
				else
				{
					// Draw the house body
					fill(100);
					rect(this.x_pos, floorPos_y-100, this.width, 100);
					// Draw the closed door
					fill(30);
					rect(this.x_pos+80, floorPos_y, 50, -85);
					// Draw the door knob
					fill(255, 255, 0);
					ellipse(this.x_pos+120, floorPos_y-30, 10, 10);
					// Draw the roof
					fill(54, 24, 24);
					triangle(this.x_pos-50, floorPos_y-100, this.x_pos +250, floorPos_y-100, this.x_pos+100, floorPos_y-200);
				}
			},
			check: function ()
			{
				if (gameChar_x > this.x_pos && gameChar_x < (this.x_pos + this.width) && gameChar_y >= floorPos_y)
				{
					this.isReached = true
					textSize(60);
					textAlign(CENTER);
					fill(255);
					text("Level Complete", gameChar_x, height / 2);
					text("Press Space To Continue", gameChar_x, height / 2+60);
					isLeft = false;
					isRight = false;
					return;
				}
			}
		},
		collectables: 
		[
			{
				x_pos: 50,
				y_pos: 420,
				size: 20,
				isFound: false,
				draw: function(t_collectable) 
				{
					fill(170, 170, 0);
					stroke(0);
					strokeWeight(1.5);
					ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
					noStroke();
					fill(255);
					textSize(13);
					textAlign(CENTER);
					text("$", t_collectable.x_pos, t_collectable.y_pos + 4);
				},
				check: function(t_collectable) 
				{
					if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size) 
					{
						t_collectable.isFound = true;
						game_score += 1;
					}
				},
				main: function() 
				{
					for (let i = 0; i < scene.collectables.length; i++) 
					{
						if (scene.collectables[i].isFound == false) 
						{
							scene.collectables[0].draw(scene.collectables[i]);
							scene.collectables[0].check(scene.collectables[i]);
						}
					}
				},
				create: function() 
				{
					for (let i = 0; i < 50; i++) 
					{
						scene.collectables.push({
						x_pos: random(-width * 5, width * 5),
						y_pos: 420,
						size: 20,
						isFound: false,
						});
					}
				}
			}
		],
		canyons: 
		{
			x_pos: [],
			width: [],
			draw: function(t_canyon) {
			  fill(43, 47, 119);
			  rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 145);
			},
			check: function(t_canyon) {
			  if (gameChar_x > t_canyon.x_pos && gameChar_x < (t_canyon.x_pos + t_canyon.width) && gameChar_y >= floorPos_y) {
				isPlummeting = true;
				checkPlayerDie();
			  }
			},
			main: function() {
			  for (let i = 0; i < this.x_pos.length; i++) {
				this.draw({
				  x_pos: this.x_pos[i],
				  width: this.width[i]
				});
				this.check({
				  x_pos: this.x_pos[i],
				  width: this.width[i]
				});
			  }
			},
			create: function() {
			  for (let i = 0; i < 20; i++) {
				this.x_pos.push(random(-width * 5, width * 5));
				this.width.push(random(15, 40));
			  }
			}
		},
		clouds: 
		{
			x_pos: [],
			y_pos: [],
			size: [],
			draw: function()
			{
				for (let i=0;i < this.x_pos.length;i++)
				{
					//first cloud
					fill(193,190,186);
					ellipse(this.x_pos[i]+50,this.y_pos[i]+50,this.size[i]+20,this.size[i]+20);
					ellipse(this.x_pos[i]+90,this.y_pos[i]+50,this.size[i],this.size[i]);
					ellipse(this.x_pos[i]+10,this.y_pos[i]+50,this.size[i],this.size[i]);
					// second cloud
					ellipse(this.x_pos[i]+450,this.y_pos[i]+50,this.size[i]+20,this.size[i]+20);
					ellipse(this.x_pos[i]+490,this.y_pos[i]+50,this.size[i],this.size[i]);
					ellipse(this.x_pos[i]+410,this.y_pos[i]+50,this.size[i],this.size[i]);
					// thrid cloud
					ellipse(this.x_pos[i]+850,this.y_pos[i]+50,this.size[i]+20,this.size[i]+20);
					ellipse(this.x_pos[i]+890,this.y_pos[i]+50,this.size[i],this.size[i]);
					ellipse(this.x_pos[i]+810,this.y_pos[i]+50,this.size[i],this.size[i]);
				}
			},
			create: function ()
			{
				for (let i = 0; i < 50; i++) 
				{
					this.x_pos.push(random(-width*10, width*10));
					this.y_pos.push(random(20, height/4));
					this.size.push(random(60, 80));  
				}
			}
	
		},
		moon: 
		{
			x_pos:random(0,300),
			y_pos:50,
			size:100,
			speed:.05,
			draw: function()
			{
				fill(246,241,213);
				ellipse(this.x_pos, this.y_pos, this.size, this.size);
				this.x_pos += this.speed
				if(this.x_pos >= width || this.x_pos <= 0)
				{
					this.speed *= -1	
				}
			}
	
		},
		lives:
		{	
			draw: function ()
			{
				for(let i = 0; i < lives; i++) 
				{
					fill(255, 0, 0);
					noStroke();
					ellipse(cameraPos_X - (i * 30 + 20),50, 10, 10); 
				}
			}
		},
		rain:
		{			
		}
	}
	scene.clouds.create(); //Create clouds
	scene.stars.create(); // Create stars
	scene.mountains.create(); //Create mountains
	scene.trees.create(); //Create trees
	scene.canyons.create(); //Create canyons
	scene.collectables[0].create(); // Create collectables
	gameChar =
	{
		draw: function ()
		{
			if (isLeft)
			{
				image(left, gameChar_x-50, gameChar_y-100);
			}
			else if (isRight)
			{
				image(right, gameChar_x-50, gameChar_y-100);
			}
			else if (isFalling || isPlummeting)
			{
				image(jump, gameChar_x-50, gameChar_y-100);
			}
			else
			{
				image(stand, gameChar_x-50, gameChar_y-100);
				console.log ("this is game char x" + gameChar_x )
			}
		}
	},
	cameraPos_X = 0 //game world camera
}
function draw()
{
	//camera tracking
	if (isRight == true && isFalling == false)
	{
		cameraPos_X += 2
	}
	else if (isLeft == true && isFalling == false)
	{
		cameraPos_X -= 2
	}
	else
	{
		//stay still 
	};
	background(43,47,119);
	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground
	push(); //part of camera tracking code
	translate(-cameraPos_X+100,0);
	scene.mountains.draw(); //draw mountains
	scene.trees.draw(); //draw the tree
	scene.stars.draw(); //draw stars
	scene.moon.draw(); //draw moon
	scene.clouds.draw(); //draw clouds
	fill(255);
	text("Score  " + game_score, cameraPos_X-70,30) //draw game score
	scene.canyons.main(); //draw & check the canyon
	for (var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}
	scene.lives.draw(); //draw lives on screen
	scene.collectables[0].main(); //draw & check the collectable
	scene.house.draw(); //draw house
	scene.house.check(); //house check
	gameChar.draw(); //the game character
	for (var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();
		let isContact = enemies[i].checkContact(gameChar_x,gameChar_y);
		if (isContact)
		{
			if(lives > 0 )
			{
				lives -= 1
				startGame();
				break;
			}
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
	for (let i = splashes.length - 1; i >= 0; i--) {	//splash
        splashes[i].show();
        splashes[i].move();
        if (splashes[i].alpha <= 0) {
            splashes.splice(i, 1);
        }
    }
	if (random(1) < 0.01) {  // 1% chance of lightning on each draw cycle
        lightningAlpha = 200;  // Start with a strong flash
        // Play thunder sound here if desired
    }
    fill(255, 255, 255, lightningAlpha);
    rect(0, 0, width, height);
    lightningAlpha = constrain(lightningAlpha - 10, 0, 255);  // Fade out the flash 
	interactions();
}
function keyPressed()
{
	if (keyCode ==  65 || keyCode == LEFT_ARROW && isPlummeting == false && isRight == false)
	{
		isLeft = true
	}
	if (keyCode == 68 || keyCode == RIGHT_ARROW && isPlummeting == false && isLeft == false)
	{
		isRight = true
	}
	if (keyCode == 87 || keyCode == UP_ARROW && isPlummeting == false)
	{
		if(isFalling != true)
		{
			gameChar_y -= 100;
		}
	}
}
function keyReleased()
{
	if (keyCode == 65 || keyCode == LEFT_ARROW)
	{
		isLeft = false
	}
	if (keyCode == 68 || keyCode == RIGHT_ARROW)
	{
		isRight = false
	}
}
function checkPlayerDie ()
{
	if (isPlummeting && lives > 1)
	{
		lives -= 1;
		startGame();
	}
	else
	{
		textSize(50);
		textAlign(CENTER);
		fill(255);
		text("GAME OVER :(", gameChar_x, height / 2);
		text("Press Space To Continue", gameChar_x, height / 2+60);
		return;
	}
}
function interactions ()
{
	if(isPlummeting == true ) //plummeting interaction
	{
		gameChar_y += 5;
		isLeft = false; // prevents bug allowing player to keep holding the key and get out of plummeting mode
		isRight = false;
		isFalling = false;
	}
	if (isLeft) //char movement
	{
		gameChar_x -= 2;
	}
	if (isRight)
	{
		gameChar_x += 2;
	}
	//jumping dectection
	if (gameChar_y < floorPos_y && isRight == true) //added additional conditional to avoid bug with camera
	{
		let isContact = false;
		for(var i = 0; i < platforms.length; i++)
		{
			if (platforms[i].checkContact(gameChar_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y +=1.5;
			isFalling = true
			cameraPos_X += 1.5;
		}
	}
	else if (gameChar_y < floorPos_y && isLeft == true) //added additional conditional to avoid bug with camera
	{
		let isContact = false;
		for(var i = 0; i < platforms.length; i++)
		{
			if (platforms[i].checkContact(gameChar_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y +=1.5;
			isFalling = true
			cameraPos_X -= 1.5;
		}
	}
	else if (gameChar_y < floorPos_y)
	{
		let isContact = false;
		for(var i = 0; i < platforms.length; i++)
		{
			if (platforms[i].checkContact(gameChar_x, gameChar_y) == true)
			{
				isContact = true;
				break;
			}
		}
		if(isContact == false)
		{
			gameChar_y +=1.5;
			isFalling = true;
		}
	}
	else
	{
		isFalling=false
	}
}
function startAudio() {
    // Check if AudioContext is in "suspended" state (autoplay policy)
    if (getAudioContext().state === 'suspended') {
        getAudioContext().resume();
    }
    
    rain.loop();
    theme.loop();
}
class RainDrop {
    constructor() {
        this.x = random(width);
        this.y = random(-height, 0);
        this.length = random(5, 15);
        this.speed = random(4, 10);
        this.xSpeed = random(-1, 1);  // Wind effect
    }

    show() {
        stroke(171, 190, 191);  // Blue for raindrop
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
function createPlatforms (x,y,length)
{
	let p = 
	{
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			fill(150);
			rect(this.x,this.y,this.length, 20)
		},
		checkContact: function (gc_x,gc_y)
		{
			if(gc_x > this.x && gc_x < this.x + this.length)
			{
				let d = this.y - gc_y;
				if (d >= 0 && d < 2)
				{
					return true;
				}
			}
			return false;
		}
	}
	return p;
}
function Enemies(x,y,range)
{
	this.x = x;
	this.y = y;
	this.range = range;
	this.currentX = x;
	this.inc = 1;
	this.update = function()
	{
		this.currentX += this.inc;
		if (this.currentX >= this.x + this.range)
		{
			this.inc = -1;
		}
		else if (this.currentX < this.x)
		{
			this.inc = 1;
		}
	}
	this.draw = function ()
	{
		this.update ()
		image(enemy, this.currentX-50, this.y-95);
	}
	this.checkContact = function(gc_x, gc_y)
	{	
	let d = dist(gc_x,gc_y, this.currentX, this.y)
		if(d < 20)
		{
			return true;
		}
		return false;
	}

}