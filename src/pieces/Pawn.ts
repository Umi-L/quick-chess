import type { Board } from "../Board";
import { Color } from "../Color";
import { Move } from "../Move";
import { PieceType } from "../PieceType";
import { Point } from "../Point";
import { Piece } from "./Piece";


export class Pawn extends Piece {
    type: PieceType = PieceType.Pawn;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }

    getMoves(board: Board, position: Point): Array<Move> {
        let moves: Array<Move> = [];
        const forward = this.color === Color.White ? 1 : -1;

        // if the square in front of the pawn is empty, it can move there
        if (board.board[position.x][position.y + forward] === null) {
            moves.push(new Move(new Point(position.x, position.y + forward), this));

            // if the pawn hasn't moved yet and the square two squares in front of the pawn is empty, it can move there
            if (!this.hasMoved && board.board[position.x][position.y + 2 * forward] === null) {
                moves.push(new Move(new Point(position.x, position.y + 2 * forward), this));
            }
        }


        // diagonal capture to the left
        if (board.pointInBounds(new Point(position.x - 1, position.y + forward)) && board.board[position.x - 1][position.y + forward] != null && board.board[position.x - 1][position.y + forward]!.color !== this.color) {
            moves.push(new Move(new Point(position.x - 1, position.y + forward), this));
        }

        // diagonal capture to the right
        if (board.pointInBounds(new Point(position.x + 1, position.y + forward)) && board.board[position.x + 1][position.y + forward] != null && board.board[position.x + 1][position.y + forward]!.color !== this.color) {
            moves.push(new Move(new Point(position.x + 1, position.y + forward), this));
        }

        moves = this.applySpecialRules(moves);


        return moves;
    }
}