import * as publicEnv from "$env/static/public";

import type { ServerDeveloper, ServerTag } from "./models/base";
import type { ServerMod, ServerSimpleMod } from "./models/mod.js";
import type { ModStatus, ServerModVersion } from "./models/mod-version.js";
import type { ServerStats } from "./models/stats";
import type { Cookies } from "@sveltejs/kit";

const BASE_URL =
    "PUBLIC_API_ENDPOINT" in publicEnv &&
    typeof publicEnv.PUBLIC_API_ENDPOINT == "string"
        ? publicEnv.PUBLIC_API_ENDPOINT
        : "https://api.geode-sdk.org";

export interface Paginated<T> {
    data: T[];
    count: number;
}

export class IndexError extends Error {
    constructor(message: string) {
        super(message);

        this.name = "IndexError";
    }
}

export class IndexNotAuthenticated extends IndexError {
    constructor() {
        super("You must be authenticated to perform this action");
        this.name = "IndexNotAuthenticated";
    }
}

export enum ModSort {
    Downloads = "downloads",
    RecentlyUpdated = "recently_updated",
    RecentlyPublished = "recently_published",
    Name = "name",
    NameReverse = "name_reverse",
}

interface BaseRequest<T> {
    error: string;
    payload: T;
}

type BasePaginatedRequest<T> = BaseRequest<Paginated<T>>;

export interface ModSearchParams {
    page?: number;
    developer?: string;
    status?: ModStatus;
    featured?: boolean;
    per_page?: number;
    tags?: string[];
    platforms?: string[];
    query?: string;
    gd?: string;
    sort?: ModSort;
    geode?: string;
}

export interface UpdateModBody {
    featured: boolean;
}

export interface CreateModBody {
    download_link: string;
}

export interface GetModVersionsParams {
    page?: number;
    per_page?: number;
    gd?: string;
    platforms?: string[];
    status?: ModStatus;
}

export interface CreateModVersionBody {
    download_link: string;
}

export interface UpdateModVersionBody {
    status: ModStatus;
    info?: string;
}

export interface GetSelfModsParams {
    status?: ModStatus;
}

export interface DeveloperSearchParams {
    query?: string;
    page?: number;
    per_page?: number;
}

export interface UpdateDeveloperBody {
    admin?: boolean;
    verified?: boolean;
}

export interface AddDeveloperBody {
    username: string;
}

export interface UpdateProfileBody {
    display_name: string;
}

export interface ModLogoCacheParams {
	version?: string;
	status?: ModStatus;
}

export enum SetTokensResult {
    SET_FROM_COOKIE,
    REFRESHED,
    UNSET
}

type GlobalFetch = typeof fetch;

export class IndexClient {
    private token: string | null;
    private refreshToken: string | null;
    private _lastAuthStatus: SetTokensResult | null = null;
    private fetch: typeof fetch;

    constructor(options: { token?: string; refreshToken?: string; fetch?: GlobalFetch } = {}) {
        this.token = options.token ?? null;
        this.refreshToken = options.refreshToken ?? null;
        this.fetch = options.fetch ?? fetch;
    }

    private validate<T>(data: BaseRequest<T>) {
        if (data.error) {
            throw new IndexError(data.error);
        }
        return data.payload;
    }

    private async withRetry(callback: () => Promise<Response>): Promise<Response> {
        if (!this.refreshToken) {
            return await callback();
        }

        const firstResponse = await callback();
        if (firstResponse.status === 401) {
            this.token = null;

            if (await this.tryRefreshTokens()) {
                return await callback();
            }
        }

        return firstResponse;
    }

    private throwOnUnauth(response: Response): void {
        if (response.status === 401) {
            throw new IndexNotAuthenticated();
        }
    }

    private async checkAndTryRefreshAuth() {
        if (!this.token && this.refreshToken) {
            await this.tryRefreshTokens();
        }

        if (!this.token) {
            throw new IndexNotAuthenticated();
        }
    }

    lastAuthStatus(): SetTokensResult | null {
        return this._lastAuthStatus;
    }

    wasAuthSuccessful(): boolean {
        return this._lastAuthStatus !== null && this._lastAuthStatus !== SetTokensResult.UNSET;
    }

    wipeTokens(): void {
        this.token = null;
        this.refreshToken = null;
    }

