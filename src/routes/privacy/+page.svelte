<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Privacy Policy - Twitch Emote Resizer</title>
</svelte:head>

<div class="flex min-h-dvh flex-col p-8 sm:p-20">
  <main class="mx-auto w-full max-w-3xl">
    <a
      href={resolve('/')}
      class="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      ← Back to home
    </a>

    <article class="max-w-none text-foreground">
      <h1 class="mb-2 text-4xl font-bold">Privacy Policy</h1>
      <p class="mb-4 text-muted-foreground">Last updated: October 12, 2025</p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Introduction</h2>
      <p class="mb-4 leading-7">
        Twitch Emote Resizer is a free tool created and maintained by an independent developer. This
        Privacy Policy explains how your information is handled when you use this service.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Information Collected</h2>

      <h3 class="mt-6 mb-3 text-xl font-semibold">Images You Upload</h3>
      <p class="mb-4 leading-7">
        When you use this tool, you upload images or GIFs for resizing. These files are:
      </p>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">Processed entirely on your device (locally)</li>
        <li class="leading-7">
          <strong class="font-semibold">Never sent</strong> to any server or third party
        </li>
        <li class="leading-7">
          <strong class="font-semibold">Not saved</strong> to any database or permanent storage
        </li>
        <li class="leading-7">Cleared from memory immediately after processing is complete</li>
      </ul>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">How Your Information Is Used</h2>
      <p class="mb-4 leading-7">
        Your images are used only to process and resize them on your device. No data is collected,
        stored, or shared.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Data Retention</h2>
      <p class="mb-4 leading-7">
        No data is retained. Your images are processed in memory and cleared immediately after
        processing.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Your Rights</h2>
      <p class="mb-4 leading-7">You have the right to:</p>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">Use this tool without creating an account</li>
        <li class="leading-7">Request information about data collected about you</li>
        <li class="leading-7">
          Opt out of analytics tracking (use browser privacy extensions or ad blockers)
        </li>
      </ul>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Cookies and Tracking</h2>
      <p class="mb-4 leading-7">
        This tool does not use cookies, tracking, or analytics. No cookies are set on your device.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Third-Party Services</h2>
      <p class="mb-4 leading-7">
        This tool does not use any third-party services. All processing happens on your device.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Children's Privacy</h2>
      <p class="mb-4 leading-7">
        This tool is not directed to children under 13. Personal information is not knowingly
        collected from children under 13.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Changes to This Privacy Policy</h2>
      <p class="mb-4 leading-7">
        This Privacy Policy may be updated from time to time. Changes will be posted on this page
        with an updated "Last updated" date.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Contact</h2>
      <p class="mb-4 leading-7">
        If you have questions about this Privacy Policy or the tool, feel free to reach out via the
        <a
          href="https://github.com/lukeramljak/twitch-emote-resizer"
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent underline hover:opacity-80">GitHub Repository</a
        >.
      </p>
    </article>
  </main>
</div>
