import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import {
    IndexError,
    deleteAllTokens,
    deleteToken,
    getSelf,
    updateProfile,
} from "$lib/api/index-repository.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");

    let loggedIn = typeof token == "string"

    return { loggedIn };
};
