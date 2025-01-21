import {
    type IndexClient,
    SetTokensResult,
} from "$lib/api/index-repository.js";
import { redis } from "$lib/server/redis.js";
import type { ServerDeveloper, ServerTag } from "$lib/api/models/base.js";
import type { Cookies } from "@sveltejs/kit";

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

export async function getCachedProfile(
    cookies: Cookies,
    client: IndexClient,
): Promise<ServerDeveloper | null> {
    const cached = cookies.get("cached_profile");
    if (cached) {
        try {
            return JSON.parse(cached) as ServerDeveloper;
        } catch (_) {}
    }

    await client.trySetTokens(cookies);

    if (client.wasAuthSuccessful()) {
        const self = await client.getSelf();
        cookies.set("cached_profile", JSON.stringify(self), {
            path: "/",
            maxAge: 31536000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        return self;
    }

    return null;
}
