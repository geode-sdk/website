<script lang="ts">
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

	export let form: ActionData;

	let status_loading: boolean = false;
	let status_loading_message: string | null = null;
	let status_current_step: number = 1;

	let ghLoginData: GithubLogin;

	let pollInterval: number;

	async function pollGitHub() {
		const token = await githubAuthPoll(ghLoginData["uuid"])
		console.log(`token result: ${token}`)
		if (token != null && token != "[object Object]") {
			document.cookie = "token=" + token;
			status_current_step = 3;
			clearInterval(pollInterval);
		}
	}

	// Animations
	// config
	let anim_duration = 1000; // in milliseconds
	let anim_how_far = 500
	// functions
	function swipeIn(node: any) {
		let duration = anim_duration
		return {
			delay: 250,
			duration,
			css: (t: number) => {
				const eased = quadOut(t);

				return `
					transform: translateX(${-anim_how_far + (eased * anim_how_far)}px);
					opacity: ${eased * 100}%;`;
			}
		};
	}
	function swipeOut(node: any) {
		let duration = anim_duration
		return {
			duration,
			css: (t: number) => {
				const eased = sineInOut(t);

				return `
					transform: translateX(${-eased * anim_how_far + anim_how_far}px);
					opacity: ${eased * 100}%;`;
			}
		};
	}

	// Button Handling
	async function signIn(e: MouseEvent) {
		status_loading_message = "Requesting code...";
		status_loading = true;
		setTimeout(async () => {
			var res = ghLoginData = await githubAuth();
			status_loading_message = "Opening up GitHub";
			setTimeout(async () => {
				status_loading_message = "Loading next step...";
				setTimeout(async () => {
					status_current_step = 2;
					status_loading = false;
					status_loading_message = null;
					var theWindow = await window.open(res["uri"], "_blank", "location=yes,height=550,width=520,scrollbars=yes,status=yes");
					var copyText = <HTMLInputElement>document.getElementById("the-code");
					copyText.select();
					copyText.setSelectionRange(0, 99999); // For mobile devices
					navigator.clipboard.writeText(copyText.value);
					pollInterval = setInterval(pollGitHub, res["interval"] * 1000)
				}, 200)
			}, 500)
		}, 1000)
		// there is a reason there are alot of set timeouts, it's so animations don't skip and shit.
	}

</script>

<svelte:head>
    <title>Developer Login</title>
    <meta name="description" content="Login to edit your mods, or your developer profile!">
</svelte:head>


<Waves type="top" />
<Gap size="large" />

<h1 class="title">Login</h1>


<div class="container">
{#if status_loading || status_current_step == 0}
<div class="step-loader" in:swipeIn out:swipeOut>
	<Column>
		<LoadingCircle></LoadingCircle>
		{#if status_loading}
		<p>{status_loading_message || "Loading..."}</p>
		{:else}
		<p>Waiting for page...</p>
		{/if}
	</Column>
</div>
{:else if status_current_step == 1}
<div class="step-1" in:swipeIn out:swipeOut>
	<Column>
		<p>When you click <em>Sign In</em>, a GitHub window will popup asking for a code, we will display it right on this page.</p>
		<Button style="secondary-filled" on:click={signIn}>Sign In</Button>
	</Column>
</div>
{:else if status_current_step == 2}
<div class="step-2" in:swipeIn out:swipeOut style="">
	<Column>
		<p>Your code is</p>
		<h2>{ghLoginData.code || "EXAM-PLES"}</h2>
		<p>We also copied it to your clipboard.</p>
		<Button style="dark-small" href={ghLoginData.uri} target="_blank">Open again (but in new tab)</Button>
		<LoadingCircle></LoadingCircle>
	</Column>
</div>
<input id="the-code" value="{ghLoginData.code || "EXAM-PLES"}" readonly>
{:else if status_current_step == 3}
<div class="step-3" in:swipeIn out:swipeOut style="">
	<Column>
		<p>Success!</p>
		<p>You are now logged in!</p>
		<Button style="primary-filled" href="/me">Manage my profile</Button>
	</Column>
</div>
{/if}

</div>


<!--p>
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
	<li>Send a POST request to <code>/v1/login/github</code> with no data. Keep track of the <code>uuid</code>.</li>
	<li>Go to the url specified in <code>uri</code> and enter the provided <code>code</code>.</li>
	<li>
		Send a POST request to <code>/v1/login/github/poll</code>. <br />
		For the body, provide the uuid as the key for a JSON dictionary: <code>&#123;"uuid": "..."&#125;</code> <br />
		The returned string should be the token.
	</li>

</ol-->


<style lang="scss">
	@use '$lib/styles/media-queries.scss' as *;

    .img-with-width {
        max-width: 35vw;
        flex-shrink: 0;

		@include lt-lg {
            max-width: 65vw;
        }
    }
    section {
        background-color: var(--background-950);
        padding: 1rem;
        border-radius: .5rem;
    }
    h1 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: min(var(--font-size-title), 15vw);

		&.title {
			transform: translateY(-100px);
		}
    }
    h2 {
        margin: 0;
        font-family: var(--font-heading);
        font-weight: 600;
        color: var(--text-50);
        font-size: min(var(--font-size-title), 3.2vw);
    }
    em {
        font-weight: unset;
    }
	div.container {
		display: block;
		position: relative;
		height: 100%;
		width: 100%;

		& > div {
			position: absolute;
			top: -20vh;
			right: 0;
			left: 0;
			bottom: 0;

			&.step-loader {
				top: -15vh;
			}

			&.step-1 {
				top: -17.5vh;
			}

			&.step-2 {
				top: -20vh;
			}
		}

		& > input {
			left: -999999vh;
			height: 0px;
			width: 0px;
			position: absolute;
		}
	}
</style>