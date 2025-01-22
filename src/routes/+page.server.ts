import type { PageServerLoad } from "./$types.js";
import { tryCreateAuthenticatedClient } from "$lib/server";

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    try {
        return { self: await client.getSelf() };
    } catch (e) {
        return { self: null };
    }
};
