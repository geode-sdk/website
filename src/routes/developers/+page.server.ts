import {
    IndexError,
    IndexClient,
    type DeveloperSearchParams,
} from "$lib/api/index-repository.js";
import { toIntSafe } from "$lib/api/helpers.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const params: DeveloperSearchParams = {
        query: url.searchParams.get("query") ?? undefined,
        page: toIntSafe(url.searchParams.get("page")),
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
    };

    const client = new IndexClient({ fetch });

    try {
        const developers = await client.getDevelopers(params);
        return { developers, params };
    } catch (e) {
        if (e instanceof IndexError) {
            return { error: e.message, params };
        }
    }

    return { params };
};
