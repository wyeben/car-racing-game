const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const car = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 60,
    speed: 5,
};

const carImage = document.getElementById("carImage");

const obstacleCarImages = [
    document.getElementById("obstacleCar1Image"),
    document.getElementById("obstacleCar2Image"),
    document.getElementById("obstacleCar3Image"),
    document.getElementById("obstacleCar4Image")


];

function drawCar(x, y, width, height, image) {
    ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
}

let obstacles = [];
let score = 0;
let paused = false; 

function drawObstacles() {
    for (let obstacle of obstacles) {
        drawCar(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.image);
    }
}


function updateGame() {
    if (paused) return;

    const maxSpeed = 10;
    car.speed = 5 + Math.min(score / 10, maxSpeed);

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += car.speed;
        if (obstacles[i].y > canvas.height + obstacles[i].height / 2) {
            obstacles.splice(i, 1);
            i--;
            
            score++;
        }
    }

    const minDistance = 40;
    const bufferZone = 2;

    for (let obstacle of obstacles) {
        const carCenterX = car.x;
        const carCenterY = car.y;

        const obstacleCenterX = obstacle.x;
        const obstacleCenterY = obstacle.y;

        const distance = Math.sqrt(
            Math.pow(carCenterX - obstacleCenterX, 2) + Math.pow(carCenterY - obstacleCenterY, 2)
        );

        if (distance < minDistance - bufferZone) {
            alert("Game Over! Your score: " + score);
            resetGame();
        }
    }

    if (Math.random() < 0.02) {
        const obstacleWidth = 50;
        const obstacleHeight = 60;

        const obstacle = {
            x: Math.random() * (canvas.width - obstacleWidth),
            y: -30,
            width: obstacleWidth,
            height: obstacleHeight,
            image: obstacleCarImages[Math.floor(Math.random() * obstacleCarImages.length)],
        };

        obstacles.push(obstacle);
    }
}



function drawLanes() {
    ctx.fillStyle = "#000"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    const laneColor = "#888"; 
    const laneWidth = 10; 
    const numLanes = 7; 

    for (let i = 1; i < numLanes; i++) {
        const laneX = (canvas.width / numLanes) * i - laneWidth / 2;
        ctx.fillStyle = laneColor;
        ctx.fillRect(laneX, 0, laneWidth, canvas.height);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLanes(); 
    drawCar(car.x, car.y, car.width, car.height, carImage);
    drawObstacles();

    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText(paused ? "Paused" : "Press P to Pause", canvas.width - 160, 30);
}


function gameLoop() {
    updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    obstacles = [];
    score = 0;
    car.x = canvas.width / 2;
    car.y = canvas.height - 50;
}

function togglePause() {
    paused = !paused;
}

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && car.x - car.width / 2 > 0) {
        car.x -= car.speed;
    } else if (e.key === "ArrowRight" && car.x + car.width / 2 < canvas.width) {
        car.x += car.speed;
    } else if (e.key === "ArrowUp" && car.y - car.height / 2 > 0) {
        car.y -= car.speed;
    } else if (e.key === "ArrowDown" && car.y + car.height / 2 < canvas.height) {
        car.y += car.speed;
    } else if (e.key === "p" || e.key === "P") {
        togglePause();
    }
});


gameLoop();
