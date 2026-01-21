<script lang="ts">
    import type { Snippet } from "svelte";
    import Icon from "./Icon.svelte";

    interface Props {
        type: "info" | "warning" | "error";
        solid?: boolean,
        children?: Snippet;
    }

    let { type, solid = false, children }: Props = $props();
</script>

<section class={[type, { solid }]}>
    <span class="icon-container">
        <Icon icon={type} />
    </span>
    <span class="content-container">{@render children?.()}</span>
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: row;
        border-radius: 0.5rem;
        max-width: min(60ch, 90vw);
        --mix-percentage: 25%;

        background-color: color-mix(in srgb, var(--mix-color) var(--mix-percentage), transparent);
        border: 0.2rem solid color-mix(in srgb, var(--mix-color) var(--mix-percentage), transparent);
        &.solid {
            background-color: var(--mix-color);
            border-color: color-mix(in srgb, white 50%, var(--mix-color));
            box-shadow: 0px .25rem 1rem rgba(0, 0, 0, .5);
        }

        .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 3em;
        }
        .content-container {
            padding: 0.5rem;
        }
        &.info {
            --mix-color: var(--accent-alt-500);
            --mix-percentage: 35%;
            .icon-container {
                color: var(--accent-alt-300);
            }
        }
        &.warning {
            --mix-color: var(--primary-300);
            &.solid {
                --mix-color: var(--accent-700);
            }
            .icon-container {
                color: var(--accent-300);
            }
        }
        &.error {
            --mix-color: var(--primary-500);
            .icon-container {
                color: var(--primary-300);
            }
            & :global(em) {
                color: var(--accent-300);
            }
        }
    }
</style>
