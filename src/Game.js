class Game {
    constructor() {
        //[ {col: 1, row 2, value: 3}, {col: 1, row: 1, value: 4} ]
        this.board = this._initBoard();
        this._cells = [];
        this._free_cells = [];
        this._moved_cells = [];
        this._direction = Direction.OFF;
        this.score = 0;
    }

    init() {
        this._updateCells();
        this._createCell();
        this._createCell();
    }

    _initBoard() {
        let board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            board.push(new Array(BOARD_SIZE).fill({value: 0, count: 1}));
        }
        return board;
    }

    _createCell() {
        if (this._free_cells.length == 0) return;
        let value = randint(1, 2);
        let {col, row} = this._free_cells[randint(0, this._free_cells.length-1)];
        this.addCell({col: col, row: row, value: value});
    }

    _boardPush(col, row, value) {
        this.board[col][row] = {value: value, count: 1}
    }

    _boardPushEmpty(col, row) {
        this.board[col][row] = {value: 0, count: 0}
    } 

    mergeCells() {
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                let board_cell = this.board[i][j];
                if (this.board[i][j].count > 1) {
                    board_cell.value++;
                    this._boardPush(i, j, board_cell.value);
                    this.score += CELL_VALUES[board_cell.value-1];
                }
            }
        }
        this._moved_cells = [];
        this._updateCells();
    }

    _updateCells() {
        this._cells = [];
        this._free_cells = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                let value = this.board[i][j].value;
                if (value != 0) {
                    for (let p = 0; p < this.board[i][j].count; p++) {
                        this._cells.push({col: i+1, row: j+1, value: value});
                    }
                } 
                else {
                    this._free_cells.push({col: i+1, row: j+1});
                }
            }
        }
    }

    turn() {
        if (this._direction == Direction.OFF) return;
        let offset_sign = 0;
        let order = [];

        for (let i = 0; i < BOARD_SIZE; i++) {
            order.push(i);
        }
        switch (this._direction) {
            case Direction.UP:
            case Direction.LEFT:
                order.shift();
                offset_sign = -1;
                break;
            case Direction.DOWN:
            case Direction.RIGHT:
                order.pop();
                order.reverse();
                offset_sign = 1;
                break;
        }
        
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j of order) {
                if (this._direction == Direction.UP || this._direction == Direction.DOWN) {
                    this._moveByCol(offset_sign, j, i);
                }
                else {
                    this._moveByRow(offset_sign, i, j);
                }
                
            }
        }
        this._updateCells();
        if (this._moved_cells.length != 0) {
            this._createCell();
        }
        this._direction = Direction.OFF;
    }

    addCell(cell) {
        if (this.board[cell.col-1][cell.row-1].value == 0 && cell.value != 0) {
            this._cells.push(cell);
            this._boardPush(cell.col-1, cell.row-1, cell.value);
            let index = this._free_cells.findIndex((el, i, arr) => (el.col == cell.col && el.row == cell.row))
            this._free_cells.splice(index);
        }
    }

    _moveByRow(offset_sign, i, j) {
        let offset = 0;
        if (offset_sign == 0 || this.board[i][j].value == 0) return;

        while (j+offset+offset_sign < BOARD_SIZE && j+offset+offset_sign >= 0) {
            let curr = j+offset;
            let next = j+offset+offset_sign;
            let moveable = this._moveCellByOne(i, curr, i, next);
            if (moveable == 'not moved') break;
            offset += offset_sign;
            if (moveable == 'merged') break;
        }
        if (offset != 0) {
            this._moved_cells.push({col0: i, row0: j, col1: i, row1: j+offset});
        }
    }

    _moveByCol(offset_sign, i, j) {
        let offset = 0;
        if (offset_sign == 0 || this.board[i][j].value == 0) return;

        while (i+offset+offset_sign < BOARD_SIZE && i+offset+offset_sign >= 0) {
            let curr = i+offset;
            let next = i+offset+offset_sign;
            let moveable = this._moveCellByOne(curr, j, next, j);
            if (moveable == 'not moved') break;
            offset += offset_sign;
            if (moveable == 'merged') break;
        }
        if (offset != 0) {
            this._moved_cells.push({col0: i, row0: j, col1: i+offset, row1: j});
        }
    }

    _moveCellByOne(i1, j1, i2, j2) {
        let curr_value = this.board[i1][j1].value;
        let next_value = this.board[i2][j2].value;

        if (next_value != 0) {
            if (next_value == curr_value && this.board[i2][j2].count == 1) {
                //this._cells_to_merge.push({col: i2+1, row: j2+1, value: curr_value})
                this._boardPush(i2, j2, this.board[i1][j1].value);
                this._boardPushEmpty(i1, j1);
                this.board[i2][j2].count++;
                return 'merged'
            }
            return 'not moved';
        }
        this._boardPush(i2, j2, this.board[i1][j1].value);
        this._boardPushEmpty(i1, j1);
        return 'moved';
    }

    checkLose() {
        if (this._free_cells.length > 0) return false;
        for (let c = 1; c < 3; c++) {
            for (let i = 0; i < BOARD_SIZE-(c-1); i++) {
                for (let j = 0; j < BOARD_SIZE-(2-c); j++) {
                    let curr_cell = this.board[i][j];
                    if (curr_cell.value == this.board[i+(c-1)][j+(2-c)].value) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    setDirection(direction) {
        this._direction = direction;
    }

    getCells() {
        return this._cells;
    }
}

const cell = {
    value: 0,
    row: 0,
    col: 0,
};

const Direction = {
    OFF: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}