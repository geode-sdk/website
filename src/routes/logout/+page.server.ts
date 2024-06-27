import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { deleteToken } from "$lib/api/index-repository";
export const load: PageServerLoad = async ({ cookies }) => {
    deleteToken(<string>cookies.get("token"));
    cookies.delete("token", { path: "/" });
    cookies.delete("cached_profile", { path: "/" });

    redirect(304, "/")
    return;
};