    async trySetTokens(cookies: Cookies): Promise<SetTokensResult> {
        const auth = cookies.get("authtoken");
        const refresh = cookies.get("refreshtoken");

        if (auth && refresh) {
            this.token = auth;
            this.refreshToken = refresh;
            this._lastAuthStatus = SetTokensResult.SET_FROM_COOKIE;
            return SetTokensResult.SET_FROM_COOKIE;
        }

        if (!auth && !refresh) {
            this._lastAuthStatus = SetTokensResult.UNSET;
            return SetTokensResult.UNSET;
        }

        if (!auth && refresh) {
            this.token = null;
            this.refreshToken = refresh;

            if (await this.tryRefreshTokens()) {
                cookies.set("authtoken", this.token!, {
                    path: "/",
                    maxAge: 86400, // = 1 day
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                cookies.set("refreshtoken", this.refreshToken, {
                    path: "/",
                    maxAge: 2592000, // = 30 days
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                });
                this._lastAuthStatus = SetTokensResult.REFRESHED;
                return SetTokensResult.REFRESHED;
            }
        }

        this._lastAuthStatus = SetTokensResult.UNSET;
        return SetTokensResult.UNSET;
    }

    async startGitHubAuth(): Promise<string> {
        const url = new URL(`${BASE_URL}/v1/login/github/web`);

        const res = await this.fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
        });

        const json: BaseRequest<string> = await res.json();
        return this.validate(json);
    }

