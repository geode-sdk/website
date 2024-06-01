import {
    IndexError,
    createMod,
    getMods,
    getSelfMods,
} from "$lib/api/index-repository.js";
import type { ServerDeveloper } from "$lib/api/models/base.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";

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

export const actions: Actions = {
    upload_mod: async ({ cookies, request }) => {
        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const data = await request.formData();

        const download_link = data.get("download_link");
        if (!download_link || typeof download_link != "string") {
            return fail(400, { message: "invalid download_link" });
        }

        try {
            await createMod(token, { download_link });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
};

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const id = params.id;

    const user_str = cookies.get("cached_profile");
    const user = user_str
        ? (JSON.parse(user_str) as ServerDeveloper)
        : undefined;

    const search_params = {
        page: toIntSafe(url.searchParams.get("page")) ?? 1,
        per_page: toIntSafe(url.searchParams.get("per_page")) ?? 10,
        status: (url.searchParams.get("status") as ModStatus) ?? "accepted",
    };

    // get /developers/id doesn't exist yet

    const developer: ServerDeveloper = {
        admin: false,
        verified: false,
        display_name: "example",
        username: "geode-sdk",
        id: +params.id,
    };

    if (!developer) {
        error(404, "Developer not found");
    }

    // get developer mods if not self, otherwise get self mods
    let self_mods = undefined;
    let mods = undefined;
    let load_error = undefined;

    if (developer.id == user?.id) {
        const token = cookies.get("token");
        if (token) {
            try {
                self_mods = await getSelfMods(token, {
                    status: search_params.status,
                });
            } catch (e) {
                if (e instanceof IndexError) {
                    load_error = e.message;
                } else {
                    throw e;
                }
            }
        }
    } else {
        try {
            mods = await getMods({
                developer: developer.username,
                ...search_params,
            });
        } catch (e) {
            if (e instanceof IndexError) {
                load_error = e.message;
            } else {
                throw e;
            }
        }
    }

    return {
        developer,
        user,
        mods,
        self_mods,
        error: load_error,
        params: search_params,
    };
};
