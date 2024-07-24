import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import {
    IndexError,
    deleteToken,
} from "$lib/api/index-repository.js";
export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");
    if (!token) {
        redirect(302, "/login");
    }

    try {
        await deleteToken(<string>cookies.get("token"));
    } catch (e) {
        if (e instanceof IndexError) {
            return fail(400, { cause: e.message });
        }

        throw e;
    }
    
    
    cookies.delete("token", { path: "/" });
    cookies.delete("cached_profile", { path: "/" });

    redirect(304, "/")
    return;
};
