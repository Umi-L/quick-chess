import type { Board } from "../Board";
import type { Color } from "../Color";
import { Move } from "../Move";
import type { PieceType } from "../PieceType";
import { Point } from "../Point";
import type { Game } from "../games/Game";
import { Piece } from "./Piece";

export abstract class SlidingPiece extends Piece {

    abstract offsets: [number, number][];

    getMoves(game: Game, board: Board, position: Point, ignoreColor: boolean, simulated: boolean): Array<Move> {
        let moves: Array<Move> = [];

        for (const [dx, dy] of this.offsets) {
            // while can move in the direction
            let point = new Point(position.x + dx, position.y + dy);
            while (point.x < board.width && point.x >= 0 && point.y < board.height && point.y >= 0) {
                const piece = board.board[point.x][point.y];
                if (piece === null) {
                    moves.push(new Move(point, this));
                } else {
                    if (piece.color !== this.color) {
                        moves.push(new Move(point, this));
                    }
                    break;
                }
                point = new Point(point.x + dx, point.y + dy);
            }
        }

        moves = this.applySpecialRules(game, position, moves, ignoreColor, simulated);


        return moves;
    }




}