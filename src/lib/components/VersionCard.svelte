<script lang="ts">
    import { serverTimestampToAgoString, serverTimestampToDateString, abbreviateNumber, formatNumber } from "$lib";
    import type { ServerMod } from "$lib/api/models/mod.js";
    import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import Column from "./Column.svelte";
    import Icon from "./Icon.svelte";
    import Label from "./Label.svelte";
    import Link from "./Link.svelte";
    import Row from "./Row.svelte";
    import VersionCards from "./VersionCards.svelte";
    import Button from "./Button.svelte";

    export let mod: ServerMod;
    export let version: ServerModVersion;
</script>

<article class="version">
    <Row wrap="wrap">
        <Column gap="small" align="left">
            <Link href={`/mods/${mod.id}?version=${version.version}`}>
                <h2>{version.version}</h2>
            </Link>
            {#if version.created_at}
                <span class="card-info" title={serverTimestampToDateString(version.created_at)}>
                    <Icon icon="time"/>{"Released " + serverTimestampToAgoString(version.created_at)}
                </span>
            {/if}
            <span
                class="card-info"
                title="{formatNumber(version.download_count)} downloads">
                <Icon icon="download" />
                {abbreviateNumber(version.download_count)} downloads
            </span>
            <span class="card-info">
                <Icon icon="geode" />
                Minimum Geode version: <Label icon="geode" style="gray">
                    {version.geode}
                </Label>
            </span>
            <span class="card-info">
                <VersionCards gd={version.gd} longForm={true} />
            </span>
        </Column>
        <Column gap="small" align="stretch">
            <Button
                href={version.download_link}
                icon="download"
                style="primary-filled">
                Download .geode file
            </Button>
            <Button href="/faq#how-do-i-manually-install-mods" icon="help">
                How to install
            </Button>
        </Column>
    </Row>
</article>

<style lang="scss">
    article.version {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;

        padding: 0.75rem;
        border-radius: 0.5rem;
        background-color: color-mix(
            in srgb,
            var(--background-500) 25%,
            transparent
        );

        h2 {
            margin: 0;
            font-family: var(--font-heading);
            color: var(--accent-300);
        }
    }

    .card-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5em;

        & > :global(.icon) {
            --icon-size: 1.2em;
            color: var(--secondary-300);
            transition-duration: var(--transition-duration);
        }
    }
</style>
