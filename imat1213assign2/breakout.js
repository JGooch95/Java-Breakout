var canvas = document.getElementById("breakout");
var ctx = canvas.getContext("2d");

//Key press detection
var keysDown = {}; 
window.addEventListener("keydown",function(e){ keysDown[e.keyCode] = true; }); //Pressing a key down
window.addEventListener("keyup",function(e){ delete keysDown[e.keyCode]; }); //Removing the key press of the key

var Screens = {
	StartScreen: 0,
	GameOver:1,
	LevelScreen:2,
	Game: 3
}

var GameScreen = Screens.StartScreen;

var Player = {
	Lives: 3, //Lives the player currently has.
	Score: 0, //Score the player currently has.
	Level: 1  //Level the player currently has.
}

var BlockGroup = {
	Rows: [], 			//Holds the rows of blocks.
	BlocksDestroyed: 0,	//States how many blocks have been destroyed.
	AmountOfBlocks: 0
}

var ball = {
	x: canvas.width / 2,   //X coordinate in pixels
	y: canvas.height - 80, //Y coordinate in pixels
	xSpeed: 200,   		 //Speed in the x direction in pixels per second
	ySpeed: -200,          //Speed in the y direction in pixels per second
	radius: 10,            //Radius of the ball in pixels
	released: false,		 //Determines whether the ball has started moving.
	collision: false		 //Determines whether the ball has collided.
}

var paddle = {
	width: 100,            //Width of the paddle in pixels
	height: 20,            //Height of the paddle in pixels
	x: (canvas.width / 2) - (this.width / 2),   //X coordinate in pixels
	y: canvas.height - 50, //Y coordinate in pixels
	speed: 800             //Speed of the paddle in pixels per second
}

function block(x, y, width, height, hits) 
{
	this.x = x,           //X coordinate of the block in pixels
	this.y = y,           //Y coordinate of the block in pixels
	this.width = width,   //Width of the block in pixels
	this.height = height,  //Height of the block in pixels
	this.colour = "white",  //Colour of the block
	this.hits = hits	   //The amount of hits until the block is destroyed.
}

function ResetBlocks()
{	
	BlockGroup.Rows = []; //Empties the multiple row array.
	var LevelBlocks = ["--------",
					   "--------"];
	var X = 20;			  //The X position the group of blocks starts.
	var Y = 50;			  //The Y position the group of blocks starts.
	var XGap = 40;		  //The Gap between the blocks in the x axis.
	var YGap = 10; 		  //The Gap between the blocks in the y axis.
	var BlockWidth = 60;  //The default width of the blocks
	var BlockHeight = 30; //The default height of the blocks
	
	BlockGroup.AmountOfBlocks = 0; //Resets the amount of blocks variable.
	
	//Block Positions change dependant on the level.
	switch(Player.Level)
	{
		case 1:
			LevelBlocks = ["========",
					   	   "--------"];
			break;

		case 2:
			LevelBlocks = ["-=-=-=-=",
					       "=-=-=-=-"];
			break;

		case 3:
			LevelBlocks = ["--====--",
					       "==----=="];
			break;

		case 4:
			LevelBlocks = ["--====--",
					       "==-==-=="];
			break;

		case 5:
			LevelBlocks = ["========",
						   "========"];
			break;

		default:
			LevelBlocks = ["========",
						   "========"];
			break;
	};

	//For the amount of rows needed.
	for(b = 0; b < LevelBlocks.length; b++)
	{
		var Row = []; //Empties the single row array.

		//For each block in a row.
		for(i = 0; i < LevelBlocks[b].length; i++)
		{
			//Single hit blocks
			if(LevelBlocks[b][i] == "-")
			{
				var NewBlock = new block((i*(BlockWidth + XGap)) + X, (b* (BlockHeight + YGap)) + Y, BlockWidth, BlockHeight, 1); //Make a new instance of the block.
				Row.push(NewBlock); //Add the block to the current row array
				BlockGroup.AmountOfBlocks += 1; //Amount of blocks is incremented.
			}
			
			//Double hit blocks
			else if(LevelBlocks[b][i] == "=")
			{
				var NewBlock = new block((i*(BlockWidth + XGap)) + X, (b* (BlockHeight + YGap)) + Y, BlockWidth, BlockHeight, 2); //Make a new instance of the block.
				Row.push(NewBlock); //Add the block to the current row array
				BlockGroup.AmountOfBlocks += 1; //Amount of blocks is incremented.
			}
		}
		BlockGroup.Rows.push(Row); //Add the row to the list of rows.
	}
}

