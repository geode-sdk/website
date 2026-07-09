<script lang="ts">
    import type { ServerModVersionThreadComment, ServerModVersionThreadLock } from "$lib/api/models/mod-version";
    import type { Paginated } from "$lib/api/index-repository";
    import ModThreadList from "./ModThreadList.svelte";
    import ModThreadCommentForm from "./ModThreadCommentForm.svelte";
    import InfoBox from "../InfoBox.svelte";
    import type { ServerDeveloperProfile } from "$lib/api/models/base";
    import { getUserContext } from "$lib/context/user";
    import { getModContext } from "$lib/context/mod";
    import { enhance } from "$app/forms";
    import Button from "../Button.svelte";
    import Icon from "../Icon.svelte";

    interface Props {
        comments: Paginated<ServerModVersionThreadComment>;
        lock: ServerModVersionThreadLock;
        currentUser: ServerDeveloperProfile | null;
        version: string;
        page: number;
        perPage: number;
        onChangePage: (page: number) => void;
    }

    let { comments, lock, version, page, perPage, onChangePage }: Props = $props();

    const currentUser = getUserContext();
    const mod = getModContext();

    const isModDeveloper = $derived(mod.developers.find((i) => i.id === currentUser?.id));
    const isLoggedIn = $derived(currentUser !== null);
    const isAdmin = $derived(currentUser?.admin === true);
    const hasAcceptedMod = $derived(currentUser?.has_accepted_mod === true);

    let updatingLock = $state(false);
</script>

<div class="flex flex-col gap-6">
    {#if isAdmin}
        <form
            method="POST"
            action="?/update_lock"
            use:enhance={() => {
                updatingLock = true;
                return async ({ update }) => {
                    updatingLock = false;
                    await update();
                };
            }}>
            <input type="hidden" name="version" value={version} />
            <div class="flex w-full bg-background-800 p-2 rounded justify-between flex-wrap">
                <div class="flex gap-1 items-center">
                    <span>Status: </span>
                    <select class="border border-background-400 rounded p-1 cursor-pointer" value={lock} name="lock">
                        <option value={'none'}>Open</option>
                        <option value={'internal'}>Internal</option>
                        <option value={'locked'}>Locked</option>
                    </select>
                </div>
                <Button type="submit" size="small" design="primary-filled" disabled={updatingLock} title="Update thread status">
                    <Icon icon="confirm" />
                    Update
                </Button>
            </div>
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
    <ModThreadList {comments} {version} {lock} {page} {perPage} {onChangePage} />
</div>
