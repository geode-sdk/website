<script lang="ts">
    import { run } from 'svelte/legacy';

    interface Props {
        href: string;
        text: string;
    }

    let { href, text }: Props = $props();

    let specialLink = $derived.by(() => {
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

<a href={specialLink}>{text}</a>
