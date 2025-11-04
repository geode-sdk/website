<script lang="ts">
    import type {
        HastBase,
        HastElement,
        HastRoot,
        Plugin,
    } from 'svelte-exmarkdown';
    import Markdown from "svelte-exmarkdown";
    import MarkdownImage from "./MarkdownImage.svelte";
    import MarkdownLink from "./MarkdownLink.svelte";

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

    let { source: md }: Props = $props();

    const colorExp = /^<\/?c[- a-zA-Z0-9]*?>$/;
    const rehypeColorize = () => {
        const colors: string[] = [];

        const traverse = (n: HastBase) => {
            if (n.type == "raw") {
                const tag = n.value ?? '';
                if (colorExp.test(tag)) {
                    const isClosing = tag[1] == "/";

                    if (!isClosing) {
                        const color = parseColorTag(tag);
                        if (color) {
                            colors.push(color);
                        }
                    } else {
                        colors.pop();
                    }

                    n.value = "";
                }
            }

            if (colors.length > 0 && n.type == "text") {
                const selColor = colors[colors.length - 1];

                n.type = "element";
                (n as HastElement).tagName = "span";

                if (!n.properties) {
                    n.properties = {};
                }

                n.properties.style = `--custom-color: ${selColor};`;
                n.properties.class = "md-colored";

                n.children = [{
                    type: "text",
                    value: n.value ?? '',
                    position: n.position,
                    children: n.children,
                }];

                return;
            }

            if ("children" in n && n.children) {
                for (const c of n.children) {
                    traverse(c);
                }
            }
        }

        return (tree: HastRoot) => {
            traverse(tree);
        }
    }

    const plugins: Plugin[] = [{ rehypePlugin: [rehypeColorize] }];
</script>

<Markdown {md} {plugins}>
    {#snippet img(props)}
        <MarkdownImage href={props.src} alt={props.alt} title={props.title} />
    {/snippet}
    {#snippet link(props)}
        <MarkdownLink href={props.href}>{props.children}</MarkdownLink>
    {/snippet}
</Markdown>

<style>
    :global(.md-colored) {
        color: var(--custom-color);
    }

    @media (prefers-contrast: more) {
        :global(.md-colored) {
            color: var(--text-color);
        }
    }
</style>
