<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        href: string | null | undefined;
        children: Snippet;
    }

    let { href, children }: Props = $props();

    let specialLink = $derived.by(() => {
        if (!href) {
            return href;
        }

        if (href.startsWith("user:")) {
            const [, userId] = href.split(":");
            return `https://gdbrowser.com/u/${userId}`;
        } else if (href.startsWith("level:")) {
            const [, levelId] = href.split(":");
            return `https://gdbrowser.com/${levelId}`;
        } else if (href.startsWith("mod:")) {
            const [, modId] = href.split(":");
            return `/mods/${modId}`;
        } else {
            return href;
        }
    });
</script>

<a href={specialLink}>{@render children()}</a>
