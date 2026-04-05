<script lang="ts">
    import Column from "$lib/components/Column.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Label from "$lib/components/Label.svelte";
    import Row from "$lib/components/Row.svelte";
    import VersionCards from "$lib/components/VersionCards.svelte";
    import { serverTimestampToAgoString, serverTimestampToDateString, formatNumber, iconForTag } from "$lib";
    import type { ServerGDVersion } from "$lib/api/models/mod-version";

    interface Props {
        modVersion?: string;
        geodeVersion?: string;
        gdVersion?: ServerGDVersion;
        createdAt?: string;
        updatedAt?: string;
        downloads?: number;
        tags?: string[];
    }

    let { modVersion, geodeVersion, gdVersion, createdAt, updatedAt, downloads, tags }: Props = $props();

    const getTagDisplay = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1);
</script>

<section>
    <Column align="start" gap="small">
        {#if modVersion}
            <span class="card-info">
                <Icon icon="version" />{modVersion}
            </span>
        {/if}

        {#if downloads}
            <span class="card-info">
                <Icon icon="download" />{formatNumber(downloads)}
            </span>
        {/if}

        {#if createdAt}
            <span class="card-info" title={serverTimestampToDateString(createdAt)}>
                <Icon icon="time" />{serverTimestampToAgoString(createdAt)}
            </span>
        {/if}

        {#if updatedAt}
            <span class="card-info" title={serverTimestampToDateString(updatedAt)}>
                <Icon icon="update" />{serverTimestampToAgoString(updatedAt)}
            </span>
        {/if}

        {#if geodeVersion}
            <span class="card-info">
                <Icon icon="geode" />{geodeVersion}
            </span>
        {/if}

        {#if gdVersion}
            <span class="card-info">
                <VersionCards gd={gdVersion} />
            </span>
        {/if}

        {#if tags && tags.length > 0}
            <div class="mod-tags">
                <Row wrap="wrap" gap="tiny" align="center" justify="start">
                    {#each tags as tag}
                        <Label icon={iconForTag(tag)} design="secondary">
                            {getTagDisplay(tag)}
                        </Label>
                    {/each}
                </Row>
            </div>
        {/if}
    </Column>
</section>

<style lang="scss">
    @use "$lib/styles/mod-details.scss" as *;

    .mod-tags {
        /* width chosen by fair dice roll */
        max-width: 18rem;
        padding-top: 0.25rem;
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
