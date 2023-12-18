const canvas = document.getElementById('game-screen');
const ctx = canvas.getContext('2d');

const score = document.getElementById('score')
const max_score = document.getElementById('max-score');
const new_game = document.getElementById('new-game-button');

canvas.width = WIDTH;
canvas.height = HEIGHT;

const board = new Board(canvas.width, 0, 0);
const game = new Game();
let isLose = false;

game.init();
board.setCells(game.getCells());

function load() {
    let saved_max_score = sessionStorage.getItem("max-score");
    max_score.innerHTML = (saved_max_score !== null) ? saved_max_score : '0';
}

function restartGame() {
    if (isLose) return true;
    return confirm(
        "Вы уверены, что хотите перезапустить игру?\n" +
        "Текущая игра и счет будут утеряны!!"
    );
}

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

function update() {
    game.turn();
    board.setCells(game.getCells());
    game.mergeCells();
    board.setCells(game.getCells());
    score.innerHTML = game.score.toString();
    maxScoreChanged();
    if (game.checkLose()) {
        isLose = true;
    }
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
    update();
}

function maxScoreChanged() {
    if (Number(score.innerHTML) > Number(max_score.innerHTML)) {
        max_score.innerHTML = score.innerHTML;
    }
}

window.addEventListener("keydown", keyDown);
new_game.addEventListener("click", (e) => {
    if (restartGame()) {
        window.location.reload();
    }
});



load();
const loop = setInterval(() => {
    gameLoop();
    if (isLose) {
        sessionStorage.setItem("max-score", max_score.innerHTML);
        alert("Ты проиграл((\nТвой результат:   " + game.score.toString());
        clearInterval(loop);
    }
}, 1000 / FPS);
