<script lang="ts">
    import Icon from "./Icon.svelte";

    export let type: "info" | "warning" | "error";
</script>

<section class={type}>
    <span class="icon-container">
        <Icon icon={type} />
    </span>
    <span class="content-container"><slot /></span>
</section>

<style lang="scss">
    section {
        display: flex;
        flex-direction: row;
        border-radius: 0.5rem;
        max-width: min(60ch, 90vw);

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
            background-color: color-mix(
                in srgb,
                var(--accent-alt-500) 35%,
                transparent
            );
            border: 0.2rem solid
                color-mix(in srgb, var(--accent-alt-500) 35%, transparent);
            .icon-container {
                color: var(--accent-alt-300);
            }
        }
        &.warning {
            background-color: color-mix(
                in srgb,
                var(--primary-300) 25%,
                transparent
            );
            border: 0.2rem solid
                color-mix(in srgb, var(--primary-300) 25%, transparent);
            .icon-container {
                color: var(--accent-300);
            }
        }
        &.error {
            background-color: color-mix(
                in srgb,
                var(--primary-500) 25%,
                transparent
            );
            border: 0.2rem solid
                color-mix(in srgb, var(--primary-500) 25%, transparent);
            .icon-container {
                color: var(--primary-300);
            }
        }
    }
</style>
