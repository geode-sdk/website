<script lang="ts">
    import Icon from "./Icon.svelte";

    interface Props {
        href?: string | null;
        title?: string | null;
        alt?: string | null;
    }

    let { href = "", title = undefined, alt }: Props = $props();

    let valid_url = $derived.by(() => {
        if (!href) {
            return false;
        }

        try {
            const url = new URL(href);
            if (url.protocol == "frame:") {
                // amazing
                return false;
            } else {
                return true;
            }
        } catch (_) {
            return false;
        }
    });
</script>

{#if valid_url}
    <img src={href} {title} {alt} />
{:else if alt && alt.length > 0}
    <div class="image-alt">
        <div class="alt-icon">
            <Icon icon="image" inline />
        </div>
        {alt}
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
