<script lang="ts">
  import type { FileUploader } from '$lib/file-uploader.svelte';
  import { EmoteConverter, type Converted } from '$lib/emote-converter.svelte';
  import { downloadImagesToZip } from '$lib/utils/image';
  import { umami } from '$lib/umami';
  import { stripFileExtension } from '$lib/utils/image';
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
    umami.track('conversion', { multiple: isMultiple });

    for (const file of fileUploader.processedFiles) {
      if (!file.imageMetadata) {
        continue;
      }
      await converter.convert(file);
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
      {#if converter.converted.length > 1}
        <Button variant="secondary" onclick={() => handleDownloadAll(converter.converted)}
          >Download All (.zip)</Button
        >
      {/if}
      <Button onclick={handleReset}>Reset</Button>
    </div>
    <div class="flex flex-col gap-16">
      {#each converter.converted as c, i (i)}
        <div class="flex flex-col items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <h1 class="text-center text-2xl font-bold">{stripFileExtension(c.name)}</h1>
            <div class="h-px w-16 bg-accent"></div>
          </div>

          <div class="flex flex-col items-center gap-4">
            <h2 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Chat Preview
            </h2>
            {#if c.type === 'image' && c.badges && c.badges.length > 0}
              <ChatPreview badge={c.badges[0]} emote={c.emotes[0]} />
            {:else}
              <ChatPreview emote={c.emotes[0]} />
            {/if}
          </div>

          <div class="flex w-full max-w-[800px] flex-col gap-4">
            <h2 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Emotes
            </h2>
            <ImageContainer images={c.emotes} />
          </div>

          {#if c.type === 'image' && c.badges && c.badges.length > 0}
            <div class="flex w-full max-w-[800px] flex-col gap-4">
              <h2 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                Badges
              </h2>
              <ImageContainer images={c.badges} />
            </div>
          {/if}
          <Button variant="secondary" onclick={() => handleDownload(c)}>Download Set (.zip)</Button>
        </div>

        {#if i < converter.converted.length - 1}
          <div class="mx-auto h-px w-full max-w-md bg-border/30"></div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
