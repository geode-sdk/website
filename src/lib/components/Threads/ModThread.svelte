<script lang="ts">
    import type {
        ServerModVersion,
        ServerModVersionThreadComment,
        ServerModVersionThreadLock,
    } from "$lib/api/models/mod-version";
    import ModThreadList from "./ModThreadList.svelte";
    import ModThreadCommentForm from "./ModThreadCommentForm.svelte";
    import InfoBox from "../InfoBox.svelte";

    interface Props {
        modVersion: ServerModVersion;
        initialComments: ServerModVersionThreadComment[];
        lock: ServerModVersionThreadLock;
        isLoggedIn: boolean;
        isAdmin: boolean;
        isModDeveloper: boolean;
        hasAcceptedMod: boolean;
    }

    let { modVersion, initialComments, isLoggedIn, isAdmin, isModDeveloper, hasAcceptedMod, lock }: Props = $props();

    // svelte-ignore state_referenced_locally
    let comments = $state(initialComments);
</script>

<div class="flex flex-col gap-6">
    {#if isLoggedIn}
        {#if lock === "none"}
            {#if isAdmin || isModDeveloper || hasAcceptedMod}
                <ModThreadCommentForm />
            {:else}
                <InfoBox type="warning"
                    >You need to have at least <strong>one accepted mod</strong> on the index to be able to comment</InfoBox>
            {/if}
        {:else if lock === "internal"}
            {#if isAdmin || isModDeveloper}
                <ModThreadCommentForm />
            {:else}
                <InfoBox type="warning"
                    >This thread is restricted to <strong>index admins</strong> and
                    <strong>developers of this mod</strong></InfoBox>
            {/if}
        {:else if isAdmin}
            <ModThreadCommentForm />
        {:else}
            <InfoBox type="warning">This thread is locked</InfoBox>
        {/if}
    {:else}
        <InfoBox type="warning">You must be <strong>logged in</strong> to comment</InfoBox>
    {/if}
    <ModThreadList {comments} />
</div>
