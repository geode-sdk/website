<script lang="ts">
    import { enhance } from "$app/forms";
    import { getContext } from "svelte";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
    import Textarea from "../ui/Textarea.svelte";
    import { type ActionData } from "../../../routes/mods/[id]/$types";
    import InfoBox from "../InfoBox.svelte";

    interface Props {
        version: string;
    }
    let { version }: Props = $props();

    const textareaOnKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Enter" || e.shiftKey) {
            return;
        }

        const submitButton = document.querySelector("#mod-thread-new-comment-form button[type='submit']") as
            | HTMLButtonElement
            | undefined;
        submitButton?.click();
    };

    const actionData = getContext<() => ActionData | null>("ActionData");
</script>

<div class="w-full">
    <form
        id="mod-thread-new-comment-form"
        method="POST"
        action="?/comment"
        enctype="multipart/form-data"
        class="flex flex-col"
        use:enhance>
        <input type="hidden" name="version" value={version} />
        <div class="max-h-60">
            <Textarea
                onkeydown={textareaOnKeyDown}
                name="comment"
                id="mod-thread-comment"
                placeholder="Enter your new comment here"
                class="h-full max-h-60 min-h-30 rounded-b-none" />
        </div>
        <div class="bg-background-800 flex justify-between gap-2 rounded rounded-t-none p-2">
            <small>Press Enter to post. Press Shift + Enter to go on a new row.</small>
            <div class="flex items-center gap-2">
                <input type="file" name="files" accept="image/*" multiple />
                <Button type="submit" size="small" design="primary-filled">
                    <Icon icon="update" />
                    Post
                </Button>
            </div>
        </div>
    </form>
    {#if actionData()?.action === "comment" && actionData()?.error}
        <div class="mt-2">
            <InfoBox type="error">{actionData()?.error}</InfoBox>
        </div>
    {/if}
    {#if actionData()?.action === "comment" && actionData()?.attachmentError}
        <div class="mt-2">
            <InfoBox type="warning">{actionData()?.attachmentError}</InfoBox>
        </div>
    {/if}
</div>
