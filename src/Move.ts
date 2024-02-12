import type { Point } from "./Point";
import type { Piece } from "./pieces/Piece";

export class Move {
    position: Point;
    piece: Piece;
    callback: (() => void) | undefined;

    constructor(position: Point, piece: Piece) {
        this.position = position;
        this.piece = piece;
    }
}