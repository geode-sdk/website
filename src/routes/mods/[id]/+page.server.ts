import {
    createModVersion,
    getMod,
    getModVersion,
    updateMod,
    updateModVersion,
} from "$lib/api/index-repository.js";
import type { ServerDeveloper } from "$lib/api/models/base.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error } from "@sveltejs/kit";

export const actions: Actions = {
    update_mod_version: async ({ cookies, request, params, url }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            error(401, "no token provided");
        }

        const data = await request.formData();
        const status = data.get("status") as ModStatus;
        if (!status || typeof status != "string") {
            error(400, "invalid status");
        }

        const version = data.get("mod_version");
        if (!version || typeof version != "string") {
            error(400, "missing version");
        }

        const info = (data.get("info") as string | null) ?? undefined;

        await updateModVersion(token, id, version, { status, info });
    },
    update_mod: async ({ cookies, request, params }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            error(401, "no token provided");
        }

        const data = await request.formData();

        // checkbox are "on" if true, otherwise not present
        const featured = data.has("featured");

        await updateMod(token, id, { featured });
    },
    create_version: async ({ cookies, request, params }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            error(401, "no token provided");
        }

        const data = await request.formData();

        const download_link = data.get("download_link");
        if (!download_link || typeof download_link != "string") {
            error(400, "invalid download_link");
        }

        await createModVersion(token, id, { download_link });
    },
};

export const load: PageServerLoad = async ({ url, params, cookies }) => {
    const id = params.id;
    const version_string = url.searchParams.get("version") ?? "latest";

    const user_str = cookies.get("cached_profile");
    const user = user_str
        ? (JSON.parse(user_str) as ServerDeveloper)
        : undefined;

    // interesting index api behavior
    const mod = await getMod(id);
    if (!mod) {
        error(404, {
            message: "Mod not found",
        });
    }

    try {
        const version = await getModVersion(id, version_string);

        return { mod, version, user };
    } catch (e) {
        error(404, {
            message: "Version not found",
        });
    }
};
