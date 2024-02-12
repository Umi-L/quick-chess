import type { Color } from "../Color";
import { PieceType } from "../PieceType";
import { JumpingPiece } from "./JumpingPiece";

export class King extends JumpingPiece {
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
    type: PieceType = PieceType.King;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}