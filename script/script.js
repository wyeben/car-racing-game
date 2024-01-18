function startDisplay() {
    var images = [
        "./images/game-clip1.jpg",
        "./images/game-clip2.PNG",
        "./images/game-clip3.webp",
        "./images/game-clip4.jpg",
        "./images/game-clip5.jpg",
        "./images/game-clip7.jpg",
        "./images/game-clip8.jpg",
        "./images/game-clip9.jpeg",
        "./images/game-clip10.jpg",
        "./images/game-clip11.webp",
        "./images/game-clip12.jpg",
        "./images/game-clip13.webp"
    ];
    var currentIndex = 0;

    var imageElements = document.querySelectorAll(".image1");

    function showNextImage() {
        imageElements.forEach(function(image, index) {
            if (index === currentIndex) {
                image.style.visibility = "visible";
                image.style.opacity = 1;
            } else {
                image.style.visibility = "hidden";
                image.style.opacity = 0;
            }
        });

        currentIndex = (currentIndex + 1) % images.length;
    }

    setInterval(showNextImage, 3000);
};

function writeUpDisplay() {
    var gameHubText = document.getElementById("gameHubText");

    function toggleEffects() {
        gameHubText.classList.remove("write-effect", "delete-effect");
        void gameHubText.offsetWidth; 
        gameHubText.classList.add("write-effect");
        setTimeout(function() {
            gameHubText.classList.add("delete-effect");
        }, 5000);
    }

    setInterval(toggleEffects, 10000); 
};

const sideButton = document.querySelector('.play-demo');
sideButton.addEventListener('click', () => {
    document.location.href = '../game/index.html';
})

startDisplay();
writeUpDisplay();

