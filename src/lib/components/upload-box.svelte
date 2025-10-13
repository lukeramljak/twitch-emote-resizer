<script lang="ts">
  import type { FileUploadEvent } from '$lib/types';
  import Button from '../components/button.svelte';

  interface Props {
    title: string;
    subtitle?: string;
    description: string;
    accept: string;
    onChange: (e: FileUploadEvent) => void;
  }

  let { title, subtitle, description, accept, onChange }: Props = $props();

  let inputElement: HTMLInputElement;

  const handleClick = () => {
    inputElement.click();
  };
</script>

<div class="flex flex-col items-center justify-center gap-4 p-4">
  <div class="flex flex-col items-center gap-2">
    <h2 class="text-center text-lg font-semibold">{title}</h2>
    {#if subtitle}
      <p
        class="inline-block rounded-full border bg-muted px-2 py-0.5 text-center text-sm text-foreground/60"
      >
        {subtitle}
      </p>
    {/if}
  </div>
  <div
    class="flex w-72 flex-col items-center justify-center gap-4 rounded-xl border bg-muted p-6 backdrop-blur-sm"
    role="region"
    aria-label="File upload area"
  >
    <svg
      class="h-8 w-8 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <title>Upload icon</title>
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
    <p class="text-sm text-muted-foreground">Drag and Drop</p>
    <p class="text-sm text-muted-foreground">or</p>
    <Button
      variant="secondary"
      onclick={handleClick}
      aria-label={`${description} - Supported formats: ${accept}`}>{description}</Button
    >
    <p class="text-center text-xs text-muted-foreground">
      Select multiple files for batch processing
    </p>
    <input
      bind:this={inputElement}
      type="file"
      multiple
      onchangecapture={onChange}
      {accept}
      hidden
      aria-label="File upload input"
    />
  </div>
</div>
