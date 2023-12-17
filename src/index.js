const canvas = document.getElementById('game-screen');
const ctx = canvas.getContext('2d');

const score = document.getElementById('score')

canvas.width = WIDTH;
canvas.height = HEIGHT;

let isLose = false;
const board = new Board(canvas.width, 0, 0);
const game = new Game();
game.init();
board.setCells(game.getCells());

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

function keyDown(e) {
    switch (e.keyCode) {
        case KEY.w:
        case KEY.up:
            console.log("w")
            game.setDirection(Direction.UP);
            break;
        case KEY.s:
        case KEY.down:
            console.log("s")
            game.setDirection(Direction.DOWN);
            break;
        case KEY.a:
        case KEY.left:
            console.log("a")
            game.setDirection(Direction.LEFT);
            break;
        case KEY.d:
        case KEY.right:
            console.log("d")
            game.setDirection(Direction.RIGHT);
            break;
    }
    game.turn();
    board.setCells(game.getCells());
    game.mergeCells();
    board.setCells(game.getCells());
    score.innerHTML = game.score.toString();
    if (game.checkLose()) {
        isLose = true;
    }
}

function transition(option) {

}

window.addEventListener("keydown", keyDown);

const loop = setInterval(() => {
    gameLoop();
    if (isLose) {
        alert("Ты проиграл((\nТвой результат:   " + game.score.toString());
        clearInterval(loop);
    }
}, 1000 / FPS);
