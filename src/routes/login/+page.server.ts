import { IndexClient } from "$lib/api/index-repository.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const client = new IndexClient({ fetch });

    await client.trySetTokens(cookies);

    if (!client.wasAuthSuccessful()) {
        const url = await client.startGitHubAuth();
        return redirect(302, url);
    } else {
        return redirect(302, "/");
    }
};
