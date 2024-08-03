import type { PageServerLoad } from "./$types.js";

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

interface CachedData {
    etag: string | null;
    tag: string;
}

// this cache lasts for as long as the server does
// ideally, this is >1 minute, or we should consider an alternative caching solution
let loader_cache: CachedData | null = null;
let launcher_cache: CachedData | null = null;

async function get_latest_tag(
    fetch_fn: typeof fetch,
    repo: string,
    cache: CachedData | null,
): Promise<CachedData> {
    // dynamic fetch function, in case you want to run this on the client

    const url = `${GITHUB_BASE_URL}${repo}${RELEASE_PREFIX}`;

    if (cache?.etag) {
        const resp = await fetch_fn(url, {
            headers: {
                "If-None-Match": cache.etag,
            },
        });

        if (resp.status == 304) {
            return cache;
        }

        if (resp.status != 200) {
            throw Error(
                `Failed to find a release for repo ${repo} (cache path)`,
            );
        }

        const release: Release = await resp.json();

        return {
            etag: resp.headers.get("ETag"),
            tag: release.tag_name,
        };
    }

    const resp = await fetch_fn(url);
    const release: Release = await resp.json();

    if (resp.status != 200) {
        throw Error(`Failed to find a release for repo ${repo}`);
    }

    return {
        etag: resp.headers.get("ETag"),
        tag: release.tag_name,
    };
}

export const load: PageServerLoad = async () => {
    return {
        error: false,
        loader_tag: "v3.4.0",
        launcher_tag: "1.4.1"
    };

    try {
        // github api says making multiple requests at the same time counts for a different ratelimit
        // otherwise i'd just Promise.all it for maximum performance
        loader_cache = await get_latest_tag(fetch, LOADER_REPO, loader_cache);
        launcher_cache = await get_latest_tag(
            fetch,
            LAUNCHER_REPO,
            launcher_cache,
        );
    } catch (e) {
        return {
            error: true,
        };
    }

    return {
        error: false,
        loader_tag: loader_cache.tag,
        launcher_tag: launcher_cache.tag,
    };
};
