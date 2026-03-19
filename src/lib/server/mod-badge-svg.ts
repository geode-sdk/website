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

type LabelDescriptor = {
    text: string;
    icon?: KnownIcon;
    fill: string;
    textColor: string;
};

type LabelColors = Pick<LabelDescriptor, "fill" | "textColor">;

type RenderedRow = {
    svg: string;
    height: number;
};

type RenderedLabel = RenderedRow & {
    width: number;
};

const CARD_WIDTH = 320;
const CARD_PADDING = 12;
const INNER_WIDTH = CARD_WIDTH - CARD_PADDING * 2;
const INFO_ROW_GAP = 8;
const BASE_ROW_HEIGHT = 18;
const ROW_ICON_SIZE = 18;
const FONT_FAMILY = "Poppins Embedded";

const LABEL_STYLE = {
    height: 24,
    gapX: 6,
    gapY: 6,
    iconSize: 14,
    textSize: 12.5,
    textWeight: 600,
    paddingX: 8,
    radius: 6,
} as const;

const COLORS = {
    background: "#0c0811",
    outline: "rgba(205, 152, 189, 0.18)",
    text: "#f2f2f2",
    muted: "#cd98bd",
    grayLabel: "rgba(124, 82, 173, 0.5)",
    grayLabelText: "#f2f2f2",
};

