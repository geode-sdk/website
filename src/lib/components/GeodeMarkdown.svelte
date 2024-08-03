<script lang="ts">
    import SvelteMarkdown from "svelte-markdown";
    import Empty from "$lib/components/Empty.svelte";
    import MarkdownImage from "./MarkdownImage.svelte";

    export let source: string;
</script>

<SvelteMarkdown renderers={{ html: Empty, image: MarkdownImage }} {source} />
