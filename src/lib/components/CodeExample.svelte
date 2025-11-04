<script lang="ts">
    import Highlight, { LineNumbers } from "svelte-highlight";
    import githubDark from "svelte-highlight/styles/github-dark";
    import stripIndent from "strip-indent";
    import { cpp, type LanguageType } from "svelte-highlight/languages";

    interface Props {
        code: string;
        language?: LanguageType<string>;
    }

    let { code, language = cpp }: Props = $props();
</script>

<svelte:head>
    {@html githubDark}
</svelte:head>

<Highlight {language} code={stripIndent(code).trim()} >
    {#snippet children({ highlighted })}
        <!-- <LineNumbers {highlighted} hideBorder --line-number-color="var(--secondary-500)" /> -->
    {/snippet}
</Highlight>
