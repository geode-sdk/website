import { getMods, type ModSearchParams } from "$lib/api/index-repository.js";
import type { PageServerLoad } from "./$types.js";

function toIntSafe(value: string | null) {
    if (!value) {
        return null;
    }

    const as_int = parseInt(value);
    if (!as_int) {
        return null;
    }

    return as_int;
}

export const load: PageServerLoad = async ({ url }) => {
    const params: ModSearchParams = {
        query: url.searchParams.get("query") ?? undefined,
        page: toIntSafe(url.searchParams.get("page")) ?? undefined,
        per_page: 10,
    };
    const mods = await getMods(params);

    return { mods, params };
};
