<script lang="ts">
    import Highlight from "svelte-highlight";
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

<Highlight {language} code={stripIndent(code).trim()} />
