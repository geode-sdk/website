import {
    IndexClient,
    IndexError,
    ModSort,
    SetTokensResult,
} from "$lib/api/index-repository.js";
import { toIntSafe } from "$lib/api/helpers.js";
import type { ServerDeveloper } from "$lib/api/models/base.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { Actions, PageServerLoad } from "./$types.js";
import { error, fail } from "@sveltejs/kit";
import { tryCreateAuthenticatedClient } from "$lib/server";

export const actions: Actions = {
    modify_user: async ({ cookies, params, request, fetch }) => {
        const id = toIntSafe(params.id);
        if (!id) {
            return fail(404, { message: "Developer not found" });
        }

        const client = await tryCreateAuthenticatedClient(cookies, fetch);

        if (!client.wasAuthSuccessful()) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        // only be present if true, just in case it messes up auth or something
        const verified = data.has("verified") ? true : undefined;
        const admin = data.has("admin") ? true : undefined;

        try {
            await client.updateDeveloper(id, { verified, admin });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
        }

        return { success: true };
    },
};

export const load: PageServerLoad = async ({ params, fetch }) => {
    const id = toIntSafe(params.id);
    if (!id) {
        error(404, "Developer not found");
    }

    const client = new IndexClient({ fetch });

    let developer = undefined;
    try {
        developer = await client.getDeveloper(id);
    } catch (e) {
        if (e instanceof IndexError) {
            error(404, "Developer not found");
        }

        throw e;
    }

    let loadError: IndexError | undefined = undefined;
    let mods = undefined;

    try {
        mods = await client.getMods({
            developer: developer.username,
            sort: ModSort.Downloads,
            per_page: 5,
        });
    } catch (e) {
        if (e instanceof IndexError) {
            loadError = e;
        } else {
            throw e;
        }
    }

    return {
        developer,
        mods,
        error: loadError,
    };
};
