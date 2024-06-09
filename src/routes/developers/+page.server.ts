import {
    IndexError,
    getDevelopers,
    type DeveloperSearchParams,
} from "$lib/api/index-repository.js";
import { toIntSafe } from "$lib/api/helpers.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url }) => {
    const params: DeveloperSearchParams = {
        query: url.searchParams.get("query") ?? undefined,
        page: toIntSafe(url.searchParams.get("page")),
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
    };

    try {
        const developers = await getDevelopers(params);
        return { developers, params };
    } catch (e) {
        if (e instanceof IndexError) {
            return { error: e.message, params };
        }
    }

    return { params };
};
