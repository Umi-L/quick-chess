<script lang="ts">
  import { Card, Text, TextInput, Button, Image } from "@svelteuidev/core";
  import { Game } from "../games/Game";
  import { BaseGame } from "../games/BaseGame";
  import { currentGame } from "../globals";
  import { onMount } from "svelte";
  import { createGame, handleGoogleAuth, joinGame } from "../SupabaseManager";

  interface GameType {
    name: string;
    description: string;
    img: string;
    builder: (width: number, height: number) => Game;
  }

  const gameTypes: GameType[] = [
    {
      name: "Base Chess",
      description: "The classic game of chess on an 8x8 board",
      img: "./chess.jpg",
      builder: () => {
        let game = new BaseGame();
        game.init();
        return game;
      },
    },
    {
      name: "Standard Chess",
      description: "The classic game of chess on an 8x8 board",
      img: "./chess.jpg",
      builder: () => {
        let game = new BaseGame();
        game.init();
        return game;
      },
    },
  ];

  onMount(async () => {
    await handleGoogleAuth();

    // if url param id is present, join game
    let urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");

    if (id) {
      console.log("Joining game with id: " + id);
      await joinGame(id);
    }
  });
</script>

<div class="main-page">
  <h1>Quick- Chess</h1>

  <div class="actions">
    <div class="carousel">
      {#each gameTypes as gameType}
        <Card shadow="sm" padding="lg">
          <Card.Section padding="lg">
            <Image src={gameType.img} alt={gameType.name} height={160} />
          </Card.Section>

          <Text weight={1000} size="xl">{gameType.name}</Text>

          <div class="half-spacing" />

          <Text>{gameType.description}</Text>

          <div class="spacing" />

          <Card.Section>
            <Button
              color="teal"
              fullSize
              on:click={() => {
                let game = gameType.builder(8, 8);
                currentGame.set(game);
                createGame(game);
              }}>Create Game</Button
            >
          </Card.Section>
        </Card>
      {/each}
    </div>
    <div class="action-wrapper">
      <Button color="teal">Join Game</Button>
      <TextInput placeholder="Game ID" />
    </div>
  </div>
</div>

<style>
  h1 {
    font-size: 5rem;
  }

  .main-page {
    display: flex;
    flex-direction: column;
    gap: 100px;
    width: 100%;
    height: 100%;
    min-height: 100dvh;

    align-items: center;

    overflow-y: scroll;
    background-color: var(--background-color);
  }

  .carousel {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;

    flex-wrap: wrap;

    gap: 20px;
  }

  .spacing {
    height: 20px;
  }
  .half-spacing {
    height: 10px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
    width: 100%;

    margin-bottom: 100px;
  }

  .action-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
</style>
