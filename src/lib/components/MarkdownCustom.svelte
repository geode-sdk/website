<script lang="ts">
	export let text: string | undefined = undefined;
	export let color: string | undefined = undefined;
	export let raw: string;
</script>

{#if text}
	<span style={`color: ${color}`}>{raw}</span>
{:else}
	<slot />
{/if}
