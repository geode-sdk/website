<script lang="ts">
	export let text: string | undefined = undefined;
	export let color: string | undefined = undefined;
	export let raw: string;
</script>

{#if text}
	<span class="colored" style={`--custom-color: ${color}`}>{raw}</span>
{/if}

<style lang="scss">

.colored {
	color: var(--custom-color);
}

@media (prefers-contrast: more) {
	.colored {
		color: var(--text-color);
	}
}
</style>
