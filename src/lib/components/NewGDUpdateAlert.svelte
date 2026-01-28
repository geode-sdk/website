<script lang="ts">
    import { getNewGDUpdateWasReleased } from "$lib";
    import Markdown from "svelte-exmarkdown";
    import Button from "./Button.svelte";
    import Gap from "./Gap.svelte";
    import InfoBox from "./InfoBox.svelte";
    import Link from "./Link.svelte";
    import Row from "./Row.svelte";
    import { useLocalize } from "@nubolab-ffwd/svelte-fluent";

    const newGDUpdate = getNewGDUpdateWasReleased();
    const { includeButton = true }: { includeButton?: boolean } = $props();

    const localize = useLocalize();
</script>

{#if newGDUpdate?.geodeStatus === "fully-broken"}
    <InfoBox type="error" solid={true}>
        <Markdown md={"TODO_TRANSLATE"}/>
        {#if includeButton}
            <Gap size="small" blocking={true}/>
            <Row justify="start">
                <Button design="primary-filled" href="/faq">
                    {"TODO_TRANSLATE"}
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
                    {"TODO_TRANSLATE"}
                </Button>
            </Row>
        {/if}
    </InfoBox>
{/if}
