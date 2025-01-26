import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { IndexError, IndexNotAuthenticated } from "$lib/api/index-repository.js";
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
                return fail(400, { message: e.message });
            }

            throw e;
        }

        return { success: true };
    },
    upload_mod: async ({ cookies, request, fetch }) => {
        const client = await tryCreateAuthenticatedClient(cookies, fetch);

        if (!client.wasAuthSuccessful()) {
            return fail(401, { message: "You are not authenticated" });
        }

        const data = await request.formData();

        const download_link = data.get("download_link");
        if (!download_link || typeof download_link != "string" || !URL.canParse(download_link)) {
            return fail(400, { message: "Download link is invalid" });
        }

        try {
            await client.createMod({ download_link });
        } catch (e) {
            if (e instanceof IndexError) {
                return fail(400, { message: e.message });
            }
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
            if (e instanceof IndexNotAuthenticated) {
                return redirect(302, "/");
            }

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
        return redirect(302, "/login");
    }

    try {
        const self = await client.getSelf();

        const myPending = await client.getSelfMods({ status: "pending" });
        const myRejected = await client.getSelfMods({ status: "rejected" });

        return { self, myPendingMods: myPending, myRejectedMods: myRejected };
    } catch (e) {
        return redirect(302, "/login");
    }
};
