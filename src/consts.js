const WIDTH = 500;
const HEIGHT = 500;

const FPS = 15;

const BOARD_SIZE = 4;
const CELL_VALUES = [..._getValues()];
const CELL_COLORS = [
    '#eee3da', '#ecdfc7', '#f2b178', '#f49363',
    '#f57c5f', '#f75e3d', '#eccd72', '#edcd61',
    '#ecc74f', '#ecc341', '#ecc12e', '#ef666c',
    '#ed4e59', '#e14238', '#72b4d5', '#5c9fdf', 
    '#047cbe'
];

const KEY = {
    w: 87, s: 83, a: 65, d: 68,
    up: 38, down: 40, left: 37, right: 39
}

const SWIPE_LENGTH = 50;
const SwipeType = {
    OFF: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

function* _getValues() {
    for (let i = 1; i < 18; i++) {
        yield 2**i;
    }
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min+1) + min);
}