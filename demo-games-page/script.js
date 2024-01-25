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

function displayInstruction(){
    const howToPlayToggle = document.getElementById('how-to-play-toggle');
    const gameInstructions = document.querySelector('.game-instructions');

        howToPlayToggle.addEventListener('click', function() {
            if(gameInstructions.innerHTML.trim() === ''){
                gameInstructions.innerHTML = `<p>Move Right: Use the Arrow Right key.</p>
                <p>Move Left: Use the Arrow Left key.</p>
                <p>Move Up: Use the Arrow Up key.</p>
                <p>Move Down: Use the Arrow Down key.</p>
    
                <p>Pause/Play: Press P or Space Bar.</p>
                <p>Return to Menu: Press B</p>`
            }else if (howToPlayToggle){
                gameInstructions.innerHTML = '';
            }
        })};

displayInstruction();        
carRacer();