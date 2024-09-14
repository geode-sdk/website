<script lang="ts">
	import { enhance } from '$app/forms';
    import CodeExample from '$lib/components/CodeExample.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Login</h1>

<p>
	Login is currently very manual. sorry :(
</p>

<form method="POST" use:enhance>
	<div>
		<label for="token">
			Index Token
		</label>
		<input type="text" name="token" id="token" />
	</div>
	<button>Log in</button>

	{#if form?.invalid}
		<small>Invalid token!</small>
	{/if}
</form>

To manually get your login token:

<ol>
	<li>Send a POST request to <code>/v1/login/github</code> with an empty body. Keep track of the <code>uuid</code>.</li>
	<li>Go to the url specified in <code>uri</code> and enter the provided <code>code</code>.</li>
	<li>
		Send a POST request to <code>/v1/login/github/poll</code>. <br />
		For the body, provide the uuid as the key for a JSON object: <code>&#123;"uuid": "..."&#125;</code> <br />
		The returned string should be the token.
	</li>
</ol>

Ideally, it will look something like this:
<CodeExample code={`
	$ curl -X POST "https://api.geode-sdk.org/v1/login/github" -d ""

	{
		"error": "",
		"payload": {
			"uuid": "$LOGIN_UUID",
			"interval": 1,
			"uri": "$LOGIN_URL",
			"code": "$LOGIN_CODE"
		}
	}

	$ curl -X POST "https://api.geode-sdk.org/v1/login/github/poll" --json '{uuid": "$LOGIN_UUID"}'

	{"error":"","payload":"$INDEX_TOKEN"}`} />