function RenderStartScreen()
{
	var Start_txt = ""; //Holds the text for the Start screen.
		
	//Sets the font to arial and the colour to white.
	ctx.fillStyle = "white";
	ctx.font="50px Arial";

	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
		
	//Draws the breakout title to the screen.
	var Start_txt = "Breakout";
	ctx.fillText(Start_txt, (canvas.width / 2) - (ctx.measureText(Start_txt).width / 2) ,canvas.height / 2 - 100);
		
	//Draws the start prompt to the screen.
	Start_txt = "Press Enter to Start";
	ctx.fillText(Start_txt, (canvas.width / 2) - (ctx.measureText(Start_txt).width / 2) ,canvas.height / 2);
}

function RenderGameOver()
{
	var GameOver_txt = ""; //Holds the text for the Game over screen.
		
	//Sets the font to arial and the colour to white.
	ctx.fillStyle = "white";
	ctx.font="50px Arial";

	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
	
	//Draws the Game Over text to the screen.
	var GameOver_txt = "Game Over";
	ctx.fillText(GameOver_txt, (canvas.width / 2) - (ctx.measureText(GameOver_txt).width / 2) ,canvas.height / 2 - 100);
	
	//Draws the final score to the screen.
	GameOver_txt = "Score: " + Player.Score;
	ctx.fillText(GameOver_txt, (canvas.width / 2) - (ctx.measureText(GameOver_txt).width / 2) ,canvas.height / 2);
	
	//Draws the return prompt to the screen.
	GameOver_txt = "Press Enter to restart";
	ctx.fillText(GameOver_txt, (canvas.width / 2) - (ctx.measureText(GameOver_txt).width / 2) ,canvas.height / 2 + 100);
}

function RenderLevelScreen()
{
	var Level_txt = ""; //Holds the text for the Level screen.
		
	//Sets the font to arial and the colour to white.
	ctx.fillStyle = "white";
	ctx.font="50px Arial";

	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
	
	//Draws the Level to the screen.
	Level_txt = "Level: " + Player.Level;
	ctx.fillText(Level_txt, (canvas.width / 2) - (ctx.measureText(Level_txt).width / 2) ,canvas.height / 2);
}

function RenderInGame()
{
	var HUD_txt = ""; //Holds the text for the HUD.
		
	//Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Ball and paddle colour
	ctx.fillStyle = "white";

	//Ball
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	ctx.fill();

	//Paddle
	ctx.beginPath();
	ctx.fillRect(paddle.x + (paddle.height/2), paddle.y, paddle.width - paddle.height, paddle.height);
	ctx.arc(paddle.x + (paddle.height / 2), paddle.y + (paddle.height / 2), paddle.height / 2, 0.5 * Math.PI, 1.5 * Math.PI);
	ctx.arc(paddle.x + (paddle.height / 2) + paddle.width - paddle.height, paddle.y + (paddle.height / 2), paddle.height / 2, 1.5 * Math.PI, 0.5 * Math.PI);
	ctx.fill();

	//Blocks
	//For each row of blocks
	for(b = 0; b < BlockGroup.Rows.length; b++)
	{
		//For each block in the row.
		for(i=0; i < BlockGroup.Rows[b].length; i++)
		{
			//1 hit blocks are red.
			if(BlockGroup.Rows[b][i].hits == 1)
			{
				BlockGroup.Rows[b][i].colour = "red";
			}
			
			//2 hit blocks are green.
			else if(BlockGroup.Rows[b][i].hits == 2)
			{
				BlockGroup.Rows[b][i].colour = "green";
			}
			//Block colour
			ctx.fillStyle = BlockGroup.Rows[b][i].colour;
			
			ctx.beginPath();
			ctx.fillRect(BlockGroup.Rows[b][i].x, BlockGroup.Rows[b][i].y, BlockGroup.Rows[b][i].width, BlockGroup.Rows[b][i].height);
			ctx.fill();
		}
	}

	//HUD
	//HUD colour and font.
	ctx.fillStyle = "white";
	ctx.font="20px Arial";

	//Lives
	HUD_txt = "Lives: " + Player.Lives;
	ctx.fillText(HUD_txt,10 ,canvas.height - 10);

	//Score
	HUD_txt = "Score: " + Player.Score;
	ctx.fillText(HUD_txt,100 ,canvas.height - 10);

	//Level
	HUD_txt = "Level " + Player.Level;
	ctx.fillText(HUD_txt, (canvas.width / 2) - (ctx.measureText(HUD_txt).width / 2) ,canvas.height - 10);
	
	//If the ball hasn't been released.
	if (ball.released == false)
	{
		//Enter prompt colour and font.
		ctx.fillStyle = "white";
		ctx.font="20px Arial";
		
		//Enter prompt.
		HUD_txt = "Press Enter to release the ball";
		ctx.fillText(HUD_txt, (canvas.width / 2) - (ctx.measureText(HUD_txt).width / 2) ,canvas.height/2);
	}
}

