<script lang="ts">
    interface Props {
        reverseOnSmallScreen?: boolean;
        children?: import('svelte').Snippet;
    }

    let { reverseOnSmallScreen = false, children }: Props = $props();

    const elementFlyIn = (node: HTMLElement) => {
        $effect(() => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.reverse().forEach((entry) => {
                        const shouldShow =
                            entry.isIntersecting || entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
                        if (shouldShow) {
                            entry.target.classList.toggle("show", shouldShow);
                        }
                    });
                },
                {
                    threshold: 0.65,
                },
            );
            observer.observe(node);
            return () => observer.unobserve(node);
        });
    }
</script>

<section class:reverseOnSmallScreen use:elementFlyIn>
    {@render children?.()}
</section>

<style lang="scss">
    @use "$lib/styles/media-queries.scss" as *;

    section {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-top: 5rem;
        padding-bottom: 5rem;
        gap: 4rem;
        font-size: 1.1em;
        max-width: 70vw;

        @include lt-lg {
            flex-direction: column;
            gap: 1rem;

            &.reverseOnSmallScreen {
                flex-direction: column-reverse;
            }
        }
    }
    section {
        opacity: 0%;
        transform: translateX(-8rem);
        transition-property: transform, opacity;
        transition-duration: 0.6s;
        transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    }
    section:nth-child(even) {
        transform: translateX(8rem);
    }
    section:global(.show) {
        transform: translateX(0rem);
        opacity: 100%;
    }
</style>
