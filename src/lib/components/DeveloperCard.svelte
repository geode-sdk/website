<script lang="ts">
    import type { ServerDeveloper } from "$lib/api/models/base";
    import Link from "$lib/components/Link.svelte";
    import DevRoleChip from "$lib/components/DevRoleChip.svelte";

    export let developer: ServerDeveloper;
</script>

<div class="aside">
    <div class="left-side">
        <Link href="developers/{developer.id}">
            <div class="link-container">
                <img
                    src={`https://avatars.githubusercontent.com/u/${developer.github_id}`}
                    width="50"
                    height="50"
                    alt="developer {developer.id}" />
                <div>
                    <p class="display-name">{developer.display_name}</p>
                    <p class="username">
                        {developer.username} ({developer.id})
                    </p>
                </div>
            </div>
        </Link>
    </div>
    <div class="right-side">
        {#if developer.verified}
            <DevRoleChip iconOnly={true} type="verified" />
        {/if}
        {#if developer.admin}
            <DevRoleChip iconOnly={true} type="admin" />
        {/if}
    </div>
</div>

<style lang="scss">
    .aside {
        --card-base-color: var(--background-500);
        --card-icon-base-color: var(--secondary-300);

        background-color: color-mix(in srgb, var(--card-base-color) 15%, transparent);

        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: space-between;

        padding: 1rem;
        border-radius: 0.5rem;

        transition: background-color var(--transition-duration);

        &:has(a:hover) {
            background-color: color-mix(in srgb, var(--card-base-color) 40%, transparent);
        }
    }

    img {
        border-radius: 0.5rem;
    }

    .left-side {
        flex-grow: 0;
        flex-shrink: 5;
    }

    .right-side {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        flex-grow: 5;
    }

    .link-container {
        display: flex;
        gap: 0.5rem;
    }

    .display-name {
        font-size: 1.2rem;
    }

    .username {
        font-size: 0.8rem;
    }
</style>
