<script lang="ts">
  import { Button } from "@svelteuidev/core";
  import { handleGoogleAuth } from "../SupabaseManager";
</script>

<div class="login-page">
  <Button>Login</Button>
</div>

<style>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
</style>
