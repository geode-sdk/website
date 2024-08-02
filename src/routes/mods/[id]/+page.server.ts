import { IndexError, IndexClient } from "$lib/api/index-repository.js";
import type { ServerDeveloper } from "$lib/api/models/base.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";

export const actions: Actions = {
    update_mod_version: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();
        const status = data.get("status") as ModStatus;
        if (!status || typeof status != "string") {
            return fail(400, { message: "invalid status" });
        }

        const version = data.get("mod_version");
        if (!version || typeof version != "string") {
            return fail(400, { message: "missing version" });
        }

        const info = (data.get("info") as string | null) ?? undefined;

        try {
            await client.updateModVersion(id, version, { status, info });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    update_mod: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();

        // checkbox are "on" if true, otherwise not present
        const featured = data.has("featured");

        try {
            await client.updateMod(id, { featured });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    create_version: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();

        const download_link = data.get("download_link");
        if (!download_link || typeof download_link != "string") {
            return fail(400, { message: "invalid download_link" });
        }

        try {
            await client.createModVersion(id, { download_link });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    add_developer: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();

        const developer = data.get("developer");
        if (!developer || typeof developer != "string") {
            return fail(400, { message: "invalid developer" });
        }

        try {
            await client.addDeveloper(id, { username: developer });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
    remove_developer: async ({ cookies, request, params, fetch }) => {
        const id = params.id;

        const token = cookies.get("token");
        if (!token) {
            return fail(401, { message: "no token provided" });
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();

        const developer = data.get("developer");
        if (!developer || typeof developer != "string") {
            return fail(400, { message: "invalid developer" });
        }

        try {
            await client.removeDeveloper(id, developer);
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
};

export const load: PageServerLoad = async ({ fetch, url, params, cookies }) => {
    const id = params.id;
    const version_string = url.searchParams.get("version") ?? "latest";

    const user_str = cookies.get("cached_profile");
    const user = user_str
        ? (JSON.parse(user_str) as ServerDeveloper)
        : undefined;

    const client = new IndexClient({ fetch });

    let mod = undefined;
    try {
        mod = await client.getMod(id);
    } catch (e) {
        error(404, {
            message: "Mod not found.",
        });
    }

    let version = undefined;
    try {
        version = await client.getModVersion(id, version_string);
    } catch (e) {
        error(404, {
            message: "Version not found.",
        });
    }

    if (!version && version_string == "latest") {
        // version info is probably just stuck in pending
        // this doesn't run all the time, as it may produce undesirable results
        version = await client.getModVersion(id, mod.versions[0].version);
    }

    return { mod, version, user };
};