function UpdateStartScreen()
{
	//If the enter key is pressed.
	if(13 in keysDown) 
	{
		//Game.StartScreen = false; //The start screen is disabled.
		BlockGroup.BlocksDestroyed = 0; //Blocks destroyed are reset.
		Player.Lives = 3; //Lives are reset
		Player.Score = 0; //Score is reset
		Player.Level = 1; //The level is reset.
		ball.xSpeed = 200; //Ball xSpeed is reset.
		ball.ySpeed = -200; //Ball ySpeed is reset.
		paddle.x = (canvas.width / 2) - (paddle.width / 2); //The paddle's position is reset.
		ResetBlocks(); //The blocks are reset.
		delete keysDown[13]; //Removes the enter key from the stack.
		GameScreen = Screens.LevelScreen;
		//Game.LevelScreen = true; //The Level screen is enabled.
	}
}

function UpdateGameOver()
{
	//If the enter key is pressed.
	if(13 in keysDown)
	{
		//Game.GameOver = false; //The Game Over screen is disabled.
		//Game.StartScreen = true; //The start screen is enabled.
		GameScreen = Screens.StartScreen;
		delete keysDown[13]; //Removes the enter key from the stack.
	}
}

function UpdateLevelScreen()
{
	var timer = setTimeout(function DisableLevelScreen(){GameScreen = Screens.Game;}, 2000); //Disables the level transfer screen after 2 seconds.
}

