function startGame() {
    window.location.href = 'game.html';
}

// Load the highest block from local storage

window.onload = function() {
    // Retrieve the highest score from localStorage
    const highestBlock = localStorage.getItem('highestBlock') || 0;
    document.getElementById('highestBlock').textContent = highestBlock;
}
