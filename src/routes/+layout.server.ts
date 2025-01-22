import type { LayoutServerLoad } from "./$types";
import { tryCreateAuthenticatedClient } from "$lib/server";
import {
    IndexNotAuthenticated,
    SetTokensResult,
} from "$lib/api/index-repository";
import { removeCookieTokens, setCookieTokens } from "$lib/server/tokens";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    try {
        const profile = await client.getSelf();

        if (client.lastAuthStatus() === SetTokensResult.REFRESHED) {
            // If our tokens got refreshed during the /me call, set the cookies again
            const tokens = client.getTokens();
            setCookieTokens(tokens.auth!, tokens.refresh!, cookies);
        }

        return { loggedInUser: profile };
    } catch (e) {
        if (e instanceof IndexNotAuthenticated) {
            client.wipeTokens();
            removeCookieTokens(cookies);
        }

        return { loggedInUser: null };
    }
};