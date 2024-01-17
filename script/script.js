const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const car = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 60,
    speed: 5,
    lane: 3,
};

const carImage = document.getElementById("carImage");

const obstacleCarImages = [
    document.getElementById("obstacleCar1Image"),
    document.getElementById("obstacleCar2Image"),
    document.getElementById("obstacleCar3Image"),
    document.getElementById("obstacleCar4Image"),
    document.getElementById("obstacleCar5Image"),
    document.getElementById("obstacleCar6Image"),
    document.getElementById("obstacleCar7Image"),
    document.getElementById("obstacleCar8Image"),
    document.getElementById("obstacleCar9Image"),
];

const roadTexture = new Image();
roadTexture.src = "../images/road-image1.jpeg";

let obstacles = [];
let score = 0;
let paused = false;
let roadOffset = 0;

let countdown = 4; 

roadTexture.onload = () => {
    roadOffset = canvas.height;

    function drawCar(x, y, width, height, image) {
        ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
    }

    function drawObstacles() {
        for (let obstacle of obstacles) {
            drawCar(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.image);
        }
    }

    function startGame() {
        countdown--;
        if (countdown > 0) {
            ctx.fillStyle = "#fff";
            ctx.font = "40px Arial";
            ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
            setTimeout(startGame, 1000); 
        } else {
            setInterval(gameLoop, 1000 / 60);
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

            const laneWidth = canvas.width / 6;
            const lane = car.lane;

            const obstacle = {
                x: laneWidth * lane + laneWidth / 2,
                y: -30,
                width: obstacleWidth,
        
                height: obstacleHeight,
                image: obstacleCarImages[Math.floor(Math.random() * obstacleCarImages.length)],
            };

            obstacles.push(obstacle);
        }
        roadOffset -= car.speed;
        if (roadOffset < -canvas.height) {
            roadOffset += canvas.height;
        }
    }

    function drawLanes() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const numLanes = 6;
        const laneWidth = canvas.width / numLanes;
        const fullRoadHeight = canvas.height * 2;

        for (let i = -1; i <= numLanes; i++) {
            const laneX = laneWidth * i;
            ctx.drawImage(roadTexture, laneX, roadOffset % fullRoadHeight, laneWidth, fullRoadHeight);
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
    }

    function resetGame() {
        obstacles = [];
        score = 0;
        car.x = canvas.width / 2;
        car.y = canvas.height - 50;
        roadOffset = 0;
    }

    function togglePause() {
        paused = !paused;
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" && car.lane > 0) {
            car.lane--;
            car.x = (canvas.width / 6) * car.lane + (canvas.width / 6) / 2;
        } else if (e.key === "ArrowRight" && car.lane < 5) {
            car.lane++;
            car.x = (canvas.width / 6) * car.lane + (canvas.width / 6) / 2;
        } else if (e.key === "ArrowUp" && car.y - car.height / 2 > 0) {
            car.y -= car.speed;
        } else if (e.key === "ArrowDown" && car.y + car.height / 2 < canvas.height) {
            car.y += car.speed;
        } else if (e.key === "p" || e.key === "P") {
            togglePause();
        }
    });

    startGame();
};
