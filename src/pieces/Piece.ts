import type { Board } from "../Board";
import type { Color } from "../Color";
import type { Move } from "../Move";
import type { PieceType } from "../PieceType";
import type { Point } from "../Point";
import type { Game } from "../games/Game";
import { currentGame } from "../globals";

export abstract class Piece {
    abstract type: PieceType;
    abstract color: Color;
    hasMoved: boolean = false;
    turnsSinceMoved: number | undefined;

    constructor() {

    }

    abstract getMoves(game: Game, board: Board, position: Point, ignoreColor: boolean, simulated: boolean): Array<Move>;

    applySpecialRules(game: Game, piecePosition: Point, moves: Array<Move>, ignoreColor: boolean, simulated: boolean): Move[] {
        game.specialRules.forEach((specialRule) => {
            // console.log("applying special rule: ");
            // console.log(specialRule);
            moves = specialRule(piecePosition, this, moves, ignoreColor, simulated);
        });

        return moves;
    }
}