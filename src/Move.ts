import type { Point } from "./Point";
import type { Piece } from "./pieces/Piece";

export class Move {
    position: Point;
    piece: Piece;
    callback: (() => void) | undefined;
    overrideAllBehavior: boolean = false;

    constructor(position: Point, piece: Piece, callback: (() => void) | undefined = undefined, overrideAllBehavior: boolean = false) {
        this.position = position;
        this.piece = piece;
        this.callback = callback;
        this.overrideAllBehavior = overrideAllBehavior;
    }
}