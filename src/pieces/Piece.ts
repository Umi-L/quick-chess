import type { Board } from "../Board";
import type { Color } from "../Color";
import type { Move } from "../Move";
import type { PieceType } from "../PieceType";
import type { Point } from "../Point";
import { currentGame } from "../globals";

export abstract class Piece {
    abstract type: PieceType;
    abstract color: Color;
    hasMoved: boolean = false;
    turnsSinceMoved: number | undefined;

    abstract getMoves(board: Board, position: Point, ignoreColor: boolean): Array<Move>;

    applySpecialRules(moves: Array<Move>, ignoreColor: boolean): Move[] {
        currentGame.update((game) => {
            if (!game) return game;

            game.specialRules.forEach((specialRule) => {
                moves = specialRule(this, moves, ignoreColor);
            });

            return game;
        });

        return moves;
    }
}