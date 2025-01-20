import { IndexClient, SetTokensResult } from "$lib/api/index-repository.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const client = new IndexClient({ fetch });

    const hasToken = await client.trySetTokens(cookies);

    switch (hasToken) {
        case SetTokensResult.UNSET:
            const url = await client.startGitHubAuth();
            redirect(302, url);
            break;
        case SetTokensResult.SET_FROM_COOKIE:
        case SetTokensResult.REFRESHED:
            redirect(302, "/");
            break;
    }
};
