import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ cookies }) => {
    const token = cookies.get("token");

    let loggedIn = typeof token == "string"

    return { loggedIn };
};
