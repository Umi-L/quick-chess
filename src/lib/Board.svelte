<script lang="ts">
  import { onMount } from "svelte";
  import Square from "./Square.svelte";
  import type { Board } from "../Board";
  import type { Piece } from "../pieces/Piece";
  import type { Game } from "../games/Game";
  import { Point } from "../Point";
  import { currentGame, gameBoard, isHost, myColor } from "../globals";
  import { createGame } from "../SupabaseManager";
  import { getOppositeColor } from "../Color";

  export let game: Game;
  let boardState: Board;
  let boardLoaded: boolean = false;

  gameBoard.subscribe((value) => {
    if (value == undefined) return;

    boardState = value!;
    if (boardLoaded) updateBoard();
  });

  let isWhite: boolean = true;

  let container: HTMLDivElement;
  let boardElement: HTMLDivElement;

  // array of cells
  let cellArray: Array<Array<Square>> = [];

  let containerWidth: number;
  let containerHeight: number;

  let cellSize: number;

  onMount(() => {
    currentGame.set(game);
    game.init();

    let containerBox = container.getBoundingClientRect();

    containerWidth = containerBox.width;
    containerHeight = containerBox.height;

    // cells should be squares
    // calculate the size of each cell so that they fit on screen and are squares
    cellSize = Math.min(
      containerWidth / boardState.width,
      containerHeight / boardState.height
    );

    generateBoard();

    isHost.set(true);
    myColor.set(isHost ? game.hostColor : getOppositeColor(game.hostColor));
    createGame(game);
  });

  function generateBoard(): void {
    for (let y = 0; y < boardState.height; y++) {
      cellArray[y] = [];
      let row = document.createElement("div");
      row.classList.add("chess-board-row");
      for (let x = 0; x < boardState.width; x++) {
        let gameY = isWhite ? boardState.height - y - 1 : y;
        let gameX = isWhite ? boardState.width - x - 1 : x;

        cellArray[y][x] = new Square({
          target: row,
          props: {
            gamePosition: new Point(gameX, gameY),
            width: containerWidth / boardState.width,
            height: containerHeight / boardState.height,
            isWhite: (y + x) % 2 === 0,
            piece: boardState.board[gameX][gameY],
          },
        });
      }

      boardElement.appendChild(row);
    }

    let portrait = containerWidth < containerHeight;

    if (portrait) {
      boardElement.style.height = `${boardState.height * cellSize}px`;
    } else {
      boardElement.style.width = `${boardState.width * cellSize}px`;
    }

    boardLoaded = true;
  }

  function updateBoard(): void {
    for (let y = 0; y < boardState.height; y++) {
      for (let x = 0; x < boardState.width; x++) {
        let gameY = isWhite ? boardState.height - y - 1 : y;
        let gameX = isWhite ? boardState.width - x - 1 : x;
        let piece: Piece | null = boardState.board[gameX][gameY];

        if (piece) {
          cellArray[y][x].$set({ piece: piece });
        } else {
          cellArray[y][x].$set({ piece: null });
        }

        cellArray[y][x].$set({
          width: containerWidth / boardState.width,
          height: containerHeight / boardState.height,
        });
      }
    }
  }
</script>

<div class="container" bind:this={container}>
  <div class="board" bind:this={boardElement}></div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }

  .board {
    background-color: red;
  }

  :global(.chess-board-row) {
    display: flex;
    flex-direction: row;
  }
</style>
