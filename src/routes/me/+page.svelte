<script lang="ts">
	import type { PageData } from "./$types.js";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
	import { sineInOut, quadOut } from 'svelte/easing';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Button from "$lib/components/Button.svelte";
    import Column from "$lib/components/Column.svelte";
    import Gap from "$lib/components/Gap.svelte";
    import GeodeLogo from "$lib/components/GeodeLogo.svelte";
    import Link from "$lib/components/Link.svelte";
    import LoadingCircle from "$lib/components/LoadingCircle.svelte";
    import Row from "$lib/components/Row.svelte";
    import Waves from "$lib/components/Waves.svelte";
    import Image from "$lib/components/Image.svelte";
    import Dot from "$lib/components/Dot.svelte";
	import { githubAuth, githubAuthPoll } from "$lib/api/index-repository"
	import type { GithubLogin } from '$lib/api/models/developer';
    import FlyIntoView from "$lib/components/FlyIntoView.svelte";


	export let data: PageData;

	let status = "accepted";

	const onChangeFilter = async () => {
		const params = new URLSearchParams();

		params.set("status", status);

		await goto(`/me?${params}`);
	}
</script>

<svelte:head>
    <title>Developer Login</title>
    <meta name="description" content="Login to edit your mods, or your developer profile!">
</svelte:head>


<Waves type="top" />
<Gap size="large" />

<fieldset>
	<legend>it's you!</legend>

	{data.self.display_name} ({data.self.username}) ((ID: #{data.self.id}))

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

