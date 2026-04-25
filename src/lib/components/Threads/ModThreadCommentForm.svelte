<script lang="ts">
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";
</script>

<div class="w-full">
    <form id="mod-thread-new-comment-form" action="" class="flex flex-col">
        <div class="max-h-60">
            <textarea
                name="comment"
                id="mod-thread-comment"
                class="border-background-800 field-sizing-content h-full max-h-60 min-h-30 w-full overflow-auto rounded rounded-b-none border-2 p-2 outline-0"
                placeholder="Enter your new comment here"></textarea>
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
