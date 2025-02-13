class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 520;
        this.canvas.height = 520;
        
        // 游戏配置
        this.gridSize = 20;
        this.snake = [];
        this.food = {};
        this.direction = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.isGameOver = false;
        this.isPaused = false;

        // 食物颜色配置
        this.foodColors = [
            '#FF5252', // 红
            '#FF4081', // 粉
            '#7C4DFF', // 紫
            '#536DFE', // 蓝
            '#64FFDA', // 青
            '#FF6E40', // 橙
        ];
        this.currentColor = '#81C784';
        
        // 速度控制
        this.speedRange = document.getElementById('speedRange');
        this.speedValue = document.getElementById('speedValue');
        this.speedRange.addEventListener('input', () => {
            this.speedValue.textContent = this.speedRange.value;
            if (this.gameLoop) {
                clearInterval(this.gameLoop);
                this.gameLoop = setInterval(() => this.update(), this.getGameSpeed());
            }
        });
        
        // 游戏遮罩层
        this.overlay = document.getElementById('gameOverlay');

        // 长按加速配置
        this.isKeyPressed = false;
        this.normalSpeed = null;
        this.speedMultiplier = 1.5;
        this.keyPressTimer = null;
        
        // 初始化事件监听
        this.initEventListeners();
        
        // 初始化按钮
        this.startBtn = document.getElementById('startBtn');
        this.startBtn.addEventListener('click', () => this.startGame());

        // 初始化游戏
        this.initGame();
    }

    initGame() {
        // 初始化蛇的位置
        this.snake = [
            {x: 6, y: 10},
            {x: 5, y: 10},
            {x: 4, y: 10}
        ];
        this.direction = 'right';
        this.generateFood();
        this.draw();
    }

    getGameSpeed() {
        const speed = 11 - parseInt(this.speedRange.value);
        return speed * 50; // 50ms - 500ms
    }

    initEventListeners() {
        document.addEventListener('keydown', (e) => {
            // 空格控制暂停
            if (e.code === 'Space') {
                this.togglePause();
                return;
            }
            
            // 游戏暂停时不响应方向键
            if (this.isPaused) return;
            
            // 防止重复触发
            if (e.repeat) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction !== 'down') this.direction = 'up';
                    this.startSpeedBoost();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction !== 'up') this.direction = 'down';
                    this.startSpeedBoost();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction !== 'right') this.direction = 'left';
                    this.startSpeedBoost();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction !== 'left') this.direction = 'right';
                    this.startSpeedBoost();
                    break;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                'w', 'W', 's', 'S', 'a', 'A', 'd', 'D'].includes(e.key)) {
                this.stopSpeedBoost();
            }
        });
    }

    togglePause() {
        if (this.isGameOver || !this.gameLoop) return;
        
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            clearInterval(this.gameLoop);
            this.overlay.style.display = 'flex';
            this.overlay.querySelector('.overlay-content').innerHTML = `
                <h3>游戏暂停</h3>
                <p>按空格键继续</p>
            `;
        } else {
            this.overlay.style.display = 'none';
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.getGameSpeed());
        }
    }

    startGame() {
        this.snake = [
            {x: 6, y: 10},
            {x: 5, y: 10},
            {x: 4, y: 10}
        ];
        this.direction = 'right';
        this.score = 0;
        this.isGameOver = false;
        this.isPaused = false;
        this.updateScore();
        this.generateFood();
        
        // 将开始按钮改为重新开始
        this.startBtn.textContent = '重新开始';
        // 移除按钮焦点
        this.startBtn.blur();
        
        this.overlay.style.display = 'none';
        this.isKeyPressed = false;
        this.normalSpeed = this.getGameSpeed();
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), this.getGameSpeed());
    }

    generateFood() {
        const x = Math.floor(Math.random() * (this.canvas.width / this.gridSize));
        const y = Math.floor(Math.random() * (this.canvas.height / this.gridSize));
        const colorIndex = Math.floor(Math.random() * this.foodColors.length);
        this.food = {x, y, color: this.foodColors[colorIndex]};
    }

    update() {
        if (this.isPaused) return;
        
        const head = {x: this.snake[0].x, y: this.snake[0].y};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.currentColor = this.food.color;
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    checkCollision(head) {
        // 检查墙壁碰撞
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            return true;
        }

        // 检查自身碰撞
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    draw() {
        // 清空画布
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格背景
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.lineWidth = 0.5;
        for (let i = 0; i <= this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
        }

        // 绘制蛇
        this.snake.forEach((segment, index) => {
            this.ctx.fillStyle = index === 0 ? this.currentColor : this.adjustColor(this.currentColor, 0.8);
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // 绘制食物
        this.ctx.fillStyle = this.food.color;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize/2,
            this.food.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    adjustColor(hex, factor) {
        // 将hex颜色变亮或变暗
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        
        return `rgba(${r},${g},${b},${factor})`;
    }

    gameOver() {
        if (this.isGameOver) return;
        
        clearInterval(this.gameLoop);
        this.isGameOver = true;
        
        // 更新最高分
        const highScore = localStorage.getItem('highScore') || 0;
        if (this.score > highScore) {
            localStorage.setItem('highScore', this.score);
            document.getElementById('high-score').textContent = this.score;
        }
        
        // 保存分数到排行榜
        this.saveScore();

        this.overlay.style.display = 'flex';
        this.overlay.querySelector('.overlay-content').innerHTML = `
            <h3>游戏结束</h3>
            <p>得分: ${this.score}</p>
            <p>点击"重新开始"按钮再试一次</p>
        `;
    }

    updateScore() {
        document.getElementById('current-score').textContent = this.score;
        const highScore = localStorage.getItem('highScore') || 0;
        document.getElementById('high-score').textContent = highScore;
    }

    saveScore() {
        const scores = JSON.parse(localStorage.getItem('scores') || '[]');
        scores.push({
            score: this.score,
            date: new Date().toISOString()
        });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem('scores', JSON.stringify(scores.slice(0, 3))); // 只保存前三名
        updateLeaderboard();
    }

    startSpeedBoost() {
        if (!this.isKeyPressed && this.gameLoop) {
            this.isKeyPressed = true;
            this.normalSpeed = this.getGameSpeed();
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.normalSpeed / this.speedMultiplier);
        }
    }

    stopSpeedBoost() {
        if (this.isKeyPressed && this.gameLoop) {
            this.isKeyPressed = false;
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.normalSpeed);
        }
    }
}

// 初始化游戏
const game = new SnakeGame(); 