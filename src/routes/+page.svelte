<script lang="ts">
  import Contact from "$lib/Contact.svelte";
  import { searchQuery } from "$lib/../stores";
  import { goto } from "$app/navigation";

  async function search() {
    goto(`/search?query=${$searchQuery}`);
  }
</script>

<div class="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 h-screen flex items-center">
  <div class="container mx-auto px-4">
    <div class="text-white text-center">
      <h1 class="text-5xl font-bold mb-4">Foreign Remittance Made Easy</h1>
      <p class="text-xl mb-8">
        Secure, fast, and reliable international money transfers
      </p>
      <a
        href="#get-started"
        class="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow"
        >Get Started</a
      >
    </div>
  </div>
</div>

<Contact />
