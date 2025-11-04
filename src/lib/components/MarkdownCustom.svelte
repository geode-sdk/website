<script lang="ts">
    interface Props {
        text?: string | undefined;
        color?: string | undefined;
        raw: string;
    }

    let { text = undefined, color = undefined, raw }: Props = $props();
</script>

{#if text}
    <span class="colored" style={`--custom-color: ${color}`}>{raw}</span>
{/if}

<style lang="scss">
    .colored {
        color: var(--custom-color);
    }

    @media (prefers-contrast: more) {
        .colored {
            color: var(--text-color);
        }
    }
</style>
