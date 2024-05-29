<h1>Login</h1>

<p>
	Login is currently very manual. sorry :(
</p>

<form method="POST">
	<div>
		<label for="token">
			Index Token
		</label>
		<input type="text" name="token" id="token" />
	</div>
	<button>Log in</button>
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

</ol>