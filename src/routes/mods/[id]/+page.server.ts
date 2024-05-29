import { getMod, getModVersion } from "$lib/api/index-repository.js";
import type { PageServerLoad } from "./$types.js";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url, params }) => {
    const id = params.id;
    const version_string = url.searchParams.get("version") ?? "latest";

    // interesting index api behavior
    const mod = await getMod(id);
    if (!mod) {
        error(404, {
            message: "Mod not found",
        });
    }

    try {
        const version = await getModVersion(id, version_string);

        return { mod, version };
    } catch (e) {
        error(404, {
            message: "Version not found",
        });
    }
};
