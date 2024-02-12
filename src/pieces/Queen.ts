import type { Color } from "../Color";
import { PieceType } from "../PieceType";
import { SlidingPiece } from "./SlidingPiece";

export class Queen extends SlidingPiece {
    offsets: [number, number][] = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0]
    ];
    type: PieceType = PieceType.Queen;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}