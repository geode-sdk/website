import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);    

export const icons = {
    error: "mdi:error",
    twitter: "mdi:twitter",
    discord: "simple-icons:discord",
    bluesky: "simple-icons:bluesky",
    docs: "mdi:file-document",
    github: "mdi:github",
    download: "mdi:download",
    browse: "mdi:database-search",
    gd: "@:gd-icon",
    geode: "@:geode-icon",
    examples: "mdi:text-search",
    graph: "mdi:graph-line",
    windows: "mdi:microsoft-windows",
    mac: "mdi:apple-finder",
    android: "mdi:android",
    ios: "mdi:apple-ios",
    linux: "mdi:linux",
    copyright: "mdi:copyright",
    help: "mdi:help-circle",
    warning: "mdi:warning-circle",
    up: "mdi:chevron-up",
    down: "mdi:chevron-down",
    left: "mdi:chevron-left",
    right: "mdi:chevron-right",
    one: "mdi:number-one-circle",
    two: "mdi:number-two-circle",
    three: "mdi:number-three-circle",
    four: "mdi:number-four-circle",
    home: "mdi:home",
    search: "mdi:search",
    time: "mdi:clock",
    "time-update": "mdi:update",
    sort: "mdi:sort",
    "sort-downloads": "mdi:sort-numeric-descending",
    "sort-recent": "mdi:sort-clock-descending",
    "sort-abc": "mdi:sort-alphabetical-ascending",
    "sort-cba": "mdi:sort-alphabetical-descending",
    tags: "mdi:tag",
    "tags-clear": "mdi:tag-off",
    filter: "mdi:filter",
    "filter-clear": "mdi:filter-off",
    featured: "mdi:star",
    status: "mdi:shield",
    verified: "mdi:shield-check",
    unverified: "mdi:shield-off",
    rejected: "mdi:shield-alert",
    view: "mdi:external-link",
    version: "mdi:source-branch",
    "view-grid": "mdi:view-comfy",
    "view-dual-list": "mdi:view-compact",
    "view-list": "mdi:view-list",
    description: "mdi:about",
    changelog: "mdi:history",
    modify: "mdi:pencil",
    update: "mdi:clock-edit",
    info: "mdi:about",
    web: "mdi:web",
    community: "mdi:account-group",
    image: "mdi:file-image",
    "image-missing": "mdi:file-image-remove",
    eye: "mdi:eye",
    account: "mdi:account-circle",
    admin: "mdi:security",
    clipboard: "mdi:content-copy",

    "tag-universal": "mdi:globe",
    "tag-gameplay": "mdi:gamepad-variant",
    "tag-editor": "mdi:hammer-wrench",
    "tag-offline": "mdi:offline",
    "tag-online": "mdi:cloud",
    "tag-enhancement": "mdi:magic",
    "tag-music": "mdi:music-note",
    "tag-interface": "mdi:interaction-tap",
    "tag-bugfix": "mdi:bug",
    "tag-utility": "mdi:wrench",
    "tag-performance": "mdi:clock-fast",
    "tag-customization": "mdi:paint-outline",
    "tag-content": "mdi:auto-stories",
    "tag-developer": "mdi:code-braces",
    "tag-cheat": "mdi:domino-mask",
    "tag-paid": "mdi:attach-money",
    "tag-joke": "mdi:comedy",
    "tag-api": "mdi:api",
    "tag-modtober24": "mdi:clouds",
    "tag-modtober24winner": "trophy-variant-outline",
    "tag-modtober25": "mdi:exclamation-thick",
    "tag-modtober25winner": "trophy-variant-outline"
};
export type KnownIcon = keyof typeof icons;

export function iconForTag(tag: string): KnownIcon {
    const key = `tag-${tag}`;
    if (key in icons) {
        return key as KnownIcon;
    }
    return "tags";
}
export function serverTimestampToAgoString(timestamp: string): string | undefined {
    const stamp = Date.parse(timestamp);
    if (isNaN(stamp)) {
        return undefined;
    }
    return dayjs(new Date(stamp)).fromNow();
}
export function abbreviateNumber(num: number): string {
    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
        roundingMode: "trunc",
    }).format(num);
}
export function serverTimestampToDateString(timestamp: string): string | undefined {
    const stamp = Date.parse(timestamp);
    if (isNaN(stamp)) {
        return undefined;
    }
    return Intl.DateTimeFormat(undefined, {
        dateStyle: "full",
        timeStyle: "long",
    }).format(stamp);
}
export function formatNumber(num: number): string {
    return Intl.NumberFormat().format(num);
}
