<script lang="ts">
  import type { ResizedImage } from '$lib/types';
  import MoonIcon from './moon-icon.svelte';
  import SunIcon from './sun-icon.svelte';

  interface Props {
    badge?: ResizedImage;
    emote: ResizedImage;
  }

  let { badge, emote }: Props = $props();

  let theme = $state<'light' | 'dark'>('dark');

  const bg = $derived(theme === 'light' ? 'bg-twitch-light' : 'bg-twitch-dark');
  const text = $derived(theme === 'light' ? 'text-[#e1654e]' : 'text-[#fb9c8a]');
</script>

{#if emote}
  <div
    class={`flex h-8 w-[300px] items-center justify-between rounded-md px-3 py-5 ${bg} transition-colors`}
  >
    <div class="flex items-center justify-start gap-2">
      {#if badge}
        <img
          src={badge.content}
          width={badge.metadata.width}
          height={badge.metadata.height}
          alt="Preview of the emote when used as a badge"
          class="h-[18px] w-[18px]"
        />
      {/if}
      <span class={`text-[13px] font-bold ${text}`}>lukeramljak</span>
      <img
        src={emote.content}
        width={emote.metadata.width}
        height={emote.metadata.height}
        alt="Preview of the emote when used in a message"
        class="h-[28px] w-[28px]"
      />
    </div>
    <div class="flex">
      {#if theme === 'dark'}
        <button onclick={() => (theme = 'light')}>
          <MoonIcon />
        </button>
      {:else}
        <button onclick={() => (theme = 'dark')} class="text-twitch-dark">
          <SunIcon />
        </button>
      {/if}
    </div>
  </div>
{/if}
