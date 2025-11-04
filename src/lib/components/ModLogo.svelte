<!-- @migration-task Error while migrating Svelte code: Event attribute must be a JavaScript expression, not a string
https://svelte.dev/e/attribute_invalid_event_handler -->
<script lang="ts">
    import { IndexClient } from "$lib/api/index-repository.js";
    import type { ServerMod } from "$lib/api/models/mod.js";
    import type { ServerModVersion } from "$lib/api/models/mod-version.js";

    import iconPlaceholder from "$lib/assets/icon-placeholder.png";
    import iconPending from "$lib/assets/icon-pending.png";

    export let mod: ServerMod;
    export let version: ServerModVersion;
    export let size: "large" | "medium" | "small" = "small";

    $: iconSize = size == "large" ? "8rem" : size == "medium" ? "6rem" : "5rem";

    $: accepted = version.status == "accepted";

    // put both the version and status into the cache to prevent stale icons from being cached
    // (pending icons show the old accepted icon for that version until that version is accepted)
    $: logoUrl = IndexClient.getModLogo(mod.id, {
        version: version.version,
        status: version.status != "accepted" ? version.status : undefined,
    }).toString();

    $: placeholderIcon = accepted ? iconPlaceholder : iconPending;

    const checkPlaceholder = (node: HTMLImageElement) => {
        if (node.complete) {
            imageLoaded = true;
            if (node.naturalWidth == 0 && node.naturalHeight == 0) {
                logoUrl = placeholderIcon;
            }
        }
    };

    let imageLoaded = false;
</script>

<!-- on:error doesn't run early enough, but the language server complains, lol -->
<img
    onerror={function () {
        this.src = placeholderIcon;
    }}
    onload={(e) => (e.target as HTMLImageElement | null)?.style.removeProperty("visibility")}
    src={logoUrl}
    use:checkPlaceholder
    alt={`Logo for the mod ${version.name}`}
    style:--icon-size={iconSize}
    style:visibility={imageLoaded ? "initial" : "hidden"}
    class="mod-image" />

<style>
    .mod-image {
        height: 336px;
        width: 336px;
        max-height: var(--icon-size);
        max-width: var(--icon-size);
    }
</style>
