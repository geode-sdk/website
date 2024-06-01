import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import {
    IndexError,
    deleteAllTokens,
    deleteToken,
    getSelf,
    updateProfile,
} from "$lib/api/index-repository.js";

export const actions: Actions = {
    update_self: async ({ cookies, request }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        const data = await request.formData();
        const display_name = data.get("display_name");
        if (!display_name || typeof display_name != "string") {
            return fail(400, { display_name, missing: true });
        }

        try {
            await updateProfile(token, { display_name });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        return { success: true };
    },
    logout: async ({ cookies }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        try {
            await deleteToken(token);
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
    logout_all: async ({ cookies }) => {
        const token = cookies.get("token");
        if (!token) {
            redirect(302, "/login");
        }

        try {
            await deleteAllTokens(token);
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
