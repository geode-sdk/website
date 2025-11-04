<script lang="ts">
    import { run } from 'svelte/legacy';

    interface Props {
        href: string;
        text: string;
    }

    let { href, text }: Props = $props();

    let specialLink = $state(href);

    run(() => {
        if (href.startsWith("user:")) {
            const [, userId] = href.split(":");
            specialLink = `https://gdbrowser.com/u/${userId}`;
        } else if (href.startsWith("level:")) {
            const [, levelId] = href.split(":");
            specialLink = `https://gdbrowser.com/${levelId}`;
        } else if (href.startsWith("mod:")) {
            const [, modId] = href.split(":");
            specialLink = `/mods/${modId}`;
        }
    });
</script>

<a href={specialLink}>{text}</a>
