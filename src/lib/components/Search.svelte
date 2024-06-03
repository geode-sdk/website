<script lang="ts">
    import Icon from "./Icon.svelte";

    export let placeholder: string;
</script>

<div class="search">
    <Icon icon="search"/>
    <input placeholder={placeholder}>
</div>

<style lang="scss">
    div.search {
        display: flex;
        flex-direction: row;
        align-items: center;

        border-radius: .5rem;
        background-color: var(--background-950);
        color: var(--text-50);
        font-family: var(--font-body);

        & > :global(*:first-child) {
            margin-left: 1rem;
            opacity: 50%;
        }
        & > input {
            background-color: transparent;
            padding: 1rem;
            flex-grow: 1;
            border: none;
            outline: none;
            color: var(--text-50);
            
            &::placeholder {
                font-family: var(--font-body);
                color: var(--text-50);
                opacity: 50%;
            }
        }
    }
</style>
