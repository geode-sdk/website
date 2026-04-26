<script lang="ts">
    import { enhance } from "$app/forms";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
    import Textarea from "../ui/Textarea.svelte";
</script>

<div class="w-full">
    <form id="mod-thread-new-comment-form" method="POST" action="?/comment" class="flex flex-col" use:enhance>
        <div class="max-h-60">
            <Textarea
                name="comment"
                id="mod-thread-comment"
                placeholder="Enter your new comment here"
                class="h-full max-h-60 min-h-30" />
        </div>
        <div class="bg-background-800 flex justify-between gap-2 rounded rounded-t-none p-2">
            <small>Press Enter to post. Press Shift + Enter to go on a new row.</small>
            <Button type="submit" size="small" design="primary-filled">
                <Icon icon="update" />
                Post
            </Button>
        </div>
    </form>
</div>
