<script lang="ts">
    import Icon from "./Icon.svelte";

    export let type: "verified" | "admin";
    export let iconOnly: boolean = false;
</script>

<span class="dev-tag {type}">
    <Icon icon={type} --icon-size="0.9rem" />
    {#if iconOnly !== true}
        {type}
    {/if}
</span>

<style lang="scss">
    .dev-tag {
        display: flex;
        align-items: center;
        gap: 0.1rem;
        border: 1px solid var(--secondary-300);
        font-size: small;
        background-color: var(--secondary-800);
        text-align: center;
        padding: 0.3rem;
        border-radius: 0.25rem;

        &.verified {
            border-color: var(--accent-alt-300);
            background-color: var(--accent-alt-800);
        }
    }
</style>
