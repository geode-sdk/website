import type { Cookies } from "@sveltejs/kit";
import { IndexClient } from "$lib/api/index-repository";

type GlobalFetch = typeof fetch;

export const tryCreateAuthenticatedClient = async (cookies: Cookies, fetch: GlobalFetch): Promise<IndexClient> => {
    const client = new IndexClient({ fetch });
    await client.trySetTokens(cookies);

    return client;
};
