const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Cargar las imágenes
const playerImage = new Image();
playerImage.src = 'player.png';

const carImage = new Image();
carImage.src = 'car.png';

// Cargar la música de fondo
const backgroundMusic = new Audio('background-music.mp3'); // Reemplaza con la ruta de tu archivo de música
backgroundMusic.volume = 0.1;

// Definir el área de meta (zona de llegada)
const goalArea = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: 70, // Aumentar altura de la zona de meta
    color: 'yellow'
};

// Variables del juego
const player = {
    width: 40, // Ajusta el tamaño según la imagen
    height: 40,
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    speed: 5
};

const cars = [];
const carWidth = 60;  // Ajusta según el tamaño de tu imagen
const carHeight = 40;
const carSpeed = 3;

// Temporizador
let startTime = Date.now();
let elapsedTime = 0;

// Generar coches (obstáculos)
for (let i = 0; i < 7; i++) {  // Aumentar el número de coches ya que el área es más grande
    const car = {
        x: Math.random() * canvas.width,
        y: i * 80 + 100,  // Ajustamos la posición inicial para que los coches no colisionen con la meta
        speed: Math.random() * 2 + carSpeed
    };
    cars.push(car);
}

// Evento de teclas
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (event) => {
    if (event.key in keys) {
        keys[event.key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key in keys) {
        keys[event.key] = false;
    }
});

// Actualizar el movimiento del jugador
function updatePlayer() {
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

// Actualizar el movimiento de los coches
function updateCars() {
    cars.forEach((car) => {
        car.x += car.speed;
        if (car.x > canvas.width) {
            car.x = -carWidth;
        }
    });
}

// Comprobar colisiones con coches
function checkCollisions() {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        if (
            player.x < car.x + carWidth &&
            player.x + player.width > car.x &&
            player.y < car.y + carHeight &&
            player.y + player.height > car.y
        ) {
            // Colisión detectada - reiniciar jugador
            player.x = canvas.width / 2 - 20;
            player.y = canvas.height - 50;
            alert('¡Te chocaste! Cuidado.');
        }
    }
}

// Comprobar si el jugador ha llegado a la meta
function checkGoal() {
    if (player.y < goalArea.height) {
        // Si el jugador toca la zona de meta, el juego termina
        alert('¡Has ganado!');
        // Reiniciar posición del jugador
        player.x = canvas.width / 2 - 20;
        player.y = canvas.height - 50;
        // Reiniciar el tiempo
        startTime = Date.now();
    }
}

// Actualizar el tiempo transcurrido
function updateTime() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo en segundos
}

// Dibujar el juego (jugador, coches, zona de meta, reloj)
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la zona de meta
    ctx.fillStyle = goalArea.color;
    ctx.fillRect(goalArea.x, goalArea.y, goalArea.width, goalArea.height);

    // Dibujar el jugador (imagen)
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Dibujar los coches (imagen)
    cars.forEach((car) => {
        ctx.drawImage(carImage, car.x, car.y, carWidth, carHeight);
    });

    // Dibujar el reloj en la esquina superior derecha
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Tiempo: ${elapsedTime} s`, canvas.width - 150, 30);
}

// Bucle del juego
function gameLoop() {
    backgroundMusic.play();
    updatePlayer();
    updateCars();
    checkCollisions();
    checkGoal(); // Comprobar si se ha alcanzado la meta
    updateTime(); // Actualizar el tiempo transcurrido
    render();
    requestAnimationFrame(gameLoop);
}

// Esperar a que las imágenes y la música se carguen antes de iniciar el juego
playerImage.onload = () => {
    carImage.onload = () => {
         // Reproducir música de fondo
        gameLoop();  // Iniciar el bucle del juego cuando las imágenes estén listas
    };
};
