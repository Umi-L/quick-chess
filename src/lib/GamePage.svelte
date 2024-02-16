<script lang="ts">
  import { Button } from "@svelteuidev/core";
  import { copyGameIDUrl, handleGoogleAuth } from "../SupabaseManager";
  import Board from "./Board.svelte";
  import type { Game } from "../games/Game";
  import { currentGame } from "../globals";

  let game: Game;
  currentGame.subscribe((value) => {
    game = value!;
  });
</script>

<div class="game-page">
  <Board {game} />
  <div class="side">
    <Button on:click={copyGameIDUrl}>Copy Link</Button>
  </div>
</div>

<style>
  .game-page {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
  }

  .side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
