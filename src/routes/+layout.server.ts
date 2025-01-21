import type { LayoutServerLoad } from "../../.svelte-kit/types/src/routes/$types";
import { tryCreateAuthenticatedClient } from "$lib/server";
import { IndexNotAuthenticated } from "$lib/api/index-repository";
import { removeCookieTokens } from "$lib/server/tokens";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    try {
        const profile = await client.getSelf();
        return { loggedInUser: profile };
    } catch (e) {
        if (e instanceof IndexNotAuthenticated) {
            client.wipeTokens();
            removeCookieTokens(cookies);
        }

        return { loggedInUser: null };
    }

}