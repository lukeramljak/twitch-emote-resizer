<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    message?: string;
    className?: string;
  }

  let { size = 'md', message, className = '' }: Props = $props();

  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
</script>

<div class={`flex items-center justify-center p-4 ${className}`}>
  <div class="flex flex-col items-center gap-2">
    <div class={`animate-spin rounded-full border-b-2 ${sizeMap[size]}`}></div>
    {#if message}<span class="text-sm text-muted-foreground">{message}</span>{/if}
  </div>
</div>
