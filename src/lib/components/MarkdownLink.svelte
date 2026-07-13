<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        href: string | null | undefined;
        children: Snippet;
    }

    let { href, children }: Props = $props();

    const isNumeric = (x: string) => {
        return /^\d+$/.test(x);
    };

    const isValidModId = (x: string) => {
        return /^[a-z0-9_\-]+\.[a-z0-9_\-]+$/.test(x);
    };

    let specialLink = $derived.by(() => {
        if (!href) {
            return href;
        }

        if (href.startsWith("user:")) {
            const [, userId] = href.split(":");
            if (!isNumeric(userId)) return undefined;

            return `https://gdbrowser.com/u/${userId}`;
        } else if (href.startsWith("level:")) {
            const [, levelId] = href.split(":");
            if (!isNumeric(levelId)) return undefined;

            return `https://gdbrowser.com/${levelId}`;
        } else if (href.startsWith("mod:")) {
            const [, modId] = href.split(":");
            if (!isValidModId(modId)) return undefined;

            return `/mods/${modId}`;
        } else if (href.startsWith("https:") || href.startsWith("http:")) {
            return href;
        } else {
            return undefined;
        }
    });
</script>

<a href={specialLink}>{@render children?.()}</a>
