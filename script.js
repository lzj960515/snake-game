class SnakeGame {
  constructor() {
    this.boardSize = 20;
    this.board = document.getElementById('game-board');
    this.scoreElement = document.getElementById('score');
    this.startBtn = document.getElementById('start-btn');
    this.snake = [{ x: 10, y: 10 }];
    this.food = null;
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameInterval = null;
    this.isPaused = false;

    this.initializeBoard();
    this.setupEventListeners();
  }

  initializeBoard() {
    this.board.innerHTML = '';
    for (let i = 0; i < this.boardSize * this.boardSize; i++) {
      const cell = document.createElement('div');
      this.board.appendChild(cell);
    }
  }

  setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    this.startBtn.addEventListener('click', () => {
      this.startGame();
    });
  }

  handleKeyPress(event) {
    const key = event.key;

    if (key === ' ') {
      this.togglePause();
      return;
    }

    const directions = {
      'ArrowUp': 'up',
      'ArrowDown': 'down',
      'ArrowLeft': 'left',
      'ArrowRight': 'right'
    };

    if (key in directions) {
      const newDirection = directions[key];
      const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
      };

      if (this.direction !== opposites[newDirection]) {
        this.nextDirection = newDirection;
      }
    }
  }

  togglePause() {
    if (this.gameInterval) {
      if (this.isPaused) {
        this.gameInterval = setInterval(this.gameLoop.bind(this), 150);
        this.isPaused = false;
      } else {
        clearInterval(this.gameInterval);
        this.isPaused = true;
      }
    }
  }

  startGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.isPaused = false;

    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }

    this.generateFood();
    this.gameInterval = setInterval(this.gameLoop.bind(this), 150);
    this.startBtn.textContent = '重新开始';
  }

  generateFood() {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * this.boardSize),
        y: Math.floor(Math.random() * this.boardSize)
      };
    } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    this.food = newFood;
  }

  gameLoop() {
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    if (this.checkCollision(head)) {
      this.endGame();
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreElement.textContent = this.score;
      this.generateFood();
    } else {
      this.snake.pop();
    }

    this.updateBoard();
  }

  checkCollision(head) {
    return (
      head.x < 0 ||
      head.x >= this.boardSize ||
      head.y < 0 ||
      head.y >= this.boardSize ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
  }

  updateBoard() {
    const cells = this.board.children;

    // 清除所有单元格的类
    for (let cell of cells) {
      cell.className = '';
    }

    // 绘制蛇
    this.snake.forEach(segment => {
      const index = segment.y * this.boardSize + segment.x;
      if (cells[index]) {
        cells[index].classList.add('snake');
      }
    });

    // 绘制食物
    const foodIndex = this.food.y * this.boardSize + this.food.x;
    if (cells[foodIndex]) {
      cells[foodIndex].classList.add('food');
    }
  }

  endGame() {
    clearInterval(this.gameInterval);
    alert(`游戏结束！得分：${this.score}`);
    this.startBtn.textContent = '开始游戏';
  }
}

// 初始化游戏
const game = new SnakeGame(); 