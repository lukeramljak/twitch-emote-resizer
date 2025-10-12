<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'default' | 'secondary';
  }

  let { children, variant = 'default', class: className, ...rest }: Props = $props();

  const variantStyles = {
    default: 'bg-primary hover:bg-primary/70',
    secondary: 'bg-accent hover:bg-accent'
  };

  const buttonClass = $derived(
    `inline-flex cursor-pointer items-center gap-2 rounded-lg px-4 py-2 font-medium shadow-md transition-colors duration-200 ${variantStyles[variant]} ${className || ''}`
  );
</script>

<button class={buttonClass} {...rest}>
  {@render children?.()}
</button>
