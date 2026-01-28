import type { HandleFetch, Handle } from "@sveltejs/kit";
import * as publicEnv from "$env/static/public";
import * as privateEnv from "$env/static/private";
import { generateBundles, negotiateLocale } from '$lib/translations/fluent';
import { createSvelteFluent } from '@nubolab-ffwd/svelte-fluent';

interface PrivateSchema {
    PRIVATE_ENDPOINT_ENABLED: string;
    PRIVATE_API_ENDPOINT: string;
}

interface PublicSchema {
    PUBLIC_API_ENDPOINT: string;
}

function checkPrivate(obj: unknown): obj is PrivateSchema {
    if (obj == null || typeof obj != "object") {
        return false;
    }

    if (!("PRIVATE_ENDPOINT_ENABLED" in obj && typeof obj.PRIVATE_ENDPOINT_ENABLED == "string")) {
        return false;
    }

    if (!("PRIVATE_API_ENDPOINT" in obj && typeof obj.PRIVATE_API_ENDPOINT == "string")) {
        return false;
    }

    return true;
}

function checkPublic(obj: unknown): obj is PublicSchema {
    if (obj == null || typeof obj != "object") {
        return false;
    }

    if (!("PUBLIC_API_ENDPOINT" in obj && typeof obj.PUBLIC_API_ENDPOINT == "string")) {
        return false;
    }

    return true;
}

const validPrivate = checkPrivate(privateEnv) ? privateEnv : null;
const validPublic = checkPublic(publicEnv) ? publicEnv : null;

export const handleFetch: HandleFetch = async ({ request, fetch }) => {
    if (!validPrivate || !validPublic) {
        return fetch(request);
    }

    if (validPrivate.PRIVATE_ENDPOINT_ENABLED == "true" && request.url.startsWith(validPublic.PUBLIC_API_ENDPOINT)) {
        request = new Request(
            request.url.replace(validPublic.PUBLIC_API_ENDPOINT, validPrivate.PRIVATE_API_ENDPOINT),
            request,
        );
    }

    return fetch(request);
};

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.locale = negotiateLocale(event);
	event.locals.fluent = createSvelteFluent(generateBundles(event.locals.locale));
	return resolve(event);
};
