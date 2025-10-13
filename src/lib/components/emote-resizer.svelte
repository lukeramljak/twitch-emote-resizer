<script lang="ts">
  import type { FileUploader } from '$lib/file-uploader.svelte';
  import { EmoteConverter, type Converted } from '$lib/emote-converter.svelte';
  import { downloadImagesToZip } from '$lib/utils/image';
  import { umami } from '$lib/umami';
  import Button from './button.svelte';
  import ChatPreview from './chat-preview.svelte';
  import ImageContainer from './image-container.svelte';
  import Loader from './loader.svelte';
  import UploadBox from './upload-box.svelte';

  interface Props {
    fileUploader: FileUploader;
  }

  let { fileUploader }: Props = $props();

  const converter = new EmoteConverter();

  let processing = $state(false);
  let hasProcessed = false;
  const hasResults = $derived(converter.converted.length > 0);

  const processFiles = async () => {
    if (fileUploader.processedFiles.length === 0) return;

    processing = true;

    const fileCount = fileUploader.processedFiles.length;
    const isMultiple = fileCount > 1;

    for (const file of fileUploader.processedFiles) {
      if (!file.imageMetadata) {
        continue;
      }

      const isGif = file.imageMetadata.name.toLowerCase().endsWith('.gif');

      if (isGif && file.rawContent) {
        const success = await converter.convertAnimated(file.rawContent, file.imageMetadata);
        if (success) {
          umami.track('conversion', { multiple: isMultiple });
        }
        if (!success) {
          fileUploader.reset();
        }
      } else if (!isGif && file.imageContent) {
        const success = await converter.convertImage(file.imageContent, file.imageMetadata);
        if (success) {
          umami.track('conversion', { multiple: isMultiple });
        }
        if (!success) {
          fileUploader.reset();
        }
      }
    }

    processing = false;
  };

  $effect(() => {
    if (fileUploader.processedFiles.length > 0 && !hasProcessed) {
      hasProcessed = true;
      processFiles();
    }
  });

  const handleReset = () => {
    fileUploader.reset();
    converter.reset();
    hasProcessed = false;
  };

  const handleDownloadAll = async (images: Converted[]) => {
    umami.track('download');
    const allImages = images.flatMap((img) => [...img.emotes, ...(img.badges ?? [])]);
    await downloadImagesToZip(allImages, 'export');
  };

  const handleDownload = async (images: Converted) => {
    umami.track('download');
    await downloadImagesToZip([...(images.badges ?? []), ...images.emotes]);
  };

  $effect(() => {
    if (converter.error) {
      alert(converter.error);
      handleReset();
    }
  });
</script>

{#if processing}
  <Loader message="Processing..." />
{:else if fileUploader.processedFiles.length === 0}
  <UploadBox
    title="Convert images or GIFs to multiple sizes"
    description="Upload images or GIFs"
    accept="image/*,.gif"
    onChange={fileUploader.handleFileUploadEvent}
  />
{:else if hasResults}
  <div class="flex w-full flex-col gap-8">
    <div class="mx-auto flex flex-col items-center gap-2 sm:flex-row">
      <Button onclick={handleReset}>Reset</Button>
      {#if converter.converted.length > 1}
        <Button variant="secondary" onclick={() => handleDownloadAll(converter.converted)}
          >Download All Emotes</Button
        >
      {/if}
    </div>
    <div class="flex flex-col gap-12">
      {#each converter.converted as c, i (i)}
        <div
          class="flex flex-col items-center gap-6 rounded-xl border bg-muted/30 p-6 backdrop-blur-sm sm:p-8"
        >
          <h1 class="text-center text-2xl font-bold">{c.name}</h1>
          <h2 class="font-bold">Chat Preview</h2>
          {#if c.type === 'image' && c.badges && c.badges.length > 0}
            <ChatPreview badge={c.badges[2]} emote={c.emotes[2]} />
          {:else}
            <ChatPreview emote={c.emotes[2]} />
          {/if}

          <div class="flex w-full max-w-[800px] flex-col gap-4">
            <h2 class="font-bold">Emotes</h2>
            <ImageContainer images={c.emotes} />
          </div>

          {#if c.type === 'image' && c.badges && c.badges.length > 0}
            <div class="flex w-full max-w-[800px] flex-col gap-4">
              <h2 class="font-bold">Badges</h2>
              <ImageContainer images={c.badges} />
            </div>
          {/if}
          <Button onclick={() => handleDownload(c)}>Download Set</Button>
        </div>
      {/each}
    </div>
  </div>
{/if}
