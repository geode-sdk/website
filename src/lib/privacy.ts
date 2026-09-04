import { browser } from "$app/environment";

const ADS_OPTOUT_KEY = "geode-ads-optout";
const TRACKING_OPTOUT_KEY = "geode-tracking-optout";

function isOptedOut(key: string): boolean {
    if (!browser) {
        return false;
    }
    return localStorage.getItem(key) === "1";
}

export function adsOptedOut(): boolean {
    return isOptedOut(ADS_OPTOUT_KEY);
}

export function trackingOptedOut(): boolean {
    return isOptedOut(TRACKING_OPTOUT_KEY);
}

export function privacyOptedOut(): boolean {
    return adsOptedOut() && trackingOptedOut();
}

export function setPrivacyOptOut(value: boolean): void {
    if (!browser) {
        return;
    }
    if (value) {
        localStorage.setItem(ADS_OPTOUT_KEY, "1");
        localStorage.setItem(TRACKING_OPTOUT_KEY, "1");
    } else {
        localStorage.removeItem(ADS_OPTOUT_KEY);
        localStorage.removeItem(TRACKING_OPTOUT_KEY);
    }
}
