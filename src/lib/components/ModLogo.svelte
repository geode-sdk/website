<script lang="ts">
	import { IndexClient } from "$lib/api/index-repository.js";
	import type { ServerMod } from "$lib/api/models/mod.js";
	import type { ServerModVersion } from "$lib/api/models/mod-version.js";

	import iconPlaceholder from "$lib/assets/icon-placeholder.png";
	import iconPending from "$lib/assets/icon-pending.png";

	export let mod: ServerMod;
	export let version: ServerModVersion;

	export let size: "large" | "medium" | "small" = "small";

	$: iconSize = size == "large"
		? "8rem"
		: size == "medium"
			? "6rem"
			: "5rem";

	let logoUrl = IndexClient.getModLogo(mod.id, version.version).toString();
	const placeholderIcon = version.status == "accepted" ? iconPlaceholder : iconPending;

	const checkPlaceholder = (node: HTMLImageElement) => {
		if (node.complete && node.naturalWidth == 0 && node.naturalHeight == 0) {
			logoUrl = placeholderIcon;
		}
	}
</script>

<!-- on:error doesn't run early enough, but the language server complains, lol -->
<img onerror={`this.src="${placeholderIcon}"`}
	src={logoUrl}
	use:checkPlaceholder
	alt={`Logo for the mod ${version.name}`}
	style:--icon-size={iconSize}
	class="mod-image" />

<style>
	.mod-image {
		height: 336px;
		width: 336px;
		max-height: var(--icon-size);
		max-width: var(--icon-size);
	}
</style>
