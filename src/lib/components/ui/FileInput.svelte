<script lang="ts">
    import cx from "$lib/cx";
    import type { ClassValue } from "clsx";
    import { type HTMLInputAttributes } from "svelte/elements";
    import Icon from "../Icon.svelte";

    type Size = "normal" | "small";
    type Props = {
        class?: ClassValue;
        files?: FileList;
        id: string;
        size?: Size;
    } & Omit<HTMLInputAttributes, "type" | "id" | "size">;

    let { class: classValue, files = $bindable(), id, size = "normal", ...restProps }: Props = $props();
</script>

<div class={cx("flex items-center gap-2", classValue)}>
    <label
        for={id}
        class={cx(
            "flex items-center justify-center gap-3 rounded-md border-2 border-solid border-background-300 p-3 text-background-300 shadow-md transition-colors select-none hover:cursor-pointer hover:border-secondary-50 hover:bg-secondary-50 hover:text-secondary-950",
            size === "small" && "gap-2 p-1.5",
        )}>
        <Icon icon="attachment" --icon-size="1.5em" />
    </label>
    <input bind:files {id} class="sr-only" type="file" {...restProps} />
    {#if files && files.length > 0}
        <span
            class="max-w-40 truncate text-sm text-background-300"
            title={files.length === 1 ? files[0].name : Array.from(files, (f) => f.name).join(", ")}>
            {files.length === 1 ? files[0].name : `${files.length} files selected`}
        </span>
    {/if}
</div>
