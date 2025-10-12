<script lang="ts">
  import type { FileUploader } from '$lib/file-uploader.svelte';
  import { EmoteConverter } from '$lib/emote-converter.svelte';
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

  let isGif = $state(false);

  const processFile = async () => {
    if (!fileUploader.imageMetadata) return;

    isGif = fileUploader.imageMetadata.name.toLowerCase().endsWith('.gif');

    umami.track('conversion-started', {
      type: isGif ? 'gif' : 'image'
    });

    if (isGif && fileUploader.rawContent) {
      const success = await converter.convertAnimated(
        fileUploader.rawContent,
        fileUploader.imageMetadata
      );
      if (!success) {
        fileUploader.reset();
        umami.track('conversion-failed', { type: 'gif' });
      } else {
        umami.track('conversion-success', { type: 'gif' });
      }
    } else if (!isGif && fileUploader.imageContent) {
      const success = await converter.convertImage(
        fileUploader.imageContent,
        fileUploader.imageMetadata
      );
      if (!success) {
        fileUploader.reset();
        umami.track('conversion-failed', { type: 'image' });
      } else {
        umami.track('conversion-success', { type: 'image' });
      }
    }
  };

  $effect(() => {
    if (fileUploader.imageMetadata && (fileUploader.imageContent || fileUploader.rawContent)) {
      processFile();
    }
  });

  const handleNewImage = () => {
    fileUploader.reset();
    converter.reset();
    isGif = false;
  };

  const handleDownloadAllImages = async () => {
    umami.track('download-all', {
      type: isGif ? 'gif' : 'image',
      count: isGif ? converter.emotes.length : converter.emotes.length + converter.badges.length
    });

    if (isGif) {
      await downloadImagesToZip(converter.emotes);
    } else {
      await downloadImagesToZip([...converter.badges, ...converter.emotes]);
    }
  };

  $effect(() => {
    if (converter.error) {
      alert(converter.error);
      handleNewImage();
    }
  });

  const hasResults = $derived(
    (isGif && converter.emotes.length > 0) ||
      (!isGif && converter.emotes.length > 0 && converter.badges.length > 0)
  );
</script>

{#if converter.converting}
  <Loader message="Processing..." />
{:else if !fileUploader.imageMetadata}
  <UploadBox
    title="Convert images or GIFs to multiple sizes"
    description="Upload image or GIF"
    accept="image/*,.gif"
    onChange={fileUploader.handleFileUploadEvent}
  />
{:else if hasResults}
  <div class="flex flex-col items-center gap-6">
    <h1 class="font-bold">Chat Preview</h1>
    {#if isGif}
      <ChatPreview emote={converter.emotes[2]} />
    {:else}
      <ChatPreview badge={converter.badges[2]} emote={converter.emotes[2]} />
    {/if}

    <div class="flex w-full max-w-[800px] flex-col gap-4">
      <h2 class="font-bold">Emotes</h2>
      <ImageContainer images={converter.emotes} />
    </div>

    {#if !isGif && converter.badges.length > 0}
      <div class="flex w-full max-w-[800px] flex-col gap-4">
        <h2 class="font-bold">Badges</h2>
        <ImageContainer images={converter.badges} />
      </div>
    {/if}

    <div class="flex gap-2">
      <Button onclick={handleNewImage}>New Image</Button>
      <Button onclick={handleDownloadAllImages}>Download All</Button>
    </div>
  </div>
{/if}
