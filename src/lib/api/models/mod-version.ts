export interface ServerDependency {
    mod_id: string;
    version: string;
    importance: string;
}

export interface ServerIncompatibility {
    mod_id: string;
    version: string;
    importance: string;
}

export type ModVersionString = string;

export interface ServerGDVersion {
    win: string | null;
    "mac-intel": string | null;
    "mac-arm": string | null;
    ios: string | null;
    android32: string | null;
    android64: string | null;
}

export type ModStatus = "accepted" | "pending" | "rejected" | "unlisted";

export interface ServerSimpleModVersion {
    name: string;
    version: string;
    download_count: number;
    validated: boolean;

    status: ModStatus;
    info: string | null;
}

export interface ServerModVersion {
    name: string;
    download_count: number;
    description?: string;
    early_load: boolean;
    api: boolean;
    geode: ModVersionString;
    version: ModVersionString;
    download_link: string;
    hash: string;
    gd: ServerGDVersion;
    mod_id: string;
    dependencies?: ServerDependency[];
    incompatibilities?: ServerIncompatibility[];
    status: ModStatus;
    direct_download_link?: string;
    info?: string | null;
}
