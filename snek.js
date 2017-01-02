
// Constants for the game
var COLS = 30, ROWS = 30;

// BLOCK STATE IDs
var EMPTY = 0, SNAKE = 1, FRUIT = 2;

// DIRECTIONS
var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

// KeyCodes
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40, SPACE = 32;

// Game states
var PLAYING = 0, PAUSED = 1, DEAD = 2, START = 3;

// Create the grid and its inner functions
var grid = {

  width: null,
  height: null,
  _grid: null,

  // Sets up the grid with all the default properties
  init: function(dir, cols, rows) {
    this.width = cols;
    this.height = rows;

    // Create an empty array for the grid
    this._grid = [];

    // Now we loop to add in the columns and the rows
    for (var i = 0; i < cols; i++) {
      this._grid.push([]);
      for (var j = 0; j < rows; j++) {
        this._grid[i].push(dir)
      }
    }
  },

  // Sets object in the grid
  set: function(val, x, y) {
    this._grid[x][y] = val;
  },

  // Returns object from the grid
  get: function(x, y) {
    return this._grid[x][y];
  }
}

// Snake object and its inner functions
var snake = {

  direction: null,
  last: null,
  _queue: null,

  // Sets up the snake with default properties
  init: function(dir, x, y) {
    this.direction = dir;

    // Create the queue which would hold the snake body (FIFO)
    this._queue = [];
    this.insert(x, y);
  },

  // Inserts the snake at a specific location
  insert: function(x, y) {
    // Unshift places at the start
    this._queue.unshift({x:x, y:y});
    this.last = this._queue[0];
  },

  // Remove the tail from the snake
  remove: function() {
    return this._queue.pop();
  }
}

// Start Button
var startBtn = {
  w: 100,
  h: 50,
  x: 0,
  y: 0,
  rectX: 0,
  rectY: 0,

  init: function(cx, cy) {
    this.x = cx; // Center locations
    this.y = cy;
    this.rectX = this.x - 50;
    this.rectY = this.y - 25;
  },

  draw: function() {
    ctx.strokeStyle = "white";
		ctx.lineWidth = "1";
		ctx.strokeRect(this.rectX, this.rectY, this.w, this.h);

		ctx.font = "16px Segoe UI, sans-serif";
		ctx.fillStlye = "white";
		ctx.fillText("Start", this.x, this.y);
    console.log(this.rectX);
  },

  getX: function() { // Return x location
    return this.x;
  },

  getY: function() { // Return y location
    return this.y;
  },

  getWidth: function() { // Return width
    return this.w;
  },

  getHeight: function() { // Return height
    return this.h;
  },

  getRectX: function() {
    return this.rectX;
  },

  getRectY: function() {
    return this.rectY;
  }
};

// Game objects
var canvas, ctx, keystate, frames, score, state, centerX, centerY; // ctx is context

function main() {
  canvas = document.createElement("canvas");
  canvas.width = COLS * 20;
  canvas.height = ROWS * 20;
  ctx = canvas.getContext("2d");

  centerX = canvas.width / 2;
  centerY = canvas.height / 2

  // Place the canvas into the document body
  document.body.appendChild(canvas);

  frames = 0;
  keystate = {};

  // Listen or key events
  document.addEventListener("keydown", function(evt) {
    if (evt.keyCode === SPACE) {
      switch (state) {
        case 0: // If playing, pause the game
          if (state !== DEAD) {
            state = PAUSED;
            drawPaused();
          }
          break;
        case 1: // If paused, resume the game
          if (state !== DEAD) {
            state = PLAYING;
            loop();
          }
          break;
        case 2: // Restart the game if dead
          state = PLAYING;
          init();
          loop();
          break;
      }
    }
    keystate[evt.keyCode] = true; // Sets the array index to true for this key
  });

  document.addEventListener("keyup", function(evt) {
    delete keystate[evt.keyCode]; // Removes the key from the index
  });

  // Add mousemove and mousedown events to the canvas
  //canvas.addEventListener("mousemove", trackPosition, true);
  //canvas.addEventListener("mouseup", btnClick, true);

  // Update game state
  state = START;

  createStartMenu();

  /*init();
  loop();*/
}

function createStartMenu() {
  // Align text to center
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "40px Segoe UI";
  ctx.fillStyle = "#eee";
  ctx.fillText("teh snek gaem", centerX, centerY - 100);

  startBtn.init(centerX, centerY);
  startBtn.draw();

  canvas.addEventListener("mouseup", function(e) {
    // Mouse positions
    var mx = e.pageX;
    var my = e.pageY;

    console.log(startBtn.getRectX());
    console.log(mx + " " + my);
    // Start button detection
    if (mx >= startBtn.getRectX() && mx <= startBtn.getRectX() + startBtn.getWidth() && my >= startBtn.getRectY() && my <= startBtn.getRectY() + startBtn.getHeight()) {
      console.log("yay");
    }
  });
}

// Detect button mouse click
function btnClick(e) {
  // Mouse positions
  var mx = e.pageX;
  var my = e.pageY;

  console.log(startBtn.getRectX());
  console.log(mx + " " + my);
  // Start button detection
  if (mx >= startBtn.getRectX() && mx <= startBtn.getRectX() + startBtn.getWidth() && my >= startBtn.getRectY() && my <= startBtn.getRectY() + startBtn.getHeight()) {
    console.log("yay");
  }
}

function init() {
  // Reset the score
  score = 0;

  // Create an empty grid
  grid.init(EMPTY, COLS, ROWS);

  // Now to set up the snake at the center
  var snekp = {x:Math.floor(COLS/2), y:Math.floor(ROWS/2)};
  snake.init(UP, snekp.x, snekp.y);
  grid.set(SNAKE, snekp.x, snekp.y);

  setFood();
}

