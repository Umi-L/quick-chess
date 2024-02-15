import type { Board } from "../Board";
import { Color } from "../Color";
import type { Move } from "../Move";
import type { Point } from "../Point";
import { gameBoard, selectedPiece, turn } from "../globals";
import type { Piece } from "../pieces/Piece";

export abstract class Game {
    abstract specialRules: Array<(piece: Piece, moves: Array<Move>, ignoreColor: boolean) => Array<Move>>;
    abstract board: Board;
    turn: Color = Color.White;
    selected: Point | undefined;
    hostColor: Color = Color.White;

    abstract init(): Board;

    constructor() {
        turn.subscribe((value) => {
            this.turn = value;
        });

        gameBoard.subscribe((value) => {
            if (!value) return;

            this.board = value;
        });

        selectedPiece.subscribe((value) => {
            this.selected = value;
        });
    }

    flipTurn(): void {
        turn.set(this.turn === Color.White ? Color.Black : Color.White);
    }

    abstract makeMove(move: Move): void;
}
