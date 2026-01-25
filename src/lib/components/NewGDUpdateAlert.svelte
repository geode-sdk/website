<script lang="ts">
    import { getNewGDUpdateWasReleased } from "$lib";
    import { m } from "$lib/paraglide/messages";
    import Markdown from "svelte-exmarkdown";
    import Button from "./Button.svelte";
    import Gap from "./Gap.svelte";
    import InfoBox from "./InfoBox.svelte";
    import Link from "./Link.svelte";
    import Row from "./Row.svelte";

    const newGDUpdate = getNewGDUpdateWasReleased();
    const { includeButton = true }: { includeButton?: boolean } = $props();
</script>

{#if newGDUpdate?.geodeStatus === "fully-broken"}
    <InfoBox type="error" solid={true}>
        <Markdown md={m.new_update_emergency_broken_info({
            new_gd_version: newGDUpdate.newGDVersion
        })}/>
        {#if includeButton}
            <Gap size="small" blocking={true}/>
            <Row justify="start">
                <Button design="primary-filled" href="/faq">
                    {m.new_update_emergency_info_button()}
                </Button>
            </Row>
        {/if}
    </InfoBox>
{:else if newGDUpdate?.geodeStatus === "just-updated"}
    <InfoBox type="info" solid={true}>
        A new update for Geometry Dash (version {newGDUpdate.newGDVersion}) 
        was recently released. <em>Geode now supports that version</em>, but 
        most mods haven't been updated yet. Please wait for mod developers to 
        update their mods.
        {#if includeButton}
            <Gap size="small" blocking={true}/>
            <Row justify="start">
                <Button design="secondary-filled" href="/faq">
                    {m.new_update_emergency_info_button()}
                </Button>
            </Row>
        {/if}
    </InfoBox>
{/if}
