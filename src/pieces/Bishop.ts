import type { Color } from "../Color";
import { PieceType } from "../PieceType";
import { SlidingPiece } from "./SlidingPiece";

export class Bishop extends SlidingPiece {
    offsets: [number, number][] = [
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1]
    ];
    type: PieceType = PieceType.Bishop;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}