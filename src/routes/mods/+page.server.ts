import {
    IndexError,
    ModSort,
    IndexClient,
    type ModSearchParams,
} from "$lib/api/index-repository.js";
import { toIntSafe, undefIfEmpty, onlyIfTrue } from "$lib/api/helpers.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { PageServerLoad } from "./$types.js";
import { redis } from "$lib/server/redis.js";

async function getTags(client: IndexClient): Promise<string[]> {
    const cache_key = `listing_tags:1`;
    if (redis) {
        const cached_tags = await redis.get(cache_key);
        if (cached_tags) {
            return JSON.parse(cached_tags);
        }
    }

    const tags = await client.getTags();

    if (redis) {
        // this delay is more arbitrary ig
        await redis.set(cache_key, JSON.stringify(tags), { EX: 5 * 60 });
    }

    return tags;
}

export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
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
        // we don't need to worry about locks as we're not about to get ratelimited for this
        const tags = getTags(client);

        try {
            const token = cookies.get("token");
            if (token && params.status == "rejected") {
                client.setToken(token);
            }

            const mods = await client.getMods(params);
            return { mods, params, tags };
        } catch (e) {
            if (e instanceof IndexError) {
                return { error: e.message, params, tags };
            }

            if (e instanceof Error) {
                return {
                    error: `Failed to search index: ${e.name}`,
                    params,
                    tags,
                };
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
