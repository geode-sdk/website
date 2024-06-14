<script lang="ts">
    import "../app.scss";
    import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte"
    import Row from "$lib/components/Row.svelte"
    import Link from "$lib/components/Link.svelte";
    import Dot from "$lib/components/Dot.svelte";
    import Waves from "$lib/components/Waves.svelte";
	import Icon from "$lib/components/Icon.svelte";
</script>

<main>
	<slot/>
	<nav>
		<Button href=".." style="primary-filled-dark" icon="home">Home</Button>
		<slot name="nav"/>
	</nav>
	<div class="waves-bottom">
		<Waves type="bottom" --text-color=var(--text-950)>
			<Column>
				<Row wrap="wrap" align="center">
					<Link href="https://discord.gg/9e43WMKzhp" icon="discord">Discord</Link>
					<Dot/>
					<Link href="https://twitter.com/geode_sdk" icon="twitter">Twitter</Link>
					<Dot/>
					<Link href="https://docs.geode-sdk.org/" icon="docs">Documentation</Link>
					<Dot/>
					<Link href="https://github.com/geode-sdk" icon="github">Source Code</Link>
				</Row>
				<p>
					Site made by <Link href="https://github.com/hjfod">HJfod</Link>.
					Thank you to <Link href="https://github.com/nekitdev">Nekit</Link> for the domain!
				</p>
				<Row gap=small>
					<Icon icon="copyright"/> 
					<p>Geode Team 2024</p>
				</Row>
			</Column>
		</Waves>
	</div>
</main>

<style lang="scss">
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		gap: var(--gap-large);
		// min-height: calc(100vh - var(--page-margin) * 2);
	}
	nav {
		position: fixed;
		top: 1rem;
		left: 1rem;
	}

	.waves-bottom {
		min-width: 100%;
	}
</style>
