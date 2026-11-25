<script lang="ts">
    import { IndexClient } from "$lib/api/index-repository.js";
    import type { ServerModVersion } from "$lib/api/models/mod-version.js";
    import type { ServerMod } from "$lib/api/models/mod.js";

    import iconPending from "$lib/assets/icon-pending.png";
    import iconPlaceholder from "$lib/assets/icon-placeholder.png";

    interface Props {
        mod: ServerMod;
        version: ServerModVersion;
        size: "large" | "medium" | "small";
    }

    const { mod, version, size = "small" } = $props();

    const iconSize = $derived(size == "large" ? "8rem" : size == "medium" ? "6rem" : "5rem");

    const accepted = $derived(version.status == "accepted");

    // put both the version and status into the cache to prevent stale icons from being cached
    // (pending icons show the old accepted icon for that version until that version is accepted)
    let logoUrl = $derived(
        IndexClient.getModLogo(mod.id, {
            version: version.version,
            status: version.status != "accepted" ? version.status : undefined,
        }).toString(),
    );

    const placeholderIcon = $derived(accepted ? iconPlaceholder : iconPending);
    let imageLoaded = $state(false);
</script>

<!-- on:error doesn't run early enough, but the language server complains, lol -->
<div class={imageLoaded ? "" : "animate-pulse rounded-2xl bg-white/10"}>
    <img
        onerror={function () {
            this.src = placeholderIcon;
        }}
        onload={(e) => {
            (e.target as HTMLImageElement | null)?.style.removeProperty("visibility");
            imageLoaded = true;
        }}
        src={logoUrl}
        alt={`Logo for the mod ${version.name}`}
        style:--icon-size={iconSize}
        style:visibility={imageLoaded ? "initial" : "hidden"}
        class="mod-image" />
</div>

<style>
    .mod-image {
        height: 336px;
        width: 336px;
        max-height: var(--icon-size);
        max-width: var(--icon-size);
    }
</style>
