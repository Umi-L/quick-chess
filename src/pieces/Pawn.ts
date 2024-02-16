import type { Board } from "../Board";
import { Color } from "../Color";
import { Move } from "../Move";
import { PieceType } from "../PieceType";
import { Point } from "../Point";
import type { Game } from "../games/Game";
import { currentGame } from "../globals";
import { Piece } from "./Piece";


export class Pawn extends Piece {
    type: PieceType = PieceType.Pawn;
    color: Color;

    constructor(color: Color) {
        super();
        this.color = color;
    }

    getMoves(game: Game, board: Board, position: Point, ignoreColor: boolean, simulated: boolean): Array<Move> {
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


        // capture to the left or right
        let captureLogic = (offset: number) => {
            if (board.pointInBounds(new Point(position.x + offset, position.y + forward)) && board.board[position.x + offset][position.y + forward] != null && board.board[position.x + offset][position.y + forward]!.color !== this.color) {
                moves.push(new Move(new Point(position.x + offset, position.y + forward), this));
            }
        }


        // diagonal capture to the left
        captureLogic(-1);
        // diagonal capture to the right
        captureLogic(1);



        // en passant
        // if pawn is next to another pawn
        let enPassantLogic = (offset: number) => {
            if (board.pointInBounds(new Point(position.x + offset, position.y))) {
                const other = board.board[position.x + offset][position.y];
                if (other && other.type === PieceType.Pawn && other.color !== this.color) {
                    if (other.turnsSinceMoved === 0) {
                        let movePos = new Point(position.x + offset, position.y + forward);

                        board.pointInBounds(movePos);

                        // if no piece is there, add the move
                        if (board.board[movePos.x][movePos.y] === null) {
                            moves.push(new Move(movePos, this, () => {

                                board.board[position.x + offset][position.y] = null;


                            }));
                        }
                    }
                }
            }
        }

        // en passant to the left
        enPassantLogic(-1);
        // en passant to the right
        enPassantLogic(1);


        moves = this.applySpecialRules(game, position, moves, ignoreColor, simulated);


        return moves;
    }
}