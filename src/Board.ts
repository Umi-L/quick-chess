import type { Point } from "./Point";
import type { Piece } from "./pieces/Piece";

export class Board {
    width: number;
    height: number;
    board: (Piece | null)[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.board = new Array(height).fill(null).map(() => new Array(width).fill(null));
    }

    pointInBounds(point: Point): boolean {
        return point.x < this.width && point.x >= 0 && point.y < this.height && point.y >= 0;
    }

    printBoard() {
        let final = "";
        // foreach row and column
        for (let i = 0; i < this.width; i++) {
            let row = "";
            for (let j = 0; j < this.height; j++) {
                const piece = this.board[i][j];
                if (piece !== null) {

                    let turnsSinceMoved = piece.turnsSinceMoved ?? " ";
                    row += piece.type + piece.color + turnsSinceMoved + " ";
                } else {
                    row += "   ";
                }
            }
            final += row + "\n";
        }

        console.log(final);
    }
}