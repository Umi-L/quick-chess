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
}