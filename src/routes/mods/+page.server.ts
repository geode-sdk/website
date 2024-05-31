import {
    IndexError,
    ModSort,
    getMods,
    getTags,
    type ModSearchParams,
} from "$lib/api/index-repository.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { PageServerLoad } from "./$types.js";

function toIntSafe(value: string | null) {
    if (!value) {
        return undefined;
    }

    const as_int = parseInt(value);
    if (!as_int) {
        return undefined;
    }

    return as_int;
}

function undefIfEmpty<T>(value: T[]) {
    if (value.length > 0) {
        return value;
    }

    return undefined;
}

function onlyIfTrue(value: string | null) {
    if (value == "true") {
        return true;
    }

    return undefined;
}

export const load: PageServerLoad = async ({ url }) => {
    const params: ModSearchParams = {
        query: url.searchParams.get("query") ?? undefined,
        page: toIntSafe(url.searchParams.get("page")),
        tags: undefIfEmpty(url.searchParams.getAll("tag")),
        platforms: undefIfEmpty(url.searchParams.getAll("platform")),
        // it's your problem if you edit the search params
        sort: (url.searchParams.get("sort") as ModSort) ?? "downloads",
        featured: onlyIfTrue(url.searchParams.get("featured")),
        status: (url.searchParams.get("status") as ModStatus) ?? "accepted",
        developer: url.searchParams.get("developer") ?? undefined,
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
    };

    // ideally we would cache this information somewhere
    const tags = await getTags();

    try {
        const mods = await getMods(params);
        return { mods, params, tags };
    } catch (e) {
        if (e instanceof IndexError) {
            return { error: e.message, params, tags };
        }
    }

    return { params, tags };
};
