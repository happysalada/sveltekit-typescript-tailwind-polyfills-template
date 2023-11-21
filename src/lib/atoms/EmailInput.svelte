<script lang="ts">
  import { debounce } from 'throttle-debounce';

  export let label: string;
  export let id: string;
  export let name: string;
  export let placeholder: string = '';
  export let error: any = undefined;
  export let value: string;
  export let constraints: any;
  export let autocomplete: string;
  export let success: boolean;

  function inputClass(value: any, error: string | undefined, success: boolean) {
    const defaultStyle =
      'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
    if (!value) return defaultStyle;
    if (error)
      return 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';
    if (success)
      return 'bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 focus:ring-green-500 focus:border-green-500 dark:border-green-500';
    return defaultStyle;
  }

  function labelClass(value: any, error: string | undefined, success: boolean) {
    if (!value) return '';
    if (error) return 'text-red-700 dark:text-red-500';
    if (success) return 'text-green-700 dark:text-green-500';
    return '';
  }

  const emailValidation = debounce(1000, async (email: string) => {
    if (!email) return;

    const response = await fetch('/api/validate_email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailAddress: email })
    });
    const { validFormat, validMx, validSmtp } = await response.json();
    if (!validFormat) {
      error = 'Invalid format';
      success = false;
      return;
    }
    if (!validMx) {
      error = 'Invalid domain';
      success = false;
      return;
    }
    // validSmtp can be null as well for unknown errors
    // We decide to be lax for now on smtp validation errors
    if (validSmtp == false) {
      error = 'Email address not found';
      success = false;
      return;
    }
    success = true;
    error = undefined;
    return;
  });
</script>

<div>
  <label for={id} class="block mb-2 text-sm font-medium {labelClass(value, error, success)}"
    >{label}</label
  >
  <div class="relative mb-6">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
      <svg
        class="w-4 h-4 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 16"
      >
        <path
          d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
        />
        <path
          d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
        />
      </svg>
    </div>
    <input
      {id}
      {name}
      type="email"
      class="rounded-lg text-sm block w-full ps-10 p-2.5 {inputClass(value, error, success)}"
      {placeholder}
      aria-invalid={error != undefined}
      aria-describedby={error != undefined ? `${id}-error` : ''}
      {autocomplete}
      data-invalid={error}
      bind:value
      {...constraints}
      {...$$restProps}
      on:input={() => emailValidation(value)}
    />
  </div>
  {#if error}
    <div class="pointer-events-none absolute inset-y-0 right-5 flex items-center pr-3">
      <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500" id={`${id}-error`}>
      <span class="font-medium">Oh, snapp!</span>
      {error}.
    </p>
  {/if}
</div>
