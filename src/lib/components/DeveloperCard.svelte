<script lang="ts">
    import type { ServerDeveloper } from "$lib/api/models/base";
    import Link from "$lib/components/Link.svelte";

    export let developer: ServerDeveloper;
</script>

<div class="container">
    <Link href="developers/{developer.id}">
        <div class="developer-link">
            <img
                src={`https://avatars.githubusercontent.com/u/${developer.github_id}`}
                width="50"
                height="50"
                alt="developer {developer.id}" />
            <div>
                <p class="display-name">{developer.display_name}</p>
                <p class="username">{developer.username} ({developer.id})</p>
            </div>
        </div>
    </Link>
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

    .developer-link {
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
