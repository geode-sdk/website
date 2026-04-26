<script lang="ts">
    import cx from "$lib/cx";
    import type { ClassValue } from "clsx";
    import { type HTMLTextareaAttributes } from "svelte/elements";

    type Props = {
        class?: ClassValue;
        value?: string;
    } & HTMLTextareaAttributes;

    const { value = "", class: classValue, ...restProps }: Props = $props();
</script>

<textarea
    class={cx(
        classValue,
        "border-background-800 field-sizing-content w-full overflow-auto rounded rounded-b-none border-2 p-2 outline-0",
    )}
    {value}
    {...restProps}></textarea>
