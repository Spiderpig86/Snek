
// Constants for the game
var COLS = 30, ROWS = 30;

// BLOCK STATE IDs
var EMPTY = 0, SNAKE = 1, FRUIT = 2;

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
      for (var j = 0; j < row; j++) {
        this._grid[x].push(dir)
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
    this.last = this.queue[0];
  },

  // Remove the snake from the canvas
  remove: function() {
    return this._queue.pop();
  }
}

function setFood() {
  var empty = [];
  for (var x=0; x<grid.width; x++) {
    for (var y=0; y<grid.height; y++) {
      if (grid.get(x,y) === EMPTY) {
        empty.push({x:x, y:y});
      }
    }
  }

  // Get a random element from the grid
  var randpos = empty[Math.floor(Math.random() * empty.length)];
}

function main() {

}

function init() {

}

function loop() {

}

function update() {

}

function draw() {

}
