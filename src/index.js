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

//for mobile
let touch_down_x, touch_down_y;
let touch_up_x, touch_up_y;


function load() {
    let saved_max_score = sessionStorage.getItem("max-score");
    max_score.innerHTML = (saved_max_score !== null) ? saved_max_score : '0';

    //All event listeners
    window.addEventListener("keydown", keyDown);
    canvas.addEventListener("touchstart", touchDown);
    canvas.addEventListener("touchend", touchUp);
    canvas.addEventListener('touchmove', scrollOff);
    canvas.addEventListener("touchcancel", touchCancel);
    new_game.addEventListener("click", (e) => {
        if (restartGame()) {
            window.location.reload();
        }
    });

}

function scrollOff(e) {
    e.preventDefault();
}

function scrollOn() {
    document.body.style.overflow = "auto";
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
    e.preventDefault();
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

function touchDown(e) {
    touch_down_x = e.changedTouches[0].clientX;
    touch_down_y = e.changedTouches[0].clientY;
}

function touchUp(e) {
    touch_up_x = e.changedTouches[0].clientX;
    touch_up_y = e.changedTouches[0].clientY;

    switch (defineSwipe()) {
        case SwipeType.UP:
            game.setDirection(Direction.UP);
            break;
        case SwipeType.DOWN:
            game.setDirection(Direction.DOWN);
            break;
        case SwipeType.LEFT:
            game.setDirection(Direction.LEFT);
            break;
        case SwipeType.RIGHT:
            game.setDirection(Direction.RIGHT);
            break;
    }
    update();
    touchReset(e);
}

function touchCancel(e) {
    touchReset(e);
}

function touchReset(e) {
    touch_down_x = touch_up_x = 0;
    touch_down_y = touch_up_y = 0;
}

function defineSwipe() {
    let deltaX = touch_up_x - touch_down_x;
    let deltaY = touch_up_y - touch_down_y;

    if (Math.abs(deltaX) < SWIPE_LENGTH && Math.abs(deltaY) < SWIPE_LENGTH) {
        return SwipeType.OFF;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        //swipe by x
        return (deltaX > 0) ? SwipeType.RIGHT : SwipeType.LEFT;
    }
    else {
        //swipe by y
        return (deltaY < 0) ? SwipeType.UP : SwipeType.DOWN;
    }
}

function maxScoreChanged() {
    if (Number(score.innerHTML) > Number(max_score.innerHTML)) {
        max_score.innerHTML = score.innerHTML;
    }
}

function main() {
    window.onload = load;
    game.init();
    board.setCells(game.getCells());

    const loop = setInterval(() => {
        gameLoop();
        if (isLose) {
            sessionStorage.setItem("max-score", max_score.innerHTML);
            alert("Ты проиграл((\nТвой результат:   " + game.score.toString());
            clearInterval(loop);
        }
    }, 1000 / FPS);
}

main();
