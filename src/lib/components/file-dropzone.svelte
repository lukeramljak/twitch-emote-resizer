<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet<[]>;
    acceptedFileTypes: string[];
    dropText: string;
    setCurrentFile: (file: File) => void;
  }

  let { children, acceptedFileTypes, dropText, setCurrentFile }: Props = $props();

  let isDragging = $state(false);
  let dragCounter = $state(0);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      isDragging = true;
    }
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;

    if (dragCounter === 0) {
      isDragging = false;
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    dragCounter = 0;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];

      if (!droppedFile) {
        alert('No files dropped');
        throw new Error('No files dropped');
      }

      if (
        !acceptedFileTypes.includes(droppedFile.type) &&
        !acceptedFileTypes.some((type) =>
          droppedFile.name.toLowerCase().endsWith(type.replace('*', ''))
        )
      ) {
        alert('Invalid file type. Please upload a supported file type.');
        throw new Error('Invalid file');
      }

      setCurrentFile(droppedFile);
    }
  };
</script>

<div
  ondragentercapture={handleDragIn}
  ondragleavecapture={handleDragOut}
  ondragovercapture={handleDrag}
  ondropcapture={handleDrop}
  class="h-full w-full"
>
  {#if isDragging}
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div
        class="animate-in fade-in zoom-in relative flex h-[90%] w-[90%] transform items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ease-out"
      >
        <p class="text-2xl font-semibold">{dropText}</p>
      </div>
    </div>
  {/if}
  {@render children()}
</div>
