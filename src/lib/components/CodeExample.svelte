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
