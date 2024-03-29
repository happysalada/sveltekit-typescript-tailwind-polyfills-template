<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  import * as EmailValidator from 'email-validator';

  import type { PageData } from './$types';

  import Nav from '$lib/Nav.svelte';
  import PhoneInput from '$lib/PhoneInput.svelte';

  export let data: PageData;

  // just needed to prevent the form from sending if phone number is invalid
  let phoneValid = false;

  const { form, errors, constraints, enhance } = superForm(data.form, {
    validators: {
      name: (input) => (input.length < 2 ? 'Name needs to be at least 2 characters' : undefined),
      country: (input) => (input.length == 0 ? 'Country cannot be empty' : undefined),
      phone: (_input) => (phoneValid ? undefined : 'Invalid phone number'),
      email: (input) => (EmailValidator.validate(input) ? undefined : 'Email is invalid'),
      password: (input) =>
        input.length < 6 ? 'Password needs to be at least 6 characters long' : undefined,
      passwordConfirmation: (input) =>
        input.length < 6 ? 'Password confirmation does not match password' : undefined
    },
    onError({ result, message }) {
      console.log('error');
      console.log(result);
      console.log(message);
    }
  });
</script>

<Nav />

<!--
  This example requires updating your template:

  ```
  <html class="h-full bg-gray-50">
  <body class="h-full">
  ```
-->
<div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
  <div class="sm:mx-auto sm:w-full sm:max-w-md">
    <img class="mx-auto h-12 w-auto" src="/Sweif.png" alt="Your Company" />
    <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign up</h2>
    <p class="mt-2 text-center text-sm text-gray-600">
      Or
      <a href="/signin" class="font-medium text-primary-600 hover:text-primary-500 text-xl"
        >Log in</a
      >
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
    <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
      <form class="space-y-6" method="POST" use:enhance>
        <div>
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
          <div class="mt-2">
            <input
              id="name"
              name="name"
              type="name"
              autocomplete="name"
              class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.name
                ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
                : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="Nico sweif"
              aria-invalid={$errors.name != undefined}
              aria-describedby={$errors.name != undefined ? 'name-error' : ''}
              data-invalid={$errors.name}
              bind:value={$form.name}
              {...$constraints.name}
            />
            {#if $errors.name}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          {#if $errors.name}
            <p class="mt-2 text-sm text-red-600" id="name-error">
              {$errors.name}
            </p>
          {/if}
        </div>

        <div class="sm:col-span-2">
          <label for="country" class="block text-sm font-medium leading-6 text-gray-900"
            >Country</label
          >
          <div class="mt-2">
            <select
              id="country"
              name="country"
              autocomplete="country"
              class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.country
                ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
                : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="Nico sweif"
              aria-invalid={$errors.country != undefined}
              aria-describedby={$errors.country != undefined ? 'country-error' : ''}
              data-invalid={$errors.country}
              bind:value={$form.country}
              {...$constraints.country}
            >
              <option value="CO" selected>Colombia</option>
              <option value="ES">Spain</option>
            </select>
            {#if $errors.country}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          {#if $errors.country}
            <p class="mt-2 text-sm text-red-600" id="email-error">
              {$errors.country}
            </p>
          {/if}
        </div>

        <div class="sm:col-span-2">
          <label for="phone" class="block text-sm font-medium leading-6 text-gray-900">Phone</label>
          <div class="mt-2 flex justify-between">
            <input id="phone" name="phone" type="hidden" bind:value={$form.phone} />

            <PhoneInput
              bind:value={$form.phone}
              bind:valid={phoneValid}
              selectedCountry={'CO'}
              options={{ autoPlaceholder: true, spaces: true }}
            />
          </div>
          {#if $errors.phone}
            <p class="mt-2 text-sm text-red-600" id="email-error">
              {$errors.phone}
            </p>
          {/if}
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="relative mt-2 rounded-md shadow-sm">
            <input
              type="email"
              name="email"
              id="email"
              class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.email
                ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
                : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="you@example.com"
              aria-invalid={$errors.email != undefined}
              aria-describedby={$errors.email != undefined ? 'email-error' : ''}
              autocomplete="email"
              data-invalid={$errors.email}
              bind:value={$form.email}
              {...$constraints.email}
            />
            {#if $errors.email}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          {#if $errors.email}
            <p class="mt-2 text-sm text-red-600" id="email-error">
              {$errors.email}
            </p>
          {/if}
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
            >Password</label
          >
          <div class="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.password
                ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
                : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              aria-invalid={$errors.password != undefined}
              aria-describedby={$errors.password != undefined ? 'password-error' : ''}
              data-invalid={$errors.password}
              bind:value={$form.password}
              {...$constraints.password}
            />
            {#if $errors.password}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          {#if $errors.password}
            <p class="mt-2 text-sm text-red-600" id="password-error">
              {$errors.password}
            </p>
          {/if}
        </div>

        <div>
          <label
            for="passwordConfirmation"
            class="block text-sm font-medium leading-6 text-gray-900">Confirm password</label
          >
          <div class="mt-2">
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.passwordConfirmation
                ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
                : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              aria-invalid={$errors.passwordConfirmation != undefined}
              aria-describedby={$errors.passwordConfirmation != undefined ? 'password-error' : ''}
              data-invalid={$errors.passwordConfirmation}
              bind:value={$form.passwordConfirmation}
              {...$constraints.passwordConfirmation}
            />
            {#if $errors.passwordConfirmation}
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  class="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            {/if}
          </div>
          {#if $errors.passwordConfirmation}
            <p class="mt-2 text-sm text-red-600" id="password-error">
              {$errors.passwordConfirmation}
            </p>
          {/if}
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
          </div>
          <!--
					<div class="text-sm">
						<a
							href="#"
							class="font-medium text-primary-600 hover:text-primary-500"
							>Forgot your password?</a
						>
					</div>
					-->
        </div>

        <div>
          <button
            class="flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >Sign up</button
          >
        </div>
      </form>

      <!--
			<div class="mt-6">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-300" />
					</div>
					<div class="relative flex justify-center text-sm">
						<span class="bg-white px-2 text-gray-500">Or continue with</span>
					</div>
				</div>

				<div class="mt-6 grid grid-cols-3 gap-3">
					<div>
						<a
							href="#"
							class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
						>
							<span class="sr-only">Sign in with Facebook</span>
							<svg
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>

					<div>
						<a
							href="#"
							class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
						>
							<span class="sr-only">Sign in with Twitter</span>
							<svg
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path
									d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
								/>
							</svg>
						</a>
					</div>

					<div>
						<a
							href="#"
							class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
						>
							<span class="sr-only">Sign in with GitHub</span>
							<svg
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
									clip-rule="evenodd"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
			-->
    </div>
  </div>
</div>
