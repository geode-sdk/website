<script lang="ts">
    import { enhance } from "$app/forms";
    import { getContext } from "svelte";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
    import Textarea from "../ui/Textarea.svelte";
    import FileInput from "../ui/FileInput.svelte";
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

    let submitting = $state(false);
</script>

<div class="w-full">
    <form
        id="mod-thread-new-comment-form"
        method="POST"
        action="?/comment"
        enctype="multipart/form-data"
        class="flex flex-col"
        use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
                submitting = false;
                await update();
            };
        }}>
        <input type="hidden" name="version" value={version} />
        <div class="max-h-60">
            <Textarea
                onkeydown={textareaOnKeyDown}
                name="comment"
                id="mod-thread-comment"
                placeholder="Enter your new comment here"
                class="h-full max-h-60 min-h-30 border-b-0 rounded-b-none" />
        </div>
        <div class="flex border-background-800 border-2 border-t-0 items-center justify-between flex-wrap gap-2 rounded rounded-t-none p-2">
            <small>Press Enter to post. Press Shift + Enter to go on a new line.</small>
            <div class="flex gap-2">
                <FileInput id="mod-thread-comment-files" name="files" accept="image/*" multiple size="small" />
                <Button type="submit" size="small" design="primary-filled" disabled={submitting}>
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
