<script lang="ts">
  import { onMount } from "svelte";
  import Square from "./Square.svelte";
  import type { Board } from "../Board";
  import type { Piece } from "../pieces/Piece";
  import type { Game } from "../games/Game";
  import { Point } from "../Point";
  import { currentGame, gameBoard, isHost, myColor } from "../globals";
  import { Color, getOppositeColor } from "../Color";

  export let game: Game;
  let boardState: Board;
  let boardLoaded: boolean = false;

  gameBoard.subscribe((value) => {
    if (value == undefined) return;

    boardState = value!;
    if (boardLoaded) updateBoard();
  });

  let isWhite: boolean;
  myColor.subscribe((value) => {
    isWhite = value == Color.White;
  });

  let container: HTMLDivElement;
  let boardElement: HTMLDivElement;

  // array of cells
  let cellArray: Array<Array<Square>> = [];

  let containerWidth: number;
  let containerHeight: number;

  let cellSize: number;

  onMount(async () => {
    gameBoard.set(game.board);

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

    window.onresize = () => {
      let containerBox = container.getBoundingClientRect();

      containerWidth = containerBox.width;
      containerHeight = containerBox.height;

      cellSize = Math.min(
        containerWidth / boardState.width,
        containerHeight / boardState.height
      );

      updateBoard();
    };
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

    let portrait = containerWidth < containerHeight;

    if (portrait) {
      boardElement.style.height = `${boardState.height * cellSize}px`;
    } else {
      boardElement.style.width = `${boardState.width * cellSize}px`;
    }
  }
</script>

<div class="container" bind:this={container}>
  <div class="board" bind:this={boardElement}></div>
</div>

<style>
  .board {
    background-color: red;
  }

  :global(.chess-board-row) {
    display: flex;
    flex-direction: row;
  }

  @media (orientation: portrait) {
    .container {
      height: 100%;
    }
  }

  @media (orientation: landscape) {
    .container {
      width: 100%;
    }
  }
</style>
