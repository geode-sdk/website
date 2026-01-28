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
        <Markdown md={localize("update-emergency-notification-info-broken", { new_gd_version: newGDUpdate.newGDVersion })}/>
        {#if includeButton}
            <Gap size="small" blocking={true}/>
            <Row justify="start">
                <Button design="primary-filled" href="/faq">
                    {localize("update-emergency-notification-info-broken.faq-button")}
                </Button>
            </Row>
        {/if}
    </InfoBox>
{:else if newGDUpdate?.geodeStatus === "just-updated"}
    <InfoBox type="info" solid={true}>
        <Markdown md={localize("update-emergency-notification-info-fixed", { new_gd_version: newGDUpdate.newGDVersion })}/>
        {#if includeButton}
            <Gap size="small" blocking={true}/>
            <Row justify="start">
                <Button design="secondary-filled" href="/faq">
                    {localize("update-emergency-notification-info-fixed.faq-button")}
                </Button>
            </Row>
        {/if}
    </InfoBox>
{/if}
