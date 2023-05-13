<script lang="ts">
  import type { PageData } from "./$types";
  import { user } from "$lib/stores";

  // import UserNav from "$lib/UserNav.svelte";

  export let data: PageData;
  user.set(data.user)
</script>

<!-- <UserNav user={data.user}/> -->

<slot />
