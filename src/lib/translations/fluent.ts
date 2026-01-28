import { FluentBundle, FluentResource } from "@fluent/bundle";
import { acceptedLanguages, negotiateLanguages } from "@fluent/langneg";
import type { RequestEvent } from "@sveltejs/kit";
import langEn from "./en.ftl";
import langFi from "./fi.ftl";

const defaultLocale = "en";

const resources: Record<string, FluentResource> = {
	en: langEn,
    fi: langFi,
};

export function getAvailableLocales(): string[] {
	return Object.keys(resources);
}

export function generateBundles(locale: string): FluentBundle[] {
	const bundle = new FluentBundle(locale);
	bundle.addResource(resources[locale]);
	return [bundle];
}

export function negotiateLocale(ev: RequestEvent): string {
	const override = ev.url.searchParams.get("lang");
	if (override && override in resources) {
		ev.cookies.set("geode-selected-language", override, { path: "/" });
		return override;
	}
	const selected = ev.cookies.get("geode-selected-language");
	if (selected) {
		return selected;
	}
	const accepted = acceptedLanguages(ev.request.headers.get("accept-language") ?? "");
	const negotiated = negotiateLanguages(accepted, Object.keys(resources), {
		defaultLocale,
		strategy: "lookup"
	}).at(0) ?? defaultLocale;
	ev.cookies.set("geode-selected-language", negotiated, { path: "/" });
	return negotiated;
}
