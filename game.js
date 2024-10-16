// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Arreglo de colores
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Clase Ball (Pelota)
class Ball {
    constructor(x, y, radius, speedX, speedY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius; // Tamaños variados de las pelotas
        this.speedX = speedX * 2; // Velocidad X aumentada (pelotas más rápidas)
        this.speedY = speedY * 2; // Velocidad Y aumentada (pelotas más rápidas)
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Colisión con la parte superior e inferior
        if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
            this.speedY = -this.speedY;
        }

        // Colisión con los bordes laterales
        if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
            this.speedX = -this.speedX;
        }
    }

    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speedX = -this.speedX; // Cambia dirección al resetear
    }
}

// Clase Paddle (Paleta)
class Paddle {
    constructor(x, y, width, height, isPlayerControlled = false) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isPlayerControlled = isPlayerControlled;
        this.speed = 9;
    }

    draw() {
        ctx.fillStyle = this.isPlayerControlled ? 'blue' : 'green'; // Paleta azul para el jugador, verde para la IA
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'up' && this.y > 0) {
            this.y -= this.speed;
        } else if (direction === 'down' && this.y + this.height < canvas.height) {
            this.y += this.speed;
        }
    }

    autoMove(ball) {
        // IA que sigue la pelota automáticamente
        if (ball.y < this.y + this.height / 2) {
            this.y -= this.speed;
        } else if (ball.y > this.y + this.height / 2) {
            this.y += this.speed;
        }
    }
}

// Clase Game (Controla el juego)
class Game {
    constructor() {
        // Crear 5 pelotas con diferentes tamaños, velocidades y colores
        this.balls = [];
        for (let i = 0; i < 5; i++) {
            this.balls.push(new Ball(
                canvas.width / 2, 
                canvas.height / 2, 
                Math.random() * 20 + 10, // Tamaño aleatorio entre 10 y 30
                (Math.random() * 4) + 2, // Velocidad X aleatoria entre 2 y 6
                (Math.random() * 4) + 2, // Velocidad Y aleatoria entre 2 y 6
                colors[i] // Color de la pelota
            ));
        }
        
        // Crear una paleta controlada por el jugador de color azul, el doble de alta
        this.paddle1 = new Paddle(0, canvas.height / 2 - 100, 10, 200, true); // Paleta del jugador

        // Crear una paleta controlada por la IA en el lado derecho de la pantalla
        this.paddle2 = new Paddle(canvas.width - 10, canvas.height / 2 - 100, 10, 200, false); // Paleta de la IA
        
        this.keys = {}; // Para capturar las teclas
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.balls.forEach(ball => ball.draw()); // Dibujar las 5 pelotas
        this.paddle1.draw(); // Dibujar la paleta del jugador
        this.paddle2.draw(); // Dibujar la paleta de la IA
    }

    update() {
        this.balls.forEach(ball => {
            ball.move(); // Mover las 5 pelotas
            
            // Colisiones con la paleta del jugador
            if (ball.x - ball.radius <= this.paddle1.x + this.paddle1.width &&
                ball.y >= this.paddle1.y && ball.y <= this.paddle1.y + this.paddle1.height) {
                ball.speedX = -ball.speedX;
            }

            // Colisiones con la paleta de la IA
            if (ball.x + ball.radius >= this.paddle2.x &&
                ball.y >= this.paddle2.y && ball.y <= this.paddle2.y + this.paddle2.height) {
                ball.speedX = -ball.speedX;
            }
        });

        // Movimiento de la paleta 1 (Jugador) controlado por teclas
        if (this.keys['ArrowUp']) {
            this.paddle1.move('up');
        }
        if (this.keys['ArrowDown']) {
            this.paddle1.move('down');
        }

        // Movimiento de la paleta 2 (IA) que sigue la primera pelota
        this.paddle2.autoMove(this.balls[0]);
    }

    handleInput() {
        window.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    run() {
        this.handleInput();
        const gameLoop = () => {
            this.update();
            this.draw();
            requestAnimationFrame(gameLoop);
        };
        gameLoop();
    }
}

// Crear instancia del juego y ejecutarlo
const game = new Game();
game.run();
