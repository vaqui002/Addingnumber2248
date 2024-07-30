function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        outcome: params.get('outcome'),
        score: params.get('score'),
        highestBlock: params.get('highestBlock')
    };
}

window.onload = function() {
    const { outcome, score, highestBlock } = getQueryParams();
    document.getElementById('resultOutcome').textContent = outcome === 'win' ? 'You Win!' : 'Game Over';
    document.getElementById('resultScore').textContent = `Score: ${score}`;
    document.getElementById('resultHighestBlock').textContent = `Highest Block: ${highestBlock}`;
};

function restartGame() {
    window.location.href = 'game.html';
}
