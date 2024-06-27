<script lang="ts">
    import type { PageData } from "./$types.js";
    import { goto } from "$app/navigation";

    export let data: PageData;

    let status = "accepted";

    const onChangeFilter = async () => {
        const params = new URLSearchParams();

        params.set("status", status);

        await goto(`/me?${params}`);
    };
</script>

<fieldset>
    <legend>it's you!</legend>

    {data.self.display_name} ({data.self.username}) ((#{data.self.id}))

    <p>
        admin: {data.self.admin} <br />
        verified: {data.self.verified} <br />
    </p>

    <form method="post" action="?/update_self">
        <label for="update_display_name">Display name:</label>
        <input
            type="text"
            value={data.self.display_name}
            name="display_name"
            id="update_display_name"
        />

        <input type="submit" value="Update" />
    </form>

    <form method="POST">
        <button formaction="?/logout">Log out</button>
        <button formaction="?/logout_all">Revoke all tokens</button>
    </form>
</fieldset>
