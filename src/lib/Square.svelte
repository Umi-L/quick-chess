<script lang="ts">
  import { onMount } from "svelte";
  import type { Point } from "../Point";
  import type { Piece } from "../pieces/Piece";
  import {
    currentGame,
    gameBoard,
    ghostMoves,
    possibleMoves,
    selectedPiece,
  } from "../globals";
  import type { Game } from "../games/Game";
  import type { Board } from "../Board";
  import type { Move } from "../Move";

  let wrapper: HTMLDivElement;
  let squareElement: HTMLDivElement;
  let dragging = false;

  export let width: number;
  export let height: number;

  export let isWhite: boolean;

  export let piece: Piece | null;

  export let gamePosition: Point;

  let isSelected: boolean = false;
  let possibleMove: Move | undefined;
  let ghostMove: Move | undefined;

  selectedPiece.subscribe((value) => {
    if (value == gamePosition) {
      isSelected = true;
    } else {
      isSelected = false;
    }
  });

  ghostMoves.subscribe((value) => {
    // find pos where move is same
    ghostMove = value.find((move) => {
      return (
        move.position.x == gamePosition.x && move.position.y == gamePosition.y
      );
    });
  });

  possibleMoves.subscribe((value) => {
    // find pos where move is same
    possibleMove = value.find((move) => {
      return (
        move.position.x == gamePosition.x && move.position.y == gamePosition.y
      );
    });
  });

  let game: Game;
  currentGame.subscribe((value) => {
    game = value!;
  });

  let board: Board;
  gameBoard.subscribe((value) => {
    board = value!;
  });

  function handleMouseDown(event: MouseEvent): void {
    if (possibleMove) {
      game.makeMove(possibleMove);
    } else {
      selectedPiece.set(undefined);
      possibleMoves.set([]);
      ghostMoves.set([]);
    }

    if (!piece) return;
    selectedPiece.set(gamePosition);
    let moves = piece.getMoves(board, gamePosition, false);
    let _ghostMoves = piece.getMoves(board, gamePosition, true);

    console.log(moves);
    possibleMoves.set(moves);
    ghostMoves.set(_ghostMoves);

    dragging = true;

    wrapper.style.width = wrapper.offsetWidth + "px";
    wrapper.style.height = wrapper.offsetHeight + "px";

    wrapper.style.position = "absolute";
    wrapper.style.zIndex = "1000";
    wrapper.style.left =
      event.clientX -
      squareElement.getBoundingClientRect().left -
      wrapper.offsetWidth / 2 +
      "px";
    wrapper.style.top =
      event.clientY -
      squareElement.getBoundingClientRect().top -
      wrapper.offsetHeight / 2 +
      "px";
  }

  function handleMouseMove(event: MouseEvent): void {
    if (dragging) {
      wrapper.style.left =
        event.clientX -
        squareElement.getBoundingClientRect().left -
        wrapper.offsetWidth / 2 +
        "px";
      wrapper.style.top =
        event.clientY -
        squareElement.getBoundingClientRect().top -
        wrapper.offsetHeight / 2 +
        "px";
    }
  }

  function handleMouseUp(event: MouseEvent): void {
    dragging = false;

    // if mouse is over this square, move the piece
    let myRect = squareElement.getBoundingClientRect();
    if (
      event.clientX > myRect.left &&
      event.clientX < myRect.right &&
      event.clientY > myRect.top &&
      event.clientY < myRect.bottom &&
      possibleMove
    ) {
      game.makeMove(possibleMove);
    }

    // clear the styles
    wrapper.style.position = "";
    wrapper.style.zIndex = "";
    wrapper.style.left = "";
    wrapper.style.top = "";
    wrapper.style.width = "";
    wrapper.style.height = "";
  }

  onMount(() => {
    wrapper.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  });
</script>

<div
  style={`width: ${width}px; height: ${height}px;`}
  class="square"
  class:white={isWhite}
  class:black={!isWhite}
>
  <div
    class="square"
    class:selected-display={isSelected}
    bind:this={squareElement}
  >
    <div class="wrapper" bind:this={wrapper}>
      <div class="move-display-wrapper">
        <div
          class:possible-move-display={possibleMove != undefined}
          class:ghost-move-display={possibleMove == undefined &&
            ghostMove != undefined}
        ></div>
      </div>
      {#if piece}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src={"./" + piece.color + piece.type + ".svg"} class="piece" />
      {/if}
    </div>
  </div>
</div>

<style>
  .square {
    width: 100%;
    height: 100%;

    position: relative;
  }

  .white {
    background-color: var(--white-color);
  }

  .black {
    background-color: var(--black-color);
  }

  .selected-display {
    background-color: var(--current-piece-color) !important;
  }

  .possible-move-display {
    position: absolute;
    width: 80%;
    height: 80%;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    background-color: var(--possible-move-color) !important;
    border-radius: 50%;
  }

  .ghost-move-display {
    position: absolute;
    width: 80%;
    height: 80%;

    top: 50%;
    left: 50%;

    transform: translate(-50%, -50%);

    background-color: var(--ghost-move-color) !important;
    border-radius: 50%;
  }

  .piece {
    width: 100%;
    height: 100%;

    user-select: none;
    pointer-events: none;
  }

  .wrapper {
    width: 100%;
    height: 100%;
  }
</style>
