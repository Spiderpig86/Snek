
// Constants for the game
var COLS = 30, ROWS = 30;

// BLOCK STATE IDs
var EMPTY = 0, SNAKE = 1, FRUIT = 2;

// DIRECTIONS
var LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

// KeyCodes
var KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

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

// Game objects
var canvas, ctx, keystate, frames, score; // ctx is context

function main() {
  canvas = document.createElement("canvas");
  canvas.width = COLS * 20;
  canvas.height = ROWS * 20;
  ctx = canvas.getContext("2d");

  // Place the canvas into the document body
  document.body.appendChild(canvas);

  frames = 0;
  keystate = {};

  // Listen or key events
  document.addEventListener("keydown", function(evt) {
    keystate[evt.keyCode] = true; // Sets the array index to true for this key
  });

  document.addEventListener("keyup", function(evt) {
    delete keystate[evt.keyCode]; // Removes the key from the index
  });

  init();
  loop();
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
  update();
  draw();

  // Tells the browser what to update with a callback function and the canvas object
  window.requestAnimationFrame(loop, canvas);
}

function update() {
  frames++;

  // Make the snake respond to key events
  if (keystate[KEY_LEFT] && snake.direction !== RIGHT) snake.direction = LEFT;
  if (keystate[KEY_UP] && snake.direction !== DOWN) snake.direction = UP;
  if (keystate[KEY_RIGHT] && snake.direction !== LEFT) snake.direction = RIGHT;
  if (keystate[KEY_DOWN] && snake.direction !== UP) snake.direction = DOWN;

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
      init(); // Reset the game
      return; // Break out of the update loop\
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

function draw() {
  var tw = canvas.width / grid.width; // tile width
  var th = canvas.height / grid.height; // tile height

  // Loop through the grid
  for (var x=0; x < grid.width; x++) {
    for (var y=0; y< grid.height; y++) {
      switch (grid.get(x, y)) {
        case EMPTY:
          ctx.fillStyle = "#000";
          break;
        case SNAKE:
          ctx.fillStyle = "#fff";
          break;
        case FRUIT:
          ctx.fillStyle = "#0066FF";
          break;
      }

      // Fill the rect with the associated item
      ctx.fillRect(x * tw, y * th, tw, th);
    }
  }

  // Draw the score
  ctx.fillStyle = "#eee";
  ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
}



// Run the game
main();
