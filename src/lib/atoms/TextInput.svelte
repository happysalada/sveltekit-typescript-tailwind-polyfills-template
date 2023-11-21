<script lang="ts">
  export let label: string;
  export let id: string;
  export let name: string;
  export let placeholder: string = '';
  export let error: any = undefined;
  export let value: string;
  export let constraints: any;
  export let autocomplete: string;

  function inputClass(value: any, error: string | undefined) {
    const defaultStyle =
      'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500';
    if (!value) return defaultStyle;
    if (error)
      return 'bg-red-50 border border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500';
    return defaultStyle;
  }

  function labelClass(value: any, error: string | undefined) {
    if (!value) return '';
    if (error) return 'text-red-700 dark:text-red-500';
    return '';
  }
</script>

<label for={id} class="block mb-2 text-sm font-medium {labelClass(value, error)}">{label}</label>
<input
  {id}
  {name}
  type="text"
  class="rounded-lg text-sm block w-full p-2.5 {inputClass(value, error)}"
  {placeholder}
  aria-invalid={error != undefined}
  aria-describedby={error != undefined ? `${id}-error` : ''}
  {autocomplete}
  data-invalid={error}
  bind:value
  {...constraints}
  {...$$restProps}
/>
{#if error}
  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
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
