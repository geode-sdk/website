<script lang="ts">
    export let name: string;
    export let alt: string;
    export let style: "glow" | "shadow" | undefined = undefined;
    export let size: string = "min(90ch, 90vw)";

    // thank you to https://github.com/newsroomdev/portfolio/blob/27c0602049dfe0c5a5a2afa2a830dd92218f7370/src/lib/Img.svelte#L5
    // for being an actual example on how to do this
    const allImages = import.meta.glob("$lib/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}", {
        import: "default",
        eager: true,
        query: { enhanced: true },
    });
    let src = Object.entries(allImages)
        .filter(([k, _]) => k.includes(name))
        .map(([_, v]) => v as string)[0];
</script>

<div style="--img-size: {size}">
    {#if src}
        <enhanced:img {src} {alt} class={style} sizes={size} />
    {:else}
        <p style="color:red;">Image {name} not found</p>
    {/if}
</div>

<style lang="scss">
    div {
        max-width: var(--img-size);
        & > :global(picture > img) {
            border-radius: 0.25rem;
            width: 100%;
            height: auto;
            &.glow {
                box-shadow: 0 0 7rem color-mix(in srgb, var(--primary-500) 25%, transparent);
            }
            &.shadow {
                box-shadow: 0 0 5rem color-mix(in srgb, var(--background-700) 75%, transparent);
            }
        }
    }
</style>
