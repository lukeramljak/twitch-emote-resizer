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

<div class="grid gap-4 sm:grid-cols-3">
  {#each images as image, i (i)}
    <button
      type="button"
      class="flex cursor-pointer flex-col justify-between rounded-md border bg-twitch-dark/80 transition-colors outline-none hover:bg-twitch-dark focus:ring-1 focus:ring-accent"
      onclick={() => handleClick(image)}
    >
      <div class="flex h-[calc(112px+2rem)] items-center justify-center">
        <img
          src={image.content}
          alt={`Preview of ${image.metadata.width}x${image.metadata.height} image`}
          width={image.metadata.width}
          height={image.metadata.height}
        />
      </div>
      <div
        class="flex flex-col items-center justify-between rounded-b-md bg-accent p-2 text-xs font-bold md:flex-row"
      >
        <span>
          {image.metadata.width}px x {image.metadata.height}px
        </span>
        <span>{image.fileSize}KB</span>
      </div>
    </button>
  {/each}
</div>
