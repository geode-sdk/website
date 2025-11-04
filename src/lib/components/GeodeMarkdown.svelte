<script lang="ts">
    import { run } from 'svelte/legacy';

    import SvelteMarkdown from "svelte-markdown";
    import { marked } from "marked";
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownLink from "./MarkdownLink.svelte";
    import MarkdownCustom from "./MarkdownCustom.svelte";

    const parseColorString = (color: string) => {
        if (!color) {
            return;
        }

        if (color[0] == "#") {
            color = color.substring(1);
        }

        if (color.length > 6) {
            return;
        }

        // silliness afoot (this is validation, i promise)
        const parsedColor = parseInt(color, 16);
        if (!parsedColor) {
            return;
        }

        return `#${parsedColor.toString(16)}`;
    };

    // this is basically a direct port of the geode function lol
    const parseColorTag = (html_tag: string) => {
        const tag = html_tag.substring(1, html_tag.length - 1);

        if (tag.length > 2 && tag[1] == "-") {
            return parseColorString(tag.substring(2));
        } else if (tag.indexOf(" ") != -1) {
            return parseColorString(tag.substring(tag.indexOf(" ") + 1).trim());
        } else {
            if (tag.length != 2) {
                return;
            }

            const colorText = tag[1];
            switch (colorText) {
                case "a":
                    return "rgba(150, 50, 255)";
                case "b":
                    return "rgba(74, 82, 225)";
                case "c":
                    return "rgba(255, 255, 150)";
                case "d":
                    return "rgba(255, 150, 255)";
                case "f":
                    return "rgba(150, 255, 255)";
                case "g":
                    return "rgba(64, 227, 72)";
                case "j":
                    return "rgba(50, 200, 255)";
                case "l":
                    return "rgba(96, 171, 239)";
                case "o":
                    return "rgba(255, 165, 75)";
                case "p":
                    return "rgba(255, 0, 255)";
                case "r":
                    return "rgba(255, 90, 90)";
                case "s":
                    return "rgba(255, 220, 65)";
                case "y":
                    return "rgba(255, 255, 0)";
            }
        }
    };

    interface Props {
        source: string;
    }

    let { source }: Props = $props();

    let tokens = $derived(marked.lexer(source));

    const colorExp = /^<\/?c[- a-zA-Z0-9]*?>$/;
    run(() => {
        const colors: string[] = [];

        // this is incredibly bad. i'm sorry
        marked.walkTokens(tokens, (token) => {
            if (colorExp.test(token.raw)) {
                const isClosing = token.raw[1] == "/";

                if (!isClosing) {
                    const color = parseColorTag(token.raw);
                    if (color) {
                        colors.push(color);
                    }
                } else {
                    colors.pop();
                }

                token.type = "text";
                token.raw = "";
                return;
            }

            if (colors.length > 0 && token.type == "text") {
                token.type = "html";
                (token as any).color = colors[colors.length - 1];
            }
        });
    });
</script>

<SvelteMarkdown
    renderers={{
        html: MarkdownCustom,
        image: MarkdownImage,
        link: MarkdownLink,
    }}
    source={tokens} />
