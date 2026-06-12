<svelte:head>
  <title>Twitch Emote Resizer - Download Desktop App</title>
</svelte:head>

<div class="flex flex-col">
  <!-- Header -->
  <header class="border-b border-purple-900 py-6">
    <div class="mx-auto max-w-4xl px-6 sm:px-8">
      <h1 class="text-4xl font-bold text-purple-400">Twitch Emote Resizer</h1>
      <p class="mt-2 text-lg text-gray-300">Batch resize images and GIFs for Twitch emotes and badges</p>
    </div>
  </header>

  <!-- Main Content -->
  <main class="flex-1 py-12">
    <div class="mx-auto max-w-4xl px-6 sm:px-8">
      <!-- Features -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold">Features</h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-lg border border-purple-900 bg-purple-950/30 p-6">
            <h3 class="mb-2 text-xl font-semibold text-purple-300">Batch Processing</h3>
            <p class="text-gray-300">Upload multiple images and GIFs at once for instant resizing.</p>
          </div>
          <div class="rounded-lg border border-purple-900 bg-purple-950/30 p-6">
            <h3 class="mb-2 text-xl font-semibold text-purple-300">Multiple Formats</h3>
            <p class="text-gray-300">Support for PNG, JPG, WebP, SVG, and animated GIFs.</p>
          </div>
          <div class="rounded-lg border border-purple-900 bg-purple-950/30 p-6">
            <h3 class="mb-2 text-xl font-semibold text-purple-300">Local Processing</h3>
            <p class="text-gray-300">All processing happens on your device. Your files never leave your computer.</p>
          </div>
          <div class="rounded-lg border border-purple-900 bg-purple-950/30 p-6">
            <h3 class="mb-2 text-xl font-semibold text-purple-300">Fast & Free</h3>
            <p class="text-gray-300">No sign-up required. No ads. No limits. Completely free to use.</p>
          </div>
        </div>
      </section>

      <!-- Download Section -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold">Download</h2>
        <div class="grid gap-4 sm:grid-cols-3">
          <a
            href="https://github.com/lukeramljak/emote-resizer/releases/latest/download/Twitch.Emote.Resizer_0.1.0_x64.msi"
            class="flex items-center justify-center rounded-lg border border-purple-500 bg-purple-600 px-6 py-4 font-semibold text-white transition hover:bg-purple-700"
          >
            Windows
          </a>
          <a
            href="https://github.com/lukeramljak/emote-resizer/releases/latest/download/Twitch.Emote.Resizer.dmg"
            class="flex items-center justify-center rounded-lg border border-purple-500 bg-purple-600 px-6 py-4 font-semibold text-white transition hover:bg-purple-700"
          >
            macOS
          </a>
          <a
            href="https://github.com/lukeramljak/emote-resizer/releases/latest/download/twitch-emote-resizer_0.1.0_amd64.AppImage"
            class="flex items-center justify-center rounded-lg border border-purple-500 bg-purple-600 px-6 py-4 font-semibold text-white transition hover:bg-purple-700"
          >
            Linux
          </a>
        </div>
        <p class="mt-4 text-center text-sm text-gray-400">
          Or <a href="https://github.com/lukeramljak/emote-resizer/releases/latest" class="text-purple-400 hover:underline">view all releases</a>
        </p>
      </section>

      <!-- How It Works -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold">How It Works</h2>
        <ol class="space-y-4">
          <li class="flex gap-4">
            <span class="flex-shrink-0 rounded-full bg-purple-600 px-3 py-1 font-semibold">1</span>
            <p class="text-gray-300">Download and install the app for your operating system</p>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 rounded-full bg-purple-600 px-3 py-1 font-semibold">2</span>
            <p class="text-gray-300">Upload your images or animated GIFs (or drag and drop)</p>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 rounded-full bg-purple-600 px-3 py-1 font-semibold">3</span>
            <p class="text-gray-300">Get instant resized versions for Twitch emotes and badges</p>
          </li>
          <li class="flex gap-4">
            <span class="flex-shrink-0 rounded-full bg-purple-600 px-3 py-1 font-semibold">4</span>
            <p class="text-gray-300">Download individually or as a ZIP file</p>
          </li>
        </ol>
      </section>

      <!-- Sizes -->
      <section class="mb-12">
        <h2 class="mb-6 text-3xl font-bold">Output Sizes</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-purple-900">
                <th class="px-4 py-2 text-left font-semibold text-purple-300">Type</th>
                <th class="px-4 py-2 text-left font-semibold text-purple-300">Sizes (px)</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-purple-900">
                <td class="px-4 py-2 text-gray-300">Emotes (PNG)</td>
                <td class="px-4 py-2 text-gray-400">112×112, 56×56, 28×28</td>
              </tr>
              <tr class="border-b border-purple-900">
                <td class="px-4 py-2 text-gray-300">Badges (PNG)</td>
                <td class="px-4 py-2 text-gray-400">72×72, 36×36, 18×18</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-gray-300">Animated Emotes (GIF)</td>
                <td class="px-4 py-2 text-gray-400">112×112, 56×56, 28×28</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Privacy -->
      <section class="mb-12 rounded-lg border border-purple-900 bg-purple-950/30 p-6">
        <h2 class="mb-4 text-2xl font-bold">Privacy</h2>
        <p class="text-gray-300">
          Your files are processed entirely on your computer. Nothing is uploaded to any servers. The app is fully open-source and respects your privacy by design.
        </p>
        <p class="mt-4">
          <a href="/privacy" class="text-purple-400 hover:underline">Read our privacy policy</a>
        </p>
      </section>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-purple-900 py-8">
    <div class="mx-auto max-w-4xl px-6 sm:px-8">
      <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p class="text-sm text-gray-400">© 2025 Twitch Emote Resizer. Open source on GitHub.</p>
        <div class="flex gap-6">
          <a
            href="https://github.com/lukeramljak/emote-resizer"
            target="_blank"
            rel="noopener noreferrer"
            class="text-purple-400 hover:text-purple-300"
          >
            GitHub
          </a>
          <a href="/privacy" class="text-purple-400 hover:text-purple-300">Privacy</a>
        </div>
      </div>
    </div>
  </footer>
</div>