function UpdateInGame(elapsed)
{
	//If the player dies
	if (Player.Lives <= 0)
	{
		GameScreen = Screens.GameOver; //The Game Over screen is enabled
		return; //The game screen is left
	}
	
	//If the ball has been released.
	if(ball.released == true)
	{
		//update the ball position according to the elapsed time
		ball.y += ball.ySpeed * elapsed;
		ball.x += ball.xSpeed * elapsed;

		//Key detection
		//If the left key is pressed the paddle moves left.
		if(37 in keysDown) { paddle.x -= paddle.speed * elapsed; }

		//If the right key is pressed the paddle moves right.
		if(39 in keysDown) { paddle.x += paddle.speed * elapsed; }
	}

	//Key detection
	//If enter is pressed
	if(13 in keysDown) 
	{ 
		//If the ball is not released
		if(ball.released ==false)
		{
			ball.released = true; //The ball is released.
		}
	}


	//Collision (Paddle : Window edges)
	//Left Window side
	if(paddle.x <=0)
	{
		paddle.x = 0; //Paddle is moved to the left side of the window.
	}

	//Right Window side
	if(paddle.x + paddle.width   >= canvas.width)
	{
		paddle.x = canvas.width - paddle.width ; //Paddle is moved to the right side of the window.
	}

	// Collision (Paddle : Ball)
	var yPaddleHit = "none";
	var xPaddleHit = "none";
	
	//If the ball enters the paddle area.
	if(ball.x + ball.radius >= paddle.x && 
	ball.x - ball.radius <= paddle.x + paddle.width && 
	ball.y + ball.radius >= paddle.y && 
	ball.y - ball.radius <= paddle.y + paddle.height)
	{
		//If the ball is within the top area of the paddle and is moving downwards.
		if(ball.x + ball.radius >= paddle.x + (paddle.x + paddle.height / 2) && 
		ball.x - ball.radius <= paddle.x + paddle.width - (paddle.x + paddle.height / 2)&& 
		ball.y + ball.radius >= paddle.y  && 
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.ySpeed > 0 ||
		ball.y + ball .radius >= paddle.y &&
		ball.y + ball.radius <= paddle.y + (paddle.height / 4) &&
		ball.x + ball.radius >= paddle.x &&
		ball.x - ball.radius <= paddle.x + paddle.width && 
		ball.ySpeed > 0 )
		{
			yPaddleHit = "top"; //The paddle has been hit on the top.
			ball.ySpeed *= -1;  //The ball is flipped in the y direction.
		}
		
		//If the ball is within the bottom area of the paddle and is moving upwards.
		else if( ball.x + ball.radius >= paddle.x + (paddle.x + paddle.height / 2) && 
		ball.x - ball.radius <= paddle.x + paddle.width - (paddle.x + paddle.height / 2)&& 
		ball.y + ball.radius >= paddle.y  && 
		ball.y - ball.radius <= paddle.y + paddle.height &&	
		ball.ySpeed < 0 ||
		ball.y - ball .radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y + paddle.height - (paddle.height / 4) &&
		ball.x + ball.radius >= paddle.x &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.ySpeed < 0)
		{
			yPaddleHit = "bottom"; //The paddle has been hit on the bottom.
			ball.ySpeed *= -1;     //The ball is flipped in the y direction.
		}
		
		//If the ball is within the left area of the paddle and is moving right.
		if(ball.x + ball.radius >= paddle.x &&
		ball.x + ball.radius <= paddle.x + (paddle.height/2) &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y + paddle.height &&
		ball.xSpeed > 0)
		{
			xPaddleHit = "left"; //The paddle has been hit on the left side.
			ball.xSpeed *= -1;   //The ball is flipped in the x direction.
		}
		
		//If the ball is within the right area of the paddle and is moving left.
		else if(ball.x - ball.radius >= paddle.x + paddle.width - (paddle.height/2)  &&
		ball.x - ball.radius <= paddle.x + paddle.width &&
		ball.y + ball.radius >= paddle.y &&
		ball.y - ball.radius <= paddle.y + paddle.height && 
		ball.xSpeed < 0)
		{
			xPaddleHit = "right"; //The paddle has been hit on the right side.
			ball.xSpeed *= -1;    //The ball is flipped in the x direction.
		}
		
		//If the paddle has been hit in any direction.
		if (xPaddleHit != "none" || yPaddleHit != "none")
		{
			//If the left side of the paddle has been hit.
			if (xPaddleHit == "left")
			{	
				ball.x = paddle.x - ball.radius; //The ball moves to the left side of the paddle.
			}
			//If the right side of the paddle has been hit.
			else if (xPaddleHit == "right")
			{
				ball.x = paddle.x + paddle.width + ball.radius; //The ball moves to the right side of the paddle.
			}
			
			//If the top of the paddle has been hit.
			if (yPaddleHit == "top")
			{
				ball.y = paddle.y - ball.radius; //The ball moves to the top of the paddle.
			}
			//If the bottom of the paddle has been hit.
			else if (yPaddleHit == "bottom")
			{
				ball.y = paddle.y + paddle.height + ball.radius; //The ball moves to the bottom of the paddle.
			}
		}

		ball.collision = true; //The ball has collided.
	}

	//Collision (Ball : Window edges)
	//Horizontal
	if(ball.x <= 0 || ball.x >= canvas.width) 
	{
		//Left window side
		if(ball.x <=0)
		{
			ball.x = 0 + ball.radius; //Ball is moved to the left side of the screen.
		}

		//Right window side
		if(ball.x >= canvas.width)
		{
			ball.x = canvas.width - ball.radius; //Ball is moved to the right side of the screen.
		}

		ball.xSpeed *= -1;      //Ball's direction on the x axis is flipped.
		ball.collision = true;  //Collision variable is set to true.
	}

	//Vertical
	if(ball.y <= 0 || ball.y >= canvas.height) 
	{
		//Top window side
		if(ball.y <=0)
		{
			ball.y = 0 + ball.radius; //Ball is moved to the top side of the screen.
		}

		//Bottom window side
		if(ball.y >= canvas.height)
		{
			//The ball's position is reset.
			ball.x = canvas.width / 2;	
			ball.y = canvas.height - 80;	

			ball.bounces = 0;	//The amount of times the ball has bounced is reset.
			Player.Lives -= 1;  //Player lives are decreased.
			
			//If the ball's direction is down
			if (ball.ySpeed < 0)
			{
				ball.ySpeed *= -1; //The ball's direction in the y axis is flipped.
			}
			
			ball.released = false; //The ball is set to not released.
			paddle.x = (canvas.width / 2) - (paddle.width / 2); //Paddle's position is reset.
		}

		ball.ySpeed *= -1; 	   //Ball's direction on the y axis is flipped.
		ball.collision = true; //Collision variable is set to true.
	}

	//Collision(Ball : Blocks)
	var yBlockHit = "none";
	var xBlockHit = "none";
	
	//For each row of blocks.
	for(b = 0; b < BlockGroup.Rows.length; b++)
	{
		//For each block in the row.
		for(i=0; i < BlockGroup.Rows[b].length; i++)
		{
			//If the ball is within the area of the block.
			if(ball.x + ball.radius >= BlockGroup.Rows[b][i].x && 
			ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width && 
			ball.y + ball.radius >= BlockGroup.Rows[b][i].y && 
			ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height)
			{
				//If the ball is within the top area of the block and is moving downwards.
				if(ball.x + ball.radius >=  BlockGroup.Rows[b][i].x + (BlockGroup.Rows[b][i].width / 4) && 
				ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width - (BlockGroup.Rows[b][i].width / 4)&& 
				ball.y + ball.radius >= BlockGroup.Rows[b][i].y  && 
				ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height &&
				ball.ySpeed > 0 ||
				ball.y + ball .radius >= BlockGroup.Rows[b][i].y &&
				ball.y + ball.radius <= BlockGroup.Rows[b][i].y + (BlockGroup.Rows[b][i].height / 4) &&
				ball.x + ball.radius >= BlockGroup.Rows[b][i].x &&
				ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width && 
				ball.ySpeed > 0 )
				{
					yBlockHit = "top"; //The block has been hit on the top.
					ball.ySpeed *= -1; //The ball's direction is flipped on the y axis.
				}
				
				//If the ball is within the bottom area of the block and is moving upwards.
				else if( ball.x + ball.radius >= BlockGroup.Rows[b][i].x + (BlockGroup.Rows[b][i].width / 4) && 
				ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width - (BlockGroup.Rows[b][i].width / 4)&& 
				ball.y + ball.radius >= BlockGroup.Rows[b][i].y  && 
				ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height &&	
				ball.ySpeed < 0 ||
				ball.y - ball .radius >= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height - (BlockGroup.Rows[b][i].height / 4) &&
				ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height  &&
				ball.x + ball.radius >= BlockGroup.Rows[b][i].x &&
				ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width &&
				ball.ySpeed < 0)
				{
					yBlockHit = "bottom"; //The block has been hit on the bottom.
					ball.ySpeed *= -1; //The ball's direction is flipped on the y axis.
				}
				
				//If the ball is within the left area of the block and is moving right.
				if(ball.x + ball.radius >= BlockGroup.Rows[b][i].x &&
				ball.x + ball.radius <= BlockGroup.Rows[b][i].x + (BlockGroup.Rows[b][i].width/4) &&
				ball.y + ball.radius >= BlockGroup.Rows[b][i].y &&
				ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height &&
				ball.xSpeed > 0)
				{
					xBlockHit = "left"; //The block has been hit on the left side.
					ball.xSpeed *= -1; //The ball's direction is flipped on the x axis.
				}
				
				//If the ball is within the right area of the block and is moving left.
				else if(ball.x - ball.radius >= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width - (BlockGroup.Rows[b][i].height/4)  &&
				ball.x - ball.radius <= BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width &&
				ball.y + ball.radius >= BlockGroup.Rows[b][i].y &&
				ball.y - ball.radius <= BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height && 
				ball.xSpeed < 0)
				{
					xBlockHit = "right"; //The block has been hit on the right side.
					ball.xSpeed *= -1; //The ball's direction is flipped on the x axis.
				}
				
				//If the block has been hit on any side.
				if (xBlockHit != "none" || yBlockHit != "none")
				{
					//X
					//If the block has been hit on the left side.
					if (xBlockHit == "left")
					{
						ball.x = BlockGroup.Rows[b][i].x - ball.radius; //The ball is moved to the left side of the block
					}
					//If the block has been hit on the right side.
					else if (xBlockHit == "right")
					{
						ball.x = BlockGroup.Rows[b][i].x + BlockGroup.Rows[b][i].width + ball.radius; //The ball is moved to the right side of the block
					}
					
					//Y
					//If the block has been hit on the top.
					if (yBlockHit == "top")
					{
						ball.y = BlockGroup.Rows[b][i].y - ball.radius; //The ball is moved to the top of the block
					}
					//If the block has been hit on the bottom.
					else if (yBlockHit == "bottom")
					{
						ball.y = BlockGroup.Rows[b][i].y + BlockGroup.Rows[b][i].height + ball.radius; //The ball is moved to the bottom of the block
					}
				}

				Player.Score += 100 * Player.Level; // Score increases dependant on the level.
				BlockGroup.Rows[b][i].hits -= 1;
				
				//If the block has taken all of its hits.
				if (BlockGroup.Rows[b][i].hits <= 0)
				{
					BlockGroup.Rows[b].splice(i,1); 	// The block is removed from the list of blocks.
					BlockGroup.BlocksDestroyed += 1; 	// The blocks destroyed is increased by 1.
				}
				
				ball.collision = true; 				// The collision variable is set to true
			}
		}
	}

	//If the amount of blocks destroyed is more than or equal to all the blocks on the canvas.
	if (BlockGroup.BlocksDestroyed >= BlockGroup.AmountOfBlocks)
	{
		Player.Level += 1; //The level is increased.

		GameScreen = Screens.LevelScreen;
		BlockGroup.BlocksDestroyed = 0; //The amount of blocks destroyed is reset.

		//The ball's position is reset.
		ball.y = canvas.height - 80;
		ball.x = canvas.width / 2;
		
		//If the ball's direction is down
		if (ball.ySpeed < 0)
		{
			ball.ySpeed *= -1; //The ball's direction in the y axis is flipped.
		}

		paddle.x = (canvas.width / 2) - (paddle.width / 2); //The paddle's position is reset.
		ResetBlocks(); //Resets the blocks to appear.

		ball.released = false; //The ball is set to not released.
	}

	//If the ball has collided.
	if(ball.collision == true)
	{
		//Speed increases dependant on the direction of the ball's movement.
		//X
		//Left
		if (ball.xSpeed > 0)
		{
			ball.xSpeed += 1;
		}
		//Right
		else if(ball.xSpeed < 0)
		{
			ball.xSpeed -= 1;
		}
		
		//Y
		//Down
		if (ball.ySpeed > 0)
		{
			ball.ySpeed += 1;
		}
		//Up
		else if(ball.ySpeed < 0)
		{
			ball.ySpeed -= 1;
		}
		
		paddle.speed += 1; //The paddle speed is increased.
		ball.collision = false; //The ball's collision is reset.
	}
}

