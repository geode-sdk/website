import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { MOD_BADGE_STAT_KEYS, renderModBadgeSvg, type ModBadgeStatKey } from "$lib/server/mod-badge-svg.js";
import { load as loadModPage } from "../+page.server.js";
import type { RequestHandler } from "./$types.js";
import { tmpdir as getOSTmpDir } from "os";
import { join as joinPath } from "path";

const BADGE_CACHE_TTL_SECS = 5 * 60;
const BADGE_CACHE_TTL_MS = BADGE_CACHE_TTL_SECS * 1_000;
const BADGE_CACHE_CONTROL = `public, max-age=${BADGE_CACHE_TTL_SECS}, s-maxage=${BADGE_CACHE_TTL_SECS}, stale-while-revalidate=86400`;
const BADGE_CACHE_DIR = joinPath(getOSTmpDir(), "mod-badges");

const pendingBadgeSvgRequests = new Map<string, Promise<string>>();
let badgeCacheDirReady: Promise<void> | null = null;

function parseStatsParam(value: string | null): ModBadgeStatKey[] {
    if (value === null) {
        return [...MOD_BADGE_STAT_KEYS];
    }

    const validStats = new Set<ModBadgeStatKey>(MOD_BADGE_STAT_KEYS);
    const seen = new Set<ModBadgeStatKey>();
    const parsed: ModBadgeStatKey[] = [];

    for (const rawStat of value.split(",")) {
        const stat = rawStat.trim() as ModBadgeStatKey;
        if (!validStats.has(stat) || seen.has(stat)) {
            continue;
        }

        seen.add(stat);
        parsed.push(stat);
    }

    return parsed;
}

function getBadgeCacheKey(modId: string, stats: ModBadgeStatKey[]) {
    return `${modId}:${stats.join(",")}`;
}

function getBadgeCachePath(cacheKey: string) {
    const digest = createHash("sha1").update(cacheKey).digest("hex");
    return joinPath(BADGE_CACHE_DIR, `${digest}.svg`);
}

function ensureBadgeCacheDir() {
    badgeCacheDirReady ??= mkdir(BADGE_CACHE_DIR, { recursive: true }).then(() => undefined);
    return badgeCacheDirReady;
}

async function readCachedBadgeSvg(cacheKey: string, now = Date.now()) {
    const cachePath = getBadgeCachePath(cacheKey);

    try {
        const fileStats = await stat(cachePath);
        if (now - fileStats.mtimeMs > BADGE_CACHE_TTL_MS) {
            return undefined;
        }

        return await readFile(cachePath, "utf8");
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
            return undefined;
        }

        throw error;
    }
}

async function writeCachedBadgeSvg(cacheKey: string, svg: string) {
    await ensureBadgeCacheDir();
    await writeFile(getBadgeCachePath(cacheKey), svg, "utf8");
}

function createBadgeResponse(svg: string, modId: string) {
    return new Response(svg, {
        headers: {
            "cache-control": BADGE_CACHE_CONTROL,
            "content-disposition": `inline; filename="${modId}-badge.svg"`,
            "content-type": "image/svg+xml; charset=utf-8",
        },
    });
}

export const GET: RequestHandler = async (event) => {
    const stats = parseStatsParam(event.url.searchParams.get("stats"));
    const cacheKey = getBadgeCacheKey(event.params.id, stats);
    const cachedSvg = await readCachedBadgeSvg(cacheKey);
    if (cachedSvg) {
        return createBadgeResponse(cachedSvg, event.params.id);
    }

    let pending = pendingBadgeSvgRequests.get(cacheKey);

    if (!pending) {
        pending = (async () => {
            const data = await loadModPage(event as unknown as Parameters<typeof loadModPage>[0]);

            if (!data || !("mod" in data) || !("version" in data)) {
                throw new Error("Failed to load mod badge data.");
            }

            const svg = await renderModBadgeSvg({
                modId: data.mod.id,
                modVersion: data.version.version,
                geodeVersion: data.version.geode,
                gdVersion: data.version.gd,
                createdAt: data.mod.created_at,
                updatedAt: data.mod.updated_at,
                downloads: data.mod.download_count,
                stats,
            });

            await writeCachedBadgeSvg(cacheKey, svg);
            return svg;
        })().finally(() => {
            pendingBadgeSvgRequests.delete(cacheKey);
        });

        pendingBadgeSvgRequests.set(cacheKey, pending);
    }

    return createBadgeResponse(await pending, event.params.id);
};
