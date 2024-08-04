import type { PageServerLoad } from "./$types.js";
import { redis } from "$lib/server/redis.js";

const GITHUB_BASE_URL = "https://api.github.com/repos/";
const RELEASE_PREFIX = "/releases/latest";

const LAUNCHER_REPO = "geode-sdk/android-launcher";
const LOADER_REPO = "geode-sdk/geode";

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

async function get_latest_tag(
    fetch_fn: typeof fetch,
    repo: string,
): Promise<string> {
    // dynamic fetch function, in case you want to run this on the client

    const url = `${GITHUB_BASE_URL}${repo}${RELEASE_PREFIX}`;
    const cache_key = `site::install:1:${repo}`;

    if (redis) {
        const tag = await redis.get(cache_key);
        if (tag) {
            return tag;
        }
    }

    const resp = await fetch_fn(url);
    const release: Release = await resp.json();

    if (resp.status != 200) {
        throw Error(`Failed to find a release for repo ${repo}`);
    }

    const tag = release.tag_name;

    if (redis) {
        // 5 minutes is well under github ratelimit periods (2 mins is lowest)
        // there's probably a case that can be made for not expiring so we can check etag
        await redis.set(cache_key, tag, { EX: 5 * 60 });
    }

    return tag;
}

export const load: PageServerLoad = async () => {
    try {
        // github api says making multiple requests at the same time counts for a different ratelimit
        // otherwise i'd just Promise.all it for maximum performance
        const loader_data = await get_latest_tag(fetch, LOADER_REPO);
        const launcher_data = await get_latest_tag(fetch, LAUNCHER_REPO);

        return {
            error: false,
            loader_tag: loader_data,
            launcher_tag: launcher_data,
        };
    } catch (e) {
        return {
            error: true,
        };
    }
};
