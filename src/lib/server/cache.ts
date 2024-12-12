import type { IndexClient, } from "$lib/api/index-repository.js";
import { redis } from "$lib/server/redis.js";
import type { ServerTag } from "$lib/api/models/base.js";

export async function getCachedTags(client: IndexClient): Promise<ServerTag[]> {
    const cache_key = `listing_tags:2`;
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
