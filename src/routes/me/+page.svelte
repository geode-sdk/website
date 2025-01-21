<script lang="ts">
	import type { PageData } from "./$types.js";
	import { goto } from "$app/navigation";
    import Link from "$lib/components/Link.svelte";

	export let data: PageData;

	let status = "accepted";

	const onChangeFilter = async () => {
		const params = new URLSearchParams();

		params.set("status", status);

		await goto(`/me?${params}`);
	}
</script>

<svelte:head>
	<title>Your profile | Geode</title>
	<meta name="description" content="See your own profile on Geode">
</svelte:head>

<fieldset>
	<legend>it's you!</legend>

	<Link --link-color="var(--accent-300)" href={`/developers/${data.self.id}`}>{data.self.display_name} ({data.self.username}) ((#{data.self.id}))</Link>

	<p>
		admin: {data.self.admin} <br />
		verified: {data.self.verified} <br />
	</p>

	<form method="post" action="?/update_self">
		<label for="update_display_name">Display name:</label>
		<input type="text" value={data.self.display_name} name="display_name" id="update_display_name" />

		<input type="submit" value="Update" />
	</form>

	<form method="POST">
		<button formaction="?/logout">Log out</button>
		<button formaction="?/logout_all">Revoke all tokens</button>
	</form>
</fieldset>

