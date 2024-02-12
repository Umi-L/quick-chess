<script lang="ts">
  import BoardElement from "./lib/Board.svelte";
  import { BaseGame } from "./games/BaseGame";
</script>

<main class="main">
  <BoardElement game={new BaseGame()} />
</main>

<style>
  .main {
    width: 100%;
    height: 100%;
  }
</style>
