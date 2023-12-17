const WIDTH = 500;
const HEIGHT = 500;

const FPS = 60;

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

const TRANSITON_CONFIG = {
    duration: 10
}

function* _getValues() {
    for (let i = 1; i < 18; i++) {
        yield 2**i;
    }
}