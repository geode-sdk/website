import { fail, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types.js";
import {
    IndexError,
    deleteAllTokens,
    deleteToken,
    getSelf,
    updateProfile,
} from "$lib/api/index-repository.js";

export const load: LayoutServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    
    let loggedIn = typeof token == "string";

    // i'm having a js moment, honestly
    let self = undefined;

    try {
        if (loggedIn) {
            self = await getSelf(<string>token);
            cookies.set("cached_profile", JSON.stringify(self), { path: "/" });
        }
    } catch (error) {
        loggedIn = false
        console.log(`Unknown Error in +layout.server.ts: ${error}`)
    }

    return { loggedIn, self };
};
