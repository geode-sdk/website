<script lang="ts">
    import type { KnownIcon } from "$lib";
    import type { Snippet } from "svelte";
    import cx from "$lib/cx";
    import Icon from "./Icon.svelte";
    import type { ClassValue } from "clsx";

    type Style = "primary-filled-dark" | "primary-filled" | "secondary-filled" | "hollow" | "dark-small";
    type Size = "large" | "normal" | "small";
    interface Props {
        design?: Style;
        href?: string | undefined;
        icon?: KnownIcon | undefined;
        iconOnRight?: boolean;
        disabled?: boolean;
        class?: ClassValue;
        size?: Size;
        type?: "button" | "submit" | "reset";
        onclick?: () => void;
        children?: Snippet;
    }

    let {
        design = "hollow",
        href = undefined,
        icon = undefined,
        iconOnRight = false,
        disabled = false,
        type = "button",
        class: className = undefined,
        size = "normal",
        onclick,
        children,
    }: Props = $props();

    const isLink = $derived(href !== undefined);
</script>

<svelte:element
    this={isLink ? "a" : "button"}
    role={isLink ? "link" : "button"}
    type={!isLink ? type : undefined}
    {href}
    {disabled}
    class={cx(
        "flex items-center justify-center gap-3 rounded-md border-2 border-solid p-3 shadow-md transition-colors select-none hover:cursor-pointer",
        design === "primary-filled-dark" &&
            "border-primary-950 bg-primary-950 text-primary-300 hover:border-primary-50 hover:bg-primary-50 hover:text-secondary-950",
        design === "primary-filled" &&
            "border-primary-300 bg-primary-300 text-primary-950 hover:border-primary-50 hover:bg-primary-50 hover:text-secondary-950",
        design === "secondary-filled" &&
            "border-secondary-300 bg-secondary-300 text-secondary-950 hover:border-secondary-50 hover:bg-secondary-50 hover:text-secondary-950",
        design === "hollow" &&
            "border-secondary-300 text-secondary-300 hover:border-secondary-50 hover:bg-secondary-50 hover:text-secondary-950 bg-transparent",
        design === "dark-small" &&
            "border-background-300 text-background-300 hover:border-secondary-50 hover:bg-secondary-50 hover:text-secondary-950 gap-1 bg-transparent p-1",
        disabled && "border-background-800 bg-background-800 text-background-50 pointer-events-none opacity-35",
        size === "small" && "gap-2 p-1.5 text-sm",
        className,
    )}
    {onclick}>
    {#if iconOnRight}
        {@render children?.()}
    {/if}
    {#if icon}
        <Icon {icon} --icon-size="1.5em" />
    {/if}
    {#if !iconOnRight}
        {@render children?.()}
    {/if}
</svelte:element>
