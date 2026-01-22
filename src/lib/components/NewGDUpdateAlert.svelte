<script lang="ts">
    import { getNewGDUpdateWasReleased } from "$lib";
    import Button from "./Button.svelte";
    import Gap from "./Gap.svelte";
    import InfoBox from "./InfoBox.svelte";
    import Link from "./Link.svelte";
    import Row from "./Row.svelte";

    const newGDUpdate = getNewGDUpdateWasReleased();
</script>

{#if newGDUpdate?.geodeStatus === "fully-broken"}
    <InfoBox type="error" solid={true}>
        A new update for Geometry Dash (version {newGDUpdate.newGDVersion}) 
        was recently released, and because of that <em>Geode is currently broken</em>.
        We're working on fixing it, but please be patient!
        <Gap size="small" blocking={true}/>
        <Row justify="start">
            <Button design="primary-filled" href="/faq">What? Why?</Button>
        </Row>
    </InfoBox>
{:else if newGDUpdate?.geodeStatus === "just-updated"}
    <InfoBox type="info" solid={true}>
        A new update for Geometry Dash (version {newGDUpdate.newGDVersion}) 
        was recently released. <em>Geode now supports that version</em>, but 
        most mods haven't been updated yet. Please wait for mod developers to 
        update their mods.
        <Gap size="small" blocking={true}/>
        <Row justify="start">
            <Button design="secondary-filled" href="/faq">What? Why?</Button>
        </Row>
    </InfoBox>
{/if}
