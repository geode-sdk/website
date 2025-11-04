<script lang="ts">
    type Type = "circle" | "plain" | "plain-mono";
    interface Props {
        type: Type;
    }

    let { type }: Props = $props();

    let svgFileName = $state();
    switch (type) {
        case "circle":
            svgFileName = "geode-logo";
            break;
        case "plain":
            svgFileName = "geode-logo-plain";
            break;
        case "plain-mono":
            svgFileName = "geode-logo-plain-mono";
            break;
    }
</script>

<div class="geode-logo">
    {#await import(`../assets/${svgFileName}.svg?raw`) then svg}
        {@html svg.default}
    {/await}
</div>

<style is:global>
    .geode-logo {
        display: flex;
        width: var(--font-size-title);
        height: var(--font-size-title);
        fill: var(--text-50);
    }
    .geode-logo > :global(svg) {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0px 0px 3rem var(--primary-700));
    }
</style>
