import { readFile } from "node:fs/promises";
import gdIcon from "$lib/assets/gd-icon.json";
import geodeIcon from "$lib/assets/geode-icon.json";
import { formatNumber, icons, serverTimestampToAgoString, type KnownIcon } from "$lib";
import type { ServerGDVersion } from "$lib/api/models/mod-version.js";
import mdiIcons from "@iconify-json/mdi/icons.json";

type SvgIconData = {
    body: string;
    width?: number;
    height?: number;
};

type ModBadgeSvgInput = {
    modId: string;
    modVersion?: string;
    geodeVersion?: string;
    gdVersion?: ServerGDVersion;
    createdAt?: string;
    updatedAt?: string;
    downloads?: number;
    stats?: ModBadgeStatKey[];
};

export const MOD_BADGE_STAT_KEYS = [
    "version",
    "geode_version",
    "gd_version",
    "created_at",
    "updated_at",
    "downloads",
] as const;

export type ModBadgeStatKey = (typeof MOD_BADGE_STAT_KEYS)[number];

type BadgeDescriptor = {
    label: string;
    value: string;
    icon: KnownIcon;
};

const FONT_FAMILY = "Poppins Embedded";
const BADGE_HEIGHT = 20;
const BADGE_RADIUS = 3;
const BADGE_ICON_SIZE = 12;
const BADGE_TEXT_SIZE = 11;
const BADGE_TEXT_WEIGHT = 600;
const BADGE_LEFT_PADDING = 6;
const BADGE_RIGHT_PADDING = 6;
const BADGE_ICON_GAP = 4;

const COLORS = {
    background: "#0c0811",
    outline: "rgba(205, 152, 189, 0.18)",
    text: "#f2f2f2",
    muted: "#cd98bd",
    grayLabel: "#5f3d84",
};

const mdiIconSet = mdiIcons as { icons: Record<string, SvgIconData> };
const customIcons: Partial<Record<KnownIcon, SvgIconData>> = {
    gd: gdIcon,
    geode: geodeIcon,
};

let embeddedFontsCssPromise: Promise<string> | null = null;

const escapeXml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");

const loadEmbeddedFontsCss = async () => {
    if (!embeddedFontsCssPromise) {
        embeddedFontsCssPromise = (async () => {
            const [regularFont, semiboldFont] = await Promise.all([
                readFile(
                    new URL(
                        "../../../node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2",
                        import.meta.url,
                    ),
                ),
                readFile(
                    new URL(
                        "../../../node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2",
                        import.meta.url,
                    ),
                ),
            ]);

            return [
                `@font-face { font-family: "${FONT_FAMILY}"; src: url("data:font/woff2;base64,${regularFont.toString("base64")}") format("woff2"); font-style: normal; font-weight: 400; }`,
                `@font-face { font-family: "${FONT_FAMILY}"; src: url("data:font/woff2;base64,${semiboldFont.toString("base64")}") format("woff2"); font-style: normal; font-weight: 600; }`,
                `text { font-family: "${FONT_FAMILY}", Arial, sans-serif; }`,
            ].join("\n");
        })();
    }

    return embeddedFontsCssPromise;
};

const measureTextWidth = (text: string, fontSize: number, weight = 400) => {
    return Math.ceil(text.length * fontSize * (weight >= 600 ? 0.61 : 0.56));
};

const getIconData = (icon: KnownIcon) => {
    const customIcon = customIcons[icon];
    if (customIcon) {
        return customIcon;
    }

    const iconName = icons[icon];
    return iconName.startsWith("mdi:") ? mdiIconSet.icons[iconName.slice("mdi:".length)] : undefined;
};

const renderIcon = (icon: KnownIcon, x: number, y: number, size: number, color: string) => {
    const data = getIconData(icon);
    if (!data) {
        return "";
    }

    const width = data.width ?? 24;
    const height = data.height ?? 24;
    return `<g transform="translate(${x} ${y}) scale(${size / width} ${size / height})" style="color: ${color};">${data.body}</g>`;
};

const renderBadgeText = (
    text: string,
    x: number,
    y: number,
    { anchor = "start" as const, fill = COLORS.text }: { anchor?: "start" | "middle"; fill?: string } = {},
) => {
    const safeText = escapeXml(text);
    return [
        `<text x="${x}" y="${y + 1}" fill="#010101" fill-opacity="0.3" font-family="${FONT_FAMILY}, Arial, sans-serif" font-size="${BADGE_TEXT_SIZE}" font-weight="${BADGE_TEXT_WEIGHT}" dominant-baseline="middle" text-anchor="${anchor}">${safeText}</text>`,
        `<text x="${x}" y="${y}" fill="${fill}" font-family="${FONT_FAMILY}, Arial, sans-serif" font-size="${BADGE_TEXT_SIZE}" font-weight="${BADGE_TEXT_WEIGHT}" dominant-baseline="middle" text-anchor="${anchor}">${safeText}</text>`,
    ].join("");
};

