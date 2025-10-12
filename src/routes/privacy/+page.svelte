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
        <li class="leading-7">Processed on the server to generate resized versions</li>
        <li class="leading-7">Temporarily stored in memory during processing</li>
        <li class="leading-7">
          <strong class="font-semibold">Not saved</strong> to any database or permanent storage
        </li>
        <li class="leading-7">
          <strong class="font-semibold">Not shared</strong> with any third parties
        </li>
        <li class="leading-7">Deleted immediately after processing is complete</li>
      </ul>

      <h3 class="mt-6 mb-3 text-xl font-semibold">Analytics Data</h3>
      <p class="mb-4 leading-7">
        This tool uses Umami Analytics for privacy-friendly analytics to understand how it's being
        used and to improve the user experience. Umami collects:
      </p>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">Pages visited and features used</li>
        <li class="leading-7">Browser type and version</li>
        <li class="leading-7">Device information (desktop, mobile, tablet)</li>
        <li class="leading-7">General location (country/region level, not precise)</li>
        <li class="leading-7">Custom events (conversions, downloads)</li>
      </ul>
      <p class="mb-4 leading-7">
        Umami is privacy-focused and does not use cookies or track personal data. It does not track
        your uploaded images or their content. For more information about Umami's privacy practices,
        visit
        <a
          href="https://umami.is/docs/faq"
          target="_blank"
          rel="noopener noreferrer"
          class="text-accent underline hover:opacity-80">Umami Documentation</a
        >.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">How Your Information Is Used</h2>
      <p class="mb-4 leading-7">The collected information is used to:</p>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">Process and resize your images</li>
        <li class="leading-7">Improve the tool and user experience</li>
        <li class="leading-7">Understand usage patterns and optimise performance</li>
        <li class="leading-7">Fix bugs and technical issues</li>
      </ul>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Data Retention</h2>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">
          <strong class="font-semibold">Uploaded Images:</strong> Deleted immediately after processing
          (within seconds)
        </li>
        <li class="leading-7">
          <strong class="font-semibold">Analytics Data:</strong> Retained by Umami according to their
          retention policies (typically aggregated and anonymised)
        </li>
      </ul>

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
        This tool uses Umami Analytics, which does not use cookies and does not track personal data.
        Umami is fully GDPR compliant and respects user privacy by design. No cookie consent banner
        is required.
      </p>

      <h2 class="mt-8 mb-4 text-2xl font-semibold">Third-Party Services</h2>
      <p class="mb-4 leading-7">This tool uses the following third-party service:</p>
      <ul class="my-4 list-disc space-y-2 pl-6">
        <li class="leading-7">
          <strong class="font-semibold">Umami Analytics:</strong> For privacy-friendly analytics and
          understanding user behavior. Umami is GDPR compliant and does not use cookies or track personal
          data.
        </li>
      </ul>

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
