class Board {
    constructor(board_size, x, y) {
        this.board_size = board_size;
        this._cells = [];
        this.x = x;
        this.y = y;
        this.indent = 10;
        this._cell_size = (this.board_size - this.indent*5) / 4;
        this.cell_color = '#cdc1b4';
        this.background_color = '#bbada0';
    }

    _drawEmptyCell = (ctx, x, y) => {
        ctx.fillStyle = this.cell_color;
        ctx.beginPath();
        ctx.roundRect(x, y, this._cell_size, this._cell_size, 10);
        ctx.fill();
    }

    _drawCell = (ctx, cell) => {
        ctx.fillStyle = CELL_COLORS[cell.value-1];
        ctx.beginPath();
        ctx.roundRect(
            this.indent*cell.row + this._cell_size*(cell.row-1),
            this.indent*cell.col + this._cell_size*(cell.col-1),
            this._cell_size, 
            this._cell_size,
            10
        );
        ctx.fill();
    }

    _drawEmptyCells = (ctx) => {
        let cx = this.x + this.indent; 
        let cy = this.y + this.indent;

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this._drawEmptyCell(ctx, cx, cy);
                cx += this.indent + this._cell_size;
            }
            cx = this.x + this.indent; 
            cy += this._cell_size + this.indent;
        }
    }

    _drawCells(ctx) {
        for (let cell of this._cells) {
            this._drawCell(ctx, cell);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.background_color;
        ctx.fillRect(this.x, this.y, this.board_size, this.board_size);
        this._drawEmptyCells(ctx);
        this._drawCells(ctx);
    }

    setCells(cells) {
        this._cells = cells;
    }
    
}