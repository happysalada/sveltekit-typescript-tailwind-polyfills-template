<script lang="ts">
  import { superForm } from 'sveltekit-superforms/client';
  export let contactForm: any;
  import TextInput from '$lib/atoms/TextInput.svelte';
  import EmailInput from '$lib/atoms/EmailInput.svelte';

  enum State {
    Input,
    Submitted
  }
  let state = State.Input;
  let emailValid = false;

  const { form, enhance, errors, constraints } = superForm(contactForm, {
    validators: {
      first_name: (input) => (input ? undefined : 'Please add your first name'),
      last_name: (input) => (input ? undefined : 'Please add your last name'),
      phone: (input) => (input ? undefined : 'Please add your phone number'),
      message: (input) => (input ? undefined : 'Please write a message')
    },
    onError({ result, message }) {
      console.log(result);
      console.log(message);
    },
    resetForm: true,
    onResult({ result }) {
      if (result.type === 'success') {
        state = State.Submitted;
      } else if (result.type === 'failure') {
        console.log(result);
      }
    }
  });
</script>

<section id="contact" class="bg-white dark:bg-gray-900">
  <div
    class="bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/contact/laptop-human.jpg')] bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply"
  >
    <div class="px-4 lg:pt-24 pt-8 pb-72 lg:pb-80 mx-auto max-w-screen-sm text-center lg:px-6">
      <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-white">Contact Us</h2>
      <p class="mb-16 font-light text-gray-400 sm:text-xl">
        We use an agile approach to test assumptions and connect with the needs of your audience
        early and often.
      </p>
    </div>
  </div>
  <div class="py-16 px-4 mx-auto -mt-96 max-w-screen-xl sm:py-24 lg:px-6">
    <form
      action="?/createContact"
      method="POST"
      use:enhance
      class="grid grid-cols-1 gap-8 p-6 mx-auto mb-16 max-w-screen-md bg-white rounded-lg border border-gray-200 shadow-sm lg:mb-28 dark:bg-gray-800 dark:border-gray-700 sm:grid-cols-2"
    >
      <div>
        <TextInput
          label="First Name"
          id="first_name"
          name="first_name"
          placeholder="Jay"
          error={$errors.first_name}
          bind:value={$form.first_name}
          constraints={$constraints.first_name}
          autocomplete="given-name"
        />
      </div>
      <div>
        <TextInput
          label="Last Name"
          id="last_name"
          name="last_name"
          placeholder="Gatsby"
          error={$errors.last_name}
          bind:value={$form.last_name}
          constraints={$constraints.last_name}
          autocomplete="family-name"
        />
      </div>
      <div>
        <EmailInput
          label="Email"
          id="email"
          name="email"
          placeholder="you@example.com"
          bind:error={$errors.email}
          bind:value={$form.email}
          constraints={$constraints.email}
          autocomplete="email"
          success={emailValid}
        />
      </div>
      <div>
        <TextInput
          label="Phone number"
          id="phone"
          name="phone"
          placeholder=""
          error={$errors.phone}
          bind:value={$form.phne}
          constraints={$constraints.phone}
          autocomplete="phone"
        />
      </div>
      <div class="sm:col-span-2">
        <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
          >Your message</label
        >

        <div class="mt-2.5">
          <textarea
            name="message"
            id="message"
            rows="4"
            class="block w-full rounded-md border-0 py-1.5 pr-10 {$errors.message
              ? 'text-red-900 placeholder:text-red-300 ring-red-300 focus:ring-red-500'
              : 'text-gray-900 ring-gray-300 focus:ring-primary-500'} ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
            aria-invalid={$errors.message != undefined}
            aria-describedby={$errors.message != undefined ? 'message-error' : ''}
            data-invalid={$errors.message}
            bind:value={$form.message}
            {...$constraints.message}
          />
        </div>
        {#if $errors.message}
          <p class="mt-2 text-sm text-red-600" id="message-error">
            {$errors.message}
          </p>
        {/if}
        <p class="mt-4 text-sm text-gray-500">
          By submitting this form you agree to our <a
            href="/terms"
            class="text-primary-600 hover:underline dark:text-primary-500">terms and conditions</a
          >
          and our
          <a href="/privacy" class="text-primary-600 hover:underline dark:text-primary-500"
            >privacy policy</a
          > which explains how we may collect, use and disclose your personal information including to
          third parties.
        </p>
      </div>
      {#if state == State.Input}
        <button
          class="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >Send message</button
        >
      {:else}
        <button
          disabled
          class="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-gray-700 sm:w-fit focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >Thank you! We will be in touch shortly</button
        >
      {/if}
    </form>
    <div class="space-y-8 text-center md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
      <div>
        <div
          class="flex justify-center items-center mx-auto mb-4 w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 lg:h-16 lg:w-16"
        >
          <svg
            class="w-5 h-5 text-gray-600 lg:w-8 lg:h-8 dark:text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
            /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg
          >
        </div>
        <p class="mb-2 text-xl font-bold dark:text-white">Email us:</p>
        <p class="mb-3 text-gray-500 dark:text-gray-400">
          Email us for general queries, including marketing and partnership opportunities.
        </p>
        <a
          href="mailto:abc@example.com"
          class="font-semibold text-primary-600 dark:text-primary-500 hover:underline"
          >hello@flowbite.com</a
        >
      </div>
      <div>
        <div
          class="flex justify-center items-center mx-auto mb-4 w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 lg:h-16 lg:w-16"
        >
          <svg
            class="w-5 h-5 text-gray-600 lg:w-8 lg:h-8 dark:text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
            /></svg
          >
        </div>
        <p class="mb-2 text-xl font-bold dark:text-white">Call us:</p>
        <p class="mb-3 text-gray-500 dark:text-gray-400">
          Call us to speak to a member of our team. We are always happy to help.
        </p>
        <span class="font-semibold text-primary-600 dark:text-primary-500">+1 (646) 786-5060</span>
      </div>
      <div>
        <div
          class="flex justify-center items-center mx-auto mb-4 w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 lg:h-16 lg:w-16"
        >
          <svg
            class="w-5 h-5 text-gray-600 lg:w-8 lg:h-8 dark:text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z"
              clip-rule="evenodd"
            /></svg
          >
        </div>
        <p class="mb-2 text-xl font-bold dark:text-white">Support</p>
        <p class="mb-3 text-gray-500 dark:text-gray-400">
          Email us for general queries, including marketing and partnership opportunities.
        </p>
        <a
          href="#"
          class="inline-flex py-2 px-4 text-sm font-medium text-center rounded-lg border text-primary-600 border-primary-600 hover:text-white hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600 dark:focus:ring-primary-800"
          >Support center</a
        >
      </div>
    </div>
  </div>
</section>
