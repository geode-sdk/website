import type { ServerModDeveloper } from "./mod-developer.js";
import type { ServerModVersion } from "./mod-version.js";

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
