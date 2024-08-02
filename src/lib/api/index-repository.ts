import type { ServerDeveloper } from "./models/base";
import type { ServerMod, ServerSimpleMod } from "./models/mod.js";
import type { ModStatus, ServerModVersion } from "./models/mod-version.js";
import type { ServerStats } from "./models/stats";

const BASE_URL = "https://api.geode-sdk.org";

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

type GlobalFetch = typeof fetch;

export class IndexClient {
    private token: string | null;
    private fetch: typeof fetch;

    constructor(options: { token?: string | null; fetch?: GlobalFetch } = {}) {
        this.token = options.token ?? null;
        this.fetch = options.fetch ?? fetch;
    }

    private validate<T>(data: BaseRequest<T>) {
        if (data.error) {
            throw new IndexError(data.error);
        }
        return data.payload;
    }

    private requireAuth() {
        if (!this.token) {
            throw new IndexError("Not logged into client");
        }
    }

    setToken(token: string) {
        this.token = token;
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

        const r = await this.fetch(url);
        const data: BasePaginatedRequest<ServerMod> = await r.json();

        return this.validate(data);
    }

    async getMod(id: string): Promise<ServerMod> {
        const r = await this.fetch(`${BASE_URL}/v1/mods/${id}`);
        const data: BaseRequest<ServerMod> = await r.json();

        return this.validate(data);
    }

    static getModLogo(id: string): URL {
        return new URL(`${BASE_URL}/v1/mods/${id}/logo`);
    }

    async updateMod(id: string, body: UpdateModBody): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/mods/${id}`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "PUT",
            body: JSON.stringify(body),
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async createMod(body: CreateModBody): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/mods`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "POST",
            body: JSON.stringify(body),
        });

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

        const r = await this.fetch(url);
        const data: BasePaginatedRequest<ServerModVersion> = await r.json();

        return this.validate(data);
    }

    async getModVersion(
        id: string,
        version: string,
    ): Promise<ServerModVersion> {
        const r = await this.fetch(
            `${BASE_URL}/v1/mods/${id}/versions/${version}`,
        );
        const data = await r.json();

        return this.validate<ServerModVersion>(data);
    }

    async updateModVersion(
        id: string,
        version: string,
        body: UpdateModVersionBody,
    ): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(
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

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async createModVersion(
        id: string,
        body: CreateModVersionBody,
    ): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/mods/${id}/versions`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "POST",
            body: JSON.stringify(body),
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async addDeveloper(id: string, body: AddDeveloperBody) {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/mods/${id}/developers`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "POST",
            body: JSON.stringify(body),
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async removeDeveloper(id: string, username: string) {
        this.requireAuth();

        const r = await this.fetch(
            `${BASE_URL}/v1/mods/${id}/developers/${username}`,
            {
                headers: new Headers({
                    Authorization: `Bearer ${this.token}`,
                }),
                method: "DELETE",
            },
        );

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async getTags(): Promise<string[]> {
        const r = await this.fetch(`${BASE_URL}/v1/tags`);
        const data = await r.json();

        return this.validate<string[]>(data);
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
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/developers/${id}`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "PUT",
            body: JSON.stringify(body),
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async getSelf(): Promise<ServerDeveloper> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/me`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
            }),
        });
        const data = await r.json();

        return this.validate<ServerDeveloper>(data);
    }

    async getSelfMods(params?: GetSelfModsParams) {
        this.requireAuth();

        const url = new URL(`${BASE_URL}/v1/me/mods`);
        if (params?.status != null) {
            url.searchParams.set("status", params.status);
        }

        const r = await this.fetch(url, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
            }),
        });

        const data = await r.json();

        return this.validate<ServerSimpleMod[]>(data);
    }

    async updateProfile(body: UpdateProfileBody) {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/me`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
            }),
            method: "PUT",
            body: JSON.stringify(body),
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }
    }

    async deleteToken(): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/me/token`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
            }),
            method: "DELETE",
        });

        if (r.status != 204) {
            const data: BaseRequest<void> = await r.json();
            throw new IndexError(data.error);
        }

        this.token = null;
    }

    async deleteAllTokens(): Promise<void> {
        this.requireAuth();

        const r = await this.fetch(`${BASE_URL}/v1/me/tokens`, {
            headers: new Headers({
                Authorization: `Bearer ${this.token}`,
            }),
            method: "DELETE",
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
