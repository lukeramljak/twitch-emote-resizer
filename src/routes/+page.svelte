<script>
  import FileDropzone from '$lib/components/file-dropzone.svelte';
  import EmoteResizer from '$lib/components/emote-resizer.svelte';
  import Footer from '$lib/components/footer.svelte';
  import { FileUploader } from '$lib/file-uploader.svelte';

  const fileUploader = new FileUploader();
</script>

<svelte:head>
  <title>Twitch Emote Resizer - Free Image and GIF Converter</title>
</svelte:head>

<div class="flex min-h-dvh flex-col p-8 sm:p-20">
  <main class="row-start-2 flex grow flex-col items-center justify-center gap-6">
    <h1 class="text-2xl font-bold">Twitch Emote Resizer</h1>
    <p class="text-center text-sm">
      Convert images and GIFs to use for your Twitch channel, totally free.
    </p>
    <FileDropzone
      acceptedFileTypes={['image/*', '.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif']}
      dropText="Drop image or GIF file"
      setCurrentFile={fileUploader.handleFileUpload}
    >
      <EmoteResizer {fileUploader} />
    </FileDropzone>
  </main>
  <Footer />
</div>
