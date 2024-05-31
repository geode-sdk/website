import type { ServerDeveloper } from "./models/base";
import type { ServerMod, ServerSimpleMod } from "./models/mod.js";
import type { ModStatus, ServerModVersion } from "./models/mod-version.js";

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

function validate<T>(data: BaseRequest<T>) {
    if (data.error) {
        throw new IndexError(data.error);
    }

    return data.payload;
}

export interface ModSearchParams {
    page?: number;
    developer?: string;
    pending_validation?: boolean;
    featured?: boolean;
    per_page?: number;
    tags?: string[];
    platforms?: string[];
    query?: string;
    gd?: string;
    sort?: ModSort;
}

export async function getMods(
    searchParams?: ModSearchParams,
): Promise<Paginated<ServerMod>> {
    const url = new URL(`${BASE_URL}/v1/mods`);

    if (searchParams?.page != null) {
        const page = searchParams.page;
        url.searchParams.set("page", page.toString());
    }

    if (searchParams?.per_page != null) {
        const limit = searchParams?.per_page ?? 10;
        url.searchParams.set("per_page", limit.toString());
    }

    if (searchParams?.developer) {
        url.searchParams.set("developer", searchParams.developer);
    }

    if (searchParams?.pending_validation) {
        url.searchParams.set("pending_validation", "true");
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

    const r = await fetch(url);
    const data: BasePaginatedRequest<ServerMod> = await r.json();

    return validate(data);
}

export async function getMod(id: string): Promise<ServerMod> {
    const r = await fetch(`${BASE_URL}/v1/mods/${id}`);
    const data: BaseRequest<ServerMod> = await r.json();

    return validate(data);
}

export function getModLogo(id: string): URL {
    return new URL(`${BASE_URL}/v1/mods/${id}/logo`);
}

export interface UpdateModBody {
    featured: boolean;
}

export async function updateMod(
    token: string,
    id: string,
    body: UpdateModBody,
): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/mods/${id}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
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

export interface CreateModBody {
    download_link: string;
}

export async function createMod(
    token: string,
    body: CreateModBody,
): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/mods`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
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

export async function getModVersion(
    id: string,
    version: string,
): Promise<ServerModVersion> {
    const r = await fetch(`${BASE_URL}/v1/mods/${id}/versions/${version}`);
    const data = await r.json();

    return validate<ServerModVersion>(data);
}

export interface UpdateModVersionBody {
    status: ModStatus;
    info?: string;
}

export async function updateModVersion(
    token: string,
    id: string,
    version: string,
    body: UpdateModVersionBody,
): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/mods/${id}/versions/${version}`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
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

export interface CreateModVersionBody {
    download_link: string;
}

export async function createModVersion(
    token: string,
    id: string,
    body: CreateModVersionBody,
): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/mods/${id}/versions`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
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

export async function getTags(): Promise<string[]> {
    const r = await fetch(`${BASE_URL}/v1/tags`);
    const data = await r.json();

    return validate<string[]>(data);
}

export async function getSelf(token: string): Promise<ServerDeveloper> {
    const r = await fetch(`${BASE_URL}/v1/me`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
    });
    const data = await r.json();

    return validate<ServerDeveloper>(data);
}

export interface GetSelfModsParams {
    status?: ModStatus;
}

export async function getSelfMods(token: string, params?: GetSelfModsParams) {
    const url = new URL(`${BASE_URL}/v1/me/mods`);
    if (params?.status != null) {
        url.searchParams.set("status", params.status);
    }

    const r = await fetch(url, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
    });

    const data = await r.json();

    return validate<ServerSimpleMod[]>(data);
}

export interface UpdateProfileBody {
    display_name: string;
}

export async function updateProfile(token: string, body: UpdateProfileBody) {
    const r = await fetch(`${BASE_URL}/v1/me`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
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

export async function deleteToken(token: string): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/me/token`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
        method: "DELETE",
    });

    if (r.status != 204) {
        const data: BaseRequest<void> = await r.json();
        throw new IndexError(data.error);
    }
}

export async function deleteAllTokens(token: string): Promise<void> {
    const r = await fetch(`${BASE_URL}/v1/me/tokens`, {
        headers: new Headers({
            Authorization: `Bearer ${token}`,
        }),
        method: "DELETE",
    });

    if (r.status != 204) {
        const data: BaseRequest<void> = await r.json();
        throw new IndexError(data.error);
    }
}