const GD_LABEL_COLORS: LabelColors = {
    fill: COLORS.grayLabel,
    textColor: COLORS.grayLabelText,
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

const measureLabelWidth = (text: string, icon?: KnownIcon) => {
    return (
        LABEL_STYLE.paddingX * 2 +
        (icon ? LABEL_STYLE.iconSize + 4 : 0) +
        measureTextWidth(text, LABEL_STYLE.textSize, LABEL_STYLE.textWeight)
    );
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

const renderText = (
    text: string,
    x: number,
    y: number,
    {
        size = 16,
        fill = COLORS.text,
        weight = 400,
    }: {
        size?: number;
        fill?: string;
        weight?: number;
    } = {},
) => {
    return `<text x="${x}" y="${y}" fill="${fill}" font-family="${FONT_FAMILY}, Arial, sans-serif" font-size="${size}" font-weight="${weight}" dominant-baseline="middle">${escapeXml(text)}</text>`;
};

const renderLabel = (label: LabelDescriptor, x: number, y: number): RenderedLabel => {
    const width = measureLabelWidth(label.text, label.icon);
    const parts = [
        `<rect x="${x}" y="${y}" width="${width}" height="${LABEL_STYLE.height}" rx="${LABEL_STYLE.radius}" fill="${label.fill}" />`,
    ];

    let contentX = x + LABEL_STYLE.paddingX;
    if (label.icon) {
        parts.push(
            renderIcon(
                label.icon,
                contentX,
                y + (LABEL_STYLE.height - LABEL_STYLE.iconSize) / 2,
                LABEL_STYLE.iconSize,
                label.textColor,
            ),
        );
        contentX += LABEL_STYLE.iconSize + 4;
    }

    parts.push(
        renderText(label.text, contentX, y + LABEL_STYLE.height / 2 + 0.5, {
            size: LABEL_STYLE.textSize,
            fill: label.textColor,
            weight: LABEL_STYLE.textWeight,
        }),
    );

    return {
        svg: parts.join(""),
        width,
        height: LABEL_STYLE.height,
    };
};

const layoutLabels = (labels: LabelDescriptor[], startX: number, startY: number, maxWidth: number) => {
    let x = startX;
    let y = startY;
    const parts: string[] = [];

    for (const label of labels) {
        const width = measureLabelWidth(label.text, label.icon);

        if (x !== startX && x + width > startX + maxWidth) {
            x = startX;
            y += LABEL_STYLE.height + LABEL_STYLE.gapY;
        }

        const rendered = renderLabel(label, x, y);
        parts.push(rendered.svg);
        x += rendered.width + LABEL_STYLE.gapX;
    }

    return {
        svg: parts.join(""),
        height: y - startY + LABEL_STYLE.height,
    };
};

const renderIconRow = (icon: KnownIcon, text: string, y: number): RenderedRow => {
    return {
        svg: `${renderIcon(icon, CARD_PADDING, y + (BASE_ROW_HEIGHT - ROW_ICON_SIZE) / 2, ROW_ICON_SIZE, COLORS.muted)}${renderText(text, CARD_PADDING + ROW_ICON_SIZE + 8, y + BASE_ROW_HEIGHT / 2 + 0.5)}`,
        height: BASE_ROW_HEIGHT,
    };
};

const buildLabel = (text: string, icon: KnownIcon, colors: LabelColors = GD_LABEL_COLORS): LabelDescriptor => {
    return { text, icon, ...colors };
};

const addVersionLabel = (labels: LabelDescriptor[], icon: KnownIcon, version: string | null, suffix = "") => {
    if (!version) {
        return;
    }

    labels.push(buildLabel(suffix ? `${version} ${suffix}` : version, icon));
};

const addMergedVersionLabels = (
    labels: LabelDescriptor[],
    icon: KnownIcon,
    firstVersion: string | null,
    secondVersion: string | null,
    firstSuffix: string,
    secondSuffix: string,
) => {
    if (firstVersion && firstVersion === secondVersion) {
        labels.push(buildLabel(firstVersion, icon));
        return;
    }

    addVersionLabel(labels, icon, firstVersion, firstSuffix);
    addVersionLabel(labels, icon, secondVersion, secondSuffix);
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

const renderGDRow = (gdVersion: ServerGDVersion, y: number): RenderedRow => {
    const sharedVersion = getSharedGDVersion(gdVersion);
    if (sharedVersion) {
        return renderIconRow("gd", sharedVersion, y);
    }

    const labels: LabelDescriptor[] = [];
    addVersionLabel(labels, "windows", gdVersion.win);
    addMergedVersionLabels(labels, "mac", gdVersion["mac-arm"], gdVersion["mac-intel"], "(ARM)", "(x64)");
    addVersionLabel(labels, "ios", gdVersion.ios);
    addMergedVersionLabels(labels, "android", gdVersion.android64, gdVersion.android32, "(64-bit)", "(32-bit)");

    const contentX = CARD_PADDING + ROW_ICON_SIZE + 8;
    const labelsY = y - 3;
    const laidOut = layoutLabels(labels, contentX, labelsY, INNER_WIDTH - (contentX - CARD_PADDING));

    return {
        svg: `${renderIcon("gd", CARD_PADDING, labelsY + (LABEL_STYLE.height - ROW_ICON_SIZE) / 2, ROW_ICON_SIZE, COLORS.muted)}${laidOut.svg}`,
        height: Math.max(BASE_ROW_HEIGHT, laidOut.height),
    };
};

export async function renderModBadgeSvg(input: ModBadgeSvgInput) {
    const parts: string[] = [];
    let y = CARD_PADDING;
    const enabledStats = new Set<ModBadgeStatKey>(input.stats ?? MOD_BADGE_STAT_KEYS);
    const rows: Array<{ stat: ModBadgeStatKey; render: (y: number) => RenderedRow | undefined }> = [
        {
            stat: "version",
            render: (currentY) =>
                input.modVersion ? renderIconRow("version", escapeXml(input.modVersion), currentY) : undefined,
        },
        {
            stat: "downloads",
            render: (currentY) =>
                input.downloads !== undefined
                    ? renderIconRow("download", formatNumber(input.downloads), currentY)
                    : undefined,
        },
        {
            stat: "created_at",
            render: (currentY) =>
                input.createdAt
                    ? renderIconRow("time", serverTimestampToAgoString(input.createdAt) ?? input.createdAt, currentY)
                    : undefined,
        },
        {
            stat: "updated_at",
            render: (currentY) =>
                input.updatedAt
                    ? renderIconRow("update", serverTimestampToAgoString(input.updatedAt) ?? input.updatedAt, currentY)
                    : undefined,
        },
        {
            stat: "geode_version",
            render: (currentY) =>
                input.geodeVersion ? renderIconRow("geode", input.geodeVersion, currentY) : undefined,
        },
        {
            stat: "gd_version",
            render: (currentY) => (input.gdVersion ? renderGDRow(input.gdVersion, currentY) : undefined),
        },
    ];

    for (const { stat, render } of rows) {
        if (!enabledStats.has(stat)) {
            continue;
        }

        const row = render(y);
        if (!row) {
            continue;
        }

        parts.push(row.svg);
        y += row.height + INFO_ROW_GAP;
    }

    if (parts.length > 0) {
        y -= INFO_ROW_GAP;
    }

    const height = y + CARD_PADDING;
    const description = [
        input.modVersion && `Version ${input.modVersion}`,
        input.downloads !== undefined && `${formatNumber(input.downloads)} downloads`,
        input.geodeVersion && `Geode ${input.geodeVersion}`,
    ]
        .filter(Boolean)
        .join(", ");

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${height}" viewBox="0 0 ${CARD_WIDTH} ${height}" role="img" aria-labelledby="title">
    <title id="title">Geode mod badge</title>
    <style>${await loadEmbeddedFontsCss()}</style>
    <rect width="${CARD_WIDTH}" height="${height}" rx="12" fill="${COLORS.background}" />
    <rect x="0.5" y="0.5" width="${CARD_WIDTH - 1}" height="${height - 1}" rx="11.5" fill="none" stroke="${COLORS.outline}" />
    ${parts.join("")}
</svg>`;
}
