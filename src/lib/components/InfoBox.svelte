<script lang="ts">
    import type { Snippet } from "svelte";
    import Icon from "./Icon.svelte";

    interface Props {
        type: "info" | "warning" | "error";
        solid?: boolean;
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

<style lang="css">
    section {
        display: flex;
        flex-direction: row;
        border-radius: 0.5rem;
        max-width: 100%;
        --mix-percentage: 25%;

        background-color: color-mix(in srgb, var(--mix-color) var(--mix-percentage), transparent);
        border: 0.2rem solid color-mix(in srgb, var(--mix-color) var(--mix-percentage), transparent);
        &.solid {
            background-color: var(--mix-color);
            border-color: color-mix(in srgb, white 50%, var(--mix-color));
            box-shadow: 0px 0.25rem 1rem rgba(0, 0, 0, 0.5);
        }

        .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 3em;
        }
        .content-container {
            display: block;
            padding: 0.5rem;
            max-width: min(60ch, 90vw);
        }
        &.info {
            --mix-color: var(--accent-alt-500);
            --mix-percentage: 35%;
            .icon-container {
                color: var(--accent-alt-300);
            }
            &.solid {
                --mix-color: var(--secondary-500);
                color: var(--text-100);
                .icon-container {
                    color: var(--text-100);
                }
                & :global(em) {
                    color: var(--accent-alt-200);
                }
            }
        }
        &.warning {
            --mix-color: var(--primary-300);
            .icon-container {
                color: var(--accent-300);
            }
            &.solid {
                --mix-color: var(--accent-200);
                color: var(--accent-900);
                .icon-container {
                    color: var(--accent-900);
                }
                & :global(em) {
                    color: var(--primary-500);
                }
            }
        }
        &.error {
            --mix-color: var(--primary-500);
            .icon-container {
                color: var(--primary-300);
            }
            &.solid :global(em) {
                color: var(--accent-300);
            }
        }
    }
</style>
