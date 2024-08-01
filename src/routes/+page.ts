import { IndexClient } from "$lib/api/index-repository.js";
import type { PageLoad } from "./$types.js";

export const prerender = true;

export const load: PageLoad = ({ fetch }) => {
    const client = new IndexClient({ fetch });
    return {
        stats: client.getServerStats(),
    };
};
