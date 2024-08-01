import { IndexClient } from "$lib/api/index-repository.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";

export const actions: Actions = {
    default: async ({ cookies, request, fetch }) => {
        const data = await request.formData();
        const token = data.get("token");

        if (!token || typeof token != "string") {
            return fail(403, { invalid: true });
        }

        const client = new IndexClient({ fetch, token });

        try {
            const self = await client.getSelf();
            // token is valid
            cookies.set("token", token, { path: "/" });
            cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
        } catch (e) {
            return fail(403, { invalid: true });
        }

        redirect(302, "/me");
    },
};

export const load: PageServerLoad = ({ cookies }) => {
    if (cookies.get("token")) {
        redirect(302, "/me");
    }
};
