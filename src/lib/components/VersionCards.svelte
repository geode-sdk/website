<script lang="ts">
    import type { ServerGDVersion } from "$lib/api/models/mod-version";
    import Icon from "./Icon.svelte";
    import Label from "./Label.svelte";

    export let gd: ServerGDVersion;
    export let longForm = false;
</script>

<Icon icon="gd"/>

{#if longForm}
    Available on:
{/if}

{#if gd.win}<Label icon="windows" style="gray">{gd.win}</Label>{/if}

{#if gd["mac-arm"] && gd["mac-arm"] == gd["mac-intel"]}
    <Label icon="mac" style="gray">{gd["mac-arm"]}</Label>
{:else}
    {#if gd["mac-arm"]}
        <Label icon="mac" style="gray">{gd["mac-arm"]} (ARM)</Label>
    {/if}
    {#if gd["mac-intel"]}
        <Label icon="mac" style="gray">{gd["mac-intel"]} (x64)</Label>
    {/if}
{/if}

{#if gd.ios}
    <Label icon="ios" style="gray">{gd.ios}</Label>
{/if}

{#if gd.android64 && gd.android64 == gd.android32}
    <Label icon="android" style="gray">{gd.android64}</Label>
{:else}
    {#if gd.android64}
        <Label icon="android" style="gray">{gd.android64} (64-bit)</Label>
    {/if}
    {#if gd.android32}
        <Label icon="android" style="gray">{gd.android32} (32-bit)</Label>
    {/if}
{/if}