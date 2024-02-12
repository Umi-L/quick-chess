import { writable, type Writable } from "svelte/store";
import { Point } from "./Point";
import { Board } from "./Board";
import type { Game } from "./games/Game";
import { Color } from "./Color";
import type { Move } from "./Move";

export let possibleMoves: Writable<Array<Move>> = writable([]);
export let selectedPiece: Writable<Point | undefined> = writable(undefined);
export let gameBoard: Writable<Board | undefined> = writable(undefined);
export let currentGame: Writable<Game | undefined> = writable(undefined);
export let turn: Writable<Color> = writable(Color.White);
export let myColor: Writable<Color> = writable(Color.White);
export let isHost: Writable<boolean> = writable(false);