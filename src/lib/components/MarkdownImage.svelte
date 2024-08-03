<script lang="ts">
    import Icon from "./Icon.svelte";
    import Image from "$lib/components/Image.svelte";

    export let href = "";
    export let title = undefined;
    export let text = "";

    let valid_url = true;
    $: {
        try {
            const url = new URL(href);
            if (url.protocol == "frame:") {
                // amazing
                valid_url = false;
            } else {
                valid_url = true;
            }
        } catch (_) {
            valid_url = false;
        }
    }
</script>

{#if valid_url}
    <img src={href} {title} alt={text} />
{:else if text.length > 0}
    <div class="image-alt">
        <div class="alt-icon">
            <Icon icon="image" inline />
        </div>
        {text}
    </div>
{:else}
    <div class="image-alt">
        <Icon icon="image-missing" inline />
    </div>
{/if}

<style lang="scss">
    .image-alt {
        display: inline-flex;
        place-items: center;

        font-size: var(--font-size-small);
        gap: 0.1rem;
        vertical-align: -0.125em;
    }
</style>