function loop() {
  // Check if the game is PAUSED. This is placed here to reduce cpu usage on pause
  if (state === PAUSED)
    return;
  else if (state === DEAD) {
    drawDead();
    return;
  }

  update();
  draw();

  // Tells the browser what to update with a callback function and the canvas object
  window.requestAnimationFrame(loop, canvas);
}

function update() {

  frames++;

  // Check which directional key is pressed
  updateDirection();

  if (frames % 5 === 0) {
    var nx = snake.last.x;
    var ny = snake.last.y;

    switch (snake.direction) {
      case LEFT:
        nx--;
        break;
      case UP:
        ny--;
        break;
      case RIGHT:
        nx++;
        break;
      case DOWN:
        ny++;
        break;
    }

    if (isOutOfBounds(nx, ny)) {
      //init(); // Reset the game
      state = DEAD;
      return; // Break out of the update loop
    }

    var tail = checkCollision(nx, ny);

    grid.set(SNAKE, tail.x, tail.y);

    // Insert the new location into the queue
    snake.insert(tail.x, tail.y);
  }
}

// Check if the snake is out of bounds or eats itself
function isOutOfBounds(nx, ny) {
  return (0 > nx || nx > grid.width - 1 || 0 > ny || ny > grid.height - 1 || grid.get(nx, ny) === SNAKE);
}

// Set the food at a random location
function setFood() {
  var empty = [];
  for (var x=0; x<grid.width; x++) {
    for (var y=0; y<grid.height; y++) {
      if (grid.get(x,y) === EMPTY) {
        empty.push({x:x, y:y});
      }
    }
}

// Gets a random element from the grid
var r = empty[Math.floor(Math.random() * empty.length)];

// Places the fruit at a random location
grid.set(FRUIT, r.x, r.y);
}

function checkCollision(nx, ny) {
  // Check if the snake collides with fruit
  if (grid.get(nx, ny) === FRUIT) {
    // Update snake length
    var t = {x:nx, y:ny};
    // Regenerate food
    setFood();
    // Increment the score
    score++;
  } else {
    // Update the tail location. This changes the last element of the snake to an empty cell
    var t  = snake.remove();
    grid.set(EMPTY, t.x, t.y);
    t.x = nx;
    t.y = ny;
  }

  return t;
}

function updateDirection() {
  // Make the snake respond to key events
  if (keystate[KEY_LEFT] && snake.direction !== RIGHT) snake.direction = LEFT;
  if (keystate[KEY_UP] && snake.direction !== DOWN) snake.direction = UP;
  if (keystate[KEY_RIGHT] && snake.direction !== LEFT) snake.direction = RIGHT;
  if (keystate[KEY_DOWN] && snake.direction !== UP) snake.direction = DOWN;
}

function draw() {
  var tw = canvas.width / grid.width; // tile width
  var th = canvas.height / grid.height; // tile height

  // Loop through the grid
  for (var x=0; x < grid.width; x++) {
    for (var y=0; y< grid.height; y++) {
      /*switch (grid.get(x, y)) {
        case EMPTY:
          ctx.fillStyle = "#000";
          ctx.fillRect(x * tw, y * th, tw, th);
          break;
        case SNAKE:
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * tw, y * th, tw, th);
          break;
        case FRUIT:
          ctx.fillStyle = "#0066FF";
          break;
      }

      // Fill the rect with the associated item
      ctx.fillRect(x * tw, y * th, tw, th);*/

      switch (grid.get(x, y)) {
        case EMPTY:
          ctx.fillStyle = "#000";
          ctx.fillRect(x * tw, y * th, tw, th);
          break;
        case SNAKE:
          ctx.fillStyle = "#fff";
          ctx.fillRect(x * tw, y * th, tw, th);
          break;
        case FRUIT:
          /*var img = new Image(); /* TODO: Resize image *//*
            img.src = "data:image/png;base64,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";
            ctx.drawImage(img, x * tw, y * th);*/
            ctx.fillStyle = "#0066FF";
            ctx.fillRect(x * tw, y * th, tw, th);
          break;
    }
    }

  }

  // Draw the score
  drawScore();
}

function drawScore() {
  // Align text to left
  ctx.textAlign = 'left';
  ctx.textBaseline = 'left';
  ctx.font = "16px Segoe UI"
  ctx.fillStyle = "#eee";
  var highScore = localStorage['highscore'] || 0;
  if (score < highScore)
    ctx.fillText("Previous Highscore: " + highScore, 10, canvas.height - 20);
  else {
      ctx.fillText("New Highscore: " + score, 10, canvas.height - 20); // Show when current score is greater than the old highscore
  }

  // Align text to center
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
    ctx.font = 'bold 102px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillText(score, centerX, centerY);
}

function drawPaused() {
  ctx.font = "30px Segoe UI";
  ctx.fillStyle = "#eee";
  ctx.fillText("PAUSED", centerX, centerY);
}

function drawDead() {
  ctx.font = "40px Segoe UI";
  ctx.strokeStyle = "#eee";
  ctx.strokeText("YOU DIED BUCKO", centerX, centerY);

  ctx.font = "20px Segoe UI";
  ctx.fillStyle = "#eee";
  ctx.fillText("Just press space to restart", centerX, centerY + 50);

  // Cache the Highscore
  var prevHighScore = localStorage['highscore'] || 0;
  if (score > prevHighScore)
    localStorage['highscore'] = score; // Cache the new score

}

// Run the game
main();
