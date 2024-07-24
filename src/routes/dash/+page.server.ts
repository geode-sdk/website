import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import {
    IndexError,
    getSelf,
} from "$lib/api/index-repository.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (!token) {
        redirect(302, "/login");
    }

    // i'm having a js moment, honestly
    let self = undefined;
    try {
        self = await getSelf(token);
        cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
    } catch (_) {
        cookies.delete("token", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        redirect(302, "/login");
    }

    return { self };
};