function render() 
{	
	switch(GameScreen)
	{
		case Screens.StartScreen:
			RenderStartScreen();
			break;

		case Screens.GameOver:
			RenderGameOver();
			break;

		case Screens.LevelScreen:
			RenderLevelScreen();
			break;

		case Screens.Game:
			RenderInGame();
			break;

		default:
			GameScreen = Screens.StartScreen;
			//break;
	};
}

function update(elapsed) 
{
	switch(GameScreen)
	{
		case Screens.StartScreen:
			UpdateStartScreen();
			break;

		case Screens.GameOver:
			UpdateGameOver();
			break;

		case Screens.LevelScreen:
			UpdateLevelScreen();
			break;

		case Screens.Game:
			UpdateInGame(elapsed);
			break;

		default:
			GameScreen = Screens.StartScreen;
			//break;
	};
}

var previous;
function run(timestamp) 
{
	if (!previous) previous = timestamp;          //start with no elapsed time
	var elapsed = (timestamp - previous) / 1000;  //work out the elapsed time
	update(elapsed);                              //update the game with the elapsed time
	render();                                     //render the scene
	previous = timestamp;                         //set the (globally defined) previous timestamp ready for next time
	window.requestAnimationFrame(run);            //ask browser to call this function again, when it's ready
}


//trigger the game loop
window.requestAnimationFrame(run);
