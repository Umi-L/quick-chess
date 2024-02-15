import type { Board } from "../Board";
import type { Color } from "../Color";
import { Move } from "../Move";
import type { PieceType } from "../PieceType";
import { Point } from "../Point";
import { Piece } from "./Piece";

export abstract class JumpingPiece extends Piece {

    abstract offsets: [number, number][];

    getMoves(board: Board, position: Point, ignoreColor: boolean): Array<Move> {
        let moves: Array<Move> = [];

        for (const [dx, dy] of this.offsets) {
            // while can move in the direction
            let point = new Point(position.x + dx, position.y + dy);

            // check if the point is within the board
            if (point.x < board.width && point.x >= 0 && point.y < board.height && point.y >= 0) {
                // check if the piece is null or the piece is of the opposite color
                const piece = board.board[point.x][point.y];

                if (piece === null) {
                    moves.push(new Move(point, this));
                    continue;
                }

                if (piece.color !== this.color) {
                    moves.push(new Move(point, this));
                }
            }

        }

        moves = this.applySpecialRules(moves, ignoreColor);

        return moves;
    }




}