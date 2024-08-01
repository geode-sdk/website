import {
    IndexError,
    ModSort,
    IndexClient,
    type ModSearchParams,
} from "$lib/api/index-repository.js";
import { toIntSafe, undefIfEmpty, onlyIfTrue } from "$lib/api/helpers.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ url, fetch }) => {
    const params: ModSearchParams = {
        query: url.searchParams.get("query") ?? undefined,
        page: toIntSafe(url.searchParams.get("page")),
        tags: undefIfEmpty(url.searchParams.getAll("tag")),
        platforms: undefIfEmpty(url.searchParams.getAll("platform")),
        // it's your problem if you edit the search params
        sort: (url.searchParams.get("sort") as ModSort) ?? "downloads",
        featured: onlyIfTrue(url.searchParams.get("featured")),
        status: (url.searchParams.get("status") as ModStatus) ?? "accepted",
        gd: url.searchParams.get("gd") ?? undefined,
        developer: url.searchParams.get("developer") ?? undefined,
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
    };

    const client = new IndexClient({ fetch });

    try {
        // ideally we would cache this information somewhere
        const tags = client.getTags();

        try {
            const mods = await client.getMods(params);
            return { mods, params, tags };
        } catch (e) {
            if (e instanceof IndexError) {
                return { error: e.message, params, tags };
            }
        }

        return { params, tags };
    } catch (e) {
        if (e instanceof IndexError) {
            return { error: e.message, params };
        }
        return {
            error: "There was an Unknown Error when loading the Geode Index! Please try again later - it could also be that the servers are down. :(",
            params,
        };
    }
};
