import type { PageServerLoad } from "../../../../../.svelte-kit/types/src/routes/login/$types";
import { IndexClient } from "$lib/api/index-repository";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ url, cookies }) => {
    const client = new IndexClient({ fetch });

    const params = url.searchParams;

    if (!params.has('state') || !params.has('code')) {
        redirect(302, "/");
    }

    try {
        const tokens = await client.onGitHubCallback(
            params.get('code')!,
            params.get('state')!
        );

        const self = await client.getSelf();

        cookies.set("authtoken", tokens.access_token, {
            path: "/",
            maxAge: 86400, // = 1 day
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        cookies.set("refreshtoken", tokens.refresh_token, {
            path: "/",
            maxAge: 2592000, // = 30 days
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        cookies.set("cached_profile", JSON.stringify(self), {
            path: "/",
            maxAge: 31536000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        redirect(302, "/");
    } catch (e: unknown) {
        console.error(e);
        redirect(302, "/");
    }
}
