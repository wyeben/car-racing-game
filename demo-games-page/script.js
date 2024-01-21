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
carRacer();