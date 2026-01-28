<script lang="ts">
    type Type = "circle" | "plain" | "plain-mono";
    interface Props {
        type: Type;
    }

    let { type }: Props = $props();

    const svgFileName = $derived.by(() => {
        switch (type) {
            case "circle":
                return "geode-logo";
            case "plain":
                return "geode-logo-plain";
            case "plain-mono":
                return "geode-logo-plain-mono";
        }
    });
</script>

<div class="geode-logo">
    {#await import(`../assets/${svgFileName}.svg?raw`) then svg}
        {@html svg.default}
    {/await}
</div>

<style is:global>
    .geode-logo {
        display: flex;
        width: var(--font-size-geode);
        height: var(--font-size-geode);
        fill: var(--text-50);
    }
    .geode-logo > :global(svg) {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0px 0px 3rem var(--primary-700));
    }
</style>
