<script lang="ts">
  import BoardElement from "./lib/Board.svelte";
  import { BaseGame } from "./games/BaseGame";
  import { currentGame } from "./globals";
  import MainPage from "./lib/MainPage.svelte";
  import { colorScheme, SvelteUIProvider } from "@svelteuidev/core";
  import { onMount } from "svelte";
  import type { Game } from "./games/Game";
  import GamePage from "./lib/GamePage.svelte";
  colorScheme.set("dark");

  let game: Game;
  currentGame.subscribe((value) => {
    game = value!;
  });
</script>

<main class="main">
  <SvelteUIProvider withGlobalStyles themeObserver={$colorScheme}>
    {#if game}
      <GamePage />
    {:else}
      <MainPage></MainPage>
    {/if}
  </SvelteUIProvider>
</main>

<style>
  .main {
    width: 100%;
    height: 100%;
  }
</style>
