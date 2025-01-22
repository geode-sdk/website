import type { Cookies } from "@sveltejs/kit";

export const setCookieTokens = (
    auth: string,
    refresh: string,
    cookies: Cookies,
): void => {
    cookies.set("authtoken", auth, {
        path: "/",
        maxAge: 86400, // = 1 day
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    cookies.set("refreshtoken", refresh, {
        path: "/",
        maxAge: 2592000, // = 30 days
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
};

export const removeCookieTokens = (
    cookies: Cookies,
    auth: boolean = true,
    refresh: boolean = true,
) => {
    if (auth) {
        cookies.delete("authtoken", { path: "/" });
    }

    if (refresh) {
        cookies.delete("refreshtoken", { path: "/" });
    }
};