const getSharedGDVersion = (gdVersion: ServerGDVersion) => {
    const version = gdVersion.ios;
    return version &&
        [
            gdVersion.android32,
            gdVersion.android64,
            gdVersion.ios,
            gdVersion["mac-arm"],
            gdVersion["mac-intel"],
            gdVersion.win,
        ].every((current) => current === version)
        ? version
        : null;
};

const formatGDVersionValue = (gdVersion: ServerGDVersion) => {
    const sharedVersion = getSharedGDVersion(gdVersion);
    if (sharedVersion) {
        return sharedVersion;
    }

    const distinctVersions = [
        gdVersion.win,
        gdVersion["mac-arm"],
        gdVersion["mac-intel"],
        gdVersion.ios,
        gdVersion.android64,
        gdVersion.android32,
    ].filter((version, index, versions): version is string => Boolean(version) && versions.indexOf(version) === index);

    return distinctVersions.join(" / ");
};

const getBadgeDescriptor = (input: ModBadgeSvgInput, stat: ModBadgeStatKey): BadgeDescriptor | undefined => {
    switch (stat) {
        case "version":
            return input.modVersion ? { label: "Version", value: input.modVersion, icon: "version" } : undefined;
        case "geode_version":
            return input.geodeVersion ? { label: "Geode", value: input.geodeVersion, icon: "geode" } : undefined;
        case "gd_version":
            return input.gdVersion ? { label: "GD", value: formatGDVersionValue(input.gdVersion), icon: "gd" } : undefined;
        case "created_at":
            return input.createdAt
                ? {
                      label: "Created",
                      value: serverTimestampToAgoString(input.createdAt) ?? input.createdAt,
                      icon: "time",
                  }
                : undefined;
        case "updated_at":
            return input.updatedAt
                ? {
                      label: "Updated",
                      value: serverTimestampToAgoString(input.updatedAt) ?? input.updatedAt,
                      icon: "update",
                  }
                : undefined;
        case "downloads":
            return input.downloads !== undefined
                ? { label: "Downloads", value: formatNumber(input.downloads), icon: "download" }
                : undefined;
    }
};

export async function renderModBadgeSvg(input: ModBadgeSvgInput) {
    const requestedStats = input.stats?.length ? input.stats : MOD_BADGE_STAT_KEYS;
    const badge =
        requestedStats.map((stat) => getBadgeDescriptor(input, stat)).find((stat) => stat !== undefined) ?? {
            label: "Mod",
            value: input.modId,
            icon: "geode" as const,
        };

    const leftTextWidth = measureTextWidth(badge.label, BADGE_TEXT_SIZE, BADGE_TEXT_WEIGHT);
    const rightTextWidth = measureTextWidth(badge.value, BADGE_TEXT_SIZE, BADGE_TEXT_WEIGHT);
    const leftWidth =
        BADGE_LEFT_PADDING * 2 + BADGE_ICON_SIZE + BADGE_ICON_GAP + leftTextWidth;
    const rightWidth = Math.max(30, BADGE_RIGHT_PADDING * 2 + rightTextWidth);
    const totalWidth = leftWidth + rightWidth;
    const textY = BADGE_HEIGHT / 2;
    const valueCenterX = leftWidth + rightWidth / 2;
    const title = `${badge.label}: ${badge.value}`;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${BADGE_HEIGHT}" viewBox="0 0 ${totalWidth} ${BADGE_HEIGHT}" role="img" aria-labelledby="title">
    <title id="title">${escapeXml(title)}</title>
    <defs>
        <linearGradient id="shine" x2="0" y2="100%">
            <stop offset="0" stop-color="#fff" stop-opacity="0.1" />
            <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="clip">
            <rect width="${totalWidth}" height="${BADGE_HEIGHT}" rx="${BADGE_RADIUS}" fill="#fff" />
        </mask>
    </defs>
    <style>${await loadEmbeddedFontsCss()}</style>
    <g mask="url(#clip)">
        <path fill="${COLORS.background}" d="M0 0h${leftWidth}v${BADGE_HEIGHT}H0z" />
        <path fill="${COLORS.grayLabel}" d="M${leftWidth} 0h${rightWidth}v${BADGE_HEIGHT}H${leftWidth}z" />
        <path fill="url(#shine)" d="M0 0h${totalWidth}v${BADGE_HEIGHT}H0z" />
    </g>
    <rect x="0.5" y="0.5" width="${totalWidth - 1}" height="${BADGE_HEIGHT - 1}" rx="${BADGE_RADIUS - 0.5}" fill="none" stroke="${COLORS.outline}" />
    ${renderIcon(badge.icon, BADGE_LEFT_PADDING, (BADGE_HEIGHT - BADGE_ICON_SIZE) / 2, BADGE_ICON_SIZE, COLORS.muted)}
    ${renderBadgeText(badge.label, BADGE_LEFT_PADDING + BADGE_ICON_SIZE + BADGE_ICON_GAP, textY)}
    ${renderBadgeText(badge.value, valueCenterX, textY, { anchor: "middle" })}
</svg>`;
}
