import {
    IndexError,
    ModSort,
    createMod,
    getDeveloper,
    getMods,
    getSelfMods,
    updateDeveloper,
} from "$lib/api/index-repository.js";
import { toIntSafe } from "$lib/api/helpers.js";
import type { ServerDeveloper } from "$lib/api/models/base.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";

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
    modify_user: async ({ cookies, params, request }) => {
        const id = toIntSafe(params.id);
        if (!id) {
            return fail(404, { message: "Developer not found" });
        }

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const data = await request.formData();

        // only be present if true, just in case it messes up auth or something
        const verified = data.has("verified") ? true : undefined;
        const admin = data.has("admin") ? true : undefined;

        try {
            await updateDeveloper(token, id, { verified, admin });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    }
};

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const id = toIntSafe(params.id);
    if (!id) {
        error(404, "Developer not found");
    }

    const user_str = cookies.get("cached_profile");
    const user = user_str
        ? (JSON.parse(user_str) as ServerDeveloper)
        : undefined;

    let developer = undefined;
    try {
        developer = await getDeveloper(id);
    } catch (e) {
        if (e instanceof IndexError) {
            error(404, "Developer not found");
        }

        throw e;
    }

    // get developer mods if not self, otherwise get self mods
    let load_error = undefined;

    if (developer.id == user?.id) {
        const token = cookies.get("token");
        if (token) {
            let self_mods = undefined;

            const search_params = {
                status: (url.searchParams.get("status") as ModStatus) ?? "accepted",
            };

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

            return {
                developer,
                user,
                self_mods,
                error: load_error,
                params: search_params,
            };
        }
    }

    let mods = undefined;

    try {
        mods = await getMods({
            developer: developer.username,
            sort: ModSort.Downloads,
            per_page: 5
        });
    } catch (e) {
        if (e instanceof IndexError) {
            load_error = e.message;
        } else {
            throw e;
        }
    }

    return {
        developer,
        user,
        mods,
        error: load_error,
    };
};
