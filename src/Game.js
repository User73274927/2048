class Game {
    constructor() {
        //[ {col: 1, row 2, value: 3}, {col: 1, row: 1, value: 4} ]
        this.board = this._initBoard();
        this._cells = [];
        this._direction = Direction.OFF;
    }

    _initBoard() {
        let board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            board.push(new Array(BOARD_SIZE).fill({value: 0, count: 1}));
        }
        return board;
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
                    this._boardPush(i, j, ++board_cell.value);
                }
            }
        }
        this._updateCells();
    }

    _updateCells() {
        this._cells = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                let value = this.board[i][j].value;
                if (value != 0) {
                    for (let p = 0; p < this.board[i][j].count; p++) {
                        this._cells.push({col: i+1, row: j+1, value: value});
                    }
                }
            }
        }
        console.log(this._cells);
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
        this._direction = Direction.OFF;
    }

    addCell(cell) {
        if (this.board[cell.col-1][cell.row-1].value == 0 && cell.value != 0) {
            this._cells.push(cell);
            this._boardPush(cell.col-1, cell.row-1, cell.value);
        }
    }

    _moveByRow(offset_sign, i, j) {
        let offset = 0;
        if (offset_sign == 0 || this.board[i][j].value == 0) return;

        while (j+offset+offset_sign < BOARD_SIZE && j+offset+offset_sign >= 0) {
            let curr = j+offset;
            let next = j+offset+offset_sign;
            let moveable = this._moveCellByOne(i, curr, i, next);
            if (!moveable) break;
            offset += offset_sign;
        }
    }

    _moveByCol(offset_sign, i, j) {
        let offset = 0;
        if (offset_sign == 0 || this.board[i][j] == 0) return;

        while (i+offset+offset_sign < BOARD_SIZE && i+offset+offset_sign >= 0) {
            let curr = i+offset;
            let next = i+offset+offset_sign;
            let moveable = this._moveCellByOne(curr, j, next, j);
            if (!moveable) break;
            offset += offset_sign;
        }
    }

    _moveCellByOne(i1, j1, i2, j2) {
        let curr_value = this.board[i1][j1].value;
        let next_value = this.board[i2][j2].value;

        if (next_value != 0) {
            if (next_value == curr_value) {
                //this._cells_to_merge.push({col: i2+1, row: j2+1, value: curr_value})
                this._boardPush(i2, j2, this.board[i1][j1].value);
                this._boardPushEmpty(i1, j1);
                this.board[i2][j2].count++;
            }
            return false;
        }
        this._boardPush(i2, j2, this.board[i1][j1].value);
        this._boardPushEmpty(i1, j1);
        return true;
    }

    _cells_remove(cell) {
        let index = this._cells.indexOf(cell);
        if (index !== -1) {
            this._cells.splice(index);
        }
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