import type { PageServerLoad } from "./$types";
import { IndexClient } from "$lib/api/index-repository";
import { redirect } from "@sveltejs/kit";
import { setCookieTokens } from "$lib/api/tokens";

export const load: PageServerLoad = async ({ url, cookies }) => {
    const client = new IndexClient({ fetch });

    const params = url.searchParams;

    if (!params.has("state") || !params.has("code")) {
        return redirect(302, "/");
    }

    try {
        const tokens = await client.onGitHubCallback(params.get("code")!, params.get("state")!);

        setCookieTokens(tokens.access_token, tokens.refresh_token, cookies);

        return redirect(302, "/me");
    } catch (e: unknown) {
        return redirect(302, "/");
    }
};
