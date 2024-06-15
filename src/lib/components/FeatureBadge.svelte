<script>
    import Icon from "./Icon.svelte";
</script>
<span class="feature-badge">
    <Icon icon="featured" --icon-display="block" --icon-size="1.25rem" />
</span>

<style lang="scss">
    .feature-badge {
        background-color: color-mix(in srgb, var(--accent-200) 15%, transparent);
        color: var(--accent-100);
        border-radius: 0.25rem;

        padding-left: 0.3rem;
        padding-right: 0.3rem;
        padding-top: 0.125rem;
        padding-bottom: 0.125rem;

        margin-left: 0.375rem;
    }
</style>