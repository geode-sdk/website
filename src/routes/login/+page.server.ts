import { getSelf } from "$lib/api/index-repository.js";
import { error, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        const token = data.get("token")?.toString();

        if (!token) {
            error(400, "missing token");
        }

        try {
            const self = await getSelf(token);
            // token is valid
            cookies.set("token", token, { path: "/" });
            cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
        } catch (e) {
            error(403, "invalid token");
        }

        redirect(302, "/me");
    },
};

export const load: PageServerLoad = ({ cookies }) => {
    if (cookies.get("token")) {
        redirect(302, "/me");
    }
};
