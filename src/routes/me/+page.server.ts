import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { getSelf, getSelfMods } from "$lib/api/index-repository.js";
import type { ModStatus } from "$lib/api/models/mod-version.js";
import type { ServerSimpleMod } from "$lib/api/models/mod.js";

export const load: PageServerLoad = async ({ cookies, url }) => {
    const token = cookies.get("token");
    if (!token) {
        redirect(302, "/login");
    }

    const sort = (url.searchParams.get("status") as ModStatus) ?? "accepted";

    // i'm having a js moment, honestly
    let self = undefined;
    try {
        self = await getSelf(token);
        cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
    } catch (_) {
        cookies.delete("token", { path: "/" });
        redirect(302, "/login");
    }

    let self_mods: ServerSimpleMod[] = [];
    try {
        self_mods = await getSelfMods(token, { status: sort });
    } catch (_) {
        // ...
    }

    return { self, mods: self_mods, status: sort };
};
