<script lang="ts">
    import type { KnownIcon } from "$lib";
    import { pushState } from "$app/navigation";
    import Icon from "./Icon.svelte";

    interface Props {
        icon?: KnownIcon | undefined;
        href: string;
        bold?: boolean;
        centered?: boolean;
        newTab?: boolean;
        children?: import('svelte').Snippet;
    }

    let {
        icon = undefined,
        href,
        bold = false,
        centered = false,
        newTab = false,
        children
    }: Props = $props();

    function scrollToElement(id: string) {
        // Remove any existing scroll highlights
        document.querySelectorAll(".highlight-scrolled").forEach((e) => e.classList.remove("highlight-scrolled"));

        const target = document.querySelector(id);
        if (target) {
            target.classList.add("highlight-scrolled");
            target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
            const url = new URL(window.location.href);
            url.hash = id;
            pushState(url, {});
        }
    }

    function smoothScrollToAnchor(e: MouseEvent) {
        e.preventDefault();
        const anchor = e.currentTarget! as HTMLAnchorElement;
        scrollToElement(anchor.getAttribute("href") ?? "");
    }
</script>

<svelte:window onhashchange={() => scrollToElement(window.location.hash)} />

<a
    {href}
    style={bold ? "--link-weight: 600" : undefined}
    onclick={href.startsWith("#") ? smoothScrollToAnchor : undefined}
    target={newTab ? "_blank" : undefined}
    rel={newTab ? "noopener noreferrer" : undefined}>
    {#if icon}
        <Icon {icon} --icon-size="1.15em" />
    {/if}
    <span class:centered>{@render children?.()}</span>
</a>

<style lang="scss">
    :global(:root) {
        --link-hover: var(--text-50);
        --link-color: var(--text-color);
    }

    a {
        text-decoration: none;

        display: inline-flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap-small);
        font-weight: var(--link-weight);
        font-size: var(--font-size);

        transition: color, text-decoration;
        transition-duration: var(--transition-duration);

        color: var(--link-color);

        &:hover {
            text-decoration: underline;
            color: var(--link-hover);
        }
        & span.centered {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    /*
    a.active {
        background-color: red;
    }
    */
</style>
