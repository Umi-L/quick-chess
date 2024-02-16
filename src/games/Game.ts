import type { Board } from "../Board";
import { Color, getOppositeColor } from "../Color";
import { Move } from "../Move";
import { PieceType } from "../PieceType";
import { Point } from "../Point";
import { updateGame } from "../SupabaseManager";
import { gameBoard, myColor, possibleMoves, selectedPiece, turn } from "../globals";
import type { Piece } from "../pieces/Piece";

export abstract class Game {
    abstract specialRules: Array<(piecePosition: Point, piece: Piece, moves: Array<Move>, ignoreColor: boolean, simulated: boolean) => Array<Move>>;
    abstract board: Board;
    turn: Color = Color.White;
    selected: Point | undefined;
    hostColor: Color = Color.White;

    abstract init(): Board;
    abstract onLoad(): void;

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
        turn.set(this.turn = getOppositeColor(this.turn));
    }

    abstract makeMove(move: Move): void;
    abstract simulateMove(move: Move, piecePosition: Point): void;

    removeOpponentMoves = (position: Point, piece: Piece, moves: Move[], ignoreColor: boolean) => {

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

    cantPlayMoveIfNotTurn = (position: Point, piece: Piece, moves: Move[], ignoreColor: boolean) => {
        if (!this.isMyTurn() && !ignoreColor) {
            return [];
        }

        return moves;
    }

    castle = (piecePosition: Point, piece: Piece, moves: Move[], ignoreColor: boolean): Move[] => {

        if (!this.isMyTurn() && !ignoreColor)
            return moves;

        // if piece is a king and hasn't moved
        if (piece.type == PieceType.King && piece.hasMoved == false) {
            // foreach piece left of the king
            for (let i = piecePosition.x - 1; i >= 0; i--) {
                const toCheckPiece = this.board.board[i][piecePosition.y];
                if (toCheckPiece !== null) {
                    if (toCheckPiece.type == PieceType.Rook && toCheckPiece.hasMoved == false) {
                        moves.push(new Move(new Point(piecePosition.x - 2, piecePosition.y), piece, () => {
                            this.castleLogic(piecePosition, piece, toCheckPiece, i);
                        }, true));
                    }
                    break;
                }
            }

            // foreach piece right of the king
            for (let i = piecePosition.x + 1; i < this.board.width; i++) {
                const toCheckPiece = this.board.board[i][piecePosition.y];
                if (toCheckPiece !== null) {
                    if (toCheckPiece.type == PieceType.Rook && toCheckPiece.hasMoved == false) {
                        moves.push(new Move(new Point(piecePosition.x + 2, piecePosition.y), toCheckPiece, () => {
                            this.castleLogic(piecePosition, piece, toCheckPiece, i);
                        }, true));
                    }
                    break;
                }
            }

        }

        return moves;
    }

    castleLogic = (piecePosition: Point, piece: Piece, rook: Piece, rookXPos: number): void => {

        console.log("castle move", rookXPos);

        let leftOrRight = rookXPos < piecePosition.x ? -1 : 1;

        // both pieces have moved
        piece.hasMoved = true;
        rook.hasMoved = true;

        this.updateTimeSinceMoved();

        // both pieces have moved this turn
        piece.turnsSinceMoved = 0;
        rook.turnsSinceMoved = 0;

        // set the king's position left 2 tiles
        this.board.board[piecePosition.x + 2 * leftOrRight][piecePosition.y] = this.board.board[piecePosition.x][piecePosition.y];

        // set the king's previous position to null
        this.board.board[piecePosition.x][piecePosition.y] = null;

        // move rook to new position.x +1
        this.board.board[piecePosition.x + 1 * leftOrRight][piecePosition.y] = this.board.board[rookXPos][piecePosition.y];

        // set position at i, piecePosition.y null to remove the rook
        this.board.board[rookXPos][piecePosition.y] = null;

        this.updateValues();
    }

    // check = (piecePosition: Point, piece: Piece, moves: Move[], ignoreColor: boolean): Move[] => {
    //     // simulate move and if its color is in check, remove the move
    //     let finalMoves: Move[] = [];

    //     for (const move of moves) {
    //         // create deep clone of the game
    //         let clone = Object.assign(Object.create(Object.getPrototypeOf(this)), this) as Game;

    //         clone.simulateMove(move, piecePosition);

    //         let nextMovePossibleMoves: Move[] = [];

    //         // foreach piece in the board
    //         for (let i = 0; i < clone.board.width; i++) {
    //             for (let j = 0; j < clone.board.height; j++) {
    //                 const piece = clone.board.board[i][j];
    //                 if (piece !== null) {
    //                     // add moves to the array 
    //                     let pieceMoves = piece.getMoves(clone, clone.board, piecePosition, false, true);
    //                     nextMovePossibleMoves = nextMovePossibleMoves.concat(pieceMoves);
    //                 }
    //             }
    //         }

    //         let isInCheck = false;

    //         // foreach move in the array
    //         for (let i = 0; i < nextMovePossibleMoves.length; i++) {
    //             const move = nextMovePossibleMoves[i];
    //             if (move.piece.type === PieceType.King) {
    //                 isInCheck = true;
    //                 break;
    //             }
    //         }

    //         if (!isInCheck) {
    //             finalMoves.push(move);
    //         }
    //     }

    //     return finalMoves;
    // }

    updateValues() {
        selectedPiece.set(undefined);
        possibleMoves.set([]);
        this.flipTurn();

        updateGame(this);
    }

    updateTimeSinceMoved() {
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
    }

    isMyTurn(): boolean {
        let color!: Color;
        myColor.update((value) => {
            color = value;
            return value;
        })

        return this.turn === color;
    }
}
