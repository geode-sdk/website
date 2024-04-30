<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight";
    import cpp from "svelte-highlight/languages/cpp";
    import githubDark from "svelte-highlight/styles/github-dark";
    import stripIndent from "strip-indent";

    export let code: string;
</script>

<svelte:head>
    {@html githubDark}
</svelte:head>

<Highlight language={cpp} code={stripIndent(code).trim()} let:highlighted>
    <!-- <LineNumbers {highlighted} hideBorder --line-number-color=var(--secondary-500)/> -->
</Highlight>

<style lang="scss">
    :global(pre) {
        background-color: var(--background-950);
        padding: 1px;
        border-radius: calc(.5rem + 1px);
        box-shadow: 0px 0px 7rem color-mix(in srgb, var(--primary-500) 10%, transparent);

        & > :global(code) {
            color: var(--text-50);
            display: block;
            background-color: var(--background-950);
            border: 1px color-mix(in srgb, var(--background-300) 50%, transparent) solid;
            padding: 1rem;
            border-radius: .5rem;
            tab-size: 4;
        }
    }
</style>
