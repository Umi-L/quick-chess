import { Board } from "../Board";
import { Color } from "../Color";
import type { Move } from "../Move";
import { Bishop } from "../pieces/Bishop";
import { King } from "../pieces/King";
import { Knight } from "../pieces/Knight";
import { Pawn } from "../pieces/Pawn";
import { Piece } from "../pieces/Piece";
import { Queen } from "../pieces/Queen";
import { Rook } from "../pieces/Rook";
import type { Point } from "../Point";
import { gameBoard, myColor, possibleMoves, selectedPiece } from "../globals";
import { Game } from "./Game";



export class BaseGame extends Game {

    removeOpponentMoves = (piece: Piece, moves: Move[], ignoreColor: boolean) => {

        if (ignoreColor) {
            return moves;
        }

        let color: Color;
        myColor.update((value) => {
            color = value;
            return value;
        })

        // remove moves that are of the opposing color
        moves = moves.filter(move => move.piece.color === color);

        return moves;
    };

    cantPlayMoveIfNotTurn = (piece: Piece, moves: Move[], ignoreColor: boolean) => {

        if (ignoreColor) {
            return moves;
        }

        let color: Color = Color.White; // default value
        myColor.update((value) => {
            color = value;
            return value;
        })

        if (this.turn !== color) {
            return [];
        }

        return moves;
    }

    castle(piece: Piece, moves: Move[], ignoreColor: boolean): Move[] {
        return moves;
    }

    specialRules: ((piece: Piece, moves: Move[], ignoreColor: boolean) => Move[])[] = [
        this.cantPlayMoveIfNotTurn,
        this.removeOpponentMoves,
        this.castle,
    ];

    board: Board;

    init(): Board {
        this.board = new Board(8, 8);

        // White pieces
        this.board.board[0][0] = new Rook(Color.White);
        this.board.board[1][0] = new Knight(Color.White);
        this.board.board[2][0] = new Bishop(Color.White);
        this.board.board[4][0] = new Queen(Color.White);
        this.board.board[3][0] = new King(Color.White);
        this.board.board[5][0] = new Bishop(Color.White);
        this.board.board[6][0] = new Knight(Color.White);
        this.board.board[7][0] = new Rook(Color.White);

        for (let i = 0; i < 8; i++) {
            this.board.board[i][1] = new Pawn(Color.White);
        }

        // Black pieces
        this.board.board[0][7] = new Rook(Color.Black);
        this.board.board[1][7] = new Knight(Color.Black);
        this.board.board[2][7] = new Bishop(Color.Black);
        this.board.board[4][7] = new Queen(Color.Black);
        this.board.board[3][7] = new King(Color.Black);
        this.board.board[5][7] = new Bishop(Color.Black);
        this.board.board[6][7] = new Knight(Color.Black);
        this.board.board[7][7] = new Rook(Color.Black);

        for (let i = 0; i < 8; i++) {
            this.board.board[i][6] = new Pawn(Color.Black);
        }

        gameBoard.set(this.board);

        return this.board;
    }

    constructor() {
        super();
        this.board = this.init();
    }

    makeMove(move: Move): Board {
        if (move.callback) {
            move.callback();
            return this.board;
        }

        if (this.selected === undefined) {
            if (this.board!.board[move.position.x][move.position.y] !== null) {
                selectedPiece.set(move.position);
            }
        } else {
            const piece = this.board!.board[this.selected.x][this.selected.y];
            if (piece !== null) {
                console.log(move);
                this.board!.board[move.position.x][move.position.y] = piece;
                piece.hasMoved = true;

                // foreach piece in the board
                for (let i = 0; i < this.board!.width; i++) {
                    for (let j = 0; j < this.board!.height; j++) {
                        const piece = this.board!.board[i][j];
                        if (piece !== null) {
                            if (piece.turnsSinceMoved !== undefined) {
                                piece.turnsSinceMoved++;
                            }
                        }
                    }
                }

                piece.turnsSinceMoved = 0;

                this.board!.board[this.selected.x][this.selected.y] = null;
                selectedPiece.set(undefined);
                possibleMoves.set([]);
                this.flipTurn();


            }
        }

        gameBoard.set(this.board!);

        return this.board!;
    }

}