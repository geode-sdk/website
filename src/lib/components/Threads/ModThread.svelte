<script lang="ts">
    import type {
        ServerModVersionThreadComment,
        ServerModVersionThreadLock,
    } from "$lib/api/models/mod-version";
    import ModThreadList from "./ModThreadList.svelte";
    import ModThreadCommentForm from "./ModThreadCommentForm.svelte";
    import InfoBox from "../InfoBox.svelte";
    import type { ServerDeveloperProfile } from "$lib/api/models/base";
    import { getUserContext } from "$lib/context/user";
    import { getModContext } from "$lib/context/mod";

    interface Props {
        comments: ServerModVersionThreadComment[];
        lock: ServerModVersionThreadLock;
        currentUser: ServerDeveloperProfile | null;
    }

    let { comments, lock }: Props = $props();

    const currentUser = getUserContext();
    const mod = getModContext();

    const isModDeveloper = $derived(mod.developers.find((i) => i.id === currentUser?.id));
    // const isLoggedIn = $derived(currentUser !== null);
    const isLoggedIn = $derived(true);
    const isAdmin = $derived(currentUser?.admin === true);
    // const hasAcceptedMod = $derived(currentUser?.has_accepted_mod === true);
    const hasAcceptedMod = $derived(true);
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
