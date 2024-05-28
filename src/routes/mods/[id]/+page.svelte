<script lang="ts">
	import { getModDownload, getModLogo } from "$lib/api/index-repository.js";
	import type { PageData } from "./$types.js";

	export let data: PageData;

	const logoUrl = getModLogo(data.mod.id).toString();
</script>

<svelte:head>
	<title>{data.version.name}</title>
	<meta property="og:title" content={data.version.name} />
	<meta property="og:image" content={logoUrl} />
	<meta property="og:image:width" content="80" />
	<meta property="og:image:height" content="80" />
</svelte:head>

<h1>{data.version.name} [v{data.version.version}]</h1>

<img src={logoUrl} alt={`mod logo for ${data.version.name}`} />

<a href={getModDownload(data.mod.id, data.version.version).toString()}>Download</a>

{data.mod.about}