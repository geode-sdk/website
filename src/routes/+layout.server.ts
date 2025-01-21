import type { LayoutServerLoad } from "../../.svelte-kit/types/src/routes/$types";
import { tryCreateAuthenticatedClient } from "$lib/server";
import { getCachedProfile } from "$lib/server/cache";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    const userProfile = client.wasAuthSuccessful()
        ? await getCachedProfile(cookies, client)
        : null;

    return { loggedInUser: userProfile };
}