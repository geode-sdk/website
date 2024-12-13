<script lang="ts">
	export let href: string;
	export let text: string;

	let specialLink = href;

	$: if (href.startsWith("user:")) {
		const [, userId] = href.split(":");
		specialLink = `https://gdbrowser.com/u/${userId}`;
	} else if (href.startsWith("level:")) {
		const [, levelId] = href.split(":");
		specialLink = `https://gdbrowser.com/${levelId}`;
	} else if (href.startsWith("mod:")) {
		const [, modId] = href.split(":");
		specialLink = `/mods/${modId}`;
	}
</script>

<a href={specialLink}>{text}</a>
