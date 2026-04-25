<script lang="ts">
    import cx from "$lib/cx";
    import type { Snippet } from "svelte";

    interface Props {
        children?: Snippet;
        semitransparent?: boolean;
        class?: string;
    }

    const { children, class: className = undefined, semitransparent = false }: Props = $props();
</script>

<div
    class={cx(
        "bg-background-950 rounded-md p-3 shadow-md",
        semitransparent && "bg-background-950/70 backdrop-blur-sm",
        className
    )}>
    {@render children?.()}
</div>
