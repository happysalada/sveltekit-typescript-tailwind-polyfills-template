<script lang="ts">
  import Map from '$lib/Map.svelte'
  import SearchBar from '$lib/SearchBar.svelte';
  import SidePanel from '$lib/SidePanel.svelte';
</script>


<div class="relative h-full w-full">
  <SearchBar />
  <div class="flex">
    <Map />
    <SidePanel />
  </div>
</div>
