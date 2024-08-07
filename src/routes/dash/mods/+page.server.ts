import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import {
    IndexError,
    getSelfMods,
} from "$lib/api/index-repository.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (!token) {
        redirect(302, "/login");
    }

    // i'm having a js moment, honestly
    let mods = undefined;
    try {
        mods = await getSelfMods(token);
    } catch (_) {

        redirect(500, "It failed idk why, reason: " + _);
    }

    return { mods };
};
