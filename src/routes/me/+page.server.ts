import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { IndexError, IndexClient } from "$lib/api/index-repository.js";

export const actions: Actions = {
    update_self: async ({ cookies, request, fetch }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        const client = new IndexClient({ token, fetch });

        const data = await request.formData();
        const display_name = data.get("display_name");
        if (!display_name || typeof display_name != "string") {
            return fail(400, { display_name, missing: true });
        }

        try {
            await client.updateProfile({ display_name });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        return { success: true };
    },
    logout: async ({ cookies, fetch }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        const client = new IndexClient({ token, fetch });

        try {
            await client.deleteToken();
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        cookies.delete("token", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        return { success: true };
    },
    logout_all: async ({ cookies, fetch }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        const client = new IndexClient({ token, fetch });

        try {
            await client.deleteAllTokens();
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        cookies.delete("token", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        return { success: true };
    },
};

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const token = cookies.get("token");
    if (!token) {
        redirect(302, "/login");
    }

    const client = new IndexClient({ token, fetch });

    // i'm having a js moment, honestly
    let self = undefined;
    try {
        self = await client.getSelf();
        cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
    } catch (_) {
        cookies.delete("token", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        redirect(302, "/login");
    }

    return { self };
};
