<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight";
    import githubDark from "svelte-highlight/styles/github-dark";
    import stripIndent from "strip-indent";
    import { cpp, type LanguageType } from "svelte-highlight/languages";

    export let code: string;
    export let language: LanguageType<string> = cpp;
</script>

<svelte:head>
    {@html githubDark}
</svelte:head>

<Highlight {language} code={stripIndent(code).trim()} let:highlighted>
    <!-- <LineNumbers {highlighted} hideBorder --line-number-color="var(--secondary-500)" /> -->
</Highlight>
