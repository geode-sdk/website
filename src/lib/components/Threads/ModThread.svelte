<script lang="ts">
    import type { ServerModVersionThreadComment, ServerModVersionThreadLock } from "$lib/api/models/mod-version";
    import ModThreadList from "./ModThreadList.svelte";
    import ModThreadCommentForm from "./ModThreadCommentForm.svelte";
    import InfoBox from "../InfoBox.svelte";
    import type { ServerDeveloperProfile } from "$lib/api/models/base";
    import { getUserContext } from "$lib/context/user";
    import { getModContext } from "$lib/context/mod";
    import { enhance } from "$app/forms";
    import Select from "$lib/components/Select.svelte";
    import SelectOption from "$lib/components/SelectOption.svelte";
    import { untrack } from "svelte";

    interface Props {
        comments: ServerModVersionThreadComment[];
        lock: ServerModVersionThreadLock;
        currentUser: ServerDeveloperProfile | null;
        version: string;
    }

    let { comments, lock, version }: Props = $props();

    let lockForm: HTMLFormElement | undefined = $state();
    let lockValue: ServerModVersionThreadLock = $state(untrack(() => lock));

    const currentUser = getUserContext();
    const mod = getModContext();

    const isModDeveloper = $derived(mod.developers.find((i) => i.id === currentUser?.id));
    const isLoggedIn = $derived(currentUser !== null);
    const isAdmin = $derived(currentUser?.admin === true);
    const hasAcceptedMod = $derived(currentUser?.has_accepted_mod === true);
</script>

<div class="flex flex-col gap-6">
    {#if isAdmin}
        <form
            bind:this={lockForm}
            method="POST"
            action="?/update_lock"
            use:enhance={() => {
                return async ({ update }) => {
                    await update();
                };
            }}>
            <input type="hidden" name="version" value={version} />
            <input type="hidden" name="lock" bind:value={lockValue} />
            <Select
                title="Thread"
                titleIcon="status"
                select={(value) => {
                    lockValue = value as ServerModVersionThreadLock;
                    lockForm?.requestSubmit();
                }}>
                <SelectOption icon="status" title="Open" value="none" isDefault={lock === "none"} />
                <SelectOption icon="time" title="Internal" value="internal" isDefault={lock === "internal"} />
                <SelectOption icon="rejected" title="Locked" value="locked" isDefault={lock === "locked"} />
            </Select>
        </form>
    {/if}
    {#if isLoggedIn}
        {#if lock === "none"}
            {#if isAdmin || isModDeveloper || hasAcceptedMod}
                <ModThreadCommentForm {version} />
            {:else}
                <InfoBox type="warning"
                    >You need to have at least <strong>one accepted mod</strong> on the index to be able to comment</InfoBox>
            {/if}
        {:else if lock === "internal"}
            {#if isAdmin || isModDeveloper}
                <ModThreadCommentForm {version} />
            {:else}
                <InfoBox type="warning"
                    >This thread is restricted to <strong>index admins</strong> and
                    <strong>developers of this mod</strong></InfoBox>
            {/if}
        {:else if isAdmin}
            <ModThreadCommentForm {version} />
        {:else}
            <InfoBox type="warning">This thread is locked</InfoBox>
        {/if}
    {:else}
        <InfoBox type="warning">You must be <strong>logged in</strong> to comment</InfoBox>
    {/if}
    <ModThreadList {comments} {version} />
</div>
