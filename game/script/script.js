const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const car = {
    x: canvas.width / 2,
    y: canvas.height - 70,
    width: 70,
    height: 110,
    speed: 5,
    lane: 3,
};

const carImage = document.getElementById("carImage");

const obstacleCarImages = Array.from({ length: 9 }, (_, i) => document.getElementById(`obstacleCar${i + 1}Image`));

const roadTexture = new Image();
roadTexture.src = "/images/road-image1.jpeg";

const pauseImage = new Image();
pauseImage.src = "/images/pause-image.webp";

const playImage = new Image();
playImage.src = "/images/play-image2.webp";

const gameSound = document.getElementById("gameSound");
let collisionSound = document.getElementById("collisionSound");
let collisionSoundPlaying = false; 
let obstacles = [];
let score = 0;
let paused = false;
let roadOffset = 0;

let countdown = 21;
let gameInterval;
let gameOverModal;
let soundMuted = true;
let initialScrollingCompleted = false;


roadTexture.onload = () => {
    roadOffset = canvas.height;
    initialScrollingCompleted = false;
    playGameSound();

    function drawCar(x, y, width, height, image) {
        ctx.drawImage(image, x - width / 2, y - height / 2, width, height);
    }

    function drawObstacles() {
        for (let obstacle of obstacles) {
            drawCar(obstacle.x, obstacle.y, obstacle.width, obstacle.height, obstacle.image);
        }
    }

    function playGameSound() {
        if (!soundMuted && !collisionSoundPlaying) {
            gameSound.play();
        }
    }

    function pauseGameSound() {
        gameSound.pause();
    }

    function toggleSound() {
        soundMuted = !soundMuted;

        if (soundMuted) {
            pauseGameSound();
        } else {
            playGameSound();
        }
    }



const collisionSound = document.getElementById("collisionSound");

function playCollisionSound() {
    if (!soundMuted && !collisionSoundPlaying) {
        pauseGameSound();
        collisionSoundPlaying = true; 
        collisionSound.play();
        collisionSound.onended = function () {
            collisionSoundPlaying = false; 
            // if (!paused) {
            //     playGameSound();
            // }
        };
    }
}



function updateGame() {
    if (paused) {
        pauseGameSound();
        return;
    }

    if (!gameSound.paused) {
        playGameSound();
    }

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

    const carHalfWidth = car.width / 2;
    const carHalfHeight = car.height / 2;

    let collision = false;

    for (let obstacle of obstacles) {
        const obstacleHalfWidth = obstacle.width / 2;
        const obstacleHalfHeight = obstacle.height / 2;

        const distanceX = Math.abs(car.x - obstacle.x);
        const distanceY = Math.abs(car.y - obstacle.y);

        if (distanceX < carHalfWidth + obstacleHalfWidth && distanceY < carHalfHeight + obstacleHalfHeight) {
            collision = true;
            break;
        }
    }

    if (collision) {
        playCollisionSound();
        displayGameOver();
        clearInterval(gameInterval);
        return;
    }

    if (Math.random() < 0.02) {
        const obstacleWidth = 70;
        const obstacleHeight = 110;
        const laneWidth = canvas.width / 6;
        const lane = car.lane;

        let obstacleOverlap = true;
        let newObstacle;

        for (let attempts = 0; attempts < 10 && obstacleOverlap; attempts++) {
            newObstacle = {
                x: laneWidth * lane + laneWidth / 2,
                y: -30,
                width: obstacleWidth,
                height: obstacleHeight,
                image: obstacleCarImages[Math.floor(Math.random() * obstacleCarImages.length)],
            };

            obstacleOverlap = obstacles.some((existingObstacle) => {
                const overlapDistanceX = Math.abs(newObstacle.x - existingObstacle.x);
                const overlapDistanceY = Math.abs(newObstacle.y - existingObstacle.y);
                return (
                    overlapDistanceX < newObstacle.width / 2 + existingObstacle.width / 2 &&
                    overlapDistanceY < newObstacle.height / 2 + existingObstacle.height / 2
                );
            });
        }

        if (!obstacleOverlap) {
            obstacles.push(newObstacle);
        }
    }


    // roadOffset -= car.speed;
    // if (roadOffset < -canvas.height) {
    //     roadOffset += canvas.height;
    // }
}

    

    function displayGameOver() {
        clearInterval(gameInterval);

        const modalContent = document.createElement("div");
        modalContent.style.position = 'absolute';
        modalContent.style.top = '50%';
        modalContent.style.left = '50%';
        modalContent.style.transform = 'translate(-50%, -50%)';
        modalContent.style.textAlign = 'center';
        modalContent.style.color = '#fff';
        modalContent.innerHTML = `<h1>Game Over</h1><h3>Score: ${score}</h3>
                                  <div class="game-over-btn"><button class="play-again"></button>
                                  <button class="go-back"></button></div>`;

        gameOverModal = document.createElement("div");
        gameOverModal.style.position = 'absolute';
        gameOverModal.style.width = '100%';
        gameOverModal.style.height = '100%';
        gameOverModal.style.background = 'rgba(255, 0, 0, 1)';
        gameOverModal.appendChild(modalContent);

        document.body.appendChild(gameOverModal);

        setTimeout(() => {
            gameOverModal.style.transition = 'background 0.5s ease'; 
            gameOverModal.style.background = 'rgba(255, 0, 0, 0)';
            
            setTimeout(() => {
                gameOverModal.style.background = 'rgba(255, 0, 0, 1)';
            }, 200);

            setTimeout(() => {
                gameOverModal.style.background = 'rgba(0, 0, 0, 0.5)'; 
            }, 300);
        }, 100); 
    
    }

    function drawLanes() {
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const numLanes = 6;
        const laneWidth = canvas.width / numLanes;
        const fullRoadHeight = canvas.height * 2;

        
        for (let i = -1; i <= numLanes; i++) {
            const laneX = laneWidth * i;
            ctx.drawImage(roadTexture, laneX, roadOffset % fullRoadHeight, laneWidth, fullRoadHeight);
        }
        if (!initialScrollingCompleted) {
        roadOffset -= car.speed;

        if (roadOffset <= -canvas.height) {
            roadOffset = -canvas.height;
            initialScrollingCompleted = true; 
        }
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

        const pausePlayImage = paused ? playImage : pauseImage;
        ctx.drawImage(pausePlayImage, canvas.width - 160, 30, 50, 40);
    }

    function gameLoop() {
        updateGame();
        draw();
    }

    function startGame() {
        countdown--;
        if (countdown > 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "200px Arial";
            ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);
            setTimeout(startGame, 1000);
        } else {
            toggleSound(); 
            setTimeout(() => {
            gameInterval = setInterval(gameLoop, 1000 / 60);
        }, 500);
            }
    }
    function resetGame() {
        obstacles = [];
        score = 0;
        car.x = canvas.width / 2;
        car.y = canvas.height - 50;
        roadOffset = 0;
    
        if (gameOverModal) {
            document.body.removeChild(gameOverModal);
        }
        toggleSound();
        startGame();
    } 

    function togglePause() {
        paused = !paused;
    }

    function goBack() {
        clearInterval(gameInterval);
        document.location.href = '../demo-games-page/demo-games-page.html';

        
    }

    document.body.addEventListener('click', (event) => {
        if (event.target.classList.contains('play-again')) {
            resetGame();
        } else if (event.target.classList.contains('go-back')) {
            goBack();
        }
    });

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
        } else if (e.key === "p" || e.key === "P" || e.key === " ") {
            togglePause();
            toggleSound();
        } else if (e.key === 'b' || e.key === 'B') {
            goBack();
        }
          else if (e.key === 's' || e.key === 'S') {
            toggleSound();
        }
          else if (e.key === 'd' || e.key === 'D') {
        }
          else if (e.key === 'c' || e.key === 'C') {
            car.speed -= 5;
          }
    });

    startGame();
};
