import type { ServerModDeveloper } from "./developer";
import type {
    ServerModVersion,
    ServerSimpleModVersion,
} from "./mod-version.js";

export interface ServerSimpleMod {
    id: string;
    featured: boolean;
    download_count: number;
    versions: ServerSimpleModVersion[];
    developers: ServerModDeveloper[];
}

export interface ServerMod {
    id: string;
    repository?: string;
    featured: boolean;
    developers: ServerModDeveloper[];
    download_count: number;
    tags: string[];
    versions: ServerModVersion[];
    about?: string;
    changelog?: string;
    created_at: string;
    updated_at: string;
}
