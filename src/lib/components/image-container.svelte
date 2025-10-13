<script lang="ts">
  import type { ResizedImage } from '$lib/types';
  import { downloadImage } from '$lib/utils/image';

  interface Props {
    images: ResizedImage[];
  }

  let { images }: Props = $props();

  const handleClick = (image: ResizedImage) => {
    downloadImage(image);
  };
</script>

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {#each images as image, i (i)}
    <button
      type="button"
      class="group relative overflow-hidden rounded-lg border border-border/50 bg-muted transition-all duration-300 hover:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none"
      onclick={() => handleClick(image)}
    >
      <div class="relative flex aspect-square items-center justify-center bg-primary/30">
        <img
          src={image.content}
          alt={`Preview of ${image.metadata.width}x${image.metadata.height} image`}
          width={image.metadata.width}
          height={image.metadata.height}
          class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />

        <div
          class="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span class="text-sm font-semibold text-accent">Click to Download</span>
        </div>
      </div>

      <div class="border-t border-border/30 bg-primary/50 p-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-muted-foreground">
            {image.metadata.width} × {image.metadata.height}
          </span>
          <span class="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
            {image.fileSize}KB
          </span>
        </div>
      </div>
    </button>
  {/each}
</div>
