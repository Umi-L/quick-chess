import { Board } from "../Board";
import { Color } from "../Color";
import { Move } from "../Move";
import { Bishop } from "../pieces/Bishop";
import { King } from "../pieces/King";
import { Knight } from "../pieces/Knight";
import { Pawn } from "../pieces/Pawn";
import { Piece } from "../pieces/Piece";
import { Queen } from "../pieces/Queen";
import { Rook } from "../pieces/Rook";
import { Point } from "../Point";
import { gameBoard, myColor, possibleMoves, selectedPiece } from "../globals";
import { Game } from "./Game";
import { updateGame } from "../SupabaseManager";
import { PieceType } from "../PieceType";



export class BaseGame extends Game {
    specialRules: ((piecePosition: Point, piece: Piece, moves: Move[], ignoreColor: boolean) => Move[])[] = [];

    board!: Board;

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

    // function to be called when the game is loaded from the database re-initialize things that are lossy in json
    onLoad(): void {
        this.specialRules = [
            this.cantPlayMoveIfNotTurn,
            this.removeOpponentMoves,
            this.castle,
            // this.check,
        ]
    }

    constructor() {
        super();

        console.log("BaseGame constructor");

        this.specialRules = [
            this.cantPlayMoveIfNotTurn,
            this.removeOpponentMoves,
            this.castle,
            // this.check,
        ]
    }

    makeMove(move: Move): Board {
        if (move.callback) {
            move.callback();

            if (move.overrideAllBehavior) {
                return this.board;
            }
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

                this.updateTimeSinceMoved();

                piece.turnsSinceMoved = 0;

                this.board!.board[this.selected.x][this.selected.y] = null;

                this.updateValues();
            }
        }

        gameBoard.set(this.board!);

        return this.board!;
    }

    simulateMove(move: Move, piecePosition: Point): Board {

        console.log("simulateMove");

        if (move.callback) {
            move.callback();

            if (move.overrideAllBehavior) {
                return this.board;
            }
        }


        if (move.piece !== null) {
            this.board!.board[move.position.x][move.position.y] = move.piece;
            move.piece.hasMoved = true;

            this.updateTimeSinceMoved();

            move.piece.turnsSinceMoved = 0;

            this.board!.board[piecePosition.x][piecePosition.y] = null;
        }


        return this.board!;
    }
}