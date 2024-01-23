function carRacer(){
    const playDemoBtn = document.querySelector('.play-demo-btn');
    playDemoBtn.addEventListener('click', () => {
        document.location.href = '../game/index.html';
    })
    const backBtn = document.querySelector('.back-btn');
    backBtn.addEventListener('click', () => {
        document.location.href = '../index.html';
    })
}

const howToPlayToggle = document.getElementById('how-to-play-toggle');
const gameInstructions = document.querySelector('.game-instructions');

        howToPlayToggle.addEventListener('click', function() {
            if (gameInstructions.style.display === 'none') {
                gameInstructions.style.display = 'block';
            } else {

                gameInstructions.style.display = 'none';
            }
        });
carRacer();