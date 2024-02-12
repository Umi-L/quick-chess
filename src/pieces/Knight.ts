import type { Color } from "../Color";
import { PieceType } from "../PieceType";
import { JumpingPiece } from "./JumpingPiece";

export class Knight extends JumpingPiece {
    offsets: [number, number][] = [
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2]
    ];
    type: PieceType = PieceType.Knight;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }
}