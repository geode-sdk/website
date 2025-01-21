<script lang="ts">
    import type { ServerDeveloper } from "$lib/api/models/base";
    import Link from "$lib/components/Link.svelte";
    import Icon from "$lib/components/Icon.svelte";

    export let developer: ServerDeveloper;
</script>

<div class="container">
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
    <div class="right-side">
        {#if developer.verified}
            <span class="dev-tag verified">
                <Icon icon="verified" --icon-size="0.9rem" /> verified
            </span>
        {/if}
        {#if developer.admin}
            <span class="dev-tag admin">
                <Icon icon="admin" --icon-size="0.9rem" />admin
            </span>
        {/if}
    </div>
</div>

<style lang="scss">
    .container {
        --card-base-color: var(--background-500);
        --card-icon-base-color: var(--secondary-300);
        --card-icon-hover-color: var(--primary-300);

        background-color: color-mix(
            in srgb,
            var(--card-base-color) 15%,
            transparent
        );

        display: flex;
        align-items: center;
        justify-content: space-between;

        padding: 1rem;
        border-radius: 0.5rem;

        &:has(a:hover) {
            background-color: color-mix(
                in srgb,
                var(--card-base-hover) 15%,
                transparent
            );
        }
    }

    .dev-tag {
        display: flex;
        align-items: center;
        gap: 0.1rem;
        border: 1px solid var(--secondary-300);
        font-size: small;
        background-color: var(--secondary-800);
        text-align: center;
        padding: 0.3rem;
        border-radius: 0.25rem;

        &.verified {
            border-color: var(--accent-alt-300);
            background-color: var(--accent-alt-800);
        }
    }

    img {
        border-radius: 0.5rem;
    }

    .right-side {
        display: flex;
        gap: 0.5rem;
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
