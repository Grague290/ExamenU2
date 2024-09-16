const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


const playerImage = new Image();
playerImage.src = 'player.png';

const carImage = new Image();
carImage.src = 'car.png';


const goalArea = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: 50, 
    color: 'yellow'
};


const player = {
    width: 40, 
    height: 40,
    x: canvas.width / 2 - 20,
    y: canvas.height - 50,
    speed: 5
};

const cars = [];
const carWidth = 60;  
const carHeight = 40;
const carSpeed = 3;


for (let i = 0; i < 5; i++) {
    const car = {
        x: Math.random() * canvas.width,
        y: i * 80 + 50,
        speed: Math.random() * 2 + carSpeed
    };
    cars.push(car);
}


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


function updateCars() {
    cars.forEach((car) => {
        car.x += car.speed;
        if (car.x > canvas.width) {
            car.x = -carWidth;
        }
    });
}


function checkCollisions() {
    for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        if (
            player.x < car.x + carWidth &&
            player.x + player.width > car.x &&
            player.y < car.y + carHeight &&
            player.y + player.height > car.y
        ) {
            
            player.x = canvas.width / 2 - 20;
            player.y = canvas.height - 50;
            alert('¡Te chocaste! Cuidado.');
        }
    }
}


function checkGoal() {
    if (player.y < goalArea.height) {
       
        alert('¡Has ganado!');
       
        player.x = canvas.width / 2 - 20;
        player.y = canvas.height - 50;
    }
}


function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

   
    ctx.fillStyle = goalArea.color;
    ctx.fillRect(goalArea.x, goalArea.y, goalArea.width, goalArea.height);

    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    cars.forEach((car) => {
        ctx.drawImage(carImage, car.x, car.y, carWidth, carHeight);
    });
}


function gameLoop() {
    updatePlayer();
    updateCars();
    checkCollisions();
    checkGoal(); 
    render();
    requestAnimationFrame(gameLoop);
}


playerImage.onload = () => {
    carImage.onload = () => {
        gameLoop(); }
};
