import type { PageServerLoad } from "../../../../../.svelte-kit/types/src/routes/login/$types";
import { IndexClient } from "$lib/api/index-repository";
import { redirect } from "@sveltejs/kit";
import { setCookieTokens } from "$lib/server/tokens";

export const load: PageServerLoad = async ({ url, cookies }) => {
    const client = new IndexClient({ fetch });

    const params = url.searchParams;

    if (!params.has('state') || !params.has('code')) {
        redirect(302, "/");
    }

    try {
        const tokens = await client.onGitHubCallback(
            params.get('code')!,
            params.get('state')!
        );

        setCookieTokens(tokens.access_token, tokens.refresh_token, cookies);

        return redirect(302, "/");
    } catch (e: unknown) {
        return redirect(302, "/");
    }
}
