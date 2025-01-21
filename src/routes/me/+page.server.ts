import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { IndexError } from "$lib/api/index-repository.js";
import { tryCreateAuthenticatedClient } from "$lib/server";

export const actions: Actions = {
    update_self: async ({ cookies, request, fetch }) => {
        const client = await tryCreateAuthenticatedClient(cookies, fetch);

        if (!client.wasAuthSuccessful()) {
            return fail(401, { message: "You are not authenticated" });
        }

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
        const client = await tryCreateAuthenticatedClient(cookies, fetch);

        if (!client.wasAuthSuccessful()) {
            return fail(401, { message: "You are not authenticated" });
        }

        try {
            await client.deleteToken();
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        cookies.delete("authtoken", { path: "/" });
        cookies.delete("refreshtoken", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        return redirect(302, "/");
    },
    logout_all: async ({ cookies, fetch }) => {
        const client = await tryCreateAuthenticatedClient(cookies, fetch);

        if (!client.wasAuthSuccessful()) {
            return fail(401, { message: "You are not authenticated" });
        }

        try {
            await client.deleteAllTokens();
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { cause: e.message });
            }

            throw e;
        }

        cookies.delete("authtoken", { path: "/" });
        cookies.delete("refreshtoken", { path: "/" });
        cookies.delete("cached_profile", { path: "/" });

        return redirect(302, "/");
    },
};

export const load: PageServerLoad = async ({ cookies, fetch }) => {
    const client = await tryCreateAuthenticatedClient(cookies, fetch);

    if (!client.wasAuthSuccessful()) {
        redirect(302, "/login");
    }

    // i'm having a js moment, honestly
    let self = undefined;
    try {
        self = await client.getSelf();

        cookies.set("cached_profile", JSON.stringify(self), {
            path: "/",
            maxAge: 31536000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
    } catch (e) {
        console.log(e);
        cookies.delete("cached_profile", { path: "/" });

        redirect(302, "/login");
    }

    return { self };
};
