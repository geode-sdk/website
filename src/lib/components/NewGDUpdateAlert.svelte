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
{:else if newGDUpdate?.geodeStatus === "ipo"}
    <InfoBox type="blue" solid={true}>
        A <em>new era</em> for Geode has begun! We are pleased to communicate a strategic evolution for our development ecosystem. Effective immediately, <em>Geode SDK</em> has been formally acquired by <em>Sapphire Enterprise Inc.</em> — a transition engineered to catalyze professional-grade stability and deliver high-fidelity, enterprise-level support to the Geometry Dash modding landscape.
        <br />
        Please be patient as we <em>update our branding</em> to reflect the change.
        <Gap size="small" blocking={true}/>
        <Row justify="start">
            <Button design="secondary-filled" href="/activate">Unlock Sapphire Pro</Button>
        </Row>
    </InfoBox>
{/if}