    async onGitHubCallback(code: string, state: string): Promise<{ access_token: string, refresh_token: string }> {
        const url = new URL(`${BASE_URL}/v1/login/github/callback`);

        const res = await this.fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ code, state })
        });

        if (res.status !== 200) {
            // invalid code / state

            throw new IndexError("Couldn't authenticate");
        }
        
        const json: BaseRequest<{ access_token: string, refresh_token: string }> = await res.json();
        const validated = this.validate(json);

        this.token = validated.access_token;
        this.refreshToken = validated.refresh_token;
        return validated;
    }

    /**
     * @returns true if refreshed successfuly, false otherwise
     */
    async tryRefreshTokens(): Promise<boolean> {
        // No need to refresh them (hopefully)
        if (this.token) {
            return true;
        }

        const refresh = this.refreshToken;
        if (!refresh) {
            return false;
        }

        const url = new URL(`${BASE_URL}/v1/login/refresh`);

        const res = await this.fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ refresh_token: refresh })
        });

        if (res.status !== 200) {
            // Bad refresh token

            this.token = null;
            this.refreshToken = null;
            return false;
        } else {
            const json: BaseRequest<{ access_token: string, refresh_token: string }> = await res.json();
            this.token = json.payload.access_token;
            this.refreshToken = json.payload.refresh_token;
            return true;
        }
    }

    async getMods(
        searchParams?: ModSearchParams,
    ): Promise<Paginated<ServerMod>> {
        const url = new URL(`${BASE_URL}/v1/mods`);

        if (searchParams?.page != null) {
            const page = searchParams.page;
            url.searchParams.set("page", page.toString());
        }

        if (searchParams?.per_page != null) {
            const limit = searchParams.per_page;
            url.searchParams.set("per_page", limit.toString());
        }

        if (searchParams?.developer) {
            url.searchParams.set("developer", searchParams.developer);
        }

        if (searchParams?.status) {
            url.searchParams.set("status", searchParams.status);
        }

        if (searchParams?.featured != null) {
            url.searchParams.set("featured", "true");
        }

        if (searchParams?.tags) {
            url.searchParams.set("tags", searchParams.tags.join(","));
        }

        if (searchParams?.platforms) {
            url.searchParams.set("platforms", searchParams.platforms.join(","));
        }

        if (searchParams?.query) {
            url.searchParams.set("query", searchParams.query);
        }

        if (searchParams?.gd) {
            url.searchParams.set("gd", searchParams.gd);
        }

        if (searchParams?.sort) {
            url.searchParams.set("sort", searchParams.sort);
        }

        const r = await this.withRetry(async () => {
            return await this.fetch(url, {
                headers: this.token
                    ? {"Authorization": `Bearer ${this.token}`}
                    : {}
            });
        });

        const data: BasePaginatedRequest<ServerMod> = await r.json();

        return this.validate(data);
    }

    async getMod(id: string): Promise<ServerMod> {
        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/mods/${id}`, {
                    headers: this.token
                        ? { "Authorization": `Bearer ${this.token}` }
                        : {}
                }
            );
        });
        const data: BaseRequest<ServerMod> = await r.json();

        return this.validate(data);
    }

    static getModLogo(id: string, params?: ModLogoCacheParams): URL {
        const url = new URL(`${BASE_URL}/v1/mods/${id}/logo`);

        if (params?.version) {
            url.searchParams.append("version", params.version);
        }

        if (params?.status) {
            url.searchParams.append("status", params.status);
        }

        return url;
    }

    async updateMod(id: string, body: UpdateModBody): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/mods/${id}`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "PUT",
                body: JSON.stringify(body),
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async createMod(body: CreateModBody): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/mods`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "POST",
                body: JSON.stringify(body),
            });
        })

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async getModVersions(
        id: string,
        params?: GetModVersionsParams,
    ): Promise<Paginated<ServerModVersion>> {
        const url = new URL(`${BASE_URL}/v1/mods/${id}/versions`);

        if (params?.page != null) {
            const page = params.page;
            url.searchParams.set("page", page.toString());
        }

        if (params?.per_page != null) {
            const limit = params.per_page;
            url.searchParams.set("per_page", limit.toString());
        }

        if (params?.gd) {
            url.searchParams.set("gd", params.gd);
        }

        if (params?.platforms) {
            url.searchParams.set("platforms", params.platforms.join(","));
        }

        if (params?.status) {
            url.searchParams.set("status", params.status);
        }

        const r = await this.fetch(
            url,
            this.token
                ? {
                      headers: new Headers({
                          Authorization: `Bearer ${this.token}`,
                      }),
                  }
                : undefined,
        );
        const data: BasePaginatedRequest<ServerModVersion> = await r.json();

        return this.validate(data);
    }

    async getModVersion(
        id: string,
        version: string,
    ): Promise<ServerModVersion> {
        const r = await this.fetch(
            `${BASE_URL}/v1/mods/${id}/versions/${version}`,
            this.token
                ? {
                      headers: new Headers({
                          Authorization: `Bearer ${this.token}`,
                      }),
                  }
                : undefined,
        );
        const data = await r.json();

        return this.validate<ServerModVersion>(data);
    }

    async updateModVersion(
        id: string,
        version: string,
        body: UpdateModVersionBody,
    ): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(
                `${BASE_URL}/v1/mods/${id}/versions/${version}`,
                {
                    headers: new Headers({
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json",
                    }),
                    method: "PUT",
                    body: JSON.stringify(body),
                },
            );
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async createModVersion(
        id: string,
        body: CreateModVersionBody,
    ): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/mods/${id}/versions`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "POST",
                body: JSON.stringify(body),
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async addDeveloper(id: string, body: AddDeveloperBody) {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/mods/${id}/developers`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "POST",
                body: JSON.stringify(body),
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async removeDeveloper(id: string, username: string) {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(
                `${BASE_URL}/v1/mods/${id}/developers/${username}`,
                {
                    headers: new Headers({
                        Authorization: `Bearer ${this.token}`,
                    }),
                    method: "DELETE",
                },
            );
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async getTags(): Promise<ServerTag[]> {
        const r = await this.fetch(`${BASE_URL}/v1/detailed-tags`);
        const data = await r.json();

        return this.validate<ServerTag[]>(data);
    }

    async getDevelopers(
        params?: DeveloperSearchParams,
    ): Promise<Paginated<ServerDeveloper>> {
        const url = new URL(`${BASE_URL}/v1/developers`);

        if (params?.page != null) {
            const page = params.page;
            url.searchParams.set("page", page.toString());
        }

        if (params?.per_page != null) {
            const limit = params.per_page;
            url.searchParams.set("per_page", limit.toString());
        }

        if (params?.query != null) {
            url.searchParams.set("query", params.query);
        }

        const r = await this.fetch(url);
        const data: BasePaginatedRequest<ServerDeveloper> = await r.json();

        return this.validate(data);
    }

    async getDeveloper(id: number): Promise<ServerDeveloper> {
        const r = await this.fetch(`${BASE_URL}/v1/developers/${id}`);
        const data = await r.json();

        return this.validate<ServerDeveloper>(data);
    }

    async updateDeveloper(id: number, body: UpdateDeveloperBody) {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/developers/${id}`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "PUT",
                body: JSON.stringify(body),
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async getSelf(): Promise<ServerDeveloper> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/me`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
            });
        });

        this.throwOnUnauth(r);
        const data = await r.json();

        return this.validate<ServerDeveloper>(data);
    }

    async getSelfMods(params?: GetSelfModsParams) {
        await this.checkAndTryRefreshAuth();

        const url = new URL(`${BASE_URL}/v1/me/mods`);
        if (params?.status != null) {
            url.searchParams.set("status", params.status);
        }

        const r = await this.withRetry(async () => {
            return await this.fetch(url, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
            });
        });

        const data = await r.json();

        return this.validate<ServerSimpleMod[]>(data);
    }

    async updateProfile(body: UpdateProfileBody) {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/me`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                }),
                method: "PUT",
                body: JSON.stringify(body),
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async deleteToken(): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/me/token`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
                method: "DELETE",
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }

        this.token = null;
    }

    async deleteAllTokens(): Promise<void> {
        await this.checkAndTryRefreshAuth();

        const r = await this.withRetry(async () => {
            return await this.fetch(`${BASE_URL}/v1/me/tokens`, {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
                method: "DELETE",
            });
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }

        this.token = null;
    }

    async getServerStats(): Promise<ServerStats> {
        const r = await this.fetch(`${BASE_URL}/v1/stats`);
        const data = await r.json();
        return this.validate<ServerStats>(data);
    }
}
