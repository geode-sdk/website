import type { PageServerLoad } from "./$types.js";
import { redis, redis_lock, redis_unlock } from "$lib/server/redis.js";

const GITHUB_BASE_URL = "https://api.github.com/repos/";
const RELEASE_PREFIX = "/releases/latest";

const LAUNCHER_REPO = "geode-sdk/android-launcher";
const LOADER_REPO = "geode-sdk/geode";
const IOS_REPO = "geode-sdk/ios-launcher";

// most of these properties aren't useful to us
interface Asset {
    url: string;
    name: string;
    browser_download_url: string;
}

interface Release {
    url: string;
    id: number;
    tag_name: string;
    name: string;
    assets: Asset[];
}

async function get_latest_tag(fetch_fn: typeof fetch, repo: string): Promise<string> {
    // dynamic fetch function, in case you want to run this on the client

    const url = `${GITHUB_BASE_URL}${repo}${RELEASE_PREFIX}`;
    const cache_key = `install:2:${repo}`;

    let last_modified: string | undefined = undefined;
    if (redis) {
        const cached_at = await redis.hGet(cache_key, "cached");

        if (cached_at) {
            const begin_time = +cached_at;
            const elapsed_time = Date.now() - begin_time;

            // we can really set this to whatever
            if (elapsed_time < 1000 * 60 * 5) {
                const tag = await redis.hGet(cache_key, "tag");
                if (tag) {
                    return tag;
                }
            }

            // perform a refetch
            last_modified = await redis.hGet(cache_key, "modified");
        }
    }

    const headers = last_modified ? { headers: { "If-Modified-Since": last_modified } } : undefined;

    const resp = await fetch_fn(url, headers);

    if (resp.status == 304 && redis) {
        const tag = await redis.hGet(cache_key, "tag");
        if (!tag) {
            await redis.del(cache_key);
            throw new Error("expected cached tag, but found nothing");
        }

        const cached = Date.now();
        await redis.hSet(cache_key, "cached", cached);

        return tag;
    }

    if (resp.status != 200) {
        if (redis) {
            // use cache in case of an error. we can try again later
            const tag = await redis.hGet(cache_key, "tag");
            if (tag) {
                return tag;
            }
        }

        throw Error(`Failed to find a release for repo ${repo}`);
    }

    const release: Release = await resp.json();

    const tag = release.tag_name;
    last_modified = resp.headers.get("last-modified") ?? undefined;

    if (redis) {
        const cached = Date.now();

        if (last_modified) {
            await redis.hSet(cache_key, {
                cached,
                tag,
                modified: last_modified,
            });
        } else {
            await redis.hSet(cache_key, { cached, tag });
        }
    }

    return tag;
}

export const load: PageServerLoad = async () => {
    const lock_key = "install:1:lock";

    try {
        if (redis) {
            await redis_lock(lock_key);
        }

        // github api says making multiple requests at the same time counts for a different ratelimit
        // otherwise i'd just Promise.all it for maximum performance
        const loader_data = await get_latest_tag(fetch, LOADER_REPO);
        const launcher_data = await get_latest_tag(fetch, LAUNCHER_REPO);
        let ios_launcher_data = await get_latest_tag(fetch, IOS_REPO);

        if (ios_launcher_data.startsWith("v")) {
            ios_launcher_data = ios_launcher_data.substring(1);
        }

        return {
            error: false,
            loader_tag: loader_data,
            launcher_tag: launcher_data,
            ios_launcher_tag: ios_launcher_data,
        };
    } catch (e) {
        return {
            error: true,
        };
    } finally {
        if (redis) {
            await redis_unlock(lock_key);
        }
    }
};
