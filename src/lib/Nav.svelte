<script lang="ts">
	import { user } from "$lib/../stores";
	import { goto } from "$app/navigation";
	import Surreal from "surrealdb.js";
	import { PUBLIC_SURREAL_URL } from "$env/static/public";

	function signout(): void {
		const db = new Surreal(`${PUBLIC_SURREAL_URL}/rpc`);
		db.invalidate();
		user.set({});
		goto("/");
	}

	let isDropdownOpen = false;
</script>

<header class="bg-white">
	<nav
		class="flex items-center justify-between p-6 lg:px-8"
		aria-label="Global"
	>
		<div class="flex lg:flex-1">
			<a href="/" class="">
				<span class="sr-only">Your Company</span>
				<img
					class="h-8"
					src="/Sweif.png"
					alt=""
				/>
			</a>
		</div>
		<div class="flex lg:hidden">
			<button
				type="button"
				class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
				on:click={() => (isDropdownOpen = true)}
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<div class="hidden lg:flex lg:gap-x-12">
			<a href="/" class="text-sm font-semibold leading-6 text-gray-900"
				>Product</a
			>

			<a href="#features" class="text-sm font-semibold leading-6 text-gray-900"
				>Featuers</a
			>

			<a href="/#contact" class="text-sm font-semibold leading-6 text-gray-900"
				>Contact</a
			>
		</div>
		<div class="hidden lg:flex lg:flex-1 lg:justify-end">
			{#if $user?.email}
				<button
					class="text-sm font-semibold leading-6 text-gray-900"
					on:click={signout}
					>Sign out <span aria-hidden="true">&rarr;</span></button
				>
			{:else}
				<a href="/signin" class="text-sm font-semibold leading-6 text-gray-900"
					>Log in <span aria-hidden="true">&rarr;</span></a
				>
			{/if}
		</div>
	</nav>
	<!-- Mobile menu, show/hide based on menu open state. -->
	<div
		class="lg:hidden"
		role="dialog"
		aria-modal="true"
		class:hidden={!isDropdownOpen}
	>
		<!-- Background backdrop, show/hide based on slide-over state. -->
		<div class="fixed inset-0 z-10" class:hidden={!isDropdownOpen} />
		<div
			class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
		>
			<div class="flex items-center justify-between">
				<a href="/" class="-m-1.5 p-1.5">
					<span class="sr-only">Your Company</span>
					<img
						class="h-8 w-auto"
						src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
						alt=""
					/>
				</a>
				<button
					type="button"
					class="-m-2.5 rounded-md p-2.5 text-gray-700"
					on:click={() => (isDropdownOpen = false)}
				>
					<span class="sr-only">Close menu</span>
					<svg
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
			<div class="mt-6 flow-root">
				<div class="-my-6 divide-y divide-gray-500/10">
					<div class="space-y-2 py-6">
						<a
							href="/"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Product</a
						>

						<a
							href="/#features"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Features</a
						>

						<a
							href="/#contact"
							class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
							>Contact</a
						>

					</div>
					<div class="py-6">
						{#if $user?.email}
							<button
								class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								on:click={signout}
								>Sign out</button
							>
						{:else}
							<a
								href="/signin"
							class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
								>Log in</a
							>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</header>
