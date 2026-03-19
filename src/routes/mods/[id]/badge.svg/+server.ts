import {
    MOD_BADGE_STAT_KEYS,
    renderModBadgeSvg,
    type ModBadgeStatKey,
} from "$lib/server/mod-badge-svg.js";
import { load as loadModPage } from "../+page.server.js";
import type { RequestHandler } from "./$types.js";

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

export const GET: RequestHandler = async (event) => {
    const data = await loadModPage(event as unknown as Parameters<typeof loadModPage>[0]);

    if (!data || !("mod" in data) || !("version" in data)) {
        throw new Error("Failed to load mod badge data.");
    }

    const stats = parseStatsParam(event.url.searchParams.get("stats"));

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

    return new Response(svg, {
        headers: {
            "cache-control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
            "content-disposition": `inline; filename="${event.params.id}-badge.svg"`,
            "content-type": "image/svg+xml; charset=utf-8",
        },
    });
};
