const canvas = document.getElementById('game-screen');
const ctx = canvas.getContext('2d');

canvas.width = WIDTH;
canvas.height = HEIGHT;

const board = new Board(canvas.width, 0, 0);

const clear = () => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const gameLoop = () => {
    clear();
    draw();
}

let draw = () => {
    board.draw(ctx);
}

setInterval(() => {
    gameLoop();
}, 1000 / FPS); 